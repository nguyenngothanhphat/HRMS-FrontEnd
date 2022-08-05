import React, { PureComponent } from 'react';
import { Form } from 'antd';
import WarningImage from '@/assets/resourceManagement/warningImage.svg';
import styles from './index.less';

class WarningModalContent extends PureComponent {
  render() {
    const { setManagerChange = () => {} } = this.props;
    return (
      <div className={styles.WarningModalContent}>
        <Form id="warningForm" name="warningForm" onFinish={() => setManagerChange()}>
          <div className={styles.warningImage}>
            <img src={WarningImage} alt="warning" />
          </div>
          <p className={styles.warningContent}>The employee is assigned to multiple projects.</p>
          <p className={styles.warningContent}>Are you sure you want to change the manager?</p>
        </Form>
      </div>
    );
  }
}

export default WarningModalContent;
