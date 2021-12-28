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
    upload: { visa0URL = '', visa1URL = '' } = {},
    employeeProfile: { tempData: { visaData = [{}] } = {} } = {},
  }) => ({
    visaData,
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

  handleRenderDataVisa = () => {
    const { visaData = [] } = this.props;
    return visaData.map((item, index) => {
      const {
        visaNumber = '',
        document = {},
        document: { attachment: { url = '', name = '' } = {} } = {},
        visaIssuedCountry: { name: name1 = '', flag = '' } = {},
        visaType = [],
        visaEntryType = '',
        visaIssuedOn = '',
        visaValidTill = '',
      } = item;
      return (
        <Fragment key={`formVisa${index + 1}`}>
          <Col span={6} className={styles.textLabel}>
            <span>{name1}</span>
            <div className={styles.flag}>
              <img src={flag} alt="flag" />
            </div>
          </Col>
          <Col span={18} className={`${styles.textValue} ${styles.setIconEarly}`}>
            {document ? (
              <div className={styles.viewFileUpLoad}>
                <p onClick={() => this.handleOpenModalReview(url)} className={styles.urlData}>
                  {name}
                </p>
                <ConformIcondata data={name} />
              </div>
            ) : (
              <img src={iconPDF} alt="iconFilePDF" className={styles.iconEarly} />
            )}
          </Col>

          <Col span={6} className={styles.textLabel}>
            Visa Number
          </Col>
          <Col span={18} className={styles.textLabel}>
            {visaNumber}
          </Col>

          <Col span={6} className={styles.textLabel}>
            Visa Type
          </Col>
          <Col span={18} className={styles.textValue}>
            {visaType.map((itemVisa, indexItem) => (
              <div key={`visaType${indexItem + 1}`}>{itemVisa}</div>
            ))}
          </Col>
          <Col span={6} className={styles.textLabel}>
            Country
          </Col>
          <Col span={18} className={styles.textValue}>
            {name1}
          </Col>
          <Col span={6} className={styles.textLabel}>
            Entry Type
          </Col>
          <Col span={18} className={styles.textValue}>
            {visaEntryType}
          </Col>
          <Col span={6} className={styles.textLabel}>
            Issued On
          </Col>
          <Col span={18} className={styles.textValue}>
            {Moment(visaIssuedOn).locale('en').format('Do MMMM YYYY')}
          </Col>
          <Col span={6} className={styles.textLabel}>
            Valid Till
          </Col>
          <Col span={18} className={styles.textValue}>
            {Moment(visaValidTill).locale('en').format('Do MMMM YYYY')}
          </Col>
          <Col span={24} className={styles.line} />
        </Fragment>
      );
    });
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

  render() {
    const { visaData = [] } = this.props;
    const { visible, linkImage } = this.state;

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
        {visaData.length !== 0
          ? this.handleRenderDataVisa()
          : this.handleRenderDataDummyVisa(dummyData2)}

        <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />

        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
