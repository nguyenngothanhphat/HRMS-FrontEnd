import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import Moment from 'moment';
import ConformIcondata from '../../../confirmIcon';
import styles from './index.less';

@connect(
  ({
    upload: { urlImage = '' } = {},
    employeeProfile: { tempData: { visaData = [{}] } = {} } = {},
  }) => ({
    urlImage,
    visaData,
  }),
)
class View extends PureComponent {
  render() {
    const { dataAPI, visaData, urlImage = '' } = this.props;
    const {
      visaEntryType = '',
      visaIssuedCountry = '',
      visaIssuedOn = '',
      visaNumber = '',
      visaType = '',
      visaValidTill = '',
    } = visaData;
    console.log(visaIssuedCountry, visaEntryType);
    const viewCountry = dataAPI.passportIssuedCountry ? dataAPI.passportIssuedCountry.name : '';
    const splitUrl = urlImage.split('/');
    const dummyData = [
      { label: 'Passport Number', value: dataAPI.passportNumber },
      { label: 'Issued Country', value: viewCountry },
      {
        label: 'Issued On',
        value: dataAPI.passportIssuedOn
          ? Moment(dataAPI.passportIssuedOn).locale('en').format('Do MMM YYYY')
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
      { label: 'Visa Number', value: visaNumber },
      { label: 'Visa Type', value: visaType },
      { label: 'Country', value: visaIssuedCountry },
      { label: 'Entry Type', value: visaEntryType },
      {
        label: 'Issued On',
        value: visaIssuedOn ? Moment(visaIssuedOn).locale('en').format('Do MMM YYYY') : '',
      },
      {
        label: 'Valid Till',
        value: visaValidTill ? Moment(visaValidTill).locale('en').format('Do MMM YYYY') : '',
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
              {item.label === 'Passport Number' && urlImage ? (
                <div className={styles.viewFileUpLoad}>
                  <a
                    href={urlImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.urlData}
                  >
                    {splitUrl[6]}
                  </a>
                  <ConformIcondata data={splitUrl[6]} />
                </div>
              ) : (
                ''
              )}
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
              {item.label === 'Visa Number' && urlImage ? (
                <div className={styles.viewFileUpLoad}>
                  <a
                    href={urlImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.urlData}
                  >
                    {splitUrl[6]}
                  </a>
                  <ConformIcondata data={splitUrl[6]} />
                </div>
              ) : (
                ''
              )}
            </Col>
          </Fragment>
        ))}

        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
