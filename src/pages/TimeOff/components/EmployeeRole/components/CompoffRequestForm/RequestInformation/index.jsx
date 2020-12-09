import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import TimeOffModal from '@/components/TimeOffModal';
import ExtraTimeSpentRow from './ExtraTimeSpentRow';
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
      showSuccessModal: false,
      durationFrom: '',
      durationTo: '',
      dateLists: [],
      projectManagerId: '',
      projectManagerName: '',
    };
  }

  // SET DATE List
  setDateList = (list) => {
    this.setState({
      dateLists: list,
    });
  };

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
  onEnterProjectNameChange = () => {
    this.setState({
      projectManagerId: 'PSI- 1221',
      projectManagerName: 'Rose Mary Mali',
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

    const { durationTo } = this.state;
    if (durationTo !== '') {
      const list = this.getDateLists(value, durationTo);
      this.setDateList(list);
      this.formRef.current.setFieldsValue({
        extraTimeLists: [],
      });
    }
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
    const { durationFrom } = this.state;
    if (durationFrom !== '') {
      const list = this.getDateLists(durationFrom, value);
      this.setDateList(list);
      this.formRef.current.setFieldsValue({
        extraTimeLists: [],
      });
    }
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
      const obj = {
        date: now.format('YYYY-MM-DD'),
        value: null,
      };
      dates.push(obj);
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

  // ON DATE onRemove
  onDateRemove = (indexToRemove) => {
    const { dateLists } = this.state;
    const originalList = JSON.parse(JSON.stringify(dateLists));
    const modifiedList = originalList.filter((value, index) => index !== indexToRemove);
    const listValue = modifiedList.map((data) => data.value);

    this.setDateList(modifiedList);
    this.formRef.current.setFieldsValue({
      extraTimeLists: listValue,
    });
  };

  // ON DATE onDataChange
  onDataChange = (e, indexToChange) => {
    const { value } = e.target;
    const { dateLists } = this.state;
    const originalList = JSON.parse(JSON.stringify(dateLists));
    originalList[indexToChange].value = parseFloat(value);

    this.setState({
      dateLists: originalList,
    });
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
      showSuccessModal,
      durationFrom,
      durationTo,
      dateLists,
      projectManagerId,
      projectManagerName,
    } = this.state;
    // const numberOfDays = 0;

    // count total days and total hours
    const listValue = dateLists.map((data) => data.value);
    const totalHours = listValue.reduce((a, b) => a + b, 0);
    const totalDays = dateLists.length;

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
                  <Option value="HRMS Projekt">
                    <span style={{ fontSize: '13px' }}>HRMS Projekt</span>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              {projectManagerId !== '' && projectManagerName !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    Managed by [{projectManagerId}]
                    <br />
                    {projectManagerName}
                  </span>
                </div>
              )}
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
            <Col span={6} />
          </Row>

          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Extra time spent</span>
            </Col>
            <Col span={12}>
              <div className={styles.extraTimeSpent}>
                <Row className={styles.header}>
                  <Col span={7}>Date</Col>
                  <Col span={7}>Day</Col>
                  <Col span={10}>Time Spent (In Hrs)</Col>
                </Row>
                {(durationFrom === '' || durationTo === '') && (
                  <div className={styles.content}>
                    <div className={styles.emptyContent}>
                      <span>Selected duration will show as days</span>
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col span={6}>
              {durationFrom !== '' && durationTo !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>Allowed input: 1- 9 hrs/day</span>
                </div>
              )}
            </Col>
          </Row>

          {durationFrom !== '' && durationTo !== '' && (
            <Row className={styles.eachRow}>
              <Col className={styles.label} span={6} />
              <Col span={18}>
                <div className={styles.extraTimeSpent}>
                  <div className={styles.content}>
                    <Form.List name="extraTimeLists">
                      {() => (
                        <>
                          {dateLists.map((date, index) => {
                            return (
                              <ExtraTimeSpentRow
                                eachDate={date}
                                index={index}
                                onRemove={this.onDateRemove}
                                listLength={dateLists.length}
                                onChange={this.onDataChange}
                                totalDays={totalDays}
                                totalHours={totalHours}
                              />
                            );
                          })}
                        </>
                      )}
                    </Form.List>
                  </div>
                </div>
              </Col>
            </Row>
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
                <TextArea rows={3} placeholder="The reason I am taking timeoff is …" />
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
