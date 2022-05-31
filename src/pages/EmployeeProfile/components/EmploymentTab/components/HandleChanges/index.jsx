import React, { PureComponent } from 'react';
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

@connect(({ employeeProfile, user, location: { companyLocationList = [] } = {} }) => ({
  employeeProfile,
  companyLocationList,
  user,
}))
class HandleChanges extends PureComponent {
  constructor(props) {
    super(props);
    const { user, employeeProfile } = this.props;
    const { currentUser } = user || {};
    this.state = {
      radio: 2,
      changeData: {
        changedBy: currentUser ? currentUser.employee._id : '',
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
          reportTo: '',
          reportees: [],
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
      },
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/fetchEmployeeListSingleCompanyEffect',
    });
  };

  componentDidUpdate() {
    const { current, nextTab } = this.props;
    const { changeData } = this.state;
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
  }

  onRadioChange = (e) => {
    const { changeData } = this.state;
    switch (Number(e.target.value)) {
      case 1:
        this.setState({ changeData: { ...changeData, stepOne: 'Before' } });
        break;
      case 2:
        this.setState({ changeData: { ...changeData, stepOne: 'Now' } });
        break;
      case 3:
        this.setState({ changeData: { ...changeData, stepOne: 'Later' } });
        break;
      case 4:
        this.setState({
          changeData: {
            ...changeData,
            stepFive: { ...changeData.stepFive, toEmployee: !changeData.stepFive.toEmployee },
          },
        });
        break;
      case 5:
        this.setState({
          changeData: {
            ...changeData,
            stepFive: { ...changeData.stepFive, toManager: !changeData.stepFive.toManager },
          },
        });
        break;

      default:
        break;
    }
    if (e.target.value <= 3) this.setState({ radio: Number(e.target.value) });
  };

  onDateChange = (value, msg) => {
    const { changeData } = this.state;
    if (msg === 'Before') {
      if (Date.parse(value) < Date.now()) {
        this.setState({ changeData: { ...changeData, stepOne: value._d } });
      } else dialog({ message: 'Please enter an appropriate date' });
    } else if (msg === 'Later') {
      if (Date.parse(value) > Date.now()) {
        this.setState({ changeData: { ...changeData, stepOne: value._d } });
      } else dialog({ message: 'Please enter an appropriate date' });
    }
  };

  onChange = (value, type) => {
    const { changeData } = this.state;
    const {
      dispatch,
      employeeProfile,
      companyLocationList = [],
      setChangedData = () => {},
    } = this.props;
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
          stepFive: { ...changeData.stepThree, notifyTo: value },
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
    this.setState({
      changeData: changeDataTemp,
    });
    setChangedData(changeDataTemp);
  };

  render() {
    const { current, data, employeeProfile, companyLocationList } = this.props;
    const { radio, changeData } = this.state;
    return (
      <div className={styles.handleChanges}>
        {current === 0 ? (
          <FirstStep
            changeData={changeData}
            onRadioChange={this.onRadioChange}
            onDateChange={this.onDateChange}
            radio={radio}
          />
        ) : null}
        {current === 1 ? (
          <SecondStep
            fetchedState={employeeProfile}
            companyLocationList={companyLocationList}
            changeData={changeData}
            onChange={this.onChange}
          />
        ) : null}
        {current === 2 ? (
          <ThirdStep
            fetchedState={employeeProfile}
            changeData={changeData}
            onChange={this.onChange}
          />
        ) : null}
        {current === 3 ? (
          <FourthStep
            fetchedState={employeeProfile}
            changeData={changeData}
            onChange={this.onChange}
            onRadioChange={this.onRadioChange}
          />
        ) : null}
        {current === 4 ? (
          <FifthStep
            changeData={changeData}
            onChange={this.onChange}
            onRadioChange={this.onRadioChange}
            radio={changeData.stepFour}
            fetchedState={employeeProfile}
          />
        ) : null}
        {current === 5 ? (
          <SixthStep name={data.name} currentData={data} changeData={changeData} />
        ) : null}
        {current === 6 ? (
          <SeventhStep
            changeData={changeData}
            onChange={this.onChange}
            fetchedState={employeeProfile}
          />
        ) : null}
      </div>
    );
  }
}

export default HandleChanges;
