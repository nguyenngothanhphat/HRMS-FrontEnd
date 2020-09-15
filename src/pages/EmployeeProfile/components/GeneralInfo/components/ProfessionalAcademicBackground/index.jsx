import React, { PureComponent } from 'react';
// import { Row, Col } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';

class ProfessionalAcademicBackground extends PureComponent {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.viewTitle}>
          <p className={styles.viewTitle__text}>Professional &amp; Academic Background</p>
          <div className={styles.viewTitle__edit}>
            <EditFilled className={styles.viewTitle__edit__icon} />
            <p className={styles.viewTitle__edit__text}>Edit</p>
          </div>
        </div>
        <div className={styles.viewBottom}>bottom</div>
      </div>
    );
  }
}

export default ProfessionalAcademicBackground;
