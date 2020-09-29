import React, { PureComponent } from 'react';
import { Steps } from 'antd';
import styles from './index.less';
import Screen2 from './components/Screen2';
import Screen3 from './components/Screen3';

const { Step } = Steps;

class SignUpConfigLocation extends PureComponent {
  customStep = (number) => {
    const { current = 1 } = this.props;
    const check = number - 1 > current;
    return (
      <div className={styles.customStep} style={check ? { backgroundColor: '#d9e5ff' } : {}}>
        {number}
      </div>
    );
  };

  render() {
    const { current = 1 } = this.props;
    return (
      <div className={styles.root}>
        <div style={{ marginRight: '46px' }}>
          <Steps className={styles.steps} current={current} direction="vertical">
            <Step icon={this.customStep(1)} />
            <Step icon={this.customStep(2)} />
            <Step icon={this.customStep(3)} />
          </Steps>
        </div>
        {/* <Screen3 /> */}
        <Screen2 />
      </div>
    );
  }
}

export default SignUpConfigLocation;
