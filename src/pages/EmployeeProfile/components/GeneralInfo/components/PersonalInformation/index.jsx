import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';

class PersonalInformation extends PureComponent {
  render() {
    const { dataAPI = {} } = this.props;
    console.log('generalData', dataAPI);
    return (
      <div className={styles.PersonalInformation}>
        <Row className={styles.EmployeeDetails}>
          <Col span={24}>
            <div>
              <div className={styles.spaceTitle}>
                <p className={styles.EmployeeTitle}>Personal Information</p>
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
                  <p className={styles.Name}>Personal Number</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.personalNumber}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Personal Email</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.personalEmail}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Blood Group</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.Blood}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Marital Status</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.maritalStatus}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Linkedin</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.linkedIn}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Residence Address</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.residentAddress}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetailsBot}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Current Address</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.currentAddress}</p>
                </Col>
              </Col>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PersonalInformation;
