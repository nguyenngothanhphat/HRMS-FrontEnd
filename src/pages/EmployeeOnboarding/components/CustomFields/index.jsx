import { Button } from 'antd';
import React, { PureComponent } from 'react';
import iGirl from '@/assets/backgroundCustomField.svg';
import styles from './index.less';

class CustomFields extends PureComponent {
  render() {
    return (
      <div className={styles.CustomFields}>
        <div className={styles.contentLeft}>
          <h2 className={styles.contentLeftTitle}>Custom fields</h2>
          <p className={styles.contentLeftText}>
            You can manage create fields of your choice for entering into forms or surveys from
            here.
          </p>
          <div>
            <Button className={styles.buttonAddNewSection}>Add new section</Button>
            <Button className={styles.buttonAddNewField}>Add new field</Button>
          </div>
        </div>
        <div>
          <img src={iGirl} alt="not found" />
        </div>
      </div>
    );
  }
}

export default CustomFields;
