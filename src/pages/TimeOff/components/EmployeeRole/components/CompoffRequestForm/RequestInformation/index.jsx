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
  onEnterProjectNameChange = (id) => {
    // const { durationFrom } = this.state;
    // const { timeOff: { timeOffTypes = [] } = {} } = this.props;
    // timeOffTypes.forEach((eachType) => {
    //   const { _id = '', name = '', shortType = '', type = '' } = eachType;
    //   if (id === _id) {
    //     this.autoValueForToDate(type, shortType, durationFrom);
    //     if ((type === 'A' || type === 'B') && durationFrom !== null && durationFrom !== '') {
    //       this.setSecondNotice(`${shortType}s gets credited each month.`);
    //     }
    //
    //     this.setState({
    //       selectedShortType: shortType,
    //       selectedType: type,
    //       selectedTypeName: name,
    //     });
    //   }
    // });
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
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
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

    // const { selectedShortType, selectedType } = this.state;
    // this.autoValueForToDate(selectedType, selectedShortType, value);
    // if (selectedType === 'A' || selectedType === 'B')
    //   this.setSecondNotice(`${selectedShortType}s gets credited each month.`);
    //
    // // initial value for leave dates list
    // const { durationTo } = this.state;
    // const dateLists = this.getDateLists(value, durationTo);
    // const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');
    // this.formRef.current.setFieldsValue({
    //   leaveTimeLists: initialValuesForLeaveTimesList,
    // });
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
    // const { selectedShortType, selectedType } = this.state;
    // if (selectedType === 'A' || selectedType === 'B')
    //   this.setSecondNotice(`${selectedShortType}s gets credited each month.`);
    //
    // // initial value for leave dates list
    // const { durationFrom } = this.state;
    // const dateLists = this.getDateLists(durationFrom, value);
    // const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');
    // this.formRef.current.setFieldsValue({
    //   leaveTimeLists: initialValuesForLeaveTimesList,
    // });
  };

  // ON SAVE DRAFT CLICKED
  saveDraft = () => {
    // eslint-disable-next-line no-alert
    alert('Save Draft');
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

    const { showSuccessModal, secondNotice, durationFrom, durationTo } = this.state;

    // DYNAMIC ROW OF DATE LISTS
    // const dateLists = this.getDateLists(durationFrom, durationTo);
    // const numberOfDays = 0;

    return (
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span>Compoff</span>
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
              <span>Enter Project name</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter project name!',
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    this.onEnterProjectNameChange(value);
                  }}
                  placeholder="Enter Project"
                >
                  <Option value="A">A</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <div className={styles.smallNotice}>
                <span className={styles.normalText}>
                  Managed by [PSI- 1221]
                  <br />
                  Rose Mary Mali
                </span>
              </div>
            </Col>
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
              // loading={loadingAddLeaveRequest}
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
          // content={`${selectedTypeName} request submitted to the HR and your manager.`}
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
