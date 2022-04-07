import { Button, Col, DatePicker, Form, Input, message, Row, Select, Skeleton, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import TimeOffModal from '@/components/TimeOffModal';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import {
  MAX_NO_OF_DAYS_TO_SHOW,
  TIMEOFF_INPUT_TYPE,
  TIMEOFF_INPUT_TYPE_BY_LOCATION,
  TIMEOFF_LINK_ACTION,
  TIMEOFF_STATUS,
  TIMEOFF_TYPE,
  TIMEOFF_PERIOD,
  TIMEOFF_DATE_FORMAT,
  TIMEOFF_COL_SPAN_1,
  TIMEOFF_COL_SPAN_2,
  TIMEOFF_12H_FORMAT,
  TIMEOFF_24H_FORMAT,
  getHours,
  convert24To12,
  WORKING_HOURS,
} from '@/utils/timeOff';
import styles from './index.less';
import LeaveTimeRow from './components/LeaveTimeRow';
import LeaveTimeRow2 from './components/LeaveTimeRow2';

const { Option } = Select;
const { TextArea } = Input;

const { A, B, C, D } = TIMEOFF_TYPE;
const { AFTERNOON, MORNING, WHOLE_DAY } = TIMEOFF_PERIOD;
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
      timeOffTypesByCountry = [],
      emailsList = [],
      employeeSchedule: { startWorkDay = {}, endWorkDay = {} } = {},
      totalLeaveBalance: {
        commonLeaves: { timeOffTypes: timeOffTypesAB = [] } = {},
        specialLeaves: { timeOffTypes: timeOffTypesCD = [] } = {},
      } = {},
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
  const [remainingDayOfSelectedType, setRemainingDayOfSelectedType] = useState(0);
  const [viewDocumentModal, setViewDocumentModal] = useState(false);
  const [currentAllowanceState, setCurrentAllowanceState] = useState(0);
  const [invalidDates, setInvalidDates] = useState([]);
  const [dateLists, setDateLists] = useState([]);
  const [isModified, setIsModified] = useState(false); // when start editing a request, if there are any changes, isModified = true

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

  // GET REMAINING DAY
  const getRemainingDay = (typeName) => {
    let count = 0;
    // let total = 0;
    let check = false;

    timeOffTypesAB.forEach((value) => {
      const {
        defaultSettings: {
          // baseAccrual: { time = 0 } = {},
          name: name1 = '',
          type = '',
        } = {},
        currentAllowance = 0,
      } = value;
      if (typeName === name1 && (type === A || type === B)) {
        count = currentAllowance;
        // total = time;
        check = true;
      }
    });

    if (!check)
      timeOffTypesCD.forEach((value) => {
        const {
          defaultSettings: {
            // baseAccrual: { time = 0 } = {},
            name: name1 = '',
          } = {},
          currentAllowance = 0,
        } = value;
        if (typeName === name1) {
          count = currentAllowance;
          // total = time;
          check = true;
        }
      });

    setRemainingDayOfSelectedType(count);
  };

  // const getRemainingDayById = (_id) => {
  //   let count = 0;

  //   [...timeOffTypesAB, ...timeOffTypesCD].forEach((value) => {
  //     const { defaultSettings: { _id: _id1 = '' } = {}, currentAllowance = 0 } = value;
  //     if (_id1 === _id) {
  //       count = currentAllowance;
  //     }
  //   });

  //   return count;
  // };

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
    return moment(date).weekday() === 6 || moment(date).weekday() === 0;
  };

  // GET LIST OF DAYS FROM DAY A TO DAY B
  const getDateLists = (startDate, endDate, selectedTypeProp) => {
    const dates = [];
    const endDateTemp = moment(endDate).clone();

    if ([C].includes(selectedTypeProp)) {
      const now = moment(startDate).clone();
      while (now.isSameOrBefore(moment(endDate), 'day')) {
        if (checkIfWeekEnd(now)) {
          const nextNow = moment(now).add(1, 'days');
          // if "now" = saturday, nextNow = sunday AND endDate = sunday => add 2 days
          if (checkIfWeekEnd(nextNow) && moment(endDate).weekday() === 6) {
            endDateTemp.add(2, 'days');
          } else endDateTemp.add(1, 'days');
        }
        now.add(1, 'days');
      }
    }

    if (startDate && endDate) {
      const now = moment(startDate).clone();
      while (now.isSameOrBefore(moment(endDateTemp), 'day')) {
        if (!checkIfWeekEnd(now)) {
          if (checkIfWholeDayAvailable(now) || checkIfHalfDayAvailable(now)) {
            dates.push(now.format(TIMEOFF_DATE_FORMAT));
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
    let list = [];
    if (type === C || type === D) {
      list = [...timeOffTypesCD];
    }
    if (type === A || type === B) {
      list = [...timeOffTypesAB];
    }
    const foundType = list.find((value) => value.defaultSettings.name === selectedTypeName);
    return foundType?.currentAllowance || 0;
  };

  const getAutoToDate = (allowance) => {
    if (allowance !== 0) return moment.utc(durationFrom).add(allowance - 1, 'day');
    return moment.utc(durationFrom).add(allowance, 'day');
  };

  // GET TIME OFF TYPE BY ID
  const onSelectTimeOffTypeChange = (id) => {
    const foundType = timeOffTypesByCountry.find((t) => t._id === id);
    if (foundType) {
      const { type = '', name = '' } = foundType;
      getRemainingDay(name);
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

  // CALCULATE DURATION FOR API
  const calculateNumberOfLeaveDay = (list) => {
    let count = 0;
    if (BY_HOUR) {
      list.forEach((value) => {
        count += value.hours;
      });
      count /= 24;
    } else {
      list.forEach((value) => {
        const { timeOfDay = '' } = value;
        switch (timeOfDay) {
          case MORNING:
            count += 0.5;
            break;
          case AFTERNOON:
            count += 0.5;
            break;
          case WHOLE_DAY:
            count += 1;
            break;
          default:
            break;
        }
      });
    }
    return count;
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
          date: value,
          timeOfDay: WHOLE_DAY,
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
            date: value,
            timeOfDay: WHOLE_DAY,
          };
        });
      } else {
        result = dateLists.map((value, index) => {
          return {
            date: value,
            timeOfDay: leaveTimeLists[index].period,
          };
        });
      }
      if (selectedType !== C && selectedType !== D) {
        result = result.filter(
          (value) =>
            moment.utc(value.date).weekday() !== 6 &&
            moment.utc(value.date).weekday() !== 0 &&
            Object.keys(value).length !== 0,
        );
      } else {
        result = result.filter((value) => Object.keys(value).length !== 0);
      }
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
        const duration = calculateNumberOfLeaveDay(leaveDatesPayload);

        const data = {
          type: timeOffType,
          employee: employeeId,
          subject,
          fromDate: durationFrom,
          toDate: durationTo,
          duration,
          leaveDates: leaveDatesPayload,
          onDate: moment.utc(),
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
        const duration = calculateNumberOfLeaveDay(leaveDatesPayload);

        const payload = {
          type: timeOffType,
          status: IN_PROGRESS,
          subject,
          fromDate: durationFrom,
          toDate: durationTo,
          leaveDates: leaveDatesPayload,
          onDate: moment.utc(),
          description,
          duration: Math.round(duration * 100) / 100,
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

  // RENDER SELECT BOX
  // GET DATA FOR SELECT BOX TYPE 1,2
  const renderTimeOffTypes = (data) => {
    const result = data.map((type) => {
      const { currentAllowance = 0, defaultSettings = {} } = type;
      if (defaultSettings) {
        const { _id = '', name = '', type: type1 = '' } = defaultSettings;
        return {
          name,
          remaining: currentAllowance,
          type: type1,
          _id,
        };
      }
      return '';
    });
    return result.filter((val) => val);
    
  };

  // RENDER OPTIONS
  // TYPE A & B: PAID LEAVES & UNPAID LEAVES
  const renderType1 = (data) => {
    return data.map((value) => {
      const { name = '', type = '', remaining = 0, _id = '' } = value;

      const foundType = timeOffTypesByCountry.find((t) => t._id === _id) || {};

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
                {`${name}`}
              </span>

              <span
                className={styles.days}
                style={{
                  float: 'right',
                }}
              >
                {(type === A || type === B) && (
                  <span style={remaining === 0 ? invalidCss : defaultCss}>
                    <span
                      style={
                        remaining === 0
                          ? { fontSize: 12, color: '#FD4546' }
                          : { fontSize: 12, color: 'black' }
                      }
                    >
                      {Math.round(remaining * 100) / 100}
                    </span>
                    /{foundType?.noOfDays || '0'} days
                  </span>
                )}
              </span>
            </>
          </div>
        </Option>
      );
    });
  };
  // TYPE C: SPECIAL LEAVES & TYPE D: WORKING OUT OF OFFICE
  const renderType2 = (data) => {
    return data.map((value) => {
      const { name = '', remaining = 0, _id } = value;
      const foundType = timeOffTypesByCountry.find((t) => t._id === _id) || {};
      return (
        <Option value={_id}>
          <div className={styles.timeOffTypeOptions}>
            <span style={{ fontSize: 13 }} className={styles.name}>
              {`${name}`}
            </span>

            {foundType.type === C && (
              <span style={{ float: 'right', fontSize: 12, fontWeight: 'bold' }}>
                <span
                  style={
                    remaining === 0
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
      // (current && moment(current).isAfter(moment(durationTo), 'day')) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6 ||
      !checkIfWholeDayAvailable(current) ||
      !checkIfHalfDayAvailable(current)
    );
  };

  const disabledToDate = (current) => {
    return (
      (current && moment(current).isBefore(moment(durationFrom), 'day')) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6 ||
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

  // validator
  // const typeValidator = (rule, value, callback) => {
  //   const remaining = getRemainingDayById(value);
  //   if (remaining === 'VALID' || remaining > 0) callback();
  //   else if (selectedTypeName) callback('Leave dates reach limit.');
  //   else callback();
  // };

  // FETCH LEAVE BALANCE INFO (REMAINING, TOTAL,...)
  const fetchData = async () => {
    dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
      payload: {
        location: location._id,
      },
    });

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
          if (moment(date).locale('en').format(TIMEOFF_DATE_FORMAT) === val1) {
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
      getRemainingDay(viewingType.name);
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
    fetchData();
    return () => {
      dispatch({
        type: 'timeOff/clearViewingLeaveRequest',
      });
    };
  }, [JSON.stringify(viewingLeaveRequest)]);

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
    if ([A, B, D].includes(selectedType) && durationTo) {
      const dateListsObj = getDateLists(durationFrom, durationTo, selectedType);
      setDateLists(dateListsObj.dates);
    }
  }, [durationFrom, durationTo, currentAllowanceState]);

  useEffect(() => {
    if ([C].includes(selectedType) && durationFrom) {
      const autoToDate = getAutoToDate(currentAllowanceState);
      const dateListsObj = getDateLists(durationFrom, autoToDate, selectedType);
      setDateLists(dateListsObj.dates);
      setDurationTo(moment(dateListsObj.endDate));
      form.setFieldsValue({
        durationTo: moment(dateListsObj.endDate),
      });
    }
  }, [durationFrom, currentAllowanceState]);

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
    if (BY_HOUR) {
      dispatch({
        type: 'timeOff/getEmployeeScheduleByLocation',
        payload: {
          location: location?._id,
        },
      });
    }
  }, []);

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
    if ([C, D].includes(selectedType)) {
      return (
        <>
          <Row className={styles.eachRow}>
            <Col className={styles.label} span={6}>
              <span>Leave time</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col span={12}>
              <div className={styles.extraTimeSpent}>
                <Row className={styles.header} gutter={[8, 8]}>
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
            <Col span={6} />
          </Row>

          {durationFrom && durationTo && (
            <Form.List name="leaveTimeLists">
              {() => (
                <Row key={1} className={styles.eachRow}>
                  <Col className={styles.label} span={6}>
                    <span />
                  </Col>
                  <Col span={12} className={styles.leaveDaysContainer}>
                    <LeaveTimeRow2
                      fromDate={durationFrom}
                      toDate={durationTo}
                      noOfDays={dateLists.length}
                    />
                  </Col>
                  <Col span={6} />
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
          <Row className={styles.header} gutter={[8, 8]}>
            <Col span={TIMEOFF_COL_SPAN_1.DATE}>Date</Col>
            <Col span={TIMEOFF_COL_SPAN_1.DAY}>Day</Col>
            <Col span={TIMEOFF_COL_SPAN_1.COUNT}>Count/Q.ty</Col>
          </Row>
        );
      if (showAllDateList && BY_HOUR)
        return (
          <Row className={styles.header} gutter={[8, 8]}>
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
        <Row className={styles.header} gutter={[8, 8]}>
          <Col span={TIMEOFF_COL_SPAN_1.DATE}>From</Col>
          <Col span={TIMEOFF_COL_SPAN_1.DAY}>To</Col>
          <Col span={TIMEOFF_COL_SPAN_1.COUNT}>No. of Days</Col>
        </Row>
      );
    };
    return (
      <>
        <Row className={styles.eachRow}>
          <Col className={styles.label} span={6}>
            <span>Leave time</span> <span className={styles.mandatoryField}>*</span>
          </Col>
          <Col span={12}>
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
          <Col span={6} />
        </Row>

        {durationFrom && durationTo && (
          <Form.List name="leaveTimeLists">
            {() => (
              <Row key={1} className={styles.eachRow}>
                <Col className={styles.label} span={6}>
                  <span />
                </Col>
                <Col span={12} className={styles.leaveDaysContainer}>
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
                <Col span={6} />
              </Row>
            )}
          </Form.List>
        )}
      </>
    );
  };

  // RETURN MAIN
  const renderFormItem = (content) => {
    if (!selectedTypeName) {
      return <Tooltip title="Please select a Timeoff type to proceed">{content} </Tooltip>;
    }
      return content;
  }
  if (loadingMain) return <Skeleton />;
  return (
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
          <Col className={styles.label} span={6}>
            <span>Select Timeoff Type</span> <span className={styles.mandatoryField}>*</span>
          </Col>
          <Col span={12}>
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
                {renderType1(renderTimeOffTypes(timeOffTypesAB))}
                {renderType2(renderTimeOffTypes(timeOffTypesCD))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
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
          <Col className={styles.label} span={6}>
            <span>Subject</span> <span className={styles.mandatoryField}>*</span>
          </Col>
          <Col span={12}>
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
              <Input placeholder="Enter Subject" disabled={!selectedTypeName} 
              />
            </Form.Item>
           )}
          </Col>
          <Col span={6} />
        </Row>
        <Row className={styles.eachRow}>
          <Col className={styles.label} span={6}>
            <span>Duration</span> <span className={styles.mandatoryField}>*</span>
          </Col>
          <Col span={12}>
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
                </Form.Item>
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
                    disabled={!selectedTypeName || selectedType === C}
                    onChange={(value) => {
                      toDateOnChange(value);
                    }}
                    placeholder="To Date"
                  />
                </Form.Item>
              )}
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

        {renderLeaveTimeList()}

        <Row className={styles.eachRow}>
          <Col className={styles.label} span={6}>
            <span>Description</span> <span className={styles.mandatoryField}>*</span>
          </Col>
          <Col span={12}>
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
            </Form.Item>
          )}
          </Col>
          <Col span={6} />
        </Row>

        <Row className={styles.eachRow}>
          <Col className={styles.label} span={6}>
            <span>CC (only if you want to notify other than HR & your manager)</span>
          </Col>
          <Col span={12} className={styles.ccSelection}>
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
                    option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
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
          {(action === NEW_LEAVE_REQUEST || (action === EDIT_LEAVE_REQUEST && isEditingDrafts)) && (
            <Button
              disabled={!selectedTypeName}
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
            disabled={
              !selectedTypeName ||
              (remainingDayOfSelectedType === 0 &&
                (selectedType === A || selectedType === B) &&
                action === NEW_LEAVE_REQUEST)
            }
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
  );
};

export default connect(({ timeOff, user, loading }) => ({
  timeOff,
  user,
  loadingAddLeaveRequest: loading.effects['timeOff/addLeaveRequest'],
  loadingUpdatingLeaveRequest: loading.effects['timeOff/updateLeaveRequestById'],
  loadingSaveDraft: loading.effects['timeOff/saveDraftLeaveRequest'],
  loadingUpdateDraft: loading.effects['timeOff/updateDraftLeaveRequest'],
  loadingMain:
    loading.effects['timeOff/getTimeOffTypeByLocation'] ||
    loading.effects['timeOff/fetchLeaveBalanceOfUser'] ||
    loading.effects['timeOff/fetchTimeOffTypesByCountry'],
}))(RequestInformation);
