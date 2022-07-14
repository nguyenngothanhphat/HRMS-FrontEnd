import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import { MAKE_CHANGE_TYPE } from '@/utils/employeeProfile';
import { dialog } from '@/utils/utils';
import FifthStep from './components/FifthStep';
import FirstStep from './components/FirstStep';
import FourthStep from './components/FourthStep';
import SecondStep from './components/SecondStep';
import SeventhStep from './components/SeventhStep';
import SixthStep from './components/SixthStep';
import ThirdStep from './components/ThirdStep';
import styles from './styles.less';

const { ALREADY_CHANGE, IMMEDIATE_CHANGE, SCHEDULE_CHANGE } = MAKE_CHANGE_TYPE;

const HandleChanges = (props) => {
  const {
    user,
    current,
    data,
    employeeProfile,
    companyLocationList = [],
    setIsModified = () => {},
    isModified = false,
    loadingFetchTitleList = false,
    loadingFetchEmployeeList = false,
  } = props;

  const { currentUser } = user || {};
  const [radio, setRadio] = useState(2);
  const [changeData, setChangeData] = useState({
    changedBy: currentUser ? currentUser.employee?._id : '',
    employee: employeeProfile.employee,
    newTitle: '',
    newLocation: '',
    newDepartment: '',
    newEmploymentType: '',
    newManager: '',
    newReportees: [],
    stepOne: {
      type: IMMEDIATE_CHANGE,
      effectDate: null,
    },
    stepTwo: {
      wLocation: data.location,
      employment: data.employeeType,
      department: data.department,
    },
    stepThree: {
      title: data.title,
      reportTo: data.manager || '',
      reportees: data.reportees || [],
    },
    stepFour: {
      currentAnnualCTC: data.currentAnnualCTC,
      compensationType: data.compensationType,
    },
    stepFive: {
      toEmployee: false,
      toManager: false,
      notifyTo: [],
    },
    stepSeven: {
      reasonChange: '',
    },
  });

  useEffect(() => {
    const { dispatch } = props;
    if (data.department) {
      dispatch({
        type: 'employeeProfile/fetchTitleByDepartment',
        payload: {
          company: getCurrentCompany(),
          department: data.department,
        },
      });
    }
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { employee: employeeProfile.employee },
    });
    if (!(employeeProfile.employeeList || []).length) {
      dispatch({
        type: 'employeeProfile/fetchEmployeeListSingleCompanyEffect',
      });
    }
  }, []);

  useEffect(() => {
    setChangeData((prev) => {
      return {
        ...prev,
        stepThree: {
          ...prev.stepThree,
          reportees: data.reportees || [],
        },
      };
    });
  }, [employeeProfile.reportees]);

  useEffect(() => {
    const { nextTab } = props;
    if (!changeData.stepOne.effectDate && radio !== 2) {
      if (current > 0) {
        nextTab('STOP');
        dialog({ message: 'Please enter a date' });
      }
    }
    if (changeData.stepThree.department && !changeData.stepThree.title) {
      if (current > 2) {
        nextTab('TITLE_REQUIRED');
        dialog({ message: 'Please choose a job title corresponds with the selected department' });
      }
    }
  }, [changeData]);

  const onRadioChange = (e) => {
    switch (Number(e.target.value)) {
      case 1:
        setChangeData({ ...changeData, stepOne: { type: ALREADY_CHANGE } });
        break;
      case 2:
        setChangeData({ ...changeData, stepOne: { type: IMMEDIATE_CHANGE } });
        break;
      case 3:
        setChangeData({ ...changeData, stepOne: { type: SCHEDULE_CHANGE } });
        break;
      case 4: {
        let notifyToTemp = JSON.parse(JSON.stringify(changeData.stepFive.notifyTo));
        const email = employeeProfile?.originData?.employmentData?.generalInfo?.workEmail;
        const checked = !changeData.stepFive.toEmployee;
        if (checked) {
          notifyToTemp.push(email);
        } else {
          notifyToTemp = notifyToTemp.filter((x) => x !== email);
        }
        setChangeData({
          ...changeData,
          stepFive: {
            ...changeData.stepFive,
            toEmployee: !!checked,
            notifyTo: notifyToTemp,
          },
        });
        break;
      }
      case 5: {
        let notifyToTemp = [...changeData.stepFive.notifyTo];
        const email = employeeProfile.originData?.employmentData?.manager?.generalInfo?.workEmail;
        const checked = !changeData.stepFive.toManager;
        if (checked) {
          notifyToTemp.push(email);
        } else {
          notifyToTemp = notifyToTemp.filter((x) => x !== email);
        }
        setChangeData({
          ...changeData,
          stepFive: {
            ...changeData.stepFive,
            toManager: !!checked,
            notifyTo: notifyToTemp,
          },
        });
        break;
      }

      default:
        break;
    }
    if (e.target.value <= 3) setRadio(Number(e.target.value));
  };

  const onDateChange = (value, msg) => {
    if (msg === ALREADY_CHANGE) {
      if (Date.parse(value) < Date.now()) {
        setChangeData({ ...changeData, stepOne: { ...changeData.stepOne, effectDate: value } });
      } else dialog({ message: 'Please enter an appropriate date' });
    } else if (msg === SCHEDULE_CHANGE) {
      if (Date.parse(value) > Date.now()) {
        setChangeData({ ...changeData, stepOne: { ...changeData.stepOne, effectDate: value } });
      } else dialog({ message: 'Please enter an appropriate date' });
    } else {
      setChangeData({ ...changeData, stepOne: { ...changeData.stepOne, effectDate: moment() } });
    }
  };

  const onChange = (value, type) => {
    const { dispatch, setChangedData = () => {} } = props;
    let changeDataTemp = {};
    switch (type) {
      case 'title':
        changeDataTemp = {
          ...changeData,
          stepThree: { ...changeData.stepThree, title: value },
          newTitle: employeeProfile.listTitleByDepartment.find((x) => x._id === value)?.name,
        };
        break;
      case 'wLocation':
        changeDataTemp = {
          ...changeData,
          stepTwo: { ...changeData.stepTwo, wLocation: value },
          newLocation: companyLocationList.find((x) => x._id === value)?.name,
        };
        break;
      case 'employment':
        changeDataTemp = {
          ...changeData,
          stepTwo: { ...changeData.stepTwo, employment: value },
          newEmploymentType: employeeProfile.employeeTypes.find((x) => x._id === value)?.name,
        };
        break;
      case 'compensationType':
        changeDataTemp = {
          ...changeData,
          stepFour: {
            ...changeData.stepFour,
            compensationType: value,
          },
        };
        break;

      case 'currentAnnualCTC':
        changeDataTemp = {
          ...changeData,
          stepFour: {
            ...changeData.stepFour,
            currentAnnualCTC: value,
          },
        };
        break;
      case 'department': {
        changeDataTemp = {
          ...changeData,
          stepTwo: {
            ...changeData.stepTwo,
            department: value,
          },
          stepThree: {
            ...changeData.stepThree,
            title: null,
          },
          newTitle: '',
          newDepartment: employeeProfile.departments.find((x) => x._id === value)?.name,
        };

        dispatch({
          type: 'employeeProfile/fetchTitleByDepartment',
          payload: {
            company: getCurrentCompany(),
            department: value,
          },
        });
        break;
      }
      case 'reportTo':
        changeDataTemp = {
          ...changeData,
          stepThree: { ...changeData.stepThree, reportTo: value },
          newManager: employeeProfile.employeeList.find((x) => x._id === value)?.generalInfo
            ?.legalName,
        };
        break;

      case 'reportees':
        changeDataTemp = {
          ...changeData,
          stepThree: { ...changeData.stepThree, reportees: value },
          newReportees: employeeProfile.employeeList
            .filter((x) => value.includes(x._id))
            .map((x) => x.generalInfo?.legalName),
        };
        break;

      case 'notifyTo': // fifth step
        changeDataTemp = {
          ...changeData,
          stepFive: {
            ...changeData.stepThree,
            notifyTo: [...new Set([...changeData.stepFive.notifyTo, ...value])],
          },
        };
        break;

      case 'reasonChange': // seventh step
        changeDataTemp = {
          ...changeData,
          stepSeven: { ...changeData.stepSeven, reasonChange: value },
        };
        break;

      default:
        break;
    }
    setChangeData(changeDataTemp);
    setChangedData(changeDataTemp);
  };

  return (
    <div className={styles.handleChanges}>
      {current === 0 ? (
        <FirstStep
          changeData={changeData}
          onRadioChange={onRadioChange}
          onDateChange={onDateChange}
          radio={radio}
        />
      ) : null}
      {current === 1 ? (
        <SecondStep
          fetchedState={employeeProfile}
          companyLocationList={companyLocationList}
          changeData={changeData}
          onChange={onChange}
        />
      ) : null}
      {current === 2 ? (
        <ThirdStep
          fetchedState={employeeProfile}
          changeData={changeData}
          onChange={onChange}
          loadingFetchEmployeeList={loadingFetchEmployeeList}
          loadingFetchTitleList={loadingFetchTitleList}
        />
      ) : null}
      {current === 3 ? (
        <FourthStep
          fetchedState={employeeProfile}
          changeData={changeData}
          onChange={onChange}
          onRadioChange={onRadioChange}
        />
      ) : null}
      {current === 4 ? (
        <FifthStep
          changeData={changeData}
          onChange={onChange}
          onRadioChange={onRadioChange}
          radio={changeData.stepFour}
          fetchedState={employeeProfile}
        />
      ) : null}
      {current === 5 ? (
        <SixthStep
          name={data.name}
          currentData={data}
          changeData={changeData}
          isModified={isModified}
          setIsModified={setIsModified}
        />
      ) : null}
      {current === 6 ? (
        <SeventhStep changeData={changeData} onChange={onChange} fetchedState={employeeProfile} />
      ) : null}
    </div>
  );
};

export default connect(
  ({
    // employee: { dataOrgChart = {} },
    employeeProfile,
    user,
    location: { companyLocationList = [] } = {},
    loading,
  }) => ({
    employeeProfile,
    companyLocationList,
    user,
    loadingFetchEmployeeList:
      loading.effects['employeeProfile/fetchEmployeeListSingleCompanyEffect'],
    loadingFetchTitleList: loading.effects['employeeProfile/fetchTitleByDepartment'],
    // dataOrgChart,
  }),
)(HandleChanges);
