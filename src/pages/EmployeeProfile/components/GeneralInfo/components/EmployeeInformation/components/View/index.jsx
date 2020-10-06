import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'umi';
import Icon from '@ant-design/icons';
import Moment from 'moment';
import ModalReviewImage from '@/components/ModalReviewImage';
import ConformIcondata from '../../../confirmIcon';
import iconQuestTion from '../../../Icon/icon';
import styles from './index.less';

@connect(
  ({
    upload: { employeeInformationURL = '' } = {},
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    employeeInformationURL,
    generalData,
    generalDataOrigin,
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

  render() {
    const { visible, linkImage } = this.state;
    const { dataAPI, generalData } = this.props;
    const { urlFile } = generalData;
    const splitUrl = urlFile ? urlFile.url.split('/') : '';
    const dummyData = [
      { label: 'Legal Name', value: dataAPI.legalName },
      {
        label: 'Date of Birth',
        value: dataAPI.DOB ? Moment(dataAPI.DOB).locale('en').format('Do MMM YYYY') : '',
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
              {item.label === 'Adhaar Card Number' && urlFile ? (
                <div className={styles.viewFileUpLoad}>
                  <p
                    onClick={() => this.handleOpenModalReview(urlFile.url)}
                    className={styles.urlData}
                  >
                    {splitUrl[6]}
                  </p>
                  <ConformIcondata data={splitUrl[6]} />
                </div>
              ) : (
                ''
              )}
            </Col>
          </Fragment>
        ))}
        {/* Custom Col Here */}
        <ModalReviewImage visible={visible} handleCancel={this.handleCancel} link={linkImage} />
      </Row>
    );
  }
}

export default View;
