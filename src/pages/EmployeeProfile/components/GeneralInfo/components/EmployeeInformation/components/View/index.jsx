import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'umi';
import Icon from '@ant-design/icons';
import Moment from 'moment';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import ConformIcondata from '../../../confirmIcon';
import iconQuestTion from '../../../Icon/icon';
import styles from './index.less';

@connect(
  ({
    upload: { employeeInformationURL = '' } = {},
    employeeProfile: {
      AdhaarCard = {},
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    employeeInformationURL,
    generalData,
    generalDataOrigin,
    AdhaarCard,
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

  render() {
    const { visible, linkImage } = this.state;
    const { dataAPI, AdhaarCard = {} } = this.props;
    let splitUrl = '';
    let urlAdhaarCard = '';
    if (AdhaarCard !== null) {
      if (AdhaarCard.document !== null) {
        const { document: { attachment: { name = '', url = '' } = {} } = {} } = AdhaarCard;
        splitUrl = name;
        urlAdhaarCard = url;
      }
    }

    const dummyData = [
      { label: 'Legal Name', value: dataAPI.legalName },
      {
        label: 'Date of Birth',
        value: dataAPI.DOB ? Moment(dataAPI.DOB).locale('en').format('Do MMMM YYYY') : '',
      },
      { label: 'Legal Gender', value: dataAPI.legalGender },
      { label: 'Employee ID', value: dataAPI.employeeId },
      { label: 'Work Email', value: dataAPI.workEmail },
      { label: 'Work Number', value: dataAPI.workNumber },
      { label: 'Adhaar Card Number', value: dataAPI.adhaarCardNumber },
      { label: 'UAN Number', value: dataAPI.uanNumber },
    ];
    const content = 'We require your gender for legal reasons.';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
              {item.label === 'Legal Gender' ? (
                <Tooltip
                  placement="top"
                  title={content}
                  overlayClassName={styles.GenEITooltip}
                  color="#568afa"
                >
                  <Icon component={iconQuestTion} className={styles.iconQuestTion} />
                </Tooltip>
              ) : (
                ''
              )}
            </Col>
            <Col span={18} className={styles.textValue}>
              {item.value}
              {item.label === 'Adhaar Card Number' && AdhaarCard !== null ? (
                <div className={styles.viewFileUpLoad}>
                  <p
                    onClick={() => this.handleOpenModalReview(urlAdhaarCard)}
                    className={styles.urlData}
                  >
                    {splitUrl}
                  </p>
                  <ConformIcondata data={splitUrl} />
                </div>
              ) : (
                ''
              )}
            </Col>
          </Fragment>
        ))}
        {/* Custom Col Here */}
        <ViewDocumentModal visible={visible} onClose={this.handleCancel} url={linkImage} />
      </Row>
    );
  }
}

export default View;
