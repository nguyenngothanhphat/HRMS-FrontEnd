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
      radio: 1,
      changeData: {
        stepOne: '',
        stepTwo: {
          title: '',
          wLocation: '',
          employType: '',
          compenType: '',
          annual: '',
        },
        stepThree: {
          department: '',
          position: '',
          reportTo: '',
        },
        stepFour: [],
        stepFive: {
          promotedTo: '',
          newSalary: Number,
          location: '',
        },
      },
    };
  }

  componentWillUnmount() {
    const { onSubmit, current } = this.props;
    const { changeData } = this.state;
    if (current === 4) onSubmit(changeData);
  }

  onRadioChange = (e) => {
    const { changeData } = this.state;
    console.log(e.target.value);
    if (e.target.checked) {
      switch (e.target.value) {
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
              stepFour: [...changeData.stepFour, 'Employee'],
            },
          });
          break;
        default:
          break;
      }
    }
    console.log(changeData.stepFour);
    this.setState({ radio: e.target.value });
  };

  onChange = (value, type) => {
    console.log(`selected ${value}`);
    console.log(`selected ${type}`);
  };

  render() {
    const { current, data } = this.props;
    const { radio, changeData } = this.state;
    return (
      <div className={styles.handleChanges}>
        {current === 0 ? <FirstStep onRadioChange={this.onRadioChange} radio={radio} /> : null}
        {current === 1 ? <SecondStep onChange={this.onChange} /> : null}
        {current === 2 ? <ThirdStep onChange={this.onChange} /> : null}
        {current === 3 ? <FourthStep onRadioChange={this.onRadioChange} radio={radio} /> : null}
        {current === 4 ? (
          <FifthStep
            name={data.name}
            currentData={{ title: data.title, salary: data.annualSalary, location: data.location }}
            data={{
              newTitle: changeData.stepTwo.title,
              newSalary: changeData.stepTwo.annual,
              newLocation: changeData.stepTwo.wLocation,
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default HandleChanges;
