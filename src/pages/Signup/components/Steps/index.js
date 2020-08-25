import React from 'react';
import { Steps } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

const { Step } = Steps;

class SignupSteps extends React.Component {
  renderIcon = step => {
    return <div className={styles.signup_step_icon}>{step}</div>;
  };

  render() {
    const { current = 0 } = this.props;
    return (
      <div className={styles.signup_selector}>
        <Steps current={current - 1}>
          <Step description={formatMessage({ id: 'signup.steps_1' })} icon={this.renderIcon(1)} />
          <Step description={formatMessage({ id: 'signup.steps_2' })} icon={this.renderIcon(2)} />
          <Step description={formatMessage({ id: 'signup.steps_3' })} icon={this.renderIcon(3)} />
        </Steps>
      </div>
    );
  }
}

export default SignupSteps;
