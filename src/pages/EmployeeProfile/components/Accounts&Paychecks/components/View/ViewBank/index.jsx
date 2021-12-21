import React, { PureComponent } from 'react';
import { Col } from 'antd';
// import { connect } from 'umi';
import styles from '../../../index.less';

// @connect(({ employeeProfile: { tempData: { bankData = [] } = {} } = {} }) => ({
//   bankData,
// }))
class ViewBank extends PureComponent {
  render() {
    const { bankData } = this.props;
    const dataBankDetails = [
      { id: 1, name: 'Bank Name', text: bankData[0] ? bankData[0].bankName : '-' },
      { id: 2, name: 'Account Number', text: bankData[0] ? bankData[0].accountNumber : '-' },
      { id: 3, name: 'Account Type', text: bankData[0] ? bankData[0].accountType : '-' },
      { id: 4, name: 'IFSC Code', text: bankData[0] ? bankData[0].ifscCode : '-' },
      { id: 5, name: 'MICR Code', text: bankData[0] ? bankData[0].micrcCode : '-' },
      { id: 6, name: 'UAN Number', text: bankData[0] ? bankData[0].uanNumber : '-' },
    ];
    return (
      <div className={styles.spaceDetails}>
        {dataBankDetails.map((item, index) => {
          return (
            <div key={`bank ${index + 1}`}>
              <Col key={`bank ${index + 1}`} span={24} className={styles.flexbox}>
                <Col span={8}>
                  <p className={styles.Name}>{item.name}</p>
                </Col>
                <Col span={8}>
                  <p className={styles.Text}>{item.text}</p>
                </Col>
              </Col>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ViewBank;
