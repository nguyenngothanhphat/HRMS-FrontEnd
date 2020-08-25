import React from 'react';
import { Input } from 'antd';

import styles from './index.less';

// eslint-disable-next-line react/prefer-stateless-function
class SignUpInput extends React.Component {
  render() {
    return (
      <div className={styles.signup_input}>
        <Input {...this.props} />
      </div>
    );
  }
}

export default SignUpInput;
