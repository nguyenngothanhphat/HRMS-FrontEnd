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
  loadingAddCompoffRequest: loading.effects['timeOff/addCompoffRequest'],
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

  // FETCH EMAIL LIST AND PROJECT LIST OF COMPANY
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

  fetchProjectsListByCompany = () => {
    const {
      dispatch,
      user: {
        currentUser: {
          company: { _id: company = '' } = {},
          location: { _id: location = '' } = {},
        } = {},
      } = {},
    } = this.props;
    dispatch({
      type: 'timeOff/fetchProjectsListByCompany',
      payload: { company, location },
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
    this.fetchProjectsListByCompany();
  };

  // GENERATE PROJECT LIST DATA
  generateProjectsList = () => {
    const { timeOff: { projectsList = [] } = {} } = this.props;
    return projectsList.map((project) => {
      const { _id = '', name = '' } = project;
      return {
        _id,
        name,
      };
    });
  };

  // GET MANAGER ID & NAME OF SELECTED PROJECT
  onEnterProjectNameChange = (value) => {
    const { timeOff: { projectsList = [] } = {} } = this.props;
    let projectManagerId = '';
    let projectManagerName = '';

    projectsList.forEach((project) => {
      const {
        _id = '',
        manager: { generalInfo: { employeeId = '', lastName = '', firstName = '' } = {} } = {},
      } = project;

      if (_id === value) {
        projectManagerId = employeeId;
        projectManagerName = `${firstName} ${lastName}`;
      }
    });

    this.setState({
      projectManagerId,
      projectManagerName,
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

  // ON FINISH
  onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
    const { projectId = '', description = '', personCC = [] } = values;

    const { dateLists } = this.state;

    const sendData = {
      project: projectId,
      extraTime: dateLists,
      description,
      action: 'submit',
      approvalFlow: '5fb37597daeffc0c68763d8b',
      cc: personCC,
    };

    // eslint-disable-next-line no-console
    console.log('sendData', sendData);

    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/addCompoffRequest',
      payload: sendData,
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) this.setShowSuccessModal(true);
    });
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
        timeSpend: null,
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
    const listValue = modifiedList.map((data) => data.timeSpend);

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
    originalList[indexToChange].timeSpend = parseFloat(value);

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

    const { loadingAddCompoffRequest } = this.props;

    // count total days and total hours
    const listValue = dateLists.map((data) => data.timeSpend);
    const totalHours = listValue.reduce((a, b) => a + b, 0);
    const totalDays = dateLists.length;

    // generate project list
    const projectsList = this.generateProjectsList();

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
                name="projectId"
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
                  {projectsList.map((project) => {
                    const { _id = '', name = '' } = project;
                    return (
                      <Option value={_id}>
                        <span style={{ fontSize: '13px' }}>{name}</span>
                      </Option>
                    );
                  })}
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
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="The reason I am taking timeoff is …"
                />
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
              loading={loadingAddCompoffRequest}
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
          content="Compoff request submitted to the HR and your manager."
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
