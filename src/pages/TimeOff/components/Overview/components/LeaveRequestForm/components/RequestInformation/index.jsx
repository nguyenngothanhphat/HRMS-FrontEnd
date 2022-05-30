import { Button, Col, DatePicker, Form, Input, message, Row, Select, Spin, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import TimeOffModal from '@/components/TimeOffModal';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import {
  convert24To12,
  getHours,
  MAX_NO_OF_DAYS_TO_SHOW,
  TIMEOFF_12H_FORMAT,
  TIMEOFF_24H_FORMAT,
  TIMEOFF_COL_SPAN_1,
  TIMEOFF_COL_SPAN_2,
  TIMEOFF_DATE_FORMAT,
  TIMEOFF_INPUT_TYPE,
  TIMEOFF_INPUT_TYPE_BY_LOCATION,
  TIMEOFF_LINK_ACTION,
  TIMEOFF_PERIOD,
  TIMEOFF_STATUS,
  TIMEOFF_TYPE,
  TIMEOFF_WORK_DAYS,
  WORKING_HOURS,
} from '@/utils/timeOff';
import LeaveTimeRow from './components/LeaveTimeRow';
import LeaveTimeRow2 from './components/LeaveTimeRow2';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const { A, B, C, D } = TIMEOFF_TYPE;
const { AFTERNOON, MORNING, WHOLE_DAY, HOUR } = TIMEOFF_PERIOD;
const { IN_PROGRESS, DRAFTS } = TIMEOFF_STATUS;
const { EDIT_LEAVE_REQUEST, NEW_LEAVE_REQUEST } = TIMEOFF_LINK_ACTION;

const RequestInformation = (props) => {
  const {
    dispatch,
    action = '',
    ticketID = '',
    invalidDates: invalidDatesProps = [],
    timeOff: {
      viewingLeaveRequest = {},
      viewingLeaveRequest: {
        _id: viewingId = '',
        leaveDates: viewingLeaveDates = [],
        type: viewingType = {} || {},
        subject: viewingSubject = '',
        fromDate: viewingFromDate = '',
        toDate: viewingToDate = '',
        description: viewingDescription = '',
        cc: viewingCC = [],
        status: viewingStatus = '',
      } = {},
      emailsList = [],
      employeeSchedule: { startWorkDay = {}, endWorkDay = {}, workDay = [] } = {},
      yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
    } = {},
    user: { currentUser: { location = {}, employee = {} } = {} } = {},
    loadingAddLeaveRequest = false,
    loadingUpdatingLeaveRequest = false,
    loadingSaveDraft = false,
    loadingUpdateDraft = false,
    loadingMain = false,
  } = props;

  const currentLocationID = location?.headQuarterAddress?.country?._id;

  const [form] = Form.useForm();
  const [selectedTypeName, setSelectedTypeName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showSuccessModalVisible, setShowSuccessModalVisible] = useState(false);
  const [secondNotice, setSecondNotice] = useState('');
  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');
  const [buttonState, setButtonState] = useState(0); // save draft or submit
  const [isEditingDrafts, setIsEditingDrafts] = useState(false);
  const [viewDocumentModal, setViewDocumentModal] = useState(false);
  const [currentAllowanceState, setCurrentAllowanceState] = useState(0);
  const [invalidDates, setInvalidDates] = useState([]);
  const [dateLists, setDateLists] = useState([]);
  const [isModified, setIsModified] = useState(false); // when start editing a request, if there are any changes, isModified = true
  const [workingDays, setWorkingDays] = useState([]);

  const BY_HOUR = TIMEOFF_INPUT_TYPE_BY_LOCATION[currentLocationID] === TIMEOFF_INPUT_TYPE.HOUR;
  const BY_WHOLE_DAY =
    TIMEOFF_INPUT_TYPE_BY_LOCATION[currentLocationID] === TIMEOFF_INPUT_TYPE.WHOLE_DAY;
  // DYNAMIC ROW OF DATE LISTS
  const showAllDateList = dateLists.length < MAX_NO_OF_DAYS_TO_SHOW;

  // functions
  const getTableTabIndexOfSubmittedType = (selectedTypeTemp, selectedTypeNameTemp) => {
    switch (selectedTypeNameTemp) {
      case 'LWP': // wrong here
        return '3';
      default:
        break;
    }
    switch (selectedTypeTemp) {
      case A:
      case B:
        return '1';
      case C:
        return '2';
      case D:
        return '4';
      default:
        return '1';
    }
  };

  const saveCurrentTypeTab = (type) => {
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: String(type),
        currentScopeTab: '3', // my leave request tab has index "3"
        currentFilterTab: buttonState === 1 ? '4' : '1', // draft 4, in-progress 1
      },
    });
  };

  // fetch email list of company
  const fetchEmailsListByCompany = () => {
    dispatch({
      type: 'timeOff/fetchEmailsListByCompany',
      payload: [getCurrentCompany()],
    });
  };

  const generateHours = (list) => {
    if (BY_HOUR) {
      if (list && list.length > 0) {
        const leaveTimeListsTemp = list.map((x) => {
          const hours = getHours(x.startTime, x.endTime, TIMEOFF_12H_FORMAT);
          return {
            ...x,
            hours: hours || 0,
          };
        });
        form.setFieldsValue({
          leaveTimeLists: leaveTimeListsTemp,
        });
      }
    }
  };

  const findInvalidHalfOfDay = (date) => {
    const filtered = invalidDates.filter((x) => {
      return (
        moment(x.date).format(TIMEOFF_DATE_FORMAT) === moment(date).format(TIMEOFF_DATE_FORMAT)
      );
    });

    return filtered.map((x) => x.timeOfDay);
  };

  // DISABLE DATE OF DATE PICKER
  const checkIfWholeDayAvailable = (date) => {
    const find = invalidDates.some(
      (x) =>
        moment(x.date).format(TIMEOFF_DATE_FORMAT) === moment(date).format(TIMEOFF_DATE_FORMAT) &&
        x.timeOfDay === WHOLE_DAY,
    );
    return !find;
  };

  const checkIfHalfDayAvailable = (date) => {
    const filtered = invalidDates.filter((x) => {
      return (
        moment(x.date).format(TIMEOFF_DATE_FORMAT) === moment(date).format(TIMEOFF_DATE_FORMAT) &&
        (x.timeOfDay === MORNING || x.timeOfDay === AFTERNOON)
      );
    });

    if (filtered.length > 1) {
      return false;
    }

    const find = invalidDates.some((x) => {
      return (
        moment(x.date).format(TIMEOFF_DATE_FORMAT) === moment(date).format(TIMEOFF_DATE_FORMAT) &&
        (x.timeOfDay !== MORNING || x.timeOfDay !== AFTERNOON)
      );
    });
    return !find;
  };

  const checkIfWeekEnd = (date) => {
    return !workingDays.includes(moment(date).day());
  };

  // GET LIST OF DAYS FROM DAY A TO DAY B
  const getDateLists = (startDate, endDate) => {
    let dates = [];
    const endDateTemp = moment(endDate).clone();

    if (startDate && endDate) {
      const now = moment(startDate);
      while (now.isSameOrBefore(moment(endDateTemp), 'day')) {
        if (!checkIfWeekEnd(now)) {
          if (checkIfWholeDayAvailable(now) || checkIfHalfDayAvailable(now)) {
            dates = [...dates, moment(now).format(TIMEOFF_DATE_FORMAT)];
          }
        }
        now.add(1, 'days');
      }
    }

    return {
      dates,
      endDate: endDateTemp,
    };
  };

  const getCurrentAllowance = (type) => {
    const foundType =
      type === C || type === D
        ? specialLeaves.find((x) => x.name === selectedTypeName)
        : commonLeaves.find((x) => x.name === selectedTypeName);
    if (foundType) {
      return foundType.total - foundType.taken;
    }
    return 0;
  };

  // GET TIME OFF TYPE BY ID
  const onSelectTimeOffTypeChange = (id) => {
    const foundType = [...commonLeaves, ...specialLeaves].find((t) => t._id === id);
    if (foundType) {
      const { type = '', name = '' } = foundType;
      setSelectedType(type);
      setSelectedTypeName(name);
    }
  };

  // ON FINISH & SHOW SUCCESS MODAL WHEN CLICKING ON SUBMIT
  const setShowSuccessModal = (value) => {
    setShowSuccessModalVisible(value);

    if (!value) {
      const returnTab = getTableTabIndexOfSubmittedType(selectedType, selectedTypeName);
      saveCurrentTypeTab(returnTab);
      setTimeout(() => {
        history.goBack();
      }, 200);
    }
  };

  // GENERATE LEAVE DATES FOR API
  const generateLeaveDates = (leaveTimeLists) => {
    let result = [];
    const getTime = (time) => {
      if (!time) return '00:00';
      return moment(time, TIMEOFF_12H_FORMAT).format(TIMEOFF_24H_FORMAT);
    };
    if (BY_HOUR) {
      let startTimeDefault = '';
      let endTimeDefault = '';
      if (!showAllDateList) {
        startTimeDefault = startWorkDay?.start || WORKING_HOURS.START;
        endTimeDefault = endWorkDay?.end || WORKING_HOURS.END;
      }

      result = dateLists.map((value, index) => {
        return {
          date: moment(value).format('YYYY-MM-DD'),
          timeOfDay: HOUR,
          startTime: getTime(showAllDateList ? leaveTimeLists[index].startTime : startTimeDefault),
          endTime: getTime(showAllDateList ? leaveTimeLists[index].endTime : endTimeDefault),
          hours: showAllDateList ? leaveTimeLists[index].hours : 8,
        };
      });
    } else {
      if (leaveTimeLists.length === 0) {
        // type C,D
        result = dateLists.map((value) => {
          return {
            date: moment(value).format('YYYY-MM-DD'),
            timeOfDay: WHOLE_DAY,
          };
        });
      } else {
        result = dateLists.map((value, index) => {
          return {
            date: moment(value).format('YYYY-MM-DD'),
            timeOfDay: leaveTimeLists[index].period,
          };
        });
      }

      result = result.filter((value) => Object.keys(value).length !== 0);
    }
    return result;
  };

  // ON SAVE DRAFT
  const onSaveDraft = (values) => {
    if (buttonState === 1) {
      const { _id: employeeId = '', managerInfo: { _id: managerId = '' } = {} } = employee;
      const {
        timeOffType = '',
        subject = '',
        description = '',
        personCC = [],
        leaveTimeLists = [],
      } = values;

      if (timeOffType && durationFrom && durationTo) {
        const leaveDatesPayload = generateLeaveDates(leaveTimeLists);

        const data = {
          type: timeOffType,
          employee: employeeId,
          subject,
          fromDate: moment(durationFrom).format('YYYY-MM-DD'),
          toDate: moment(durationTo).format('YYYY-MM-DD'),
          leaveDates: leaveDatesPayload,
          onDate: moment().format('YYYY-MM-DD'),
          description,
          approvalManager: managerId, // id
          cc: personCC,
          company: getCurrentCompany(),
        };

        if (!isEditingDrafts) {
          dispatch({
            type: 'timeOff/saveDraftLeaveRequest',
            payload: data,
          }).then((statusCode) => {
            if (statusCode === 200) setShowSuccessModal(true);
          });
        } else {
          data._id = viewingId;
          dispatch({
            type: 'timeOff/updateDraftLeaveRequest',
            payload: data,
          }).then((statusCode) => {
            if (statusCode === 200) setShowSuccessModal(true);
          });
        }
      }
    }
  };

  // ON FINISH
  const onFinish = (values) => {
    const { _id: employeeId = '', managerInfo: { _id: managerId = '' } = {} } = employee;
    const {
      timeOffType = '',
      subject = '',
      description = '',
      personCC = [],
      leaveTimeLists = [],
    } = values;

    const leaveDatesPayload = generateLeaveDates(leaveTimeLists);

    // ON SUBMIT
    if (buttonState === 2) {
      if (leaveDatesPayload.length === 0) {
        message.error('Please select valid leave time dates!');
      } else {
        // generate data for API
        const payload = {
          type: timeOffType,
          status: IN_PROGRESS,
          subject,
          fromDate: moment(durationFrom).format('YYYY-MM-DD'),
          toDate: moment(durationTo).format('YYYY-MM-DD'),
          leaveDates: leaveDatesPayload,
          onDate: moment().format('YYYY-MM-DD'),
          description,
          cc: personCC,
          tenantId: getCurrentTenant(),
          company: employee.company,
        };

        let type = '';
        if (action === NEW_LEAVE_REQUEST) {
          payload.employee = employeeId;
          payload.approvalManager = managerId; // id
          type = 'timeOff/addLeaveRequest';
        } else if (action === EDIT_LEAVE_REQUEST) {
          const { employee: { _id = '' } = {} } = viewingLeaveRequest;
          payload.employee = _id;
          payload._id = viewingId;
          type = 'timeOff/updateLeaveRequestById';
        }

        dispatch({
          type,
          payload,
        }).then((statusCode) => {
          if (statusCode === 200) setShowSuccessModal(true);
        });
      }
    } else {
      onSaveDraft(values);
    }
  };

  const onFinishFailed = (errorInfo) => {
    const { values = {} } = errorInfo;
    onSaveDraft(values);
  };

  const toDateOnChange = (value) => {
    setDurationTo(value || '');
  };

  // DATE PICKER ON CHANGE
  const fromDateOnChange = (value) => {
    setDurationFrom(value || '');
    if (moment(value).isAfter(moment(durationTo))) {
      setDurationTo('');
      form.setFieldsValue({
        durationTo: '',
      });
    }
  };

  // RENDER OPTIONS
  // TYPE A & B: PAID LEAVES & UNPAID LEAVES
  const renderCommonLeaves = () => {
    return commonLeaves.map((x) => {
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

      const remaining = x.total - x.taken;
      return (
        <Option key={x._id} value={x._id}>
          <div className={styles.timeOffTypeOptions}>
            <>
              <span style={{ fontSize: 13 }} className={styles.name}>
                {x.name}
              </span>

              <span
                className={styles.days}
                style={{
                  float: 'right',
                }}
              >
                <span style={remaining <= 0 ? invalidCss : defaultCss}>
                  <span
                    style={
                      remaining <= 0
                        ? { fontSize: 12, color: '#FD4546' }
                        : { fontSize: 12, color: 'black' }
                    }
                  >
                    {x.remainingTotalMessage}{' '}
                  </span>
                  days
                </span>
              </span>
            </>
          </div>
        </Option>
      );
    });
  };
  // TYPE C: SPECIAL LEAVES & TYPE D: WORKING OUT OF OFFICE
  const renderSpecialLeaves = () => {
    return specialLeaves.map((x) => {
      const remaining = x.total - x.taken;
      return (
        <Option value={x._id}>
          <div className={styles.timeOffTypeOptions}>
            <span style={{ fontSize: 13 }} className={styles.name}>
              {x.name}
            </span>

            {x.showRemainingTotal && (
              <span style={{ float: 'right', fontSize: 12, fontWeight: 'bold' }}>
                <span
                  style={
                    remaining <= 0
                      ? { fontSize: 12, color: '#FD4546' }
                      : { fontSize: 12, color: 'black' }
                  }
                >
                  {remaining} days
                </span>
              </span>
            )}
          </div>
        </Option>
      );
    });
  };

  const disabledFromDate = (current) => {
    return (
      !workingDays.includes(moment(current).day()) ||
      !checkIfWholeDayAvailable(current) ||
      !checkIfHalfDayAvailable(current)
    );
  };

  const disabledToDate = (current) => {
    return (
      (current && moment(current).isBefore(moment(durationFrom), 'day')) ||
      !workingDays.includes(moment(current).day()) ||
      !checkIfWholeDayAvailable(current) ||
      !checkIfHalfDayAvailable(current)
    );
  };

  // RENDER EMAILS LIST
  const renderEmailsList = () => {
    const list = emailsList.map((user) => {
      const { _id = '', generalInfo: { legalName = '', workEmail = '', avatar = '' } = {} } = user;
      let newAvatar = avatar;
      if (avatar === '') newAvatar = DefaultAvatar;
      return { workEmail, legalName, _id, avatar: newAvatar };
    });
    return list;
  };

  // ON CANCEL EDIT
  const onCancelEdit = () => {
    history.push(`/time-off/overview/personal-timeoff/view/${viewingId}`);
  };

  const onCancelLeaveRequest = () => {
    history.push(`/time-off/overview`);
  };
  // RENDER MODAL content
  const renderModalContent = () => {
    let content = '';
    if (action === EDIT_LEAVE_REQUEST) {
      if (buttonState === 1) {
        content = `${selectedTypeName} request saved as draft.`;
      } else if (buttonState === 2) {
        if (isEditingDrafts)
          content = `${selectedTypeName} request submitted to the HR and your manager.`;
        else content = `Edits to ticket id: ${ticketID} submitted to HR and manager`;
      }
    }

    if (action === NEW_LEAVE_REQUEST) {
      if (buttonState === 1) {
        content = `${selectedTypeName} request saved as draft.`;
      } else if (buttonState === 2)
        content = `${selectedTypeName} request submitted to the HR and your manager.`;
    }
    return content;
  };

  // on policy link clicked
  const onLinkClick = () => {
    setViewDocumentModal(true);
  };

  // FETCH LEAVE BALANCE INFO (REMAINING, TOTAL,...)
  const fetchData = async () => {
    fetchEmailsListByCompany();

    if (action === EDIT_LEAVE_REQUEST) {
      if (viewingStatus === DRAFTS) {
        setIsEditingDrafts(true);
      }

      setDurationFrom(viewingFromDate ? moment(viewingFromDate) : null);
      setDurationTo(viewingToDate ? moment(viewingToDate) : null);
      setSelectedTypeName(viewingType.name);
      setSelectedType(viewingType.type);

      // generate date lists and leave time
      const dateListsObj = getDateLists(viewingFromDate, viewingToDate, viewingType?.type);
      const dateListsTemp = dateListsObj.dates;
      setDateLists(dateListsTemp);
      const resultDates = [];

      let check = false;
      dateListsTemp.forEach((val1) => {
        check = false;
        viewingLeaveDates.forEach((val2) => {
          const { date = '' } = val2;
          if (
            moment(date).locale('en').format(TIMEOFF_DATE_FORMAT) ===
            moment(val1).locale('en').format(TIMEOFF_DATE_FORMAT)
          ) {
            resultDates.push(val2);
            check = true;
          }
        });
        if (!check) resultDates.push(null);
      });

      let leaveTimeLists = [];
      if (BY_HOUR) {
        leaveTimeLists = resultDates.map((date, index) => {
          return {
            startTime: convert24To12(viewingLeaveDates[index].startTime),
            endTime: convert24To12(viewingLeaveDates[index].endTime),
            hours: viewingLeaveDates[index].hours || null,
          };
        });
      } else {
        leaveTimeLists = resultDates.map((date) => (date ? { period: date.timeOfDay } : null));
      }

      // set values from server to fields
      form.setFieldsValue({
        timeOffType: viewingType?._id,
        subject: viewingSubject,
        durationFrom: viewingFromDate ? moment(viewingFromDate) : null,
        durationTo: viewingToDate ? moment(viewingToDate) : null,
        description: viewingDescription,
        personCC: viewingCC,
        leaveTimeLists,
      });

      if (BY_HOUR) {
        generateHours(leaveTimeLists);
      }
    }
  };

  // get dates between two dates
  const enumerateDaysBetweenDates = (startDate1, endDate1) => {
    const now = startDate1.clone();
    const dates = [];

    while (now.isSameOrBefore(endDate1)) {
      dates.push(now.format(TIMEOFF_DATE_FORMAT));
      now.add(1, 'days');
    }
    return dates;
  };

  // auto generate hours when select start time & end time for US
  const onValuesChange = () => {
    const values = form.getFieldsValue();
    const { leaveTimeLists = [] } = values;
    generateHours(leaveTimeLists);
    setIsModified(true);
  };

  // USE EFFECT
  useEffect(() => {
    if (invalidDatesProps.length > 0) {
      const dateList = enumerateDaysBetweenDates(moment(viewingFromDate), moment(viewingToDate));
      const temp = invalidDatesProps.filter((x) => {
        return !dateList.some(
          (y) =>
            moment(y).format(TIMEOFF_DATE_FORMAT) === moment(x.date).format(TIMEOFF_DATE_FORMAT),
        );
      });

      setInvalidDates(temp);
    }
  }, [JSON.stringify(invalidDatesProps)]);

  useEffect(() => {
    if (viewingId) {
      fetchData();
    }
  }, [viewingId, JSON.stringify(workingDays)]);

  const generateSecondNotice = () => {
    switch (selectedType) {
      case A:
      case B:
        return `${selectedTypeName}s gets credited each month.`;
      case C: {
        if (currentAllowanceState) {
          return `A 'To date' will be set automatically as per a duration of ${currentAllowanceState} days from the selected 'From date'`;
        }
        return '';
      }
      case D: {
        if (dateLists.length > 0) {
          return `${selectedTypeName} applied for: ${dateLists.length} days`;
        }
        return ``;
      }

      default:
        return '';
    }
  };

  useEffect(() => {
    const currentAllowance = getCurrentAllowance(selectedType);
    setCurrentAllowanceState(currentAllowance);
  }, [selectedTypeName]);

  useEffect(() => {
    if (selectedType && durationTo) {
      const dateListsObj = getDateLists(durationFrom, durationTo, selectedType);
      setDateLists(dateListsObj.dates);
    }
  }, [durationFrom, durationTo, currentAllowanceState]);

  useEffect(() => {
    // only generate leave time lists when modified. If editing a ticket, no need to generate
    if (dateLists.length > 0 && isModified) {
      const initialValuesForLeaveTimesList = dateLists.map((x) => {
        // for non US user
        if (!BY_HOUR) {
          if (findInvalidHalfOfDay(x).includes(MORNING)) {
            return { period: AFTERNOON };
          }
          if (findInvalidHalfOfDay(x).includes(AFTERNOON)) {
            return { period: MORNING };
          }
          return { period: WHOLE_DAY };
        }
        // for US user
        return {
          period: WHOLE_DAY,
        };
      });
      form.setFieldsValue({
        leaveTimeLists: initialValuesForLeaveTimesList,
      });
    }
  }, [selectedTypeName, durationFrom, JSON.stringify(dateLists)]);

  useEffect(() => {
    // generate second notice
    const secondNoticeTemp = generateSecondNotice();
    setSecondNotice(secondNoticeTemp);
  }, [selectedTypeName, currentAllowanceState, JSON.stringify(dateLists)]);

  useEffect(() => {
    dispatch({
      type: 'timeOff/getEmployeeScheduleByLocation',
      payload: {
        location: location?._id,
      },
    });
    return () => {
      dispatch({
        type: 'timeOff/clearViewingLeaveRequest',
      });
    };
  }, []);

  useEffect(() => {
    const workingDaysTemp = [];
    TIMEOFF_WORK_DAYS.forEach((x) => {
      if (workDay.some((y) => y.date === x.text && y.checked)) {
        workingDaysTemp.push(x.id);
      }
    });
    setWorkingDays(workingDaysTemp);
  }, [JSON.stringify(workDay)]);

  // MAIN
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 10,
    },
  };

  const formatListEmail = renderEmailsList() || [];

  // if save as draft, no need to validate forms
  const needValidate = buttonState === 2;

  const renderLeaveTimeList = () => {
    if ([D].includes(selectedType)) {
      return (
        <>
          <Row className={styles.eachRow}>
            <Col className={styles.label} lg={6} sm={8}>
              <span>Leave time</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col lg={12} sm={16}>
              <div className={styles.extraTimeSpent}>
                <Row className={styles.header} gutter={[4, 8]}>
                  <Col span={TIMEOFF_COL_SPAN_1.DATE}>From</Col>
                  <Col span={TIMEOFF_COL_SPAN_1.DAY}>To</Col>
                  <Col span={TIMEOFF_COL_SPAN_1.COUNT}>No. of Days</Col>
                </Row>
                {(!durationFrom || !durationTo) && (
                  <div className={styles.content}>
                    <div className={styles.emptyContent}>
                      <span>Selected duration will show as days</span>
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col lg={6} sm={0} />
          </Row>

          {durationFrom && durationTo && (
            <Form.List name="leaveTimeLists">
              {() => (
                <Row key={1} className={styles.eachRow}>
                  <Col className={styles.label} lg={6} sm={8}>
                    <span />
                  </Col>
                  <Col lg={12} sm={16} className={styles.leaveDaysContainer}>
                    <LeaveTimeRow2
                      fromDate={durationFrom}
                      toDate={durationTo}
                      noOfDays={dateLists.length}
                    />
                  </Col>
                  <Col lg={6} sm={0} />
                </Row>
              )}
            </Form.List>
          )}
        </>
      );
    }

    const renderTableHeader = () => {
      if (showAllDateList && !BY_HOUR)
        return (
          <Row className={styles.header} gutter={[4, 8]}>
            <Col span={TIMEOFF_COL_SPAN_1.DATE}>Date</Col>
            <Col span={TIMEOFF_COL_SPAN_1.DAY}>Day</Col>
            <Col span={TIMEOFF_COL_SPAN_1.COUNT}>Count/Q.ty</Col>
          </Row>
        );
      if (showAllDateList && BY_HOUR)
        return (
          <Row className={styles.header} gutter={[4, 8]}>
            <Col span={TIMEOFF_COL_SPAN_2.DATE}>Date</Col>
            <Col span={TIMEOFF_COL_SPAN_2.DAY}>Day</Col>
            <Col span={TIMEOFF_COL_SPAN_2.START_TIME}>Start time</Col>
            <Col span={TIMEOFF_COL_SPAN_2.END_TIME}>End time</Col>
            <Col span={TIMEOFF_COL_SPAN_2.HOUR} style={{ textAlign: 'center' }}>
              No. of hours
            </Col>
          </Row>
        );
      return (
        <Row className={styles.header} gutter={[4, 8]}>
          <Col span={TIMEOFF_COL_SPAN_1.DATE}>From</Col>
          <Col span={TIMEOFF_COL_SPAN_1.DAY}>To</Col>
          <Col span={TIMEOFF_COL_SPAN_1.COUNT}>No. of Days</Col>
        </Row>
      );
    };
    return (
      <>
        <Row className={styles.eachRow}>
          <Col className={styles.label} lg={6} sm={8}>
            <span>Leave time</span> <span className={styles.mandatoryField}>*</span>
          </Col>
          <Col lg={12} sm={16}>
            <div className={styles.extraTimeSpent}>
              {renderTableHeader()}
              {(!durationFrom || !durationTo) && (
                <div className={styles.content}>
                  <div className={styles.emptyContent}>
                    <span>Selected duration will show as days</span>
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col lg={6} sm={0} />
        </Row>

        {durationFrom && durationTo && (
          <Form.List name="leaveTimeLists">
            {() => (
              <Row key={1} className={styles.eachRow}>
                <Col className={styles.label} lg={6} sm={8}>
                  <span />
                </Col>
                <Col lg={12} sm={16} className={styles.leaveDaysContainer}>
                  {showAllDateList ? (
                    dateLists.map((date, index) => {
                      return (
                        <LeaveTimeRow
                          eachDate={date}
                          index={index}
                          listLength={dateLists.length}
                          needValidate={needValidate}
                          findInvalidHalfOfDay={findInvalidHalfOfDay}
                          BY_HOUR={BY_HOUR}
                          BY_WHOLE_DAY={BY_WHOLE_DAY}
                          form={form}
                        />
                      );
                    })
                  ) : (
                    <LeaveTimeRow2
                      fromDate={durationFrom}
                      toDate={durationTo}
                      noOfDays={dateLists.length}
                    />
                  )}
                </Col>
                <Col lg={6} sm={0} />
              </Row>
            )}
          </Form.List>
        )}
      </>
    );
  };

  const renderFormItem = (content) => {
    if (!selectedTypeName) {
      return <Tooltip title="Please select a Timeoff type to proceed">{content}</Tooltip>;
    }
    return content;
  };

  const disabledBtn = () => {
    return !selectedTypeName;
  };
  // RETURN MAIN
  return (
    <Spin spinning={loadingMain && action === EDIT_LEAVE_REQUEST}>
      <div className={styles.RequestInformation}>
        <div className={styles.formTitle}>
          <span>Timeoff</span>
        </div>
        <Form
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...layout}
          name="basic"
          id="myForm"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={styles.form}
          onValuesChange={onValuesChange}
        >
          <Row className={styles.eachRow}>
            <Col className={styles.label} lg={6} sm={8}>
              <span>Select Timeoff Type</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col lg={12} sm={16}>
              <Form.Item
                name="timeOffType"
                rules={[
                  {
                    required: true,
                    message: 'Please select Timeoff Type!',
                  },
                  // { validator: typeValidator },
                ]}
              >
                <Select
                  onChange={(value) => {
                    onSelectTimeOffTypeChange(value);
                  }}
                  placeholder="Timeoff Type"
                >
                  {renderCommonLeaves()}
                  {renderSpecialLeaves()}
                </Select>
              </Form.Item>
            </Col>
            <Col lg={6} sm={0}>
              {selectedTypeName && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    {selectedTypeName}s are covered under{' '}
                    <span className={styles.link} onClick={onLinkClick}>
                      Standard Policy
                    </span>
                  </span>
                </div>
              )}
            </Col>
          </Row>

          <Row className={styles.eachRow}>
            <Col className={styles.label} lg={6} sm={8}>
              <span>Subject</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col lg={12} sm={16}>
              {renderFormItem(
                <Form.Item
                  name="subject"
                  rules={[
                    {
                      required: needValidate,
                      message: 'Please input subject!',
                    },
                  ]}
                >
                  <Input placeholder="Enter Subject" disabled={!selectedTypeName} />
                </Form.Item>,
              )}
            </Col>
            <Col lg={6} sm={0} />
          </Row>
          <Row className={styles.eachRow}>
            <Col className={styles.label} lg={6} sm={8}>
              <span>Duration</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col lg={12} sm={16}>
              <Row gutter={['20', '0']}>
                <Col span={12}>
                  {renderFormItem(
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
                        disabledDate={disabledFromDate}
                        format={TIMEOFF_DATE_FORMAT}
                        onChange={(value) => {
                          fromDateOnChange(value);
                        }}
                        placeholder="From Date"
                        disabled={!selectedTypeName}
                      />
                    </Form.Item>,
                  )}
                </Col>
                <Col span={12}>
                  {renderFormItem(
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
                        disabledDate={disabledToDate}
                        format={TIMEOFF_DATE_FORMAT}
                        disabled={!selectedTypeName}
                        //  disabled={!selectedTypeName || selectedType === C}
                        onChange={(value) => {
                          toDateOnChange(value);
                        }}
                        placeholder="To Date"
                      />
                    </Form.Item>,
                  )}
                </Col>
              </Row>
            </Col>
            <Col lg={6} sm={0}>
              {secondNotice !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>{secondNotice}</span>
                </div>
              )}
            </Col>
          </Row>

          {renderLeaveTimeList()}

          <Row className={styles.eachRow}>
            <Col className={styles.label} lg={6} sm={8}>
              <span>Description</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col lg={12} sm={16}>
              {renderFormItem(
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
                    disabled={!selectedTypeName}
                  />
                </Form.Item>,
              )}
            </Col>
            <Col span={6} />
          </Row>

          <Row className={styles.eachRow}>
            <Col className={styles.label} lg={6} sm={8}>
              <span>CC (only if you want to notify other than HR & your manager)</span>
            </Col>
            <Col lg={12} sm={16} className={styles.ccSelection}>
              {renderFormItem(
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
                    disabled={!selectedTypeName}
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
                </Form.Item>,
              )}
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
            {action === NEW_LEAVE_REQUEST && (
              <Button
                className={styles.cancelButton}
                type="link"
                htmlType="button"
                onClick={onCancelLeaveRequest}
              >
                <span>Cancel</span>
              </Button>
            )}
            {action === EDIT_LEAVE_REQUEST && (
              <Button
                className={styles.cancelButton}
                type="link"
                htmlType="button"
                onClick={onCancelEdit}
              >
                <span>Cancel</span>
              </Button>
            )}
            {(action === NEW_LEAVE_REQUEST ||
              (action === EDIT_LEAVE_REQUEST && isEditingDrafts)) && (
              <Button
                disabled={disabledBtn()}
                loading={loadingSaveDraft || loadingUpdateDraft}
                type="link"
                form="myForm"
                className={styles.saveDraftButton}
                htmlType="submit"
                onClick={() => {
                  setButtonState(1);
                }}
              >
                Save to Draft
              </Button>
            )}

            <Button
              loading={loadingAddLeaveRequest || loadingUpdatingLeaveRequest}
              key="submit"
              type="primary"
              form="myForm"
              disabled={disabledBtn()}
              htmlType="submit"
              onClick={() => {
                setButtonState(2);
              }}
            >
              Submit
            </Button>
          </div>
        </div>

        <TimeOffModal
          visible={showSuccessModalVisible}
          onOk={() => setShowSuccessModal(false)}
          content={renderModalContent()}
          submitText="OK"
        />

        <ViewDocumentModal visible={viewDocumentModal} onClose={setViewDocumentModal} />
      </div>
    </Spin>
  );
};

export default connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingAddLeaveRequest: loading.effects['timeOff/addLeaveRequest'],
  loadingUpdatingLeaveRequest: loading.effects['timeOff/updateLeaveRequestById'],
  loadingSaveDraft: loading.effects['timeOff/saveDraftLeaveRequest'],
  loadingUpdateDraft: loading.effects['timeOff/updateDraftLeaveRequest'],
  loadingMain: loading.effects['timeOff/fetchTimeOffTypeByEmployeeEffect'],
}))(RequestInformation);
