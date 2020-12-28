import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import Moment from 'moment';
import ModalReviewImage from '@/components/ModalReviewImage';
import iconPDF from '@/assets/pdf-2.svg';
import ConformIcondata from '../../../confirmIcon';
import styles from './index.less';

@connect(
  ({
    upload: { passPortURL = '', visa0URL = '', visa1URL = '' } = {},
    employeeProfile: { tempData: { visaData = [{}], passportData = [{}] } = {} } = {},
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

  handleNameDataUpload = (url) => {
    const split1URL = url.split('/');
    const nameData1URL = split1URL[split1URL.length - 1];
    return nameData1URL;
  };

  handleRenderDataVisa = () => {
    const { visaData } = this.props;
    return visaData.map((item, index) => (
      <Fragment key={`formVisa${index + 1}`}>
        <Col span={6} className={styles.textLabel}>
          Visa Number
        </Col>
        <Col span={18} className={`${styles.textValue} ${styles.setIconEarly}`}>
          {item.visaNumber}
          {item.document ? (
            <div className={styles.viewFileUpLoad}>
              <p
                onClick={() => this.handleOpenModalReview(item.document.attachment.url)}
                className={styles.urlData}
              >
                {item.document.attachment ? item.document.attachment.name : ''}
              </p>
              <ConformIcondata
                data={item.document.attachment ? item.document.attachment.name : ''}
              />
            </div>
          ) : (
            <img src={iconPDF} alt="iconFilePDF" className={styles.iconEarly} />
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
    return dummyData2.map((item, index) => (
      <Fragment key={item.label}>
        <Col span={6} className={styles.textLabel}>
          {item.label}
        </Col>
        <Col span={18} className={styles.EarlyIcon}>
          {item.value}
          {(item.label === 'Visa Number' && index === 0) ||
          (item.label === 'Visa Number' && index === 1) ? (
            <img src={iconPDF} alt="iconFilePDF" />
          ) : (
            ''
          )}
        </Col>
      </Fragment>
    ));
  };

  handleRenderDataPassport = () => {
    const { passportData } = this.props;
    return passportData.map((item, index) => (
      <Fragment key={`formPassport${index + 1}`}>
        <Col span={6} className={styles.textLabel}>
          Passport Number
        </Col>
        <Col span={18} className={`${styles.textValue} ${styles.setIconEarly}`}>
          {item.passportNumber}
          {item.document ? (
            <div className={styles.viewFileUpLoad}>
              <p
                onClick={() => this.handleOpenModalReview(item.document.attachment.url)}
                className={styles.urlData}
              >
                {item.document.attachment ? item.document.attachment.name : ''}
              </p>
              <ConformIcondata
                data={item.document.attachment ? item.document.attachment.name : ''}
              />
            </div>
          ) : (
            <img src={iconPDF} alt="iconFilePDF" className={styles.iconEarly} />
          )}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Issued Country
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.passportIssuedCountry.name ? item.passportIssuedCountry.name : ''}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Issued On
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.passportIssuedOn
            ? Moment(item.passportIssuedOn).locale('en').format('Do MMM YYYY')
            : ''}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Valid Till
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.passportValidTill
            ? Moment(item.passportValidTill).locale('en').format('Do MMM YYYY')
            : ''}
        </Col>
      </Fragment>
    ));
  };

  handleRenderDataDummyPassport = (dummyData) => {
    return dummyData.map((item) => (
      <Fragment key={item.label}>
        <Col span={6} className={styles.textLabel}>
          {item.label}
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.value}
          {item.label === 'Passport Number' ? (
            <div className={styles.viewFileUpLoad}>
              <p onClick={() => this.handleOpenModalReview(getUrl)} className={styles.urlData}>
                {splitUrlPassPort}
              </p>
              <ConformIcondata data={splitUrlPassPort} />
            </div>
          ) : (
            ''
          )}
        </Col>
      </Fragment>
    ));
  };

  render() {
    const { passportData = [], visaData = [] } = this.props;
    const { visible, linkImage } = this.state;

    let nameDocument = '';
    let getUrl = '';
    if (document) {
      if (document.attachment) {
        const { attachment: { name = '', url = '' } = {} } = document;
        nameDocument = name;
        getUrl = url;
      }
    }
    // const nameDocument = document ? (document.attachment ? document.attachment.name : '') : '';
    // const url = document ? document.attachment.url : '';
    const splitUrlPassPort = document ? nameDocument : '';
    const dummyData = [
      { label: 'Passport Number', value: '' },
      { label: 'Issued Country', value: '' },
      { label: 'Issued On', value: '' },
      { label: 'Valid Till', value: '' },
    ];

    const dummyData2 = [
      { label: 'Visa Number', value: '' },
      { label: 'Visa Type', value: '' },
      { label: 'Country', value: '' },
      { label: 'Entry Type', value: '' },
      { label: 'Issued On', value: '' },
      { label: 'Valid Till', value: '' },
    ];

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {passportData.length !== 0
          ? this.handleRenderDataPassport()
          : this.handleRenderDataDummyPassport(dummyData)}

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
