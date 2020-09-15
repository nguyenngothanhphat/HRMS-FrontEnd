import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';

class EmployeeInformation extends PureComponent {
  render() {
    const data = [
      { id: 1, name: 'Legal Name', text: 'Aditya Venkatesh' },
      { id: 2, name: 'Date of Birth', text: '21st May 1995' },
    ];
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
              {data.map((item) => {
                return (
                  <Col key={item.id} span={24} className={styles.boxInfo}>
                    <Col span={6}>
                      <p className={styles.Name}>{item.name}</p>
                    </Col>
                    <Col span={6}>
                      <p className={styles.Text}>{item.text}</p>
                    </Col>
                  </Col>
                );
              })}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EmployeeInformation;
