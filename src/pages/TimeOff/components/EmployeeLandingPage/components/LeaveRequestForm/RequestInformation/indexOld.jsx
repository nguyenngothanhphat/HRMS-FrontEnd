import React, { PureComponent } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form, message, Skeleton } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import TimeOffModal from '@/components/TimeOffModal';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import {
  TIMEOFF_STATUS,
  TIMEOFF_LINK_ACTION,
  MAX_NO_OF_DAYS_TO_SHOW,
  TIMEOFF_TYPE,
} from '@/utils/timeOff';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import LeaveTimeRow from './LeaveTimeRow';

import styles from './index.less';
import LeaveTimeRow2 from './LeaveTimeRow2';

const { Option } = Select;
const { TextArea } = Input;

const { A, B, C, D } = TIMEOFF_TYPE;
const { IN_PROGRESS, DRAFTS } = TIMEOFF_STATUS;
const { EDIT_LEAVE_REQUEST, NEW_LEAVE_REQUEST } = TIMEOFF_LINK_ACTION;
@connect(({ timeOff, user, loading }) => ({
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
}))
class RequestInformation extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
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
      viewDocumentModal: false,
    };
  }

  getTableTabIndexOfSubmittedType = (selectedType, selectedTypeName) => {
    switch (selectedTypeName) {
      case 'LWP': // wrong here
        return '3';
      default:
        break;
    }
    switch (selectedType) {
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

  saveCurrentTypeTab = (type) => {
    const { dispatch } = this.props;
    const { buttonState } = this.state;
    dispatch({
      type: 'timeOff/save',
      payload: {
        currentLeaveTypeTab: String(type),
        currentMineOrTeamTab: '2', // my leave request tab has index "2"
        currentFilterTab: buttonState === 1 ? '4' : '1', // draft 4, in-progress 1
      },
    });
  };

  // view policy modal
  setViewDocumentModal = (value) => {
    this.setState({
      viewDocumentModal: value,
    });
  };

  // fetch email list of company
  fetchEmailsListByCompany = () => {
    const { dispatch, user: { currentUser: { company: { _id: company = '' } = {} } = {} } = {} } =
      this.props;
    dispatch({
      type: 'timeOff/fetchEmailsListByCompany',
      payload: [company],
    });
  };

  // clear viewingLeaveRequest
  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/clearViewingLeaveRequest',
    });
  };

  // FETCH LEAVE BALANCE INFO (REMAINING, TOTAL,...)
  componentDidMount = async () => {
    const {
      dispatch,
      action = '',
      user: { currentUser: { location: { _id } = {} } = {} } = {},
    } = this.props;

    await dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
      payload: {
        location: _id,
      },
    });

    this.fetchEmailsListByCompany();

    if (action === EDIT_LEAVE_REQUEST) {
      const { viewingLeaveRequest = {} } = this.props;
      // console.log('viewingLeaveRequest', viewingLeaveRequest);
      const {
        type: { _id: typeId = '', type = '', name = '' } = {} || {},
        subject = '',
        fromDate = '',
        toDate = '',
        leaveDates = [],
        description = '',
        cc = [],
        _id: requestId,
        status = '',
      } = viewingLeaveRequest;

      if (status === DRAFTS) {
        this.setState({
          isEditingDrafts: true,
        });
      }

      this.setState({
        viewingLeaveRequestId: requestId,
      });

      this.setState({
        durationFrom: fromDate === null ? null : moment.utc(fromDate),
        durationTo: toDate === null ? null : moment.utc(toDate),
        selectedTypeName: name,
        selectedType: type,
      });

      // const personCC = cc.map((person) => (person ? person._id : null));

      // if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
      // generate date lists and leave time
      const dateLists = this.getDateLists(fromDate, toDate, type);
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

      // set values from server to fields
      this.formRef.current.setFieldsValue({
        timeOffType: typeId,
        subject,
        durationFrom: fromDate === null ? null : moment.utc(fromDate),
        durationTo: toDate === null ? null : moment.utc(toDate),
        description,
        personCC: cc,
        leaveTimeLists,
      });

      // set notice
      if (type === C) {
        this.autoValueForToDate(type, name, moment.utc(fromDate), '');
      }

      if (type === D) {
        this.setSecondNotice(`${name} applied for: ${dateLists.length} days`);
      }

      this.getRemainingDay(name);
      // this.autoValueForToDate(type, shortType, moment.utc(fromDate), '');
      if (type === A && name === 'Casual Leave' && fromDate && moment(fromDate)) {
        this.setSecondNotice(`${name}s gets credited each month.`);
      }
    }
  };

  // GET REMAINING DAY
  getRemainingDay = (typeName) => {
    const {
      timeOff: {
        totalLeaveBalance: {
          commonLeaves: { timeOffTypes: timeOffTypesAB = [] } = {},
          specialLeaves: { timeOffTypes: timeOffTypesCD = [] } = {},
        } = {},
      } = {},
    } = this.props;

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

    this.setState({
      remainingDayOfSelectedType: count,
      // totalDayOfSelectedType: total,
    });
    return count;
  };

  getRemainingDayById = (_id) => {
    const {
      timeOff: {
        totalLeaveBalance: {
          commonLeaves: { timeOffTypes: timeOffTypesAB = [] } = {},
          specialLeaves: { timeOffTypes: timeOffTypesCD = [] } = {},
        } = {},
      } = {},
    } = this.props;

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

  // GET TIME OFF TYPE BY ID
  onSelectTimeOffTypeChange = (id) => {
    const { durationFrom, selectedType } = this.state;
    const { timeOff: { timeOffTypesByCountry = [] } = {} } = this.props;
    const foundType = timeOffTypesByCountry.find((t) => t._id === id);

    if (foundType) {
      const { type = '', name = '' } = foundType;

      this.autoValueForToDate(type, name, durationFrom, selectedType);

      if (type === A && name === 'Casual Leave' && durationFrom) {
        this.setSecondNotice(`${name}s gets credited each month.`);
      }

      this.getRemainingDay(name);

      this.setState({
        selectedType: type,
        selectedTypeName: name,
      });
    }
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
      const { selectedType, selectedTypeName } = this.state;
      const returnTab = this.getTableTabIndexOfSubmittedType(selectedType, selectedTypeName);
      this.saveCurrentTypeTab(returnTab);
      setTimeout(() => {
        history.goBack();
      }, 200);
    }
  };

  // CALCULATE DURATION FOR API
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
  generateLeaveDates = (from, to, leaveTimeLists, selectedType) => {
    const dateLists = this.getDateLists(from, to, selectedType);
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
  onSaveDraft = (values) => {
    const {
      buttonState,
      isEditingDrafts,
      viewingLeaveRequestId,
      // totalDayOfSelectedType,
      selectedType,
    } = this.state;
    if (buttonState === 1) {
      const { dispatch, user: { currentUser: { employee = {} } = {} } = {} } = this.props;
      const { _id: employeeId = '', manager = '' } = employee;
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
        message.error('Please fill required fields!');
      } else {
        const leaveDates = this.generateLeaveDates(
          durationFrom,
          durationTo,
          leaveTimeLists,
          selectedType,
        );

        // let duration = 0;
        // if (selectedType !== C) duration = this.calculateNumberOfLeaveDay(leaveDates);
        // else duration = totalDayOfSelectedType;

        const duration = this.calculateNumberOfLeaveDay(leaveDates);

        const data = {
          type: timeOffType,
          employee: employeeId,
          subject,
          fromDate: durationFrom,
          toDate: durationTo,
          duration,
          leaveDates,
          onDate: moment.utc(),
          description,
          approvalManager: manager, // id
          cc: personCC,
          company: getCurrentCompany(),
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
    // console.log('Success:', values);
    const {
      dispatch,
      action = '',
      user: { currentUser: { employee = {} } = {} } = {},
    } = this.props;
    const { _id: employeeId = '', managerInfo: { _id: managerId = '' } = {} } = employee;
    const {
      viewingLeaveRequestId,
      // totalDayOfSelectedType,
      remainingDayOfSelectedType,
      selectedTypeName,
      selectedType,
    } = this.state;
    const {
      timeOffType = '',
      subject = '',
      description = '',
      durationFrom = '',
      durationTo = '',
      personCC = [],
      leaveTimeLists = [],
    } = values;

    const leaveDates = this.generateLeaveDates(
      durationFrom,
      durationTo,
      leaveTimeLists,
      selectedType,
    );

    const { buttonState } = this.state;

    // ON SUBMIT
    if (buttonState === 2) {
      if (leaveDates.length === 0) {
        message.error('Please select valid leave time dates!');
      } else {
        // generate data for API
        const duration = this.calculateNumberOfLeaveDay(leaveDates);

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
            leaveDates,
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
            const { viewingLeaveRequest = {} } = this.props;
            const { employee: { _id = '' } = {} } = viewingLeaveRequest;
            data.employee = _id;
            data._id = viewingLeaveRequestId;
            type = 'timeOff/updateLeaveRequestById';
          }

          // console.log('🚀 ~ data', data);
          dispatch({
            type,
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
    const { values = {} } = errorInfo;
    this.onSaveDraft(values);
  };

  // AUTO VALUE FOR TODATE of DATE PICKER DEPENDING ON SELECTED TYPE
  autoValueForToDate = (selectedType, selectedTypeName, durationFrom, prevType) => {
    let autoToDate = null;
    const typeAB = [A, B];
    const typeCD = [C, D];

    if (
      !typeAB.includes(prevType) ||
      (typeAB.includes(prevType) && !typeAB.includes(selectedType))
    ) {
      if (durationFrom && typeCD.includes(selectedType)) {
        const { timeOff: { totalLeaveBalance: { specialLeaves = {} || {} } = {} || {} } = {} } =
          this.props;

        const { timeOffTypes = [] } = specialLeaves;

        if (selectedType === C) {
          const foundType = timeOffTypes.find(
            (value) => value.defaultSettings.name === selectedTypeName,
          );
          const { currentAllowance = 0 } = foundType || {};

          if (currentAllowance !== 0)
            autoToDate = moment.utc(durationFrom).add(currentAllowance - 1, 'day');
          else autoToDate = moment.utc(durationFrom).add(currentAllowance, 'day');

          this.setSecondNotice(
            `A 'To date' will be set automatically as per a duration of ${currentAllowance} days from the selected 'From date'`,
          );

          const dateLists = this.getDateLists(durationFrom, autoToDate, selectedType);
          const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');

          this.setState({
            durationTo: autoToDate,
          });

          this.formRef.current.setFieldsValue({
            durationTo: autoToDate,
            leaveTimeLists: initialValuesForLeaveTimesList,
          });
        }
        if (selectedType === D) {
          this.setSecondNotice('');

          this.setState({
            durationTo: null,
          });

          this.formRef.current.setFieldsValue({
            durationTo: null,
            leaveTimeLists: [],
          });
        }
      } else if (prevType) {
        this.formRef.current.setFieldsValue({
          leaveTimeLists: [],
          durationTo: null,
        });
        this.setState({
          durationTo: '',
        });
        this.setSecondNotice(``);
      }
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

    const { selectedTypeName, selectedType, durationTo } = this.state;
    if (selectedType === C || selectedType === D)
      this.autoValueForToDate(selectedType, selectedTypeName, value);

    if (selectedType === A && selectedTypeName === 'Casual Leave')
      this.setSecondNotice(`${selectedTypeName}s gets credited each month.`);

    if (durationTo) {
      this.toDateOnChange(durationTo);
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
    const { selectedTypeName, selectedType, durationFrom } = this.state;
    if (selectedType === A && selectedTypeName === 'Casual Leave')
      this.setSecondNotice(`${selectedTypeName}s gets credited each month.`);

    // initial value for leave dates list
    const dateLists = this.getDateLists(durationFrom, value, selectedType);
    const initialValuesForLeaveTimesList = dateLists.map((x) => {
      if (this.findInvalidHalfOfDay(x) === 'MORNING') return 'AFTERNOON';
      if (this.findInvalidHalfOfDay(x) === 'AFTERNOON') return 'MORNING';
      return 'WHOLE-DAY';
    });

    if (selectedType === D) {
      this.setSecondNotice(
        `${selectedTypeName} applied for: ${initialValuesForLeaveTimesList.length} days`,
      );
    }

    this.formRef.current.setFieldsValue({
      leaveTimeLists: initialValuesForLeaveTimesList,
    });
  };

  // RENDER SELECT BOX
  // GET DATA FOR SELECT BOX TYPE 1,2
  renderTimeOffTypes = (data) => {
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
    return result.filter((val) => val !== '');
  };

  // RENDER OPTIONS
  // TYPE A & B: PAID LEAVES & UNPAID LEAVES
  renderType1 = (data) => {
    const {
      timeOff: { timeOffTypesByCountry = [] },
    } = this.props;

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
  renderType2 = (data) => {
    const {
      timeOff: { timeOffTypesByCountry = [] },
    } = this.props;
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

  // GET LIST OF DAYS FROM DAY A TO DAY B
  getDateLists = (startDate, endDate, selectedType) => {
    const dates = [];
    if (startDate && endDate) {
      const now = moment(startDate).clone();

      const includeWeekend = selectedType && selectedType !== A && selectedType !== B;
      if (includeWeekend) {
        while (now.isSameOrBefore(moment(endDate), 'day')) {
          if (this.checkIfWholeDayAvailable(now) || this.checkIfHalfDayAvailable(now)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
          }
        }
      } else {
        while (now.isSameOrBefore(moment(endDate), 'day')) {
          if (moment(now).weekday() !== 6 && moment(now).weekday() !== 0) {
            if (this.checkIfWholeDayAvailable(now) || this.checkIfHalfDayAvailable(now)) {
              dates.push(now.format('YYYY-MM-DD'));
            }
          }
          now.add(1, 'days');
        }
      }
    }
    return dates;
  };

  // DISABLE DATE OF DATE PICKER
  checkIfWholeDayAvailable = (date) => {
    const { invalidDates = [] } = this.props;
    const find = invalidDates.some(
      (x) =>
        moment.utc(x.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') &&
        x.timeOfDay === 'WHOLE-DAY',
    );
    return !find;
  };

  checkIfHalfDayAvailable = (date) => {
    const { invalidDates = [] } = this.props;
    const find = invalidDates.some((x) => {
      return (
        moment.utc(x.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD') &&
        x.timeOfDay !== 'WHOLE-DAY'
      );
    });
    return !find;
  };

  findInvalidHalfOfDay = (date) => {
    const { invalidDates = [] } = this.props;
    const find = invalidDates.find((x) => {
      return moment.utc(x.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD');
    });
    return find?.timeOfDay || '';
  };

  disabledFromDate = (current) => {
    const { durationTo } = this.state;

    return (
      (current && moment(current).isAfter(moment(durationTo), 'day')) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6 ||
      !this.checkIfWholeDayAvailable(current)
    );
  };

  disabledToDate = (current) => {
    const { durationFrom } = this.state;
    return (
      (current && moment(current).isBefore(moment(durationFrom), 'day')) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6 ||
      !this.checkIfWholeDayAvailable(current)
    );
  };

  // RENDER EMAILS LIST
  renderEmailsList = () => {
    const {
      timeOff: { emailsList = [] },
    } = this.props;
    const list = emailsList.map((user) => {
      const {
        _id = '',
        generalInfo: { legalName= '', workEmail = '', avatar = '' } = {},
      } = user;
      let newAvatar = avatar;
      if (avatar === '') newAvatar = DefaultAvatar;
      return { workEmail, legalName, _id, avatar: newAvatar };
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
    history.push(`/time-off/overview/personal-timeoff/view/${id}`);
  };

  // RENDER MODAL content
  renderModalContent = () => {
    const { action = '', ticketID = '' } = this.props;
    const { selectedTypeName, buttonState, isEditingDrafts } = this.state;
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
  onLinkClick = () => {
    this.setViewDocumentModal(true);
  };

  // validator
  typeValidator = (rule, value, callback) => {
    const { selectedTypeName } = this.state;
    const remaining = this.getRemainingDayById(value);
    if (remaining === 'VALID' || remaining > 0) callback();
    else if (selectedTypeName) callback('Leave dates reach limit.');
    else callback();
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

    const dateFormat = 'Do MMM YYYY';

    const {
      selectedTypeName,
      showSuccessModal,
      secondNotice,
      durationFrom,
      durationTo,
      selectedType,
      isEditingDrafts,
      buttonState,
      remainingDayOfSelectedType,
      // negativeLeave,
      viewDocumentModal,
    } = this.state;

    const {
      timeOff: {
        // timeOffTypes = [],
        totalLeaveBalance: { commonLeaves = {}, specialLeaves = {} } = {},
        viewingLeaveRequest: { leaveDates = [] } = {},
      } = {},
      loadingAddLeaveRequest = false,
      loadingUpdatingLeaveRequest = false,
      loadingSaveDraft = false,
      loadingUpdateDraft = false,
      loadingMain = false,
      action = '',
    } = this.props;
    const { timeOffTypes: typesOfCommonLeaves = [] } = commonLeaves;
    const { timeOffTypes: typesOfSpecialLeaves = [] } = specialLeaves;
    const dataTimeOffTypes1 = this.renderTimeOffTypes(typesOfCommonLeaves);
    const dataTimeOffTypes2 = this.renderTimeOffTypes(typesOfSpecialLeaves);

    // DYNAMIC ROW OF DATE LISTS
    const dateLists = this.getDateLists(durationFrom, durationTo, selectedType);

    const calculateNumberOfDayProp =
      action === EDIT_LEAVE_REQUEST ? this.calculateNumberOfLeaveDay(leaveDates) : 0;
    const dateListsFromProps = calculateNumberOfDayProp === 0 ? null : calculateNumberOfDayProp;

    let showAllDateList = false;
    if (dateListsFromProps > 0 && dateListsFromProps <= MAX_NO_OF_DAYS_TO_SHOW) {
      showAllDateList = true;
    } else if (dateLists.length <= MAX_NO_OF_DAYS_TO_SHOW) showAllDateList = true;

    // if save as draft, no need to validate forms
    const needValidate = buttonState === 2;

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
                  { validator: this.typeValidator },
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
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              {selectedTypeName !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    {selectedTypeName}s are covered under{' '}
                    <span className={styles.link} onClick={this.onLinkClick}>
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
                      disabled={selectedType === C}
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
                                onRemove={this.onDateRemove}
                                listLength={dateLists.length}
                                onChange={this.onDataChange}
                                needValidate={needValidate}
                                findInvalidHalfOfDay={this.findInvalidHalfOfDay}
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
            {action === EDIT_LEAVE_REQUEST && (
              <Button
                className={styles.cancelButton}
                type="link"
                htmlType="button"
                onClick={this.onCancelEdit}
              >
                <span>Cancel</span>
              </Button>
            )}
            {(action === NEW_LEAVE_REQUEST ||
              (action === EDIT_LEAVE_REQUEST && isEditingDrafts)) && (
              <Button
                loading={loadingSaveDraft || loadingUpdateDraft}
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

        <ViewDocumentModal visible={viewDocumentModal} onClose={this.setViewDocumentModal} />
      </div>
    );
  }
}

export default RequestInformation;
