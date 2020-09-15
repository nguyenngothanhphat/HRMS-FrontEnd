import React, { PureComponent } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { EditFilled, QuestionCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

class EmployeeInformation extends PureComponent {
  render() {
    const { dataAPI = {} } = this.props;
    console.log('generalData', dataAPI);
    return (
      <div className={styles.EmployeeInformation}>
        <Row className={styles.EmployeeDetails}>
          <Col span={24}>
            <div>
              <div className={styles.spaceTitle}>
                <p className={styles.EmployeeTitle}>Employee Information</p>
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
                  <p className={styles.Name}>Legal Name</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.legalName}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Date of Birth</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>date</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6} className={styles.boxInfoToolTip}>
                  <p className={styles.Name}>Legal Gender</p>
                  <Tooltip placement="top" title="aa">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.legalGender}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Employee ID</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>{dataAPI.employeeId}</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Work Email</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>email</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Work Number</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>number phone</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetails}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>Adhaar Card Number</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>Card Number</p>
                </Col>
              </Col>
            </div>
            <div className={styles.spaceDetailsBot}>
              <Col span={24} className={styles.boxInfo}>
                <Col span={6}>
                  <p className={styles.Name}>UAN Number</p>
                </Col>
                <Col span={6}>
                  <p className={styles.Text}>UAN Number</p>
                </Col>
              </Col>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EmployeeInformation;
