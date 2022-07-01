import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { dialog } from '@/utils/utils';
import styles from './styles.less';
import FirstStep from './components/FirstStep';
import SecondStep from './components/SecondStep';
import ThirdStep from './components/ThirdStep';
import FourthStep from './components/FourthStep';
import FifthStep from './components/FifthStep';
import SixthStep from './components/SixthStep';
import SeventhStep from './components/SeventhStep';

const HandleChanges = (props) => {
  const {
    user,
    current,
    data,
    employeeProfile,
    companyLocationList = [],
    setIsModified = () => {},
    isModified = false,
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
    stepOne: 'Now',
    stepTwo: {
      wLocation: '',
      employment: '',
      department: '',
    },
    stepThree: {
      title: '',
      reportToBefore: data.manager || '',
      reportTo: data.manager || '',
      reportees: data.reportees || [],
    },
    stepFour: {
      currentAnnualCTC: '',
      compensationType: null,
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
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { employee: employeeProfile.employee },
    });
    dispatch({
      type: 'employeeProfile/fetchEmployeeListSingleCompanyEffect',
    });
  }, []);

  useEffect(() => {
    const { nextTab } = props;
    if (changeData.stepOne === 'Before' || changeData.stepOne === 'Later') {
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
        setChangeData({ ...changeData, stepOne: 'Before' });
        break;
      case 2:
        setChangeData({ ...changeData, stepOne: 'Now' });
        break;
      case 3:
        setChangeData({ ...changeData, stepOne: 'Later' });
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
    if (msg === 'Before') {
      if (Date.parse(value) < Date.now()) {
        setChangeData({ ...changeData, stepOne: value._ });
      } else dialog({ message: 'Please enter an appropriate date' });
    } else if (msg === 'Later') {
      if (Date.parse(value) > Date.now()) {
        setChangeData({ ...changeData, stepOne: value._ });
      } else dialog({ message: 'Please enter an appropriate date' });
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
            title: '',
          },
          newTitle: '',
          newDepartment: employeeProfile.departments.find((x) => x._id === value)?.name,
        };

        dispatch({
          type: 'employeeProfile/fetchTitleByDepartment',
          payload: {
            company: employeeProfile?.originData?.compensationData?.company,
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
        <ThirdStep fetchedState={employeeProfile} changeData={changeData} onChange={onChange} />
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
  }) => ({
    employeeProfile,
    companyLocationList,
    user,
    // dataOrgChart,
  }),
)(HandleChanges);
