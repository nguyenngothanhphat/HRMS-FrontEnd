import React, { PureComponent } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import { TIMEOFF_STATUS, TIMEOFF_LINK_ACTION } from '@/utils/timeOff';
import TimeOffModal from '@/components/TimeOffModal';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import ExtraTimeSpentRow from './ExtraTimeSpentRow';

import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const { IN_PROGRESS, DRAFTS } = TIMEOFF_STATUS;
const { EDIT_COMPOFF_REQUEST, NEW_COMPOFF_REQUEST } = TIMEOFF_LINK_ACTION;

@connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingAddCompoffRequest: loading.effects['timeOff/addCompoffRequest'],
}))
class RequestInformation extends PureComponent {
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
      buttonState: 0, // save draft or submit
      isEditingDrafts: false,
      viewingCompoffRequestId: '',
      totalHours: 0,
    };
  }

  saveCurrentTypeTab = (type) => {
    const { dispatch } = this.props;
    const { buttonState } = this.state;
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: String(type),
        currentScopeTab: '3', // my compoff request tab has index "3"
        currentFilterTab: buttonState === 1 ? '4' : '1', // draft 4, in-progress 1
      },
    });
  };

  // SET DATE List
  setDateList = (list) => {
    this.setState({
      dateLists: list,
    });
  };

  // FETCH EMAIL LIST AND PROJECT LIST OF COMPANY
  fetchEmailsListByCompany = () => {
    const { dispatch, user: { currentUser: { company: { _id: company = '' } = {} } = {} } = {} } =
      this.props;
    dispatch({
      type: 'timeOff/fetchEmailsListByCompany',
      payload: [company],
    });
  };

  fetchProjectsListByEmployee = () => {
    const { dispatch, user: { currentUser: { employee: { _id = '' } = {} } = {} } = {} } =
      this.props;
    dispatch({
      type: 'timeOff/fetchProjectsListByEmployee',
      payload: {
        employee: _id,
      },
    });
  };

  // clear viewingCompoffRequest
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/clearViewingCompoffRequest',
    });
  };

  componentDidMount = () => {
    const { action = '' } = this.props;
    this.fetchEmailsListByCompany();
    this.fetchProjectsListByEmployee();

    if (action === EDIT_COMPOFF_REQUEST) {
      const { viewingCompoffRequest = {} } = this.props;
      const {
        project: { id: projectId = '' } = {},
        extraTime = [],
        description = '',
        cc = [],
        _id = '',
        status = '',
      } = viewingCompoffRequest;

      if (status === DRAFTS) {
        this.setState({
          isEditingDrafts: true,
        });
      }

      // set dates
      let durationFrom = '';
      let durationTo = '';
      if (extraTime.length > 0) {
        durationFrom = extraTime[0].date;
        durationTo = extraTime[extraTime.length - 1].date;
      }

      const dateLists = extraTime.map((value) => {
        const { date = '', timeSpend = 0 } = value;
        return {
          date: moment(date).format('YYYY-MM-DD'),
          timeSpend,
        };
      });
      const listValue = dateLists.map((data) => data.timeSpend);

      // set cc
      // const personCC = cc.map((person) => (person ? person._id : null));

      // update form
      this.formRef.current.setFieldsValue({
        projectId,
        description,
        personCC: cc,
        extraTimeLists: listValue,
        durationFrom: durationFrom === null ? null : moment(durationFrom),
        durationTo: durationTo === null ? null : moment(durationTo),
      });

      // update state
      this.setState({
        viewingCompoffRequestId: _id,
        durationFrom: durationFrom === null ? null : moment(durationFrom),
        durationTo: durationTo === null ? null : moment(durationTo),
        dateLists,
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    const { timeOff: { projectsList } = {}, action = '' } = this.props;
    if (
      JSON.stringify(prevProps.timeOff.projectsList) !== JSON.stringify(projectsList) &&
      action === EDIT_COMPOFF_REQUEST
    ) {
      const { viewingCompoffRequest = {} } = this.props;
      const { project: { id: projectId = '' } = {} } = viewingCompoffRequest;
      // set project name
      this.onEnterProjectNameChange(projectId);
    }
  };

  // GENERATE PROJECT LIST DATA
  generateProjectsList = () => {
    const { timeOff: { projectsList = [] } = {} } = this.props;
    return projectsList.map((project) => {
      const {
        id = '',
        projectName = '',
        projectManager: { _id: projectManager = '' } = {},
      } = project;
      return {
        _id: id,
        name: projectName,
        projectManager,
      };
    });
  };

  // GET MANAGER ID & NAME OF SELECTED PROJECT
  onEnterProjectNameChange = (value) => {
    const { timeOff: { projectsList = [] } = {} } = this.props;
    const find = projectsList.find((x) => x.id === value) || {};
    const {
      projectManager: {
        _id,
        generalInfo: { legalName: projectManagerName = '', employeeId: projectManagerId = '' } = {},
      } = {},
    } = find;

    this.setState({
      projectManagerId,
      projectManagerName,
    });

    const { dispatch, user: { currentUser: { employee: { _id: employeeId } = {} } = {} } = {} } =
      this.props;

    if (find) {
      dispatch({
        type: 'timeOff/getCompoffApprovalFlow',
        payload: {
          employeeId,
          projectId: value,
          projectManager: _id,
        },
      });
    }
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
  setShowSuccessModal = (value) => {
    this.setState({
      showSuccessModal: value,
    });
    if (!value) {
      this.saveCurrentTypeTab('5'); // COMPOFF TAB INDEX = 5
      history.push('/time-off');
    }
  };

  // ON FINISH
  onFinish = (values) => {
    const { projectId = '', description = '', personCC = [] } = values;
    const { action: pageAction = '' } = this.props; // edit or new compoff request
    const { dateLists, buttonState, viewingCompoffRequestId, totalHours } = this.state;
    // const { timeOff: { compoffApprovalFlow = {} } = {} } = this.props;

    const { timeOff: { projectsList = [] } = {} } = this.props;
    const project = projectsList.find((x) => x.id === projectId) || {};
    const { projectName = '', projectManager: { _id: projectManager = '' } = {} } = project;

    const action = buttonState === 1 ? 'saveDraft' : 'submit';

    const sendData = {
      project: projectId,
      projectName,
      projectManager,
      extraTime: dateLists,
      description,
      action,
      // approvalFlow: compoffApprovalFlow, // no need more
      cc: personCC,
      onDate: moment(),
      totalHours,
    };

    let type = '';

    // ON SUBMIT BUTTON
    if (buttonState === 2) {
      if (pageAction === EDIT_COMPOFF_REQUEST) {
        type = 'timeOff/updateCompoffRequest';
        sendData._id = viewingCompoffRequestId;
      } else if (pageAction === NEW_COMPOFF_REQUEST) {
        type = 'timeOff/addCompoffRequest';
      }
      sendData.status = IN_PROGRESS;
    }
    // ON SAVE TO DRAFT BUTTON
    else if (pageAction === EDIT_COMPOFF_REQUEST) {
      type = 'timeOff/updateCompoffRequest';
      sendData._id = viewingCompoffRequestId;
      sendData.status = DRAFTS;
    } else if (pageAction === NEW_COMPOFF_REQUEST) {
      type = 'timeOff/addCompoffRequest';
    }

    const { dispatch } = this.props;
    dispatch({
      type,
      payload: sendData,
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) this.setShowSuccessModal(true);
    });
  };

  onFinishFailed = (errorInfo) => {};

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
        totalHours: 0,
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
        totalHours: 0,
        extraTimeLists: [],
      });
    }
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
    return (
      current && current > moment(durationTo)
      // || moment(current).day() === 0 ||
      // moment(current).day() === 6
    );
  };

  disabledToDate = (current) => {
    const { durationFrom } = this.state;
    return (
      current && current < moment(durationFrom)
      // || moment(current).day() === 0 ||
      // moment(current).day() === 6
    );
  };

  // RENDER EMAILS LIST
  renderEmailsList = () => {
    const {
      timeOff: { emailsList = [] },
    } = this.props;
    const list = emailsList.map((user) => {
      const { _id = '', generalInfo: { legalName = '', workEmail = '', avatar = '' } = {} } = user;
      let newAvatar = avatar;
      if (avatar === '') newAvatar = DefaultAvatar;
      return { workEmail, legalName, _id, avatar: newAvatar };
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

    // count total days and total hours
    const totalHours = listValue.reduce((a, b) => a + b, 0);

    this.setDateList(modifiedList);
    this.formRef.current.setFieldsValue({
      extraTimeLists: listValue,
    });
    this.setState({ totalHours });
  };

  // ON DATE onDataChange
  onDataChange = (e, indexToChange) => {
    const { value } = e.target;
    const { dateLists } = this.state;
    const originalList = JSON.parse(JSON.stringify(dateLists));
    originalList[indexToChange].timeSpend = parseFloat(value);

    // count total days and total hours
    const listValue = originalList.map((data) => data.timeSpend);
    const totalHours = listValue.reduce((a, b) => a + b, 0);

    this.setState({
      dateLists: originalList,
      totalHours,
    });
  };

  // RENDER MODAL content
  renderModalContent = () => {
    const { action = '', ticketID } = this.props;
    const { buttonState, isEditingDrafts } = this.state;
    let content = '';

    if (action === EDIT_COMPOFF_REQUEST) {
      if (buttonState === 1) content = `Compoff request saved as draft.`;
      else if (buttonState === 2) {
        if (isEditingDrafts) content = `Compoff request submitted to the HR and your manager.`;
        else content = `Edits to ticket id: ${ticketID} submitted to HR and manager`;
      }
    }

    if (action === NEW_COMPOFF_REQUEST) {
      if (buttonState === 1) {
        content = `Compoff request saved as draft.`;
      } else if (buttonState === 2)
        content = `Compoff request submitted to the HR and your manager.`;
    }
    return content;
  };

  // ON CANCEL EDIT
  onCancelEdit = () => {
    const { viewingCompoffRequestId: id } = this.state;
    history.push(`/time-off/overview/personal-compoff/view/${id}`);
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

    const formatListEmail = this.renderEmailsList() || [];

    const dateFormat = 'DD.MM.YY';

    const {
      showSuccessModal,
      durationFrom,
      durationTo,
      dateLists,
      projectManagerId,
      projectManagerName,
      buttonState,
      isEditingDrafts,
      totalHours,
    } = this.state;

    const { loadingAddCompoffRequest } = this.props;

    // generate project list
    const projectsList = this.generateProjectsList();

    // if save as draft, no need to validate forms
    const needValidate = buttonState === 2;

    const { action = '' } = this.props;

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
              <span>Enter Project name</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="projectId"
                rules={[
                  {
                    required: needValidate,
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
              <span>Duration</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col span={12}>
              <Row gutter={['20', '0']}>
                <Col span={12}>
                  <Form.Item
                    name="durationFrom"
                    rules={[
                      {
                        required: needValidate,
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
                        required: needValidate,
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
              <span>Extra time spent</span> <span className={styles.mandatoryField}>*</span>
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
              <span>Description</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                rules={[
                  {
                    required: needValidate,
                    message: 'Please input description!',
                  },
                ]}
              >
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  maxLength={250}
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
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Search a person you want to loop"
                  filterOption={(input, option) => {
                    return (
                      option.children[1].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                >
                  {formatListEmail.map((value) => {
                    const { _id = '', workEmail = '', avatar = '' } = value;

                    return (
                      <Option key={_id} value={_id}>
                        <div style={{ display: 'inline', marginRight: '10px' }}>
                          <img
                            style={{
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                            }}
                            src={avatar}
                            alt="user"
                            onError={(e) => {
                              e.target.src = DefaultAvatar;
                            }}
                          />
                        </div>
                        <span
                          style={{ fontSize: '13px', color: '#161C29' }}
                          className={styles.ccEmail}
                        >
                          {workEmail}
                        </span>
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
            {action === EDIT_COMPOFF_REQUEST && (
              <Button
                className={styles.cancelButton}
                type="link"
                htmlType="button"
                onClick={this.onCancelEdit}
              >
                <span>Cancel</span>
              </Button>
            )}
            {(action === NEW_COMPOFF_REQUEST ||
              (action === EDIT_COMPOFF_REQUEST && isEditingDrafts)) && (
              <Button
                loading={loadingAddCompoffRequest && buttonState === 1}
                type="link"
                form="myForm"
                className={styles.saveDraftButton}
                htmlType="submit"
                onClick={() => {
                  this.setState({ buttonState: 1 });
                }}
              >
                Save to Draft
              </Button>
            )}
            <Button
              loading={loadingAddCompoffRequest && buttonState === 2}
              key="submit"
              type="primary"
              form="myForm"
              htmlType="submit"
              onClick={() => {
                this.setState({ buttonState: 2 });
              }}
            >
              Submit
            </Button>
          </div>
        </div>
        <TimeOffModal
          visible={showSuccessModal}
          onOk={() => this.setShowSuccessModal(false)}
          content={this.renderModalContent()}
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
