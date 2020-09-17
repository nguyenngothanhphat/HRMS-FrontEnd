import React, { PureComponent } from 'react';
import styles from './styles.less';
import FirstStep from './components/FirstStep';
import SecondStep from './components/SecondStep';
import ThirdStep from './components/ThirdStep';
import FourthStep from './components/FourthStep';
import FifthStep from './components/FifthStep';

class HandleChanges extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      radio: 2,
      changeData: {
        stepOne: 'Now',
        stepTwo: {
          title: '',
          wLocation: '',
          employment: '',
          compensation: '',
          salary: '',
        },
        stepThree: {
          department: '',
          position: '',
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
      nextTab('STOP');
    }
  }

  componentWillUnmount() {
    const { onSubmit, current } = this.props;
    const { changeData } = this.state;
    if (current === 4) onSubmit(changeData);
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

  onDateChange = (value) => {
    const { changeData } = this.state;
    this.setState({ changeData: { ...changeData, stepOne: value._d } });
  };

  onChange = (value, type) => {
    const { changeData } = this.state;
    console.log(`selected ${value}`);
    console.log(`selected ${type}`);
    switch (type) {
      case 'title':
        this.setState({
          changeData: { ...changeData, stepTwo: { ...changeData.stepTwo, title: value } },
        });
        break;
      case 'wLocation':
        this.setState({
          changeData: { ...changeData, stepTwo: { ...changeData.stepTwo, wLocation: value } },
        });
        break;
      case 'employment':
        this.setState({
          changeData: { ...changeData, stepTwo: { ...changeData.stepTwo, employment: value } },
        });
        break;
      case 'compensation':
        this.setState({
          changeData: { ...changeData, stepTwo: { ...changeData.stepTwo, compensation: value } },
        });
        break;
      case 'salary':
        this.setState({
          changeData: { ...changeData, stepTwo: { ...changeData.stepTwo, salary: value } },
        });
        break;
      case 'department':
        this.setState({
          changeData: { ...changeData, stepThree: { ...changeData.stepThree, department: value } },
        });
        break;
      case 'position':
        this.setState({
          changeData: { ...changeData, stepThree: { ...changeData.stepThree, position: value } },
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
    const { current, data } = this.props;
    const { radio, changeData } = this.state;
    return (
      <div className={styles.handleChanges}>
        {current === 0 ? (
          <FirstStep
            onRadioChange={this.onRadioChange}
            onDateChange={this.onDateChange}
            radio={radio}
          />
        ) : null}
        {current === 1 ? <SecondStep changeData={changeData} onChange={this.onChange} /> : null}
        {current === 2 ? <ThirdStep changeData={changeData} onChange={this.onChange} /> : null}
        {current === 3 ? (
          <FourthStep onRadioChange={this.onRadioChange} radio={changeData.stepFour} />
        ) : null}
        {current === 4 ? (
          <FifthStep
            name={data.name}
            currentData={{ title: data.title, salary: data.annualSalary, location: data.location }}
            data={{
              newTitle: changeData.stepTwo.title,
              newSalary: changeData.stepTwo.salary,
              newLocation: changeData.stepTwo.wLocation,
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default HandleChanges;
