import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import Moment from 'moment';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { dataAPI } = this.props;
    const dummyData = [
      { label: 'Passport Number', value: dataAPI.passportNo },
      { label: 'Issued Country', value: dataAPI.passportIssueCountry },
      {
        label: 'Issued On',
        value: dataAPI.issuedOnPassPort
          ? Moment(dataAPI.issuedOnPassPort).locale('en').format('Do MMM YYYY')
          : '',
      },
      {
        label: 'Valid Till',
        value: dataAPI.validTillPassPort
          ? Moment(dataAPI.validTillPassPort).locale('en').format('Do MMM YYYY')
          : '',
      },
    ];
    const dummyData2 = [
      { label: 'Visa Number', value: dataAPI.visaNumber },
      { label: 'Visa Type', value: dataAPI.visaType },
      { label: 'Country', value: dataAPI.country },
      { label: 'Entry Type', value: dataAPI.entryType },
      {
        label: 'Issued On',
        value: dataAPI.issuedOnVisa
          ? Moment(dataAPI.issuedOnVisa).locale('en').format('Do MMM YYYY')
          : '',
      },
      {
        label: 'Valid Till',
        value: dataAPI.validTillVisa
          ? Moment(dataAPI.validTillVisa).locale('en').format('Do MMM YYYY')
          : '',
      },
    ];
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
            </Col>
            <Col span={18} className={styles.textValue}>
              {item.value}
            </Col>
          </Fragment>
        ))}
        <Col span={24} className={styles.line} />
        {dummyData2.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
            </Col>
            <Col span={18} className={styles.textValue}>
              {item.value}
            </Col>
          </Fragment>
        ))}

        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
