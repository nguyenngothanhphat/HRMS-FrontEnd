import { Button, Col, DatePicker, Form, Input, message, Row, Select, Skeleton } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import TimeOffModal from '@/components/TimeOffModal';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import {
  MAX_NO_OF_DAYS_TO_SHOW,
  TIMEOFF_LINK_ACTION,
  TIMEOFF_STATUS,
  TIMEOFF_TYPE,
} from '@/utils/timeOff';
import styles from './index.less';
import LeaveTimeRow from './LeaveTimeRow';
import LeaveTimeRow2 from './LeaveTimeRow2';

const { Option } = Select;
const { TextArea } = Input;

const { A, B, C, D } = TIMEOFF_TYPE;
const { IN_PROGRESS, DRAFTS } = TIMEOFF_STATUS;
const { EDIT_LEAVE_REQUEST, NEW_LEAVE_REQUEST } = TIMEOFF_LINK_ACTION;

const dateFormat = 'Do MMM YYYY';

const RequestInformation = (props) => {
  const {
    dispatch,
    action = '',
    ticketID = '',
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
        currentMineOrTeamTab: '2', // my leave request tab has index "2"
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

  const checkIfHalfDayAvailable = (date) => {
    const { invalidDates = [] } = props;
    const find = invalidDates.some((x) => {
      return (
        moment.utc(x.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') &&
        x.timeOfDay !== 'WHOLE-DAY'
      );
    });
    return !find;
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

  const getRemainingDayById = (_id) => {
    let count = 0;

    timeOffTypesAB.forEach((value) => {
      const { defaultSettings: { _id: _id1 = '', type = '' } = {}, currentAllowance = 0 } = value;
      if (_id1 === _id && (type === A || type === B)) {
        count = currentAllowance;
      }
    });

    timeOffTypesCD.forEach((value) => {
      const { defaultSettings: { _id: _id1 = '' } = {}, currentAllowance = 0 } = value;
      if (_id1 === _id) {
        count = currentAllowance;
      }
    });

    return count;
  };

  const findInvalidHalfOfDay = (date) => {
    const { invalidDates = [] } = props;
    const find = invalidDates.find((x) => {
      return moment.utc(x.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD');
    });
    return find?.timeOfDay || '';
  };

  // DISABLE DATE OF DATE PICKER
  const checkIfWholeDayAvailable = (date) => {
    const { invalidDates = [] } = props;
    const find = invalidDates.some(
      (x) =>
        moment.utc(x.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') &&
        x.timeOfDay === 'WHOLE-DAY',
    );
    return !find;
  };

  // GET LIST OF DAYS FROM DAY A TO DAY B
  const getDateLists = (startDate, endDate, selectedTypeProp) => {
    const dates = [];
    if (startDate && endDate) {
      const now = moment(startDate).clone();

      const includeWeekend = selectedTypeProp && selectedTypeProp !== A && selectedTypeProp !== B;
      if (includeWeekend) {
        while (now.isSameOrBefore(moment(endDate), 'day')) {
          if (checkIfWholeDayAvailable(now) || checkIfHalfDayAvailable(now)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
          }
        }
      } else {
        while (now.isSameOrBefore(moment(endDate), 'day')) {
          if (moment(now).weekday() !== 6 && moment(now).weekday() !== 0) {
            if (checkIfWholeDayAvailable(now) || checkIfHalfDayAvailable(now)) {
              dates.push(now.format('YYYY-MM-DD'));
            }
          }
          now.add(1, 'days');
        }
      }
    }
    return dates;
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

  // AUTO VALUE FOR TODATE of DATE PICKER DEPENDS ON SELECTED TYPE
  const autoValueForToDate = () => {
    let autoToDate = null;

    if (selectedType === C) {
      const currentAllowance = getCurrentAllowance(selectedType);

      if (currentAllowance !== 0)
        autoToDate = moment.utc(durationFrom).add(currentAllowance - 1, 'day');
      else autoToDate = moment.utc(durationFrom).add(currentAllowance, 'day');

      setCurrentAllowanceState(currentAllowance);

      const dateLists = getDateLists(durationFrom, autoToDate, selectedType);
      const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');

      setDurationTo(autoToDate);

      form.setFieldsValue({
        durationTo: autoToDate,
        leaveTimeLists: initialValuesForLeaveTimesList,
      });
    }
    if (selectedType === D) {
      setDurationTo(null);
      form.setFieldsValue({
        durationTo: null,
        leaveTimeLists: [],
      });
    }
  };

  // GET TIME OFF TYPE BY ID
  const onSelectTimeOffTypeChange = (id) => {
    const foundType = timeOffTypesByCountry.find((t) => t._id === id);
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

  // CALCULATE DURATION FOR API
  const calculateNumberOfLeaveDay = (list) => {
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
  const generateLeaveDates = (from, to, leaveTimeLists, selectedTypeTemp) => {
    const dateLists = getDateLists(from, to, selectedTypeTemp);
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

    return result;
  };

  // ON SAVE DRAFT
  const onSaveDraft = (values) => {
    if (buttonState === 1) {
      const { _id: employeeId = '', manager = '' } = employee;
      const {
        timeOffType = '',
        subject = '',
        description = '',
        durationFrom: durationFromValue = '',
        durationTo: durationToValue = '',
        personCC = [],
        leaveTimeLists = [],
      } = values;

      if (timeOffType === '') {
        message.error('Please fill required fields!');
      } else {
        const leaveDatesPayload = generateLeaveDates(
          durationFromValue,
          durationToValue,
          leaveTimeLists,
          selectedType,
        );

        // let duration = 0;
        // if (selectedType !== C) duration = calculateNumberOfLeaveDay(leaveDates);
        // else duration = totalDayOfSelectedType;

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
          approvalManager: manager, // id
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
      durationFrom: durationFromTemp = '',
      durationTo: durationToTemp = '',
      personCC = [],
      leaveTimeLists = [],
    } = values;

    const leaveDatesPayload = generateLeaveDates(
      durationFromTemp,
      durationToTemp,
      leaveTimeLists,
      selectedType,
    );

    // ON SUBMIT
    if (buttonState === 2) {
      if (leaveDatesPayload.length === 0) {
        message.error('Please select valid leave time dates!');
      } else {
        // generate data for API
        const duration = calculateNumberOfLeaveDay(leaveDatesPayload);

        if ((selectedType === A || selectedType === B) && duration > remainingDayOfSelectedType) {
          message.error(
            `You only have ${remainingDayOfSelectedType} day(s) of ${selectedTypeName} left.`,
          );
        } else {
          const data = {
            type: timeOffType,
            status: IN_PROGRESS,
            subject,
            fromDate: durationFrom,
            toDate: durationTo,
            duration,
            leaveDates: leaveDatesPayload,
            onDate: moment.utc(),
            description,
            cc: personCC,
            tenantId: getCurrentTenant(),
            company: employee.company,
          };

          let type = '';
          if (action === NEW_LEAVE_REQUEST) {
            data.employee = employeeId;
            data.approvalManager = managerId; // id
            type = 'timeOff/addLeaveRequest';
          } else if (action === EDIT_LEAVE_REQUEST) {
            const { employee: { _id = '' } = {} } = viewingLeaveRequest;
            data.employee = _id;
            data._id = viewingId;
            type = 'timeOff/updateLeaveRequestById';
          }

          // console.log('🚀 ~ data', data);
          dispatch({
            type,
            payload: data,
          }).then((statusCode) => {
            if (statusCode === 200) setShowSuccessModal(true);
          });
        }
      }
    } else if (buttonState === 1) {
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
                      {remaining}
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
      (current && moment(current).isAfter(moment(durationTo), 'day')) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6 ||
      !checkIfWholeDayAvailable(current)
    );
  };

  const disabledToDate = (current) => {
    return (
      (current && moment(current).isBefore(moment(durationFrom), 'day')) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6 ||
      !checkIfWholeDayAvailable(current)
    );
  };

  // RENDER EMAILS LIST
  const renderEmailsList = () => {
    const list = emailsList.map((user) => {
      const {
        _id = '',
        generalInfo: { firstName = '', lastName = '', workEmail = '', avatar = '' } = {},
      } = user;
      let newAvatar = avatar;
      if (avatar === '') newAvatar = DefaultAvatar;
      return { workEmail, firstName, lastName, _id, avatar: newAvatar };
    });
    // return list.filter((value) => Object.keys(value).length !== 0);
    return list;
  };

  // ON CANCEL EDIT
  const onCancelEdit = () => {
    history.push(`/time-off/overview/personal-timeoff/view/${viewingId}`);
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
  const typeValidator = (rule, value, callback) => {
    const remaining = getRemainingDayById(value);
    if (remaining === 'VALID' || remaining > 0) callback();
    else if (selectedTypeName) callback('Leave dates reach limit.');
    else callback();
  };

  // FETCH LEAVE BALANCE INFO (REMAINING, TOTAL,...)
  const fetchData = async () => {
    await dispatch({
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

      setDurationFrom(viewingFromDate ? moment.utc(viewingFromDate) : null);
      setDurationTo(viewingToDate ? moment.utc(viewingToDate) : null);
      setSelectedTypeName(viewingType.name);
      setSelectedType(viewingType.type);

      // generate date lists and leave time
      const dateLists = getDateLists(viewingFromDate, viewingToDate, viewingType?.type);
      const resultDates = [];

      let check = false;
      dateLists.forEach((val1) => {
        check = false;
        viewingLeaveDates.forEach((val2) => {
          const { date = '' } = val2;
          if (moment(date).locale('en').format('YYYY-MM-DD') === val1) {
            resultDates.push(val2);
            check = true;
          }
        });
        if (!check) resultDates.push(null);
      });
      const leaveTimeLists = resultDates.map((date) => (date ? date.timeOfDay : null));

      // set values from server to fields
      form.setFieldsValue({
        timeOffType: viewingType?._id,
        subject: viewingSubject,
        durationFrom: viewingFromDate ? moment.utc(viewingFromDate) : null,
        durationTo: viewingToDate ? moment.utc(viewingToDate) : null,
        description: viewingDescription,
        personCC: viewingCC,
        leaveTimeLists,
      });

      // set notice
      if (viewingType.type === C) {
        autoValueForToDate();
      }

      if (viewingType.type === D) {
        setSecondNotice(`${viewingType.name} applied for: ${dateLists.length} days`);
      }

      getRemainingDay(viewingType.name);
    }
  };

  // USE EFFECT

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

      default:
        return '';
    }
  };

  useEffect(() => {
    // auto value for type C, D
    if (selectedType === C || selectedType === D) {
      if (selectedTypeName && durationFrom) {
        autoValueForToDate();
      } else {
        toDateOnChange('');
        form.setFieldsValue({
          durationTo: '',
        });
      }
    }
  }, [selectedTypeName, durationFrom]);

  useEffect(() => {
    console.log('currentAllowanceState', currentAllowanceState);
    // generate second notice
    const secondNoticeTemp = generateSecondNotice();
    setSecondNotice(secondNoticeTemp);
  }, [selectedTypeName, durationFrom, currentAllowanceState]);

  useEffect(() => {
    if (durationFrom && durationTo) {
      // initial value for leave dates list
      const dateLists = getDateLists(durationFrom, durationTo, selectedType);
      const initialValuesForLeaveTimesList = dateLists.map((x) => {
        if (findInvalidHalfOfDay(x) === 'MORNING') return 'AFTERNOON';
        if (findInvalidHalfOfDay(x) === 'AFTERNOON') return 'MORNING';
        return 'WHOLE-DAY';
      });

      if (selectedType === D) {
        setSecondNotice(
          `${selectedTypeName} applied for: ${initialValuesForLeaveTimesList.length} days`,
        );
      }

      form.setFieldsValue({
        leaveTimeLists: initialValuesForLeaveTimesList,
      });
    }
    if (!durationTo && (selectedType === C || selectedType === D)) {
      setSecondNotice('');
    }
  }, [durationFrom, durationTo]);

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
  // DYNAMIC ROW OF DATE LISTS
  const dateLists = getDateLists(durationFrom, durationTo, selectedType);

  const calculateNumberOfDayProp =
    action === EDIT_LEAVE_REQUEST ? calculateNumberOfLeaveDay(viewingLeaveDates) : 0;
  const dateListsFromProps = calculateNumberOfDayProp === 0 ? null : calculateNumberOfDayProp;

  let showAllDateList = false;
  if (dateListsFromProps > 0 && dateListsFromProps <= MAX_NO_OF_DAYS_TO_SHOW) {
    showAllDateList = true;
  } else if (dateLists.length <= MAX_NO_OF_DAYS_TO_SHOW) showAllDateList = true;

  // if save as draft, no need to validate forms
  const needValidate = buttonState === 2;

  // RETURN MAIN
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
                { validator: typeValidator },
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
            {selectedTypeName !== '' && (
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
                    disabledDate={disabledFromDate}
                    format={dateFormat}
                    onChange={(value) => {
                      fromDateOnChange(value);
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
                    disabledDate={disabledToDate}
                    format={dateFormat}
                    disabled={selectedType === C}
                    onChange={(value) => {
                      toDateOnChange(value);
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

        {selectedType !== C && selectedType !== D ? (
          <>
            <Row className={styles.eachRow}>
              <Col className={styles.label} span={6}>
                <span>Leave time</span> <span className={styles.mandatoryField}>*</span>
              </Col>
              <Col span={12}>
                <div className={styles.extraTimeSpent}>
                  {showAllDateList ? (
                    <Row className={styles.header}>
                      <Col span={7}>Date</Col>
                      <Col span={7}>Day</Col>
                      <Col span={10}>Count/Q.ty</Col>
                    </Row>
                  ) : (
                    <Row className={styles.header}>
                      <Col span={7}>From</Col>
                      <Col span={7}>To</Col>
                      <Col span={10}>No. of Days</Col>
                    </Row>
                  )}
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
                            />
                          );
                        })
                      ) : (
                        <LeaveTimeRow2
                          fromDate={durationFrom}
                          toDate={durationTo}
                          noOfDays={dateListsFromProps || dateLists.length}
                        />
                      )}
                    </Col>
                    <Col span={6} />
                  </Row>
                )}
              </Form.List>
            )}
          </>
        ) : (
          <>
            <Row className={styles.eachRow}>
              <Col className={styles.label} span={6}>
                <span>Leave time</span> <span className={styles.mandatoryField}>*</span>
              </Col>
              <Col span={12}>
                <div className={styles.extraTimeSpent}>
                  <Row className={styles.header}>
                    <Col span={7}>From</Col>
                    <Col span={7}>To</Col>
                    <Col span={10}>No. of Days</Col>
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
                        noOfDays={dateListsFromProps || dateLists.length}
                      />
                    </Col>
                    <Col span={6} />
                  </Row>
                )}
              </Form.List>
            )}
          </>
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
              remainingDayOfSelectedType === 0 &&
              (selectedType === A || selectedType === B) &&
              action === NEW_LEAVE_REQUEST
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
        onOk={() => setShowSuccessModalVisible(false)}
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
