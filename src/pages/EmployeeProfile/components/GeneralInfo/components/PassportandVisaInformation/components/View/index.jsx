import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import Moment from 'moment';
import ConformIcondata from '../../../confirmIcon';
import styles from './index.less';

@connect(({ upload: { urlImage = '' } = {} }) => ({
  urlImage,
}))
class View extends PureComponent {
  render() {
    const { dataAPI, urlImage = '' } = this.props;
    const viewCountry = dataAPI.issuedCountry ? dataAPI.issuedCountry.name : '';
    const splitUrl = urlImage.split('/');
    const dummyData = [
      { label: 'Passport Number', value: dataAPI.number },
      { label: 'Issued Country', value: viewCountry },
      {
        label: 'Issued On',
        value: dataAPI.issuedOn ? Moment(dataAPI.issuedOn).locale('en').format('Do MMM YYYY') : '',
      },
      {
        label: 'Valid Till',
        value: dataAPI.validTill
          ? Moment(dataAPI.validTill).locale('en').format('Do MMM YYYY')
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
