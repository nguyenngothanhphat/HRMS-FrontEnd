import React, { Component } from 'react';
import { Steps } from 'antd';
import styles from './index.less';
import Screen3 from './components/Screen3';
import Screen1 from './components/Screen1';

const { Step } = Steps;

class SignUpConfigLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayScreen: 1,
    };
  }

  customStep = (number) => {
    const { current = 1 } = this.props;
    const check = number - 1 > current;
    return (
      <div className={styles.customStep} style={check ? { backgroundColor: '#d9e5ff' } : {}}>
        {number}
      </div>
    );
  };

  renderScreen = () => {
    const { displayScreen } = this.state;
    switch (displayScreen) {
      case 1:
        return <Screen1 />;
      case 3:
        return <Screen3 />;
      default:
        return <Screen1 />;
    }
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
        {this.renderScreen()}
      </div>
    );
  }
}

export default SignUpConfigLocation;
