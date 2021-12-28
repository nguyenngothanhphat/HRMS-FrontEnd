import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import Moment from 'moment';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import iconPDF from '@/assets/pdf-2.svg';
import ConformIcondata from '../../../confirmIcon';
import styles from './index.less';

@connect(
  ({
    upload: { passPortURL = '' } = {},
    employeeProfile: { tempData: { passportData = [{}] } = {} } = {},
  }) => ({
    passPortURL,
    passportData,
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
    });
    setTimeout(() => {
      this.setState({
        linkImage: '',
      });
    }, 500);
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

  handleRenderDataPassport = () => {
    const { passportData = [] } = this.props;
    return passportData.map((item, index) => (
      <Fragment key={`formPassport${index + 1}`}>
        {index > 0 ? <Col span={24} className={styles.line} /> : null}
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
          Issued By Country
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.passportIssuedCountry ? item.passportIssuedCountry.name : ''}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Issued On
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.passportIssuedOn
            ? Moment(item.passportIssuedOn).locale('en').format('Do MMMM YYYY')
            : ''}
        </Col>
        <Col span={6} className={styles.textLabel}>
          Valid Till
        </Col>
        <Col span={18} className={styles.textValue}>
          {item.passportValidTill
            ? Moment(item.passportValidTill).locale('en').format('Do MMMM YYYY')
            : ''}
        </Col>
      </Fragment>
    ));
  };

  handleRenderDataDummyPassport = (dummyData) => {
    return dummyData.map((item, index) => (
      <Fragment key={item.label}>
        <Col span={6} className={styles.textLabel}>
          {item.label}
        </Col>
        <Col span={18} className={styles.EarlyIcon}>
          {item.value}
          {(item.label === 'Passport Number' && index === 0) ||
          (item.label === 'Passport Number' && index === 1) ? (
            <img src={iconPDF} alt="iconFilePDF" />
          ) : (
            ''
          )}
        </Col>
      </Fragment>
    ));
  };

  render() {
    const { passportData = [] } = this.props;
    const { visible, linkImage } = this.state;

    const dummyData = [
      { label: 'Passport Number', value: '' },
      { label: 'Issued Country', value: '' },
      { label: 'Issued On', value: '' },
      { label: 'Valid Till', value: '' },
    ];

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {passportData.length !== 0
          ? this.handleRenderDataPassport()
          : this.handleRenderDataDummyPassport(dummyData)}
        <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
