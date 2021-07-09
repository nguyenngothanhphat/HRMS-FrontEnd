import React, { Component } from 'react';
import { Steps } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';
import Screen1 from './components/Screen1';

const { Step } = Steps;

@connect(({ signup: { currentStep = 0 } = {} }) => ({
  currentStep,
}))
class SignUpConfigLocation extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'country/fetchListCountry',
    });
    dispatch({
      type: 'companiesManagement/fetchCompanyTypeList',
    });
    dispatch({
      type: 'companiesManagement/fetchIndustryList',
    });
  }

  customStep = (number) => {
    const { currentStep = 0 } = this.props;
    const check = number > currentStep;
    return (
      <div className={styles.customStep} style={check ? { backgroundColor: '#d9e5ff' } : {}}>
        {number + 1}
      </div>
    );
  };

  renderScreen = () => {
    const { currentStep } = this.props;
    switch (currentStep) {
      case 0:
        return <Screen1 />;
      case 1:
        return <Screen2 />;
      case 2:
        return <Screen3 />;
      default:
        return <Screen1 />;
    }
  };

  onChangeStep = (current) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'signup/save',
      payload: {
        currentStep: current,
      },
    });
  };

  render() {
    const { currentStep = 0 } = this.props;

    return (
      <div className={styles.root}>
        <div style={{ marginRight: '46px' }}>
          <Steps
            className={styles.steps}
            current={currentStep}
            // onChange={this.onChangeStep}
            direction="vertical"
          >
            <Step icon={this.customStep(0)} />
            <Step icon={this.customStep(1)} />
            <Step icon={this.customStep(2)} />
          </Steps>
        </div>
        {this.renderScreen()}
      </div>
    );
  }
}

export default SignUpConfigLocation;
