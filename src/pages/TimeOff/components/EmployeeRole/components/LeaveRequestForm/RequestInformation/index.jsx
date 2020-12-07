import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form, message } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import TimeOffModal from '@/components/TimeOffModal';
import styles from './index.less';

const { Option, OptGroup } = Select;
const { TextArea } = Input;

@connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingAddLeaveRequest: loading.effects['timeOff/addLeaveRequest'],
}))
class RequestInformation extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedShortType: '',
      selectedTypeName: '',
      selectedType: '', // A, B, C or D
      showSuccessModal: false,
      secondNotice: '',
      durationFrom: '',
      durationTo: '',
    };
  }

  fetchEmailsListByCompany = () => {
    const {
      dispatch,
      user: { currentUser: { company: { _id: company = '' } = {} } = {} } = {},
    } = this.props;
    dispatch({
      type: 'timeOff/fetchEmailsListByCompany',
      payload: [company],
    });
  };

  // FETCH LEAVE BALANCE INFO (REMAINING, TOTAL,...)
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
    });
    dispatch({
      type: 'timeOff/fetchTimeOffTypes',
    });
    this.fetchEmailsListByCompany();
  };

  // GET TIME OFF TYPE BY ID
  onSelectTimeOffTypeChange = (id) => {
    const { durationFrom } = this.state;
    const { timeOff: { timeOffTypes = [] } = {} } = this.props;
    timeOffTypes.forEach((eachType) => {
      const { _id = '', name = '', shortType = '', type = '' } = eachType;
      if (id === _id) {
        this.autoValueForToDate(type, shortType, durationFrom);
        if ((type === 'A' || type === 'B') && durationFrom !== null && durationFrom !== '') {
          this.setSecondNotice(`${shortType}s gets credited each month.`);
        }

        this.setState({
          selectedShortType: shortType,
          selectedType: type,
          selectedTypeName: name,
        });
      }
    });
  };

  // SHOW BELOW NOTICE (BESIDE DURATION FIELD)
  setSecondNotice = (value) => {
    this.setState({
      secondNotice: value,
    });
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
  setShowSuccessModal = (value) => {
    this.setState({
      showSuccessModal: value,
    });
    if (!value) {
      history.push('/time-off');
    }
  };

  // CACULATE DURATION FOR API
  calculateNumberOfLeaveDay = (list) => {
    let count = 0;
    list.forEach((value) => {
      const { timeOfDay = '' } = value;
      switch (timeOfDay) {
        case 'MORNING':
          count += 0.5;
          break;
        case 'AFTERNOON':
          count += 0.5;
          break;
        case 'WHOLE-DAY':
          count += 1;
          break;
        default:
          break;
      }
    });
    return count;
  };

  // GENERATE LEAVE DATES FOR API
  generateLeaveDates = (from, to, leaveTimeLists) => {
    const dateLists = this.getDateLists(from, to);
    let result = [];
    if (leaveTimeLists.length === 0) {
      // type C,D
      result = dateLists.map((value) => {
        return {
          date: value,
          timeOfDay: 'WHOLE-DAY',
        };
      });
    } else {
      result = dateLists.map((value, index) => {
        if (leaveTimeLists[index] !== 'WORK') {
          return {
            date: value,
            timeOfDay: leaveTimeLists[index],
          };
        }
        return {};
      });
    }
    result = result.filter(
      (value) =>
        moment(value.date).weekday() !== 6 &&
        moment(value.date).weekday() !== 0 &&
        Object.keys(value).length !== 0,
    );

    return result;
  };

  onValuesChange = (value) => {
    // eslint-disable-next-line no-console
    console.log('Success:', value);
  };

  // ON FINISH
  onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
    const { dispatch, user: { currentUser: { employee = {} } = {} } = {} } = this.props;
    const { _id: employeeId = '', manager: { _id: managerId = '' } = {} } = employee;
    const {
      timeOffType = '',
      subject = '',
      description = '',
      durationFrom = '',
      durationTo = '',
      personCC = [],
      leaveTimeLists = [],
    } = values;

    const leaveDates = this.generateLeaveDates(durationFrom, durationTo, leaveTimeLists);
    // console.log('leaveDates', leaveDates);

    if (leaveDates.length === 0) {
      message.error('Please select valid dates!');
    } else {
      // generate data for API
      const duration = this.calculateNumberOfLeaveDay(leaveDates);

      const data = {
        type: timeOffType,
        status: 'IN-PROGRESS',
        employee: employeeId,
        subject,
        fromDate: durationFrom,
        toDate: durationTo,
        duration,
        leaveDates,
        onDate: moment(),
        description,
        approvalManager: managerId, // id
        cc: personCC,
      };

      dispatch({
        type: 'timeOff/addLeaveRequest',
        payload: data,
      }).then((res) => {
        const { statusCode } = res;
        if (statusCode === 200) this.setShowSuccessModal(true);
      });
    }
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  // AUTO VALUE FOR TODATE DATEPICKER DEPENDING ON SELECTED TYPE
  autoValueForToDate = (selectedType, selectedShortType, durationFrom) => {
    if (
      durationFrom !== null &&
      durationFrom !== '' &&
      (selectedType === 'C' || selectedType === 'D')
    ) {
      const {
        timeOff: { timeOffTypes = [] },
      } = this.props;

      let typeList = timeOffTypes.map((eachType) => {
        const { type = '', shortType = '', baseAccrual: { time = 0 } = {} } = eachType;
        return {
          type,
          shortType,
          time,
        };
      });

      if (selectedType === 'C') {
        typeList = typeList.filter((value) => value.type === 'C');
      } else if (selectedType === 'D') {
        typeList = typeList.filter((value) => value.type === 'D');
      }

      let autoToDate = null;
      typeList.forEach((eachType) => {
        const { shortType = '', time = 0 } = eachType;
        if (selectedShortType === shortType) {
          if (selectedType === 'D') {
            this.setSecondNotice(`${shortType} applied for: ${time} days`);
          }
          autoToDate = moment(durationFrom).add(time, 'day');
        }
      });

      this.formRef.current.setFieldsValue({
        durationTo: autoToDate,
      });
    }
  };

  // DATE PICKER ON CHANGE
  fromDateOnChange = (value) => {
    if (value === null) {
      this.setState({
        durationFrom: '',
      });
    } else {
      this.setState({
        durationFrom: value,
      });
    }

    const { selectedShortType, selectedType } = this.state;
    this.autoValueForToDate(selectedType, selectedShortType, value);
    if (selectedType === 'A' || selectedType === 'B')
      this.setSecondNotice(`${selectedShortType}s gets credited each month.`);

    // initial value for leave dates list
    const { durationTo } = this.state;
    const dateLists = this.getDateLists(value, durationTo);
    const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');
    this.formRef.current.setFieldsValue({
      leaveTimeLists: initialValuesForLeaveTimesList,
    });
  };

  toDateOnChange = (value) => {
    if (value === null) {
      this.setState({
        durationTo: '',
      });
    } else {
      this.setState({
        durationTo: value,
      });
    }
    const { selectedShortType, selectedType } = this.state;
    if (selectedType === 'A' || selectedType === 'B')
      this.setSecondNotice(`${selectedShortType}s gets credited each month.`);

    // initial value for leave dates list
    const { durationFrom } = this.state;
    const dateLists = this.getDateLists(durationFrom, value);
    const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');
    this.formRef.current.setFieldsValue({
      leaveTimeLists: initialValuesForLeaveTimesList,
    });
  };

  // ON SAVE DRAFT CLICKED
  saveDraft = () => {
    // eslint-disable-next-line no-alert
    alert('Save Draft');
  };

  // RENDER SELECT BOX
  // GET DATA FOR SELECT BOX TYPE 1,2
  renderTimeOffTypes1 = (data) => {
    return data.map((type) => {
      const { currentAllowance = 0, defaultSettings = {} } = type;
      if (defaultSettings !== null) {
        const {
          _id = '',
          name = '',
          shortType = '',
          baseAccrual: { time = 0 } = {},
        } = defaultSettings;
        return {
          name,
          shortName: shortType,
          remaining: currentAllowance,
          total: time,
          _id,
        };
      }
      return '';
    });
  };

  // GET DATA FOR SELECT BOX TYPE 3 (WFH/CP...)
  renderTimeOffTypes2 = (data) => {
    let result = data.map((eachType) => {
      const { _id = '', name = '', type = '', shortType = '' } = eachType;
      if (type === 'D') {
        return {
          name,
          shortName: shortType,
          _id,
        };
      }
      return null;
    });
    result = result.filter((value) => value !== null);
    return result;
  };

  // RENDER OPTIONS
  // TYPE A: PAID LEAVES & UNPAID LEAVES
  renderType1 = (data) => {
    return data.map((value) => {
      const { name = '', shortName = '', remaining = 0, total = 0, _id = '' } = value;
      const defaultCss = {
        fontSize: 12,
        color: '#6f7076',
        fontWeight: 'bold',
      };
      const invalidCss = {
        fontSize: 12,
        color: '#FD4546',
        fontWeight: 'bold',
      };
      return (
        <Option key={_id} value={_id}>
          <div className={styles.timeOffTypeOptions}>
            {/* I don't knew why I could not CSS this block in styles.less file
          So I tried inline CSS. 
          Amazing! It worked :D. (Tuan - Lewis Nguyen) */}
            <>
              <span style={{ fontSize: 13 }} className={styles.name}>
                {`${name} (${shortName})`}
              </span>
              <span
                className={styles.days}
                style={{
                  float: 'right',
                }}
              >
                <span style={remaining === 0 ? invalidCss : defaultCss} className={styles.totals}>
                  <span
                    style={
                      remaining === 0
                        ? { fontSize: 12, color: '#FD4546' }
                        : { fontSize: 12, color: 'black' }
                    }
                  >
                    {remaining}
                  </span>
                  /{total} days
                </span>
              </span>
            </>
          </div>
        </Option>
      );
    });
  };

  // TYPE C: SPECIAL LEAVES
  renderType2 = (data) => {
    return data.map((value) => {
      const { name = '', shortName = '', total = 0, _id } = value;
      return (
        <Option value={_id}>
          <div className={styles.timeOffTypeOptions}>
            <span style={{ fontSize: 13 }} className={styles.name}>
              {`${name} (${shortName})`}
            </span>
            <span style={{ float: 'right', fontSize: 12, fontWeight: 'bold' }}>{total} days</span>
          </div>
        </Option>
      );
    });
  };

  // TYPE D: WORKING OUT OF OFFICE
  renderType3 = (data) => {
    return data.map((value) => {
      const { name = '', shortName = '', _id = '' } = value;
      return (
        <Option key={_id} value={_id}>
          <div className={styles.timeOffTypeOptions}>
            <span style={{ fontSize: 13 }} className={styles.name}>
              {`${name} (${shortName})`}
            </span>
          </div>
        </Option>
      );
    });
  };

  // GET LIST OF DAYS FROM DAY A TO DAY B
  getDateLists = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    const now = start;
    const dates = [];

    while (now.isBefore(end) || now.isSame(end)) {
      dates.push(now.format('YYYY-MM-DD'));
      now.add(1, 'days');
    }
    return dates;
  };

  // DISABLE DATE OF DATE PICKER
  disabledFromDate = (current) => {
    const { durationTo } = this.state;
    return current && current > moment(durationTo);
  };

  disabledToDate = (current) => {
    const { durationFrom } = this.state;
    return current && current < moment(durationFrom);
  };

  // RENDER EMAILS LIST
  renderEmailsList = () => {
    const {
      timeOff: { emailsList = [] },
    } = this.props;
    const list = emailsList.map((user) => {
      const {
        _id = '',
        generalInfo: { firstName = '', lastName = '', workEmail = '' } = {},
      } = user;
      return { workEmail, firstName, lastName, _id };
    });
    // return list.filter((value) => Object.keys(value).length !== 0);
    return list;
  };

  // COMPARE TWO DAYS
  compareTwoDates = (from, to) => {
    // moment object
    if (from < to) return -1;
    if (from > to) return 1;
    return 0;
  };

  render() {
    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 10,
      },
    };

    const dateFormat = 'MM/DD/YYYY';

    const {
      selectedShortType,
      showSuccessModal,
      secondNotice,
      durationFrom,
      durationTo,
      selectedTypeName,
      selectedType,
    } = this.state;

    const {
      timeOff: {
        timeOffTypes = [],
        totalLeaveBalance: { commonLeaves = {}, specialLeaves = {} } = {},
      } = {},
      loadingAddLeaveRequest,
    } = this.props;
    const { timeOffTypes: typesOfCommonLeaves = [] } = commonLeaves;
    const { timeOffTypes: typesOfSpecialLeaves = [] } = specialLeaves;

    const dataTimeOffTypes1 = this.renderTimeOffTypes1(typesOfCommonLeaves);
    const dataTimeOffTypes2 = this.renderTimeOffTypes1(typesOfSpecialLeaves);
    const dataTimeOffTypes3 = this.renderTimeOffTypes2(timeOffTypes);

    // DYNAMIC ROW OF DATE LISTS
    const dateLists = this.getDateLists(durationFrom, durationTo);
    // const numberOfDays = 0;

    return (
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span>Timeoff</span>
        </div>
        <Form
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...layout}
          name="basic"
          ref={this.formRef}
          id="myForm"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
          className={styles.form}
        >
          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Select Timeoff Type</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="timeOffType"
                rules={[
                  {
                    required: true,
                    message: 'Please select Timeoff Type!',
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    this.onSelectTimeOffTypeChange(value);
                  }}
                  placeholder="Timeoff Type"
                >
                  {this.renderType1(dataTimeOffTypes1)}
                  {this.renderType2(dataTimeOffTypes2)}
                  {this.renderType3(dataTimeOffTypes3)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              {selectedShortType !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    {selectedShortType}s are covered under{' '}
                    <span className={styles.link}>Standard Policy</span>
                  </span>
                </div>
              )}
            </Col>
          </Row>

          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Subject</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="subject"
                rules={[
                  {
                    required: true,
                    message: 'Please input subject!',
                  },
                ]}
              >
                <Input placeholder="Enter Subject" />
              </Form.Item>
            </Col>
            <Col span={6} />
          </Row>
          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Duration</span>
            </Col>
            <Col span={12}>
              <Row gutter={['20', '0']}>
                <Col span={12}>
                  <Form.Item
                    name="durationFrom"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a date!',
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={this.disabledFromDate}
                      format={dateFormat}
                      onChange={(value) => {
                        this.fromDateOnChange(value);
                      }}
                      placeholder="From Date"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="durationTo"
                    rules={[
                      {
                        required: true,
                        message: 'Please select a date!',
                      },
                    ]}
                  >
                    <DatePicker
                      disabledDate={this.disabledToDate}
                      format={dateFormat}
                      onChange={(value) => {
                        this.toDateOnChange(value);
                      }}
                      placeholder="To Date"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              {secondNotice !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>{secondNotice}</span>
                </div>
              )}
            </Col>
          </Row>

          {durationFrom !== '' &&
            durationTo !== '' &&
            selectedType !== 'C' && // Type C: Special Leaves
            selectedType !== 'D' && ( // Type D: Working out of office
              <Form.List name="leaveTimeLists">
                {() => (
                  <Row key={1} className={styles.eachRow}>
                    <Col className={styles.label} span={6}>
                      <span />
                    </Col>
                    <Col span={12} className={styles.leaveDaysContainer}>
                      {dateLists.map((date, index) => {
                        // NO RENDER SATURDAY AND SUNDAY
                        if (moment(date).weekday() !== 6 && moment(date).weekday() !== 0)
                          return (
                            <>
                              <div key={`${index + 1}`} className={styles.eachDay}>
                                <div className={styles.day}>
                                  <span>
                                    {moment(date).locale('en').format('dddd')},{' '}
                                    {moment(date).locale('en').format('MM/DD/YYYY')}
                                  </span>
                                </div>
                                <div className={styles.daySelectionBox}>
                                  <Form.Item
                                    // name={`leaveDaysDetail${index}`}
                                    name={[index]}
                                    fieldKey={[index]}
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please select!',
                                      },
                                    ]}
                                  >
                                    <Select placeholder="">
                                      <OptGroup label="Count/Q.ty">
                                        <Option value="WHOLE-DAY">
                                          <span style={{ fontSize: 13 }}>Whole day</span>
                                        </Option>
                                        <Option value="MORNING">
                                          <span style={{ fontSize: 13 }}>Morning</span>
                                        </Option>
                                        <Option value="AFTERNOON">
                                          <span style={{ fontSize: 13 }}>Afternoon</span>
                                        </Option>
                                      </OptGroup>
                                      <OptGroup label="Other">
                                        <Option value="WORK">
                                          <span
                                            style={{
                                              fontSize: 13,
                                              color: '#00C598',
                                              fontWeight: 'bold',
                                            }}
                                          >
                                            Go to work
                                          </span>
                                        </Option>
                                      </OptGroup>
                                    </Select>
                                  </Form.Item>
                                </div>
                              </div>
                              {/* DATE IS FRIDAY AND IS NOT END OF LIST => SHOW HR LINE */}
                              {moment(date).weekday() === 5 &&
                                moment(date).add(3, 'day') < moment(durationTo) && (
                                  <div className={styles.hr} />
                                )}
                            </>
                          );
                        return null;
                      })}
                      {moment(durationFrom).weekday() === 6 &&
                        (this.compareTwoDates(
                          moment(durationFrom).add(1, 'day').format('DD/MM/YYYY'),
                          moment(durationTo).format('DD/MM/YYYY'),
                        ) === 0 ||
                          this.compareTwoDates(
                            moment(durationFrom).format('DD/MM/YYYY'),
                            moment(durationTo).format('DD/MM/YYYY'),
                          ) === 0) && (
                          <div className={styles.eachDay}>
                            <span>Please select valid dates!</span>
                          </div>
                        )}
                    </Col>
                    <Col span={6}>
                      {/* <div className={styles.smallNotice}>
                        <span className={styles.normalText}>
                          Number of days: {numberOfDays} day(s)
                        </span>
                      </div> */}
                    </Col>
                  </Row>
                )}
              </Form.List>
            )}

          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Description</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Please input description!',
                  },
                ]}
              >
                <TextArea placeholder="The reason I am taking timeoff is …" />
              </Form.Item>
            </Col>
            <Col span={6} />
          </Row>

          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>CC (only if you want to notify other than HR & your manager)</span>
            </Col>
            <Col span={12} className={styles.ccSelection}>
              <Form.Item
                name="personCC"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select mode="multiple" allowClear placeholder="Search a person you want to loop">
                  {this.renderEmailsList().map((value) => {
                    const { firstName = '', lastName = '', _id = '', workEmail = '' } = value;
                    return (
                      <Option key={_id} value={_id}>
                        <span style={{ fontSize: 13 }}>
                          {firstName} {lastName}
                        </span>
                        <span style={{ fontSize: 12, color: '#464646' }}>({workEmail})</span>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} />
          </Row>
        </Form>
        <div className={styles.footer}>
          <span className={styles.note}>
            By default notifications will be sent to HR, your manager and recursively loop to your
            department head.
          </span>
          <div className={styles.formButtons}>
            <Button type="link" htmlType="button" onClick={this.saveDraft}>
              Save to Draft
            </Button>
            <Button
              loading={loadingAddLeaveRequest}
              key="submit"
              type="primary"
              form="myForm"
              htmlType="submit"
            >
              Submit
            </Button>
          </div>
        </div>
        <TimeOffModal
          visible={showSuccessModal}
          onClose={this.setShowSuccessModal}
          content={`${selectedTypeName} request submitted to the HR and your manager.`}
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
