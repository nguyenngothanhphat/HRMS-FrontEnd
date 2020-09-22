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
        value: dataAPI.passportIssueOn
          ? Moment(dataAPI.passportIssueOn).locale('en').format('Do MMM YYYY')
          : '',
      },
      {
        label: 'Valid Till',
        value: dataAPI.passportValidTill
          ? Moment(dataAPI.passportValidTill).locale('en').format('Do MMM YYYY')
          : '',
      },
    ];
    const dummyData2 = [
      { label: 'Visa Number', value: dataAPI.visaNo },
      { label: 'Visa Type', value: dataAPI.visaType },
      { label: 'Country', value: dataAPI.visaCountry },
      { label: 'Entry Type', value: dataAPI.visaEntryType },
      {
        label: 'Issued On',
        value: dataAPI.visaIssuedOn
          ? Moment(dataAPI.visaIssuedOn).locale('en').format('Do MMM YYYY')
          : '',
      },
      {
        label: 'Valid Till',
        value: dataAPI.visaValidTill
          ? Moment(dataAPI.visaValidTill).locale('en').format('Do MMM YYYY')
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
