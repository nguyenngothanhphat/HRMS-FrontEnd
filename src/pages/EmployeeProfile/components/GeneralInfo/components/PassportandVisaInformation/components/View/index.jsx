import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import Moment from 'moment';
import ModalReviewImage from '@/components/ModalReviewImage';
import ConformIcondata from '../../../confirmIcon';
import styles from './index.less';

@connect(
  ({
    upload: { passPortURL = '', visa0URL = '', visa1URL = '' } = {},
    employeeProfile: { tempData: { visaData = [{}], passportData = {} } = {} } = {},
  }) => ({
    passPortURL,
    visaData,
    passportData,
    visa0URL,
    visa1URL,
  }),
)
class View extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      linkImage: '',
    };
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      linkImage: '',
    });
  };

  handleOpenModalReview = (linkImage) => {
    this.setState({
      visible: true,
      linkImage,
    });
  };

  handleNameDataUpload = (index) => {
    const { visa0URL = '', visa1URL = '' } = this.props;
    if (index === 0) {
      const split0URL = visa0URL.split('/');
      const nameData0URL = split0URL[split0URL.length - 1];
      return nameData0URL;
    }
    const split1URL = visa1URL.split('/');
    const nameData1URL = split1URL[split1URL.length - 1];
    return nameData1URL;
  };

  handleRenderDataVisa = () => {
    const { visaData, visa1URL = '', visa0URL = '' } = this.props;
    return visaData.map((item, index) => (
      <Fragment key={`formVisa${index + 1}`}>
        <Col span={6} className={styles.textLabel}>
          Visa Number
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.visaNumber}
          {(index === 0 && visa0URL !== '') || (index === 1 && visa1URL !== '') ? (
            <div className={styles.viewFileUpLoad}>
              {index === 0 ? (
                <p onClick={() => this.handleOpenModalReview(visa0URL)} className={styles.urlData}>
                  {this.handleNameDataUpload(index)}
                </p>
              ) : (
                <p onClick={() => this.handleOpenModalReview(visa1URL)} className={styles.urlData}>
                  {this.handleNameDataUpload(index)}
                </p>
              )}
              <ConformIcondata data={this.handleNameDataUpload(index)} />
            </div>
          ) : (
            ''
          )}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Visa Type
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.visaType}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Country
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.visaIssuedCountry.name}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Entry Type
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.visaEntryType}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Issued On
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.visaIssuedOn ? Moment(item.visaIssuedOn).locale('en').format('Do MMM YYYY') : ''}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Valid Till
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.visaValidTill ? Moment(item.visaValidTill).locale('en').format('Do MMM YYYY') : ''}
        </Col>
        <Col span={24} className={styles.line} />
      </Fragment>
    ));
  };

  handleRenderDataDummyVisa = (dummyData2) => {
    const { visa1URL = '', visa0URL = '' } = this.props;
    return dummyData2.map((item, index) => (
      <Fragment key={item.label}>
        <Col span={6} className={styles.textLabel}>
          {item.label}
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.value}
          {(item.label === 'Visa Number' && index === 0 && visa0URL !== '') ||
          (item.label === 'Visa Number' && index === 1 && visa1URL !== '') ? (
            <div className={styles.viewFileUpLoad}>
              {index === 0 ? (
                <p onClick={() => this.handleOpenModalReview(visa0URL)} className={styles.urlData}>
                  {this.handleNameDataUpload(index)}
                </p>
              ) : (
                <p onClick={() => this.handleOpenModalReview(visa1URL)} className={styles.urlData}>
                  {this.handleNameDataUpload(index)}
                </p>
              )}
              <ConformIcondata data={this.handleNameDataUpload(index)} />
            </div>
          ) : (
            ''
          )}
        </Col>
      </Fragment>
    ));
  };

  render() {
    const { passportData = {}, visaData = [], passPortURL = '' } = this.props;
    const { visible, linkImage } = this.state;
    const {
      passportIssuedCountry = '',
      passportNumber = '',
      passportValidTill = '',
      passportIssuedOn = '',
    } = passportData;
    const viewCountry = passportIssuedCountry.name ? passportIssuedCountry.name : '';
    const splitUrlPassPort = passPortURL.split('/');
    const dummyData = [
      { label: 'Passport Number', value: passportNumber },
      { label: 'Issued Country', value: viewCountry },
      {
        label: 'Issued On',
        value: passportIssuedOn ? Moment(passportIssuedOn).locale('en').format('Do MMM YYYY') : '',
      },
      {
        label: 'Valid Till',
        value: passportValidTill
          ? Moment(passportValidTill).locale('en').format('Do MMM YYYY')
          : '',
      },
    ];

    const dummyData2 = [
      { label: 'Visa Number', value: '' },
      { label: 'Visa Type', value: '' },
      {
        label: 'Country',
        value: '',
      },
      { label: 'Entry Type', value: '' },
      {
        label: 'Issued On',
        value: '',
      },
      {
        label: 'Valid Till',
        value: '',
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
              {item.label === 'Passport Number' && passPortURL ? (
                <div className={styles.viewFileUpLoad}>
                  <p
                    onClick={() => this.handleOpenModalReview(passPortURL)}
                    className={styles.urlData}
                  >
                    {splitUrlPassPort[splitUrlPassPort.length - 1]}
                  </p>
                  <ConformIcondata data={splitUrlPassPort[splitUrlPassPort.length - 1]} />
                </div>
              ) : (
                ''
              )}
            </Col>
          </Fragment>
        ))}
        <Col span={24} className={styles.line} />
        {visaData.length !== 0
          ? this.handleRenderDataVisa()
          : this.handleRenderDataDummyVisa(dummyData2)}

        <ModalReviewImage visible={visible} handleCancel={this.handleCancel} link={linkImage} />
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
