import React, { PureComponent } from 'react';
// import { Form, Input, Row, Col, Typography, Button } from 'antd';
// import { formatMessage } from 'umi';

import styles from './index.less';

class EmailReminderForm extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.EmailReminderForm}>
        <div className={styles.EmailReminderForm_title}>
          Create a custom new email reminder
          <hr />
        </div>
        <div className={styles.EmailReminderForm_form}>Create a custom new email reminder</div>
      </div>
    );
  }
}

export default EmailReminderForm;
