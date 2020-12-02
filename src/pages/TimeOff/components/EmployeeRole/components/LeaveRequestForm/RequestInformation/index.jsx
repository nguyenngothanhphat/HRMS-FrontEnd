import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form } from 'antd';
import RedCautionIcon from '@/assets/redcaution.svg';
import { connect, history } from 'umi';
import moment from 'moment';
import TimeOffModal from '@/components/TimeOffModal';
import styles from './index.less';

const { Option } = Select;
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
      showSuccessModal: false,
      secondNotice: '',
      durationFrom: '',
      durationTo: '',
      isDurationValid: false,
    };
  }

  // FETCH LEAVE BALANCE INFO (REMAINING, TOTAL,...)
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
    });
    dispatch({
      type: 'timeOff/fetchTimeOffTypes',
    });
  };

  // GET TIME OFF TYPE BY ID
  getTypeInfo = (id) => {
    const { timeOff: { timeOffTypes = [] } = {} } = this.props;
    timeOffTypes.forEach((type) => {
      const { _id = '', name = '', shortType = '' } = type;
      if (id === _id) {
        this.setState({
          selectedShortType: shortType,
          selectedTypeName: name,
        });
      }
    });
  };

  // SHOW BELOW NOTICE (BESIDE DURATION FIELD)
  setSecondNotice = (value) => {
    let secondNotice = '';
    switch (value) {
      case 'CL':
        secondNotice = `${value}s gets credited each month.`;
        break;
      case 'WFH/CP':
        secondNotice = `WFH applied for: 3 days`;
        break;
      default:
        break;
    }
    this.setState({
      secondNotice,
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
      switch (value) {
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
    const result = dateLists.map((value, index) => {
      return {
        date: value,
        timeOfDay: leaveTimeLists[index],
      };
    });
    return result;
  };

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
    // generate data for API
    const duration = this.calculateNumberOfLeaveDay(leaveTimeLists);
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
      cc: [],
    };

    dispatch({
      type: 'timeOff/addLeaveRequest',
      payload: data,
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) this.setShowSuccessModal(true);
    });
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  // DATE PICKER
  fromDateOnChange = (value) => {
    this.setState({
      durationFrom: value,
    });
    const { selectedShortType } = this.state;
    this.setSecondNotice(selectedShortType);
  };

  toDateOnChange = (value) => {
    this.setState({
      durationTo: value,
    });
    const { selectedShortType } = this.state;
    this.setSecondNotice(selectedShortType);
  };

  // CHECK DAY ORDER
  fromDateValidator = (rule, value, callback) => {
    const { durationTo } = this.state;
    if (durationTo !== '') {
      const checkDayOrder = moment(durationTo).isAfter(value);
      if (!checkDayOrder && value !== null) {
        callback('From Date must be before To Date!');
        this.setState({
          isDurationValid: false,
        });
      } else {
        callback();
        this.setState({
          isDurationValid: true,
        });
      }
    }
  };

  toDateValidator = (rule, value, callback) => {
    const { durationFrom } = this.state;
    const checkDayOrder = moment(value).isAfter(durationFrom);
    if (durationFrom !== '') {
      if (!checkDayOrder && value !== null) {
        callback('To Date must be after From Date!');
        this.setState({
          isDurationValid: false,
        });
      } else {
        callback();
        this.setState({
          isDurationValid: true,
        });
      }
    }
  };

  // ON SAVE DRAFT CLICKED
  saveDraft = () => {
    // eslint-disable-next-line no-alert
    alert('Save Draft');
  };

  // HOVER ON EACH OPTION IN SELECT
  content = () => (
    <span
      // style={{
      //   position: 'absolute',
      //   top: 0,
      //   right: 0,
      //   display: 'flex',
      //   background: '#FFFFFF',
      //   boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.15)',
      //   borderRadius: '4px',
      //   width: '200px',
      //   overflow: 'auto',
      // }}
      className={styles.runOutOfRemainingDayNotice}
    >
      <img src={RedCautionIcon} alt="caution-icon" />
      <p>
        You cannot apply for this leave.
        {/* You have exhausted all your {name} ({shortName} */}
        s).
      </p>
    </span>
  );

  // RENDER SELECT BOX
  // GET DATA FOR SELECT BOX
  renderTimeOffTypes = (data) => {
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
        <Option value={_id}>
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
      const { name = '', shortName = '', total = 0, _id = '' } = value;
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

  // GET LIST OF DAYS FROM DAY A TO DAY B
  getDateLists = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    const now = start;
    const dates = [];

    while (now.isBefore(end)) {
      dates.push(now.format('YYYY-MM-DD'));
      now.add(1, 'days');
    }
    return dates;
  };

  // DISABLE PAST DATE OF DATE PICKER
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
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

    const {
      selectedShortType,
      showSuccessModal,
      secondNotice,
      durationFrom,
      durationTo,
      isDurationValid,
      selectedTypeName,
    } = this.state;

    const {
      timeOff: { totalLeaveBalance: { commonLeaves = {}, specialLeaves = {} } = {} } = {},
      loadingAddLeaveRequest,
    } = this.props;
    const { timeOffTypes: typesOfCommonLeaves = [] } = commonLeaves;
    const { timeOffTypes: typesOfSpecialLeaves = [] } = specialLeaves;

    const dataTimeOffTypes1 = this.renderTimeOffTypes(typesOfCommonLeaves);
    const dataTimeOffTypes2 = this.renderTimeOffTypes(typesOfSpecialLeaves);

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
                <Select onChange={(value) => this.getTypeInfo(value)} placeholder="Timeoff Type">
                  {this.renderType1(dataTimeOffTypes1)}
                  {this.renderType2(dataTimeOffTypes2)}
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
                      { validator: this.fromDateValidator },
                    ]}
                  >
                    <DatePicker
                      disabledDate={this.disabledDate}
                      onChange={(value) => this.fromDateOnChange(value)}
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
                      { validator: this.toDateValidator },
                    ]}
                  >
                    <DatePicker
                      disabledDate={this.disabledDate}
                      onChange={(value) => this.toDateOnChange(value)}
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

          {durationFrom !== '' && durationTo !== '' && isDurationValid && (
            <Form.List name="leaveTimeLists">
              {() => (
                <Row className={styles.eachRow}>
                  <Col className={styles.label} span={6}>
                    <span />
                  </Col>
                  <Col span={12} className={styles.leaveDaysContainer}>
                    {this.getDateLists(durationFrom, durationTo).map((date, index) => {
                      return (
                        <div className={styles.eachDay}>
                          <div className={styles.day}>
                            <span>{date}</span>
                          </div>
                          <div className={styles.daySelectionBox}>
                            <Form.Item
                              // name={`leaveDaysDetail${index}`}
                              name={[index]}
                              rules={[
                                {
                                  required: true,
                                  message: 'Please select!',
                                },
                              ]}
                            >
                              <Select placeholder="">
                                <Option value="WHOLE-DAY">
                                  <span style={{ fontSize: 13 }}>Whole day</span>
                                </Option>
                                <Option value="MORNING">
                                  <span style={{ fontSize: 13 }}>Morning</span>
                                </Option>
                                <Option value="AFTERNOON">
                                  <span style={{ fontSize: 13 }}>Afternoon</span>
                                </Option>
                              </Select>
                            </Form.Item>
                          </div>
                        </div>
                      );
                    })}
                  </Col>
                  <Col span={6} />
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
            <Col span={12}>
              <Form.Item
                name="personCC"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Select placeholder="Search a person you want to loop">
                  <Option value="Person 1">
                    <span style={{ fontSize: 13 }}>Person 1</span>
                  </Option>
                  <Option value="Person 2">
                    <span style={{ fontSize: 13 }}>Person 2</span>
                  </Option>
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
