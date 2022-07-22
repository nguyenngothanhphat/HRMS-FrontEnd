import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import {
  convert24To12,
  getHours,
  MAX_NO_OF_DAYS_TO_SHOW,
  TIMEOFF_12H_FORMAT,
  TIMEOFF_24H_FORMAT,
  TIMEOFF_COL_SPAN_1,
  TIMEOFF_COL_SPAN_2,
  TIMEOFF_DATE_FORMAT,
  TIMEOFF_DATE_FORMAT_API,
  TIMEOFF_INPUT_TYPE,
  TIMEOFF_INPUT_TYPE_BY_LOCATION,
  TIMEOFF_LINK_ACTION,
  TIMEOFF_PERIOD,
  TIMEOFF_STATUS,
  TIMEOFF_TYPE,
  TIMEOFF_WORK_DAYS,
  WORKING_HOURS,
} from '@/utils/timeOff';
import { getCurrentTenant } from '@/utils/authority';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import TimeOffModal from '@/components/TimeOffModal';
import AddAttachments from './components/AddAttachments';
import DebounceSelect from './components/DebounceSelect';
import LeaveTimeRow from './components/LeaveTimeRow';
import LeaveTimeRow2 from './components/LeaveTimeRow2';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;

const { A, B, C, D } = TIMEOFF_TYPE;
const { AFTERNOON, MORNING, WHOLE_DAY, HOUR } = TIMEOFF_PERIOD;
const { IN_PROGRESS, DRAFTS } = TIMEOFF_STATUS;
const { EDIT_LEAVE_REQUEST, NEW_LEAVE_REQUEST, NEW_BEHALF_OF } = TIMEOFF_LINK_ACTION;

const RequestInformation = (props) => {
  const {
    dispatch,
    action = '',
    ticketID = '',
    invalidDates: invalidDatesProps = [],
    timeOff: {
      viewingLeaveRequest = {},
      employeeBehalfOf,
      viewingLeaveRequest: {
        _id: viewingId = '',
        leaveDates: viewingLeaveDates = [],
        type: viewingType = {} || {},
        subject: viewingSubject = '',
        fromDate: viewingFromDate = '',
        toDate: viewingToDate = '',
        description: viewingDescription = '',
        cc: viewingCC = [],
        attachments: viewingAttachmentList = [],
        status: viewingStatus = '',
      } = {},
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

  const [form] = Form.useForm();

  // leave type
  const [continuousDateList, setContinuousDateList] = useState([]);
  const [choosableDateList, setChoosableDateList] = useState([]);

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
  const [workingDays, setWorkingDays] = useState([]);
  const [isNormalType, setIsNormalType] = useState(false);
  const [locationEmployeeBehalfOf, setLocationEmployeeBehalfOf] = useState('');
  const [visible, setVisible] = useState(false);
  const didMount = useRef(false);

  const currentLocationID =
    action === NEW_LEAVE_REQUEST
      ? location?.headQuarterAddress?.country?._id
      : locationEmployeeBehalfOf;

  const BY_HOUR = TIMEOFF_INPUT_TYPE_BY_LOCATION[currentLocationID] === TIMEOFF_INPUT_TYPE.HOUR;
  const BY_WHOLE_DAY =
    TIMEOFF_INPUT_TYPE_BY_LOCATION[currentLocationID] === TIMEOFF_INPUT_TYPE.WHOLE_DAY;

  // DYNAMIC ROW OF DATE LISTS
  const showAllDateList =
    continuousDateList.length < MAX_NO_OF_DAYS_TO_SHOW || choosableDateList.length > 0;

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
  const fetchEmailsListByCompany = async (values) => {
    let emailList = [];
    if (!isEmpty(values)) {
      const res = await dispatch({
        type: 'timeOff/fetchEmailsListByCompany',
        payload: {
          search: values,
        },
      });
      if (res.statusCode === 200) {
        emailList = res.data;
      }
    }
    return emailList;
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
  const getContinuousDateLists = (startDate, endDate) => {
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
      if (type === TIMEOFF_TYPE.A || type === TIMEOFF_TYPE.B || type === TIMEOFF_TYPE.D) {
        setIsNormalType(true);
      } else {
        setIsNormalType(false);
      }
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

      result = (!isNormalType ? continuousDateList : choosableDateList).map((value, index) => {
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
        result = continuousDateList.map((value) => {
          return {
            date: moment(value).format('YYYY-MM-DD'),
            timeOfDay: WHOLE_DAY,
          };
        });
      } else {
        result = (!isNormalType ? continuousDateList : choosableDateList).map((value, index) => {
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
        attachments = [],
      } = values;

      if (timeOffType && ((durationFrom && durationTo) || choosableDateList.length)) {
        const leaveDatesPayload = generateLeaveDates(leaveTimeLists);

        let data = {};
        if (isNormalType) {
          data = {
            type: timeOffType,
            status: IN_PROGRESS,
            subject,
            listDate: choosableDateList,
            leaveDates: leaveDatesPayload,
            onDate: moment().format('YYYY-MM-DD'),
            description,
            cc: personCC.map((item) => item?.value[0]) || [],
            tenantId: getCurrentTenant(),
            company: employee.company,
            attachments,
            approvalManager: managerId,
            employee: employeeId,
          };
        } else {
          data = {
            type: timeOffType,
            status: IN_PROGRESS,
            subject,
            fromDate: moment(durationFrom).format('YYYY-MM-DD'),
            toDate: moment(durationTo).format('YYYY-MM-DD'),
            leaveDates: leaveDatesPayload,
            onDate: moment().format('YYYY-MM-DD'),
            description,
            cc: personCC.map((item) => item?.value[0]) || [],
            tenantId: getCurrentTenant(),
            company: employee.company,
            attachments,
            approvalManager: managerId,
            employee: employeeId,
          };
        }
        if (!isEditingDrafts) {
          dispatch({
            type: 'timeOff/saveDraftLeaveRequest',
            payload: {
              ...data,
              status: DRAFTS,
            },
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
      employeeBehalf = {},
      timeOffType = '',
      subject = '',
      description = '',
      personCC = [],
      leaveTimeLists = [],
      attachments = [],
    } = values;
    const leaveDatesPayload = generateLeaveDates(leaveTimeLists);

    // ON SUBMIT
    if (buttonState === 2) {
      if (leaveDatesPayload.length === 0) {
        message.error('Please select valid leave time dates!');
      } else {
        // generate data for API
        let payload = {};
        if (isNormalType) {
          payload = {
            type: timeOffType,
            status: IN_PROGRESS,
            subject,
            listDate: choosableDateList,
            leaveDates: leaveDatesPayload,
            onDate: moment().format('YYYY-MM-DD'),
            description,
            cc: personCC.map((item) => item?.value[0]) || [],
            tenantId: getCurrentTenant(),
            company: employee.company,
            attachments,
          };
        } else {
          payload = {
            type: timeOffType,
            status: IN_PROGRESS,
            subject,
            fromDate: moment(durationFrom).format('YYYY-MM-DD'),
            toDate: moment(durationTo).format('YYYY-MM-DD'),
            leaveDates: leaveDatesPayload,
            onDate: moment().format('YYYY-MM-DD'),
            description,
            cc: personCC.map((item) => item?.value[0]) || [],
            tenantId: getCurrentTenant(),
            company: employee.company,
            attachments,
          };
        }

        const { employee: { _id = '' } = {} } = viewingLeaveRequest;
        let type = '';
        switch (action) {
          case NEW_LEAVE_REQUEST:
            payload.employee = employeeId;
            payload.approvalManager = managerId; // id
            type = 'timeOff/addLeaveRequest';
            break;
          case NEW_BEHALF_OF:
            payload.employee = employeeBehalf?.value[0] || '';
            type = 'timeOff/addLeaveRequest';
            break;
          case EDIT_LEAVE_REQUEST:
            payload.employee = _id;
            payload._id = viewingId;
            type = 'timeOff/updateLeaveRequestById';
            break;
          default:
            break;
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

  const handleChange = (value) => {
    if (!choosableDateList.includes(moment(value).format(TIMEOFF_DATE_FORMAT))) {
      setChoosableDateList([...choosableDateList, moment(value).format(TIMEOFF_DATE_FORMAT)]);
    } else {
      setChoosableDateList(
        choosableDateList.filter((x) => x !== moment(value).format(TIMEOFF_DATE_FORMAT)),
      );
    }
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
    const value = form.getFieldsValue();
    return (
      !workingDays.includes(moment(current).day()) ||
      !checkIfWholeDayAvailable(current) ||
      !checkIfHalfDayAvailable(current) ||
      value?.listDate?.find((x) => x === moment(current).format('YYYY-MM-DD'))
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

    if (action === NEW_LEAVE_REQUEST || action === NEW_BEHALF_OF) {
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
    if (action === EDIT_LEAVE_REQUEST) {
      if (viewingStatus === DRAFTS) {
        setIsEditingDrafts(true);
      }
      let isNormalTypeTemp = false;
      let choosableDateListTemp = [];
      if (
        viewingType.type === TIMEOFF_TYPE.A ||
        viewingType.type === TIMEOFF_TYPE.B ||
        viewingType.type === TIMEOFF_TYPE.D
      ) {
        isNormalTypeTemp = true;
        choosableDateListTemp = viewingLeaveDates.map((x) =>
          moment(x.date, TIMEOFF_DATE_FORMAT_API).format(TIMEOFF_DATE_FORMAT),
        );
        setIsNormalType(true);
        setChoosableDateList(choosableDateListTemp);
      }

      setDurationFrom(viewingFromDate ? moment(viewingFromDate) : null);
      setDurationTo(viewingToDate ? moment(viewingToDate) : null);
      setSelectedTypeName(viewingType.name);
      setSelectedType(viewingType.type);

      // generate date lists and leave time
      const continuousDateListObj = getContinuousDateLists(
        viewingFromDate,
        viewingToDate,
        viewingType?.type,
      );
      const continuousDateListTemp = continuousDateListObj.dates;
      setContinuousDateList(continuousDateListTemp);
      const resultDates = [];
      let check = false;
      (!isNormalTypeTemp ? continuousDateListTemp : choosableDateListTemp).forEach((val1) => {
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
        listDate: choosableDateListTemp,
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
  const onValuesChange = (changedValues, allValues) => {
    const { leaveTimeLists = [], employeeBehalf = {} } = allValues;
    if (action === NEW_BEHALF_OF && !isEmpty(employeeBehalf)) {
      dispatch({
        type: 'timeOff/save',
        payload: {
          employeeBehalfOf: employeeBehalf?.value[0] || '',
        },
      });
      setLocationEmployeeBehalfOf(employeeBehalf?.value[1] || '');
    }
    generateHours(leaveTimeLists);
  };

  // USE EFFECT
  useEffect(() => {
    if (invalidDatesProps.length > 0) {
      let listDates = [];
      let temp = [];
      const dateList = enumerateDaysBetweenDates(moment(viewingFromDate), moment(viewingToDate));
      if (!isNormalType && viewingFromDate && viewingToDate) {
        temp = invalidDatesProps.filter((x) => {
          return !dateList.some(
            (y) =>
              moment(y).format(TIMEOFF_DATE_FORMAT) === moment(x.date).format(TIMEOFF_DATE_FORMAT),
          );
        });
      } else {
        listDates = viewingLeaveRequest.leaveDates?.map((x) => x.date);
        temp = invalidDatesProps.filter((x) => {
          return !listDates?.some(
            (y) =>
              moment(y).format(TIMEOFF_DATE_FORMAT) === moment(x.date).format(TIMEOFF_DATE_FORMAT),
          );
        });
      }
      setInvalidDates(temp);
    }
  }, [JSON.stringify(invalidDatesProps)]);

  useEffect(() => {
    if (didMount.current && (!isEmpty(continuousDateList) || !isEmpty(choosableDateList))) {
      const initialValuesForLeaveTimesList = (
        isNormalType ? choosableDateList : continuousDateList
      ).map((x) => {
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
  }, [
    selectedTypeName,
    durationFrom,
    JSON.stringify(continuousDateList),
    JSON.stringify(choosableDateList),
  ]);

  useEffect(() => {
    if (viewingId) {
      fetchData();
    }
  }, [viewingId, JSON.stringify(workingDays)]);

  useEffect(() => {
    if (action !== EDIT_LEAVE_REQUEST) {
      didMount.current = true;
    }
    if (
      selectedTypeName &&
      durationFrom &&
      (!isEmpty(choosableDateList) || !isEmpty(continuousDateList))
    ) {
      setTimeout(() => {
        didMount.current = true;
      }, 1000);
    }
  }, [selectedTypeName, durationFrom]);

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
        if (choosableDateList.length > 0) {
          return `${selectedTypeName} applied for: ${choosableDateList.length} days`;
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
      const dateListsObj = getContinuousDateLists(durationFrom, durationTo, selectedType);
      setContinuousDateList(dateListsObj.dates);
    }
  }, [durationFrom, durationTo, currentAllowanceState]);

  const renderTag = ({ value, onClose }) => {
    const handleClose = () => {
      setChoosableDateList(choosableDateList.filter((x) => x !== value));
      onClose();
    };
    return (
      <Tag onClose={handleClose} closable>
        {moment(value).format(TIMEOFF_DATE_FORMAT)}
      </Tag>
    );
  };

  useEffect(() => {
    // generate second notice
    const secondNoticeTemp = generateSecondNotice();
    setSecondNotice(secondNoticeTemp);
  }, [selectedTypeName, currentAllowanceState, JSON.stringify(continuousDateList)]);

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
      dispatch({
        type: 'timeOff/save',
        payload: {
          employeeBehalfOf: '',
        },
      });
    };
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      listDate: choosableDateList,
    });
  }, [JSON.stringify(choosableDateList)]);

  useEffect(() => {
    const workingDaysTemp = [];
    TIMEOFF_WORK_DAYS.forEach((x) => {
      if (workDay.some((y) => y.date === x.text && y.checked)) {
        workingDaysTemp.push(x.id);
      }
    });
    setWorkingDays(workingDaysTemp);
  }, [JSON.stringify(workDay)]);

  useEffect(() => {
    if (!isEmpty(employeeBehalfOf)) {
      form.setFieldsValue({
        timeOffType: null,
        durationFrom: null,
        durationTo: null,
        listDate: [],
        leaveTimeLists: [],
      });
      setChoosableDateList([]);
    }
  }, [employeeBehalfOf]);

  const dateRender = (currentDate) => {
    let isSelected;
    if (choosableDateList.length) {
      isSelected = choosableDateList.indexOf(moment(currentDate).format(TIMEOFF_DATE_FORMAT)) > -1;
    }
    return <div className={isSelected ? styles.selectDate : ''}>{currentDate.date()}</div>;
  };

  // MAIN
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 10,
    },
  };

  // if save as draft, no need to validate forms
  const needValidate = buttonState === 2;

  const renderLeaveTimeList = () => {
    if ([D].includes(selectedType)) {
      const normalListDate = choosableDateList.sort((a, b) => new Date(a) - new Date(b));
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
                {!normalListDate.length && (
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

          {normalListDate && !!normalListDate.length && (
            <Form.List name="leaveTimeLists">
              {() => (
                <Row key={1} className={styles.eachRow}>
                  <Col className={styles.label} lg={6} sm={8}>
                    <span />
                  </Col>
                  <Col lg={12} sm={16} className={styles.leaveDaysContainer}>
                    <LeaveTimeRow2
                      fromDate={normalListDate[0]}
                      toDate={normalListDate[normalListDate.length - 1]}
                      noOfDays={normalListDate.length}
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
              {(!durationFrom || !durationTo) && !choosableDateList.length && (
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

        {((durationFrom && durationTo) || !!choosableDateList.length) && (
          <Form.List name="leaveTimeLists">
            {() => (
              <Row key={1} className={styles.eachRow}>
                <Col className={styles.label} lg={6} sm={8}>
                  <span />
                </Col>
                <Col lg={12} sm={16} className={styles.leaveDaysContainer}>
                  {showAllDateList ? (
                    (!isNormalType ? continuousDateList : choosableDateList).map((date, index) => {
                      return (
                        <LeaveTimeRow
                          eachDate={date}
                          index={index}
                          listLength={continuousDateList.length}
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
                      noOfDays={continuousDateList.length}
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
          {action === NEW_BEHALF_OF && (
            <Row className={styles.eachRow}>
              <Col className={styles.label} lg={6} sm={8}>
                <span>Select Employee</span> <span className={styles.mandatoryField}>*</span>
              </Col>
              <Col lg={12} sm={16}>
                <Form.Item
                  name="employeeBehalf"
                  rules={[
                    {
                      required: true,
                      message: 'Please select Employee!',
                    },
                  ]}
                >
                  <DebounceSelect
                    placeholder="Select the employee who you want to request for"
                    fetchOptions={fetchEmailsListByCompany}
                    showSearch
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
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
                  disabled={action === NEW_BEHALF_OF && !employeeBehalfOf}
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
                {isNormalType ? (
                  <Col span={24} className={styles.durationSelector}>
                    {renderFormItem(
                      <Form.Item name="listDate">
                        <Select
                          mode="tags"
                          placeholder="Select the days you want to take off"
                          onFocus={() => setVisible(true)}
                          onBlur={() => setVisible(false)}
                          open={visible}
                          value={choosableDateList}
                          tagRender={renderTag}
                          onClear={() => setChoosableDateList([])}
                          allowClear
                          dropdownMatchSelectWidth={false}
                          dropdownStyle={{ height: '270px', width: '280px', minWidth: '0' }}
                          dropdownClassName="multipleDropdown"
                          dropdownRender={() => {
                            return (
                              <DatePicker
                                disabledDate={disabledFromDate}
                                format={TIMEOFF_DATE_FORMAT}
                                onSelect={handleChange}
                                disabled={!selectedTypeName}
                                open={visible}
                                dateRender={dateRender}
                                style={{ visibility: 'hidden' }}
                                getPopupContainer={() =>
                                  document.getElementsByClassName('multipleDropdown')[0]}
                              />
                            );
                          }}
                        />
                      </Form.Item>,
                    )}
                  </Col>
                ) : (
                  <>
                    <Col span={12} className={styles.durationSelector}>
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
                    <Col span={12} className={styles.durationSelector}>
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
                  </>
                )}
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
                  <DebounceSelect
                    placeholder="Search a person you want to loop"
                    fetchOptions={fetchEmailsListByCompany}
                    showSearch
                    allowClear
                    mode="multiple"
                    disabled={!selectedTypeName}
                  />
                </Form.Item>,
              )}
            </Col>
            <Col span={6} />
          </Row>
          <Form.Item name="attachments">
            <AddAttachments
              viewingAttachmentList={viewingAttachmentList}
              selectedTypeName={selectedTypeName}
            />
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          <span className={styles.note}>
            By default notifications will be sent to HR, your manager and recursively loop to your
            department head.
          </span>
          <div className={styles.formButtons}>
            {(action === NEW_LEAVE_REQUEST || action === NEW_BEHALF_OF) && (
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
