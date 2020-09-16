import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';

class EmergencyContact extends PureComponent {
  render() {
    const { dataAPI = {} } = this.props;
    return (
      <div className={styles.EmergencyContact}>
        <Row className={styles.EmployeeDetails}>
          <Col span={24}>
            <div>
              <div className={styles.spaceTitle}>
                <p className={styles.EmployeeTitle}>Emergency Contact Details</p>
                <div className={styles.flexEdit}>
                  <EditFilled className={styles.IconEdit} />
                  <p className={styles.Edit}>Edit</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Emergency Contact</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.emergencyContact}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Person’s Name</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Person’s Name</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetailsBot}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Relation</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Relation</p>
                </Col>
              </Col>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EmergencyContact;
