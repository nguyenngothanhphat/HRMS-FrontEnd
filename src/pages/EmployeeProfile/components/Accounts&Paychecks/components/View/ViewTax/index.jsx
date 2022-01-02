import React, { PureComponent } from 'react';
import { Col } from 'antd';
// import { connect } from 'umi';
import styles from '../../../index.less';

// @connect(({ employeeProfile: { tempData: { taxData = [] } = {} } = {} }) => ({
//   taxData,
// }))
class ViewTax extends PureComponent {
  render() {
    const { taxData } = this.props;
    const dataTaxDetails = [
      { id: 1, name: 'Income Tax Rule', text: taxData[0] ? taxData[0].incomeTaxRule : '-' },
      { id: 2, name: 'PAN Number', text: taxData[0] ? taxData[0].panNum : '-' },
    ];
    return (
      <div className={styles.spaceDetails}>
        {dataTaxDetails.map((item, index) => {
          return (
            <Col key={`Tax ${index + 1}`} span={24} className={styles.flexbox}>
              <Col span={8}>
                <p className={styles.Name}>{item.name}</p>
              </Col>
              <Col span={8}>
                <p className={styles.Text}>{item.text}</p>
              </Col>
            </Col>
          );
        })}
      </div>
    );
  }
}

export default ViewTax;
