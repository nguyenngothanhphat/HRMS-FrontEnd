import React, { PureComponent } from 'react';
import { Select, DatePicker, Input, Button, Row, Col, Form, message } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import TimeOffModal from '@/components/TimeOffModal';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { TIMEOFF_STATUS, TIMEOFF_LINK_ACTION } from '@/utils/timeOff';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
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
class RequestInformation extends PureComponent {
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
      // totalDayOfSelectedType: 0,
      unpaidLeaveActivate: false,
      negativeLeave: 0,
      viewDocumentModal: false,
    };
  }

  getTableTabIndexOfSubmittedType = (selectedType, selectedShortType) => {
    switch (selectedShortType) {
      case 'LWP':
        return '3';
      default:
        break;
    }
    switch (selectedType) {
      case 'A':
        return '1';
      case 'B':
        return '1';
      case 'C':
        return '2';
      case 'D':
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
  componentDidMount = () => {
    const {
      dispatch,
      action = '',
      user: { currentUser: { location: { _id } = {} } = {} } = {},
    } = this.props;

    dispatch({
      type: 'timeOff/fetchLeaveBalanceOfUser',
      payload: {
        location: _id,
      },
    });
    dispatch({
      type: 'timeOff/fetchTimeOffTypes',
      payload: {
        tenantId: getCurrentTenant(),
      },
    });
    this.fetchEmailsListByCompany();

    if (action === TIMEOFF_LINK_ACTION.editLeaveRequest) {
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
        _id: requestId,
        status = '',
      } = viewingLeaveRequest;

      if (status === TIMEOFF_STATUS.drafts) {
        this.setState({
          isEditingDrafts: true,
        });
      }

      this.setState({
        viewingLeaveRequestId: requestId,
      });

      this.setState({
        durationFrom: fromDate === null ? null : moment(fromDate),
        durationTo: toDate === null ? null : moment(toDate),
        selectedShortType: shortType,
        selectedTypeName: name,
        selectedType: type,
      });

      // const personCC = cc.map((person) => (person ? person._id : null));

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

      // paid or unpaid leave?
      let timeOffType = '';
      if (type === 'B') {
        timeOffType = this.getUnpaidLeaveIdOfTypeB(shortType, name);
        this.setState({
          unpaidLeaveActivate: true,
        });
      } else timeOffType = typeId;

      // set values from server to fields
      this.formRef.current.setFieldsValue({
        timeOffType,
        subject,
        durationFrom: fromDate === null ? null : moment(fromDate),
        durationTo: toDate === null ? null : moment(toDate),
        description,
        personCC: cc,
        leaveTimeLists,
      });

      // set notice
      // this.autoValueForToDate(type, shortType, moment(fromDate), '');
      if (
        (type === 'A' || type === 'B') &&
        moment(fromDate) !== null &&
        moment(fromDate) !== '' &&
        shortType === 'CL'
      ) {
        this.setSecondNotice(`${shortType}s gets credited each month.`);
      }
    }
  };

  componentDidUpdate = () => {
    const { selectedShortType } = this.state;
    // set remaining day of selected leave type
    this.getRemainingDay(selectedShortType);
  };

  // GET REMAINING DAY
  getRemainingDay = (shortType) => {
    const {
      timeOff: {
        totalLeaveBalance: {
          commonLeaves: { timeOffTypes: timeOffTypesAB = [] } = {},
          specialLeaves: { timeOffTypes: timeOffTypesC = [] } = {},
        } = {},
        timeOffTypes = [],
      } = {},
    } = this.props;

    let count = 0;
    // let total = 0;
    let check = false;

    timeOffTypesAB.forEach((value) => {
      const {
        defaultSettings: {
          // baseAccrual: { time = 0 } = {},
          shortType: shortType1 = '',
          type = '',
        } = {},
        currentAllowance = 0,
      } = value;
      if (shortType === shortType1 && type === 'A') {
        count = currentAllowance;
        // total = time;
        check = true;
      }
    });

    if (!check)
      timeOffTypesC.forEach((value) => {
        const {
          defaultSettings: {
            // baseAccrual: { time = 0 } = {},
            shortType: shortType1 = '',
          } = {},
          currentAllowance = 0,
        } = value;
        if (shortType === shortType1) {
          count = currentAllowance;
          // total = time;
        }
      });

    if (!check)
      timeOffTypes.forEach((value) => {
        const { baseAccrual: { time = 0 } = {}, shortType: shortType1 = '', type = '' } = value;
        if (shortType === shortType1 && type === 'D') {
          count = time;
          // total = time;
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
          specialLeaves: { timeOffTypes: timeOffTypeC = [] } = {},
        } = {},
        timeOffTypes = [],
      } = {},
    } = this.props;

    let count = 0;

    timeOffTypesAB.forEach((value) => {
      const { defaultSettings: { _id: _id1 = '', type = '' } = {}, currentAllowance = 0 } = value;
      if (_id1 === _id && type === 'A') {
        count = currentAllowance;
      }
    });

    timeOffTypeC.forEach((value) => {
      const { defaultSettings: { _id: _id1 = '' } = {}, currentAllowance = 0 } = value;
      if (_id1 === _id) {
        count = currentAllowance;
      }
    });

    timeOffTypes.forEach((value) => {
      const { _id: _id1 = '', type = '' } = value;
      if (_id1 === _id && type === 'D') {
        count = 'VALID';
      }
    });

    return count;
  };

  // get negative of timeoff type
  getNegativeLeave = (timeOffTypes, shortType) => {
    let result = 0;
    timeOffTypes.forEach((type) => {
      const {
        defaultSettings: {
          shortType: st1 = '',
          type: t1 = '',
          balance: { negative: { unlimited = false, unto = 0 } = {} } = {},
        } = {},
        currentAllowance = 0,
      } = type;

      if (shortType === st1 && t1 === 'A') {
        if (unlimited) result = -1;
        else result = unto;
      }
      // get unpaid currentAllowance in type B with same shortType
      else if (shortType === st1 && t1 === 'B') {
        result += currentAllowance;
      }
    });

    return result;
  };

  // GET TIME OFF TYPE BY ID
  onSelectTimeOffTypeChange = (id) => {
    const { durationFrom, selectedType } = this.state;
    const { timeOff: { timeOffTypes = [] } = {} } = this.props;
    timeOffTypes.forEach((eachType) => {
      const { _id = '', name = '', shortType = '', type = '' } = eachType;
      if (id === _id) {
        const remainingDay = this.getRemainingDay(shortType);
        this.autoValueForToDate(type, shortType, durationFrom, selectedType);
        if (
          (type === 'A' || type === 'B') &&
          durationFrom !== null &&
          durationFrom !== '' &&
          shortType === 'CL'
        ) {
          this.setSecondNotice(`${shortType}s gets credited each month.`);
        }

        // if remaining day = 0, activate unpaid leaves
        let unpaidLeaveActivate = false;
        let negativeLeave = 0;
        if (remainingDay === 0) {
          if (type === 'A') {
            const { timeOff: { totalLeaveBalance: { commonLeaves = {} } = {} } = {} } = this.props;
            const { timeOffTypes: typesOfCommonLeaves = [] } = commonLeaves;
            negativeLeave = this.getNegativeLeave(typesOfCommonLeaves, shortType);
            if (negativeLeave !== 0) {
              if (this.checkDuplicateTypeAAndB(typesOfCommonLeaves, shortType, 'B')) {
                unpaidLeaveActivate = true;
              }
            }
          }
        }

        this.setState({
          selectedShortType: shortType,
          selectedType: type,
          selectedTypeName: name,
          unpaidLeaveActivate,
          negativeLeave,
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
      const { selectedType, selectedShortType } = this.state;
      const returnTab = this.getTableTabIndexOfSubmittedType(selectedType, selectedShortType);
      this.saveCurrentTypeTab(returnTab);
      setTimeout(() => {
        history.goBack();
        // history.push({
        //   pathname: `/time-off`,
        // });
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
    const {
      buttonState,
      isEditingDrafts,
      viewingLeaveRequestId,
      // totalDayOfSelectedType,
      // selectedType,
      unpaidLeaveActivate,
      selectedShortType,
      selectedTypeName,
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
        const leaveDates = this.generateLeaveDates(durationFrom, durationTo, leaveTimeLists);

        // let duration = 0;
        // if (selectedType !== 'C') duration = this.calculateNumberOfLeaveDay(leaveDates);
        // else duration = totalDayOfSelectedType;

        const duration = this.calculateNumberOfLeaveDay(leaveDates);

        const data = {
          type: unpaidLeaveActivate
            ? this.getUnpaidLeaveIdOfTypeA(selectedShortType, selectedTypeName)
            : timeOffType,
          employee: employeeId,
          subject,
          fromDate: durationFrom,
          toDate: durationTo,
          duration,
          leaveDates,
          onDate: moment(),
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
    const { _id: employeeId = '', manager = '' } = employee;
    const {
      viewingLeaveRequestId,
      // totalDayOfSelectedType,
      remainingDayOfSelectedType,
      selectedTypeName,
      selectedType,
      selectedShortType,
      unpaidLeaveActivate,
      negativeLeave,
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

    const leaveDates = this.generateLeaveDates(durationFrom, durationTo, leaveTimeLists);
    // console.log('leaveDates', leaveDates);

    const { buttonState } = this.state;

    // ON SUBMIT
    if (buttonState === 2) {
      if (leaveDates.length === 0) {
        message.error('Please select valid leave time dates!');
      } else {
        // generate data for API
        // let duration = 0;
        // if (selectedType !== 'C') duration = this.calculateNumberOfLeaveDay(leaveDates);
        // else duration = totalDayOfSelectedType;

        const duration = this.calculateNumberOfLeaveDay(leaveDates);

        if (
          (selectedType === 'A' || selectedType === 'B') &&
          duration > remainingDayOfSelectedType &&
          !unpaidLeaveActivate
        ) {
          message.error(
            `You only have ${remainingDayOfSelectedType} day(s) of ${selectedTypeName} left.`,
          );
        } else if (
          (selectedType === 'A' || selectedType === 'B') &&
          duration > remainingDayOfSelectedType &&
          unpaidLeaveActivate &&
          duration > negativeLeave + remainingDayOfSelectedType
        ) {
          message.error(
            `You only have ${negativeLeave} unpaid leave days of ${selectedTypeName} left.`,
          );
        } else {
          const data = {
            type: unpaidLeaveActivate
              ? this.getUnpaidLeaveIdOfTypeA(selectedShortType, selectedTypeName)
              : timeOffType,
            status: TIMEOFF_STATUS.inProgress,
            employee: employeeId,
            subject,
            fromDate: durationFrom,
            toDate: durationTo,
            duration,
            leaveDates,
            onDate: moment(),
            description,
            approvalManager: manager, // id
            cc: personCC,
            tenantId: getCurrentTenant(),
            company: employee.company,
          };

          let type = '';
          if (action === TIMEOFF_LINK_ACTION.newLeaveRequest) {
            type = 'timeOff/addLeaveRequest';
          } else if (action === TIMEOFF_LINK_ACTION.editLeaveRequest) {
            data._id = viewingLeaveRequestId;
            type = 'timeOff/updateLeaveRequestById';
          }

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
  autoValueForToDate = (selectedType, selectedShortType, durationFrom, prevType) => {
    let autoToDate = null;
    if (prevType !== 'A' || (prevType === 'A' && selectedType !== 'A')) {
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

        typeList.forEach((eachType) => {
          const { shortType = '', time = 0 } = eachType;
          if (selectedShortType === shortType) {
            if (time !== 0) autoToDate = moment(durationFrom).add(time - 1, 'day');
            else autoToDate = moment(durationFrom).add(time, 'day');
            if (selectedType === 'D') {
              this.setSecondNotice(`${shortType} applied for: ${time} days`);
              if (time !== 0) {
                let tempTime = time;
                for (let i = 1; i <= time; i += 1) {
                  if (moment(moment(durationFrom).add(i, 'day')).weekday() === 0) {
                    tempTime += 2;
                  }
                }
                autoToDate = moment(durationFrom).add(tempTime - 1, 'day');
              }
            }
            if (selectedType === 'C') {
              this.setSecondNotice(
                `A 'To date' will be set automatically as per a duration of ${time} days from the selected 'From date'`,
              );
            }
          }
        });

        const dateLists = this.getDateLists(durationFrom, autoToDate);
        const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');

        this.setState({
          durationTo: autoToDate,
        });

        this.formRef.current.setFieldsValue({
          durationTo: autoToDate,
          leaveTimeLists: initialValuesForLeaveTimesList,
        });
      } else if (prevType !== '') {
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

    const { selectedShortType, selectedType } = this.state;
    if (selectedType === 'C' || selectedType === 'D')
      this.autoValueForToDate(selectedType, selectedShortType, value);

    if ((selectedType === 'A' || selectedType === 'B') && selectedShortType === 'CL')
      this.setSecondNotice(`${selectedShortType}s gets credited each month.`);

    // // initial value for leave dates list
    // const { durationTo } = this.state;
    // const dateLists = this.getDateLists(value, autoToDate || durationTo);
    // const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');
    // console.log('initialValuesForLeaveTimesList', initialValuesForLeaveTimesList);
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
    const { selectedShortType, selectedType } = this.state;
    if ((selectedType === 'A' || selectedType === 'B') && selectedShortType === 'CL')
      this.setSecondNotice(`${selectedShortType}s gets credited each month.`);

    // initial value for leave dates list
    const { durationFrom } = this.state;
    const dateLists = this.getDateLists(durationFrom, value);
    const initialValuesForLeaveTimesList = dateLists.map(() => 'WHOLE-DAY');
    this.formRef.current.setFieldsValue({
      leaveTimeLists: initialValuesForLeaveTimesList,
    });
  };

  checkDuplicateTypeAAndB = (typesOfCommonLeaves, shortTypeToCheck, typeToCheck) => {
    let check = false;
    if (typeToCheck === 'B') {
      typesOfCommonLeaves.forEach((type) => {
        const { defaultSettings = {} } = type;
        if (defaultSettings !== null) {
          const { shortType = '', type: type1 = '' } = defaultSettings;
          if (type1 === 'A' && shortTypeToCheck === shortType) check = true;
        }
      });
    }
    return check;
  };

  // get unpaid leave id of type A
  getUnpaidLeaveIdOfTypeA = (shortTypeToCheck, nameToCheck) => {
    const { timeOff: { timeOffTypes = [] } = {} } = this.props;
    let id = '';

    timeOffTypes.forEach((type) => {
      const { type: type1 = '', shortType = '', _id = '', name = '' } = type;
      if (type1 === 'B' && name === nameToCheck && shortType === shortTypeToCheck) id = _id;
    });

    return id;
  };

  // get paid leave id of type B
  getUnpaidLeaveIdOfTypeB = (shortTypeToCheck, nameToCheck) => {
    const { timeOff: { timeOffTypes = [] } = {} } = this.props;
    let id = '';

    timeOffTypes.forEach((type) => {
      const { type: type1 = '', shortType = '', _id = '', name = '' } = type;
      if (type1 === 'A' && name === nameToCheck && shortType === shortTypeToCheck) id = _id;
    });

    return id;
  };

  // RENDER SELECT BOX
  // GET DATA FOR SELECT BOX TYPE 1,2
  renderTimeOffTypes1 = (data) => {
    const result = data.map((type) => {
      const { currentAllowance = 0, defaultSettings = {} } = type;
      if (defaultSettings !== null) {
        const {
          _id = '',
          name = '',
          shortType = '',
          type: type1 = '',
          baseAccrual: { time = 0 } = {},
        } = defaultSettings;
        if (!this.checkDuplicateTypeAAndB(data, shortType, type1))
          return {
            name,
            shortName: shortType,
            remaining: currentAllowance,
            total: time,
            type: type1,
            _id,
          };
      }
      return '';
    });
    return result.filter((v) => v !== '');
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
    const { unpaidLeaveActivate, selectedShortType } = this.state;

    return data.map((value) => {
      const { name = '', type = '', shortName = '', remaining = 0, total = 0, _id = '' } = value;
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
                {type === 'A' && selectedShortType === shortName && unpaidLeaveActivate && (
                  <span
                    style={{
                      marginLeft: '10px',
                      color: '#00C598',
                      padding: '5px 10px',
                      fontSize: '10px',
                      boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.14)',
                      borderRadius: '4px',
                    }}
                  >
                    Advanced leave activated
                  </span>
                )}
              </span>

              <span
                className={styles.days}
                style={{
                  float: 'right',
                }}
              >
                {type === 'A' && (
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
                    /{total} days
                  </span>
                )}
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
      const { name = '', shortName = '', remaining = 0, _id } = value;
      return (
        <Option value={_id}>
          <div className={styles.timeOffTypeOptions}>
            <span style={{ fontSize: 13 }} className={styles.name}>
              {`${name} (${shortName})`}
            </span>

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
    return (
      (current && current > moment(durationTo)) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6
    );
  };

  disabledDate = (current) => {
    return current && current > moment();
  };

  disabledToDate = (current) => {
    const { durationFrom } = this.state;
    return (
      (current && current < moment(durationFrom)) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6
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
        generalInfo: { firstName = '', lastName = '', workEmail = '', avatar = '' } = {},
      } = user;
      let newAvatar = avatar;
      if (avatar === '') newAvatar = DefaultAvatar;
      return { workEmail, firstName, lastName, _id, avatar: newAvatar };
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

    if (action === TIMEOFF_LINK_ACTION.editLeaveRequest) {
      if (buttonState === 1) {
        content = `${selectedTypeName} request saved as draft.`;
      } else if (buttonState === 2) {
        if (isEditingDrafts)
          content = `${selectedTypeName} request submitted to the HR and your manager.`;
        else content = `Edits to ticket id: ${ticketID} submitted to HR and manager`;
      }
    }

    if (action === TIMEOFF_LINK_ACTION.newLeaveRequest) {
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
    const { selectedShortType, unpaidLeaveActivate } = this.state;
    const remaining = this.getRemainingDayById(value);
    if (remaining === 'VALID' || remaining > 0) callback();
    else if (selectedShortType && !unpaidLeaveActivate) callback('Leave dates reach limit.');
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

    const dateFormat = 'MM.DD.YY';

    const {
      selectedShortType,
      showSuccessModal,
      secondNotice,
      durationFrom,
      durationTo,
      selectedType,
      isEditingDrafts,
      buttonState,
      remainingDayOfSelectedType,
      unpaidLeaveActivate,
      // negativeLeave,
      viewDocumentModal,
    } = this.state;

    const {
      timeOff: {
        timeOffTypes = [],
        totalLeaveBalance: { commonLeaves = {}, specialLeaves = {} } = {},
      } = {},
      loadingAddLeaveRequest = false,
      loadingUpdatingLeaveRequest = false,
      loadingSaveDraft = false,
      loadingUpdateDraft = false,
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
                  {this.renderType3(dataTimeOffTypes3)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              {selectedShortType !== '' && (
                <div className={styles.smallNotice}>
                  <span className={styles.normalText}>
                    {!unpaidLeaveActivate ? (
                      <>
                        {selectedShortType}s are covered under{' '}
                        <span className={styles.link} onClick={this.onLinkClick}>
                          Standard Policy
                        </span>
                      </>
                    ) : (
                      <>
                        Advance leaves will be later deducted from CL balance.{' '}
                        <span className={styles.link} onClick={this.onLinkClick}>
                          Learn More
                        </span>
                      </>
                    )}
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
                      // disabled={selectedType === 'C' || selectedType === 'D'}
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
              <span>Leave time</span> <span className={styles.mandatoryField}>*</span>
            </Col>
            <Col span={12}>
              <div
                className={styles.extraTimeSpent}
                // style={selectedType === 'C' || selectedType === 'D' ? { marginBottom: '24px' } : {}}
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
                {/* {durationFrom !== '' &&
                  durationTo !== '' &&
                  (selectedType === 'C' || selectedType === 'D') && (
                    <div className={styles.content}>
                      <div className={styles.emptyContent}>
                        <span>Selected days are automatically set to whole-day leave</span>
                      </div>
                    </div>
                  )} */}
              </div>
            </Col>
            <Col span={6} />
          </Row>

          {durationFrom !== '' &&
            durationTo !== '' && ( // Type D: Working out of office
              // selectedType !== 'C' && // Type C: Special Leaves
              // selectedType !== 'D' &&
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
            {action === TIMEOFF_LINK_ACTION.editLeaveRequest && (
              <Button
                className={styles.cancelButton}
                type="link"
                htmlType="button"
                onClick={this.onCancelEdit}
              >
                <span>Cancel</span>
              </Button>
            )}
            {(action === TIMEOFF_LINK_ACTION.newLeaveRequest ||
              (action === TIMEOFF_LINK_ACTION.editLeaveRequest && isEditingDrafts)) && (
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
                !unpaidLeaveActivate &&
                (selectedType === 'A' || selectedType === 'B') &&
                action === TIMEOFF_LINK_ACTION.newLeaveRequest
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
