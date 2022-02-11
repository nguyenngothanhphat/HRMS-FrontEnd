import React from 'react';
import { Col } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

const ViewTax = (props) => {
  const { taxData, locationEmpl: { headQuarterAddress: { country = '' } = {} } = {} } = props;
  const checkIndiaLocation = country === 'IN';
  const checkVietNamLocation = country === 'VN';
  const checkUSALocation = country === 'US';

  const dataTaxDetails = [
    {
      lable: checkUSALocation ? 'Social Security Card Number' : null,
      value: taxData[0] ? taxData[0].nationalId : '-',
    },
    {
      lable: checkIndiaLocation ? 'Income Tax Rule' : null,
      value: taxData[0] ? taxData[0].incomeTaxRule : '-',
    },
    {
      lable: checkIndiaLocation ? 'PAN Number' : null,
      value: taxData[0] ? taxData[0].panNum : '-',
    },
    {
      lable: checkVietNamLocation ? 'National ID Card Number' : null,
      value: taxData[0] ? taxData[0].nationalId : '-',
    },
    { lable: 'Marital Status', value: taxData[0] ? taxData[0].maritalStatus : '-' },
    { lable: 'No. of Dependents', value: taxData[0] ? taxData[0].noOfDependents : '-' },
    { lable: 'Residency Status', value: taxData[0] ? taxData[0].residencyStatus : '-' },
  ];
  const newDataTaxDetails = dataTaxDetails.filter((item) => item.lable !== null);
  return (
    <div className={styles.spaceDetails}>
      {newDataTaxDetails.map((item) => {
        return (
          <Col span={24} className={styles.flexbox}>
            <Col span={8}>
              <p className={styles.Name}>{item.lable}</p>
            </Col>
            <Col span={8}>
              <p className={styles.Text}>{item.value}</p>
            </Col>
          </Col>
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
)(ViewTax);
