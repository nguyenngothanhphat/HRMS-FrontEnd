import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';

class PassportVisaInformation extends PureComponent {
  render() {
    const { dataAPI = {} } = this.props;
    console.log('generalData', dataAPI);
    return (
      <div className={styles.PassportVisaInformation}>
        <Row className={styles.EmployeeDetails}>
          <Col span={24}>
            <div>
              <div className={styles.spaceTitle}>
                <p className={styles.EmployeeTitle}>Passport and Visa Information</p>
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
                  <p className={styles.Name}>Passport Number</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.passportNo}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Issued Country</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.passportIssueCountry}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Issued On</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Issued On</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Visa Number</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Visa Number</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Visa Type</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Visa Type</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Country</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Country</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Entry Type</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Entry Type</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Issued On</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Issued On</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetailsBot}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Valid Till</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Valid Till</p>
                </Col>
              </Col>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PassportVisaInformation;
