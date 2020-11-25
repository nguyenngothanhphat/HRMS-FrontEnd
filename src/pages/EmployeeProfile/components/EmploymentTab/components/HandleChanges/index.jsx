import React, { PureComponent } from 'react';
import { dialog } from '@/utils/utils';
import { connect } from 'umi';
import styles from './styles.less';
import FirstStep from './components/FirstStep';
import SecondStep from './components/SecondStep';
import ThirdStep from './components/ThirdStep';
import FourthStep from './components/FourthStep';
import FifthStep from './components/FifthStep';

@connect(({ employeeProfile, user }) => ({
  employeeProfile,
  user,
}))
class HandleChanges extends PureComponent {
  constructor(props) {
    super(props);
    const { user, employeeProfile } = this.props;
    this.state = {
      radio: 2,
      changeData: {
        changedBy: user.currentUser._id,
        employee: employeeProfile.idCurrentEmployee,
        newTitle: '',
        newLocation: '',
        stepOne: 'Now',
        stepTwo: {
          wLocation: '',
          employment: '',
          compensation: '',
          salary: null,
        },
        stepThree: {
          title: '',
          department: '',
          reportTo: '',
        },
        stepFour: {
          toEmployee: false,
          toManager: false,
          toHR: false,
        },
      },
    };
  }

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

    if (changeData.stepTwo.salary?.type && !changeData.stepTwo.salary.amount) {
      if (current > 1) {
        nextTab('SALARY_REQUIRED');
        dialog({ message: 'Please enter an amount for salary' });
      }
    }
  }

  componentWillUnmount() {
    const { onSubmit } = this.props;
    const { changeData } = this.state;
    onSubmit(changeData);
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
            stepFour: { ...changeData.stepFour, toEmployee: !changeData.stepFour.toEmployee },
          },
        });
        break;
      case 5:
        this.setState({
          changeData: {
            ...changeData,
            stepFour: { ...changeData.stepFour, toManager: !changeData.stepFour.toManager },
          },
        });
        break;
      case 6:
        this.setState({
          changeData: {
            ...changeData,
            stepFour: { ...changeData.stepFour, toHR: !changeData.stepFour.toHR },
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
    const { dispatch, employeeProfile } = this.props;
    switch (type) {
      case 'title':
        this.setState({
          changeData: {
            ...changeData,
            stepThree: { ...changeData.stepThree, title: value[1] },
            newTitle: value[0],
          },
        });
        break;
      case 'wLocation':
        this.setState({
          changeData: {
            ...changeData,
            stepTwo: { ...changeData.stepTwo, wLocation: value[1] },
            newLocation: value[0],
          },
        });
        break;
      case 'employment':
        this.setState({
          changeData: { ...changeData, stepTwo: { ...changeData.stepTwo, employment: value } },
        });
        break;
      case 'compensation':
        this.setState({
          changeData: {
            ...changeData,
            stepTwo: { ...changeData.stepTwo, compensation: value, salary: null },
          },
        });
        if (value === 'Salaried') {
          this.setState({
            changeData: {
              ...changeData,
              stepTwo: {
                ...changeData.stepTwo,
                compensation: value,
                salary: { ...changeData.stepTwo.salary, type: 'annually' },
              },
            },
          });
        }

        break;
      case 'salary':
        this.setState({
          changeData: {
            ...changeData,
            stepTwo: {
              ...changeData.stepTwo,
              salary: { ...changeData.stepTwo.salary, amount: Number(value) },
            },
          },
        });
        break;
      case 'salaryType':
        this.setState({
          changeData: {
            ...changeData,
            stepTwo: {
              ...changeData.stepTwo,
              salary: { ...changeData.stepTwo.salary, type: value },
            },
          },
        });
        break;
      case 'department':
        this.setState({
          changeData: {
            ...changeData,
            stepThree: { ...changeData.stepThree, department: value, title: '' },
            newTitle: '',
          },
        });
        dispatch({
          type: 'employeeProfile/fetchTitleByDepartment',
          payload: {
            company: employeeProfile.originData.compensationData.company,
            department: value,
          },
        });
        break;
      case 'reportTo':
        this.setState({
          changeData: { ...changeData, stepThree: { ...changeData.stepThree, reportTo: value } },
        });
        break;

      default:
        break;
    }
  };

  render() {
    const { current, data, employeeProfile } = this.props;
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
          <FourthStep onRadioChange={this.onRadioChange} radio={changeData.stepFour} />
        ) : null}
        {current === 4 ? (
          <FifthStep
            name={data.name}
            currentData={{ title: data.title, salary: data.annualSalary, location: data.location }}
            data={{
              newTitle: changeData.newTitle,
              newSalary: changeData.stepTwo.salary?.amount,
              newLocation: changeData.newLocation,
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default HandleChanges;
