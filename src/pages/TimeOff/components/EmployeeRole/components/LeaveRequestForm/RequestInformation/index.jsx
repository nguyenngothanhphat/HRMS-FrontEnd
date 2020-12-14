import React, { Component } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form, message } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import TimeOffModal from '@/components/TimeOffModal';
import LeaveTimeRow from './LeaveTimeRow';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

@connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingAddLeaveRequest: loading.effects['timeOff/addLeaveRequest'],
  loadingUpdatingLeaveRequest: loading.effects['timeOff/updateLeaveRequestById'],
  loadingSaveDraft: loading.effects['timeOff/saveDraftLeaveRequest'],
  loadingUpdateDraft: loading.effects['timeOff/updateDraftLeaveRequest'],
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
      buttonState: 0, // save draft or submit
      viewingLeaveRequestId: '',
      isEditingDrafts: false,
      remainingDayOfSelectedType: 0,
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
    const { dispatch, action = '' } = this.props;

    dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
    });
    dispatch({
      type: 'timeOff/fetchTimeOffTypes',
    });
    this.fetchEmailsListByCompany();

    if (action === 'edit-leave-request') {
      const { viewingLeaveRequest = {} } = this.props;
      // console.log('viewingLeaveRequest', viewingLeaveRequest);
      const {
        type: { _id: typeId = '', shortType = '', type = '', name = '' } = {},
        subject = '',
        fromDate = '',
        toDate = '',
        leaveDates = [],
        description = '',
        cc = [],
        _id = '',
        status = '',
      } = viewingLeaveRequest;

      if (status === 'DRAFTS') {
        this.setState({
          isEditingDrafts: true,
        });
      }

      this.setState({
        viewingLeaveRequestId: _id,
      });

      this.setState({
        durationFrom: fromDate === null ? null : moment(fromDate),
        durationTo: toDate === null ? null : moment(toDate),
        selectedShortType: shortType,
        selectedTypeName: name,
        selectedType: type,
      });

      const personCC = cc.map((person) => (person ? person._id : null));

      // if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
      // generate date lists and leave time
      const dateLists = this.getDateLists(fromDate, toDate);
      const resultDates = [];
      let check = false;
      dateLists.forEach((val1) => {
        check = false;
        leaveDates.forEach((val2) => {
          const { date = '' } = val2;
          if (moment(date).locale('en').format('YYYY-MM-DD') === val1) {
            resultDates.push(val2);
            check = true;
          }
        });
        if (!check) resultDates.push(null);
      });
      const leaveTimeLists = resultDates.map((date) => (date ? date.timeOfDay : null));
      // }

      // set values from server to fields
      this.formRef.current.setFieldsValue({
        timeOffType: typeId,
        subject,
        durationFrom: fromDate === null ? null : moment(fromDate),
        durationTo: toDate === null ? null : moment(toDate),
        description,
        personCC,
        leaveTimeLists,
      });

      // set notice
      this.autoValueForToDate(type, shortType, moment(fromDate));
      if ((type === 'A' || type === 'B') && moment(fromDate) !== null && moment(fromDate) !== '') {
        this.setSecondNotice(`${shortType}s gets credited each month.`);
      }
    }
  };

  // SET REMAINING DAY OF SELECTED TYPE
  setRemainingDay = (value) => {
    this.setState({
      remainingDayOfSelectedType: value,
    });
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
      setTimeout(() => {
        history.goBack();
      }, 200);
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
        return {
          date: value,
          timeOfDay: leaveTimeLists[index],
        };
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

  // ON SAVE DRAFT
  onSaveDraft = (values) => {
    const { buttonState, isEditingDrafts, viewingLeaveRequestId } = this.state;
    if (buttonState === 1) {
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

      if (timeOffType === '') {
        message.error('Nothing to save as draft!');
      } else {
        const leaveDates = this.generateLeaveDates(durationFrom, durationTo, leaveTimeLists);

        const duration = this.calculateNumberOfLeaveDay(leaveDates);

        const data = {
          type: timeOffType,
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

        // console.log('draft data', data);
        if (!isEditingDrafts) {
          dispatch({
            type: 'timeOff/saveDraftLeaveRequest',
            payload: data,
          }).then((statusCode) => {
            if (statusCode === 200) this.setShowSuccessModal(true);
          });
        } else {
          data._id = viewingLeaveRequestId;
          dispatch({
            type: 'timeOff/updateDraftLeaveRequest',
            payload: data,
          }).then((statusCode) => {
            if (statusCode === 200) this.setShowSuccessModal(true);
          });
        }
      }
    }
  };

  // ON FINISH
  onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
    const {
      dispatch,
      action = '',
      user: { currentUser: { employee = {} } = {} } = {},
    } = this.props;
    const { _id: employeeId = '', manager: { _id: managerId = '' } = {} } = employee;
    const { viewingLeaveRequestId } = this.state;
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

    const { buttonState } = this.state;

    // ON SUBMIT
    if (buttonState === 2) {
      if (leaveDates.length === 0) {
        message.error('Please select valid leave time dates!');
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

        if (action === 'new-leave-request') {
          dispatch({
            type: 'timeOff/addLeaveRequest',
            payload: data,
          }).then((statusCode) => {
            if (statusCode === 200) this.setShowSuccessModal(true);
          });
        } else if (action === 'edit-leave-request') {
          data._id = viewingLeaveRequestId;
          dispatch({
            type: 'timeOff/updateLeaveRequestById',
            payload: data,
          }).then((statusCode) => {
            if (statusCode === 200) this.setShowSuccessModal(true);
          });
        }
      }
    } else if (buttonState === 1) {
      this.onSaveDraft(values);
    }
  };

  onFinishFailed = (errorInfo) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
    const { values = {} } = errorInfo;
    this.onSaveDraft(values);
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
          if (selectedType === 'C') {
            this.setSecondNotice(
              `A 'To date' will be set automatically as per a duration of ${time} days from the selected 'From date'`,
            );
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

  // ON CANCEL EDIT
  onCancelEdit = () => {
    const { viewingLeaveRequestId: id } = this.state;
    history.push(`/time-off/view-request/${id}`);
  };

  // RENDER MODAL content
  renderModalContent = () => {
    const { action = '' } = this.props;
    const { selectedTypeName, buttonState, isEditingDrafts } = this.state;
    let content = '';

    if (action === 'edit-leave-request') {
      if (buttonState === 1) {
        if (isEditingDrafts) {
          content = `${selectedTypeName} request saved as draft.`;
        } else {
          content = `Edits to ticket id: 160012 submitted to HR and manager`;
        }
      } else if (buttonState === 2)
        content = `${selectedTypeName} request submitted to the HR and your manager.`;
    }

    if (action === 'new-leave-request') {
      if (buttonState === 1) {
        content = `${selectedTypeName} request saved as draft.`;
      } else if (buttonState === 2)
        content = `${selectedTypeName} request submitted to the HR and your manager.`;
    }
    return content;
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
      selectedType,
      isEditingDrafts,
      buttonState,
    } = this.state;

    const {
      timeOff: {
        timeOffTypes = [],
        totalLeaveBalance: { commonLeaves = {}, specialLeaves = {} } = {},
      } = {},
      loadingAddLeaveRequest,
      loadingUpdatingLeaveRequest,
      loadingSaveDraft,
      loadingUpdateDraft,
      action = '',
    } = this.props;
    const { timeOffTypes: typesOfCommonLeaves = [] } = commonLeaves;
    const { timeOffTypes: typesOfSpecialLeaves = [] } = specialLeaves;

    const dataTimeOffTypes1 = this.renderTimeOffTypes1(typesOfCommonLeaves);
    const dataTimeOffTypes2 = this.renderTimeOffTypes1(typesOfSpecialLeaves);
    const dataTimeOffTypes3 = this.renderTimeOffTypes2(timeOffTypes);

    // DYNAMIC ROW OF DATE LISTS
    const dateLists = this.getDateLists(durationFrom, durationTo);
    // const numberOfDays = 0;

    // if save as draft, no need to validate forms
    const needValidate = buttonState === 2;

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
                    required: needValidate,
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
                      disabled={selectedType === 'C' || selectedType === 'D'}
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
              <span>Leave time</span>
            </Col>
            <Col span={12}>
              <div
                className={styles.extraTimeSpent}
                style={selectedType === 'C' || selectedType === 'D' ? { marginBottom: '24px' } : {}}
              >
                <Row className={styles.header}>
                  <Col span={7}>Date</Col>
                  <Col span={7}>Day</Col>
                  <Col span={10}>Count/Q.ty</Col>
                </Row>
                {(durationFrom === '' || durationTo === '') && (
                  <div className={styles.content}>
                    <div className={styles.emptyContent}>
                      <span>Selected duration will show as days</span>
                    </div>
                  </div>
                )}
                {durationFrom !== '' &&
                  durationTo !== '' &&
                  (selectedType === 'C' || selectedType === 'D') && (
                    <div className={styles.content}>
                      <div className={styles.emptyContent}>
                        <span>Selected days are automatically set to whole-day leave</span>
                      </div>
                    </div>
                  )}
              </div>
            </Col>
            <Col span={6} />
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
                        return (
                          <LeaveTimeRow
                            eachDate={date}
                            index={index}
                            onRemove={this.onDateRemove}
                            listLength={dateLists.length}
                            onChange={this.onDataChange}
                            needValidate={needValidate}
                          />
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
                    required: needValidate,
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
            {action === 'edit-leave-request' && (
              <Button
                className={styles.cancelButton}
                type="link"
                htmlType="button"
                onClick={this.onCancelEdit}
              >
                <span>Cancel</span>
              </Button>
            )}
            {(action === 'new-leave-request' ||
              (action === 'edit-leave-request' && isEditingDrafts)) && (
              <Button
                loading={loadingUpdatingLeaveRequest || loadingSaveDraft || loadingUpdateDraft}
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
              loading={loadingAddLeaveRequest}
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
          onClose={this.setShowSuccessModal}
          content={this.renderModalContent()}
          submitText="OK"
        />
      </div>
    );
  }
}

export default RequestInformation;
