import React from 'react';
import { Col } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

const ViewBank = (props) => {
  const { bankData, locationEmpl: { headQuarterAddress: { country = '' } = {} } = {} } = props;
  const checkIndiaLocation = country === 'IN';
  const checkVietNamLocation = country === 'VN';
  const checkUSALocation = country === 'US';

  const dataBankDetails = [
    { lable: 'Bank Name', value: bankData[0] ? bankData[0].bankName : '-' },
    {
      lable: checkVietNamLocation ? 'Branch Name' : null,
      value: bankData[0] ? bankData[0].branchName : '-',
    },
    { lable: 'Account Type', value: bankData[0] ? bankData[0].accountType : '-' },
    { lable: 'Account Number', value: bankData[0] ? bankData[0].accountNumber : '-' },
    {
      lable: checkUSALocation ? 'Routing Number' : null,
      value: bankData[0] ? bankData[0].routingNumber : '-',
    },

    {
      lable: checkVietNamLocation ? 'Swift Code' : null,
      value: bankData[0] ? bankData[0].swiftcode : '-',
    },
    {
      lable: checkVietNamLocation ? 'Account Name' : null,
      value: bankData[0] ? bankData[0].accountName : '-',
    },

    {
      lable: checkIndiaLocation ? 'IFSC Code' : null,
      value: bankData[0] ? bankData[0].ifscCode : '-',
    },
    {
      lable: checkIndiaLocation ? 'MICR Code' : null,
      value: bankData[0] ? bankData[0].micrcCode : '-',
    },
    {
      lable: checkIndiaLocation ? 'UAN Number' : null,
      value: bankData[0] ? bankData[0].uanNumber : '-',
    },
  ];

  const newBankDetails = dataBankDetails.filter((item) => item.lable !== null);
  return (
    <div className={styles.spaceDetails}>
      {newBankDetails.map((item, index) => {
        return (
          <div key={`bank ${index + 1}`}>
            <Col key={`bank ${index + 1}`} span={24} className={styles.flexbox}>
              <Col span={8}>
                <p className={styles.Name}>{item.lable}</p>
              </Col>
              <Col span={8}>
                <p className={styles.Text}>{item.value}</p>
              </Col>
            </Col>
          </div>
        );
      })}
    </div>
  );
};

export default connect(
  ({
    employeeProfile: {
      originData: { employmentData: { location: locationEmpl = {} } = {} } = {},
    } = {},
  }) => ({
    locationEmpl,
  }),
)(ViewBank);
