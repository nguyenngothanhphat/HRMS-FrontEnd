import React, { PureComponent } from 'react';
import { Affix, Steps } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import styles from './index.less';

const { Step } = Steps;
@connect(({ signup: { currentStep = 0 } = {} }) => ({
  currentStep,
}))
class AddCompany extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'country/fetchListCountry',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'signup/save',
      payload: {
        currentStep: 0,
      },
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

  renderStep = () => {
    const { currentStep } = this.props;
    switch (currentStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      default:
        return <Step1 />;
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
      <PageContainer>
        <div className={styles.addCompany}>
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <Steps className={styles.steps} current={currentStep} onChange={this.onChangeStep}>
                <Step icon={this.customStep(0)} />
                <Step icon={this.customStep(1)} />
                <Step icon={this.customStep(2)} />
              </Steps>
            </div>
          </Affix>
          {this.renderStep()}
        </div>
      </PageContainer>
    );
  }
}

export default AddCompany;
