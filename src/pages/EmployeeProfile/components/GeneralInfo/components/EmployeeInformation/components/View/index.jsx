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
      originData: {
        generalData: generalDataOrigin = {},
        employmentData: { location: locationProp = {} } = {},
      } = {},
      tempData: { generalData = {} } = {},
      idCurrentEmployee = '',
    } = {},
    user: { currentUser = [], permissions = [] },
  }) => ({
    employeeInformationURL,
    generalData,
    generalDataOrigin,
    AdhaarCard,
    currentUser,
    permissions,
    idCurrentEmployee,
    locationProp,
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
    const {
      dataAPI = {},
      AdhaarCard = {},
      currentUser: { employee: { _id: idEmployee = '' } = {} || {} } = {},
      permissions = [],
      idCurrentEmployee = '',
      locationProp: { headQuarterAddress: { country = '' } = {} } = {},
    } = this.props;
    let splitUrl = '';
    let urlAdhaarCard = '';
    if (AdhaarCard !== null) {
      if (AdhaarCard.document !== null) {
        const { document: { attachment: { name = '', url = '' } = {} } = {} } = AdhaarCard;
        splitUrl = name;
        urlAdhaarCard = url;
      }
    }

    const checkVisible = idCurrentEmployee === idEmployee || permissions.editEmployeeInfo !== -1;

    const checkIndiaLocation = country === 'IN';
    const checkVietNamLocation = country === 'VN';
    const checkUSALocation = country === 'US';

    const dummyData = [
      { label: 'Full Name', value: dataAPI.legalName },
      {
        label: checkVisible ? 'Date of Birth' : null,
        value: dataAPI.DOB ? Moment(dataAPI.DOB).locale('en').format('Do MMMM YYYY') : '',
      },
      { label: checkVisible ? 'Gender' : null, value: dataAPI.legalGender },
      { label: 'Employee ID', value: dataAPI.employeeId },
      { label: 'Work Email', value: dataAPI.workEmail },
      { label: 'Work Number', value: dataAPI.workNumber },
      {
        label: checkVisible && checkIndiaLocation ? 'Adhaar Card Number' : null,
        value: dataAPI.adhaarCardNumber,
      },
      { label: checkVisible && checkIndiaLocation ? 'UAN Number' : null, value: dataAPI.uanNumber },
      {
        label: checkVisible && checkVietNamLocation ? 'National Identification Number' : null,
        value: dataAPI.uanNumber,
      },
      {
        label: checkVisible && checkUSALocation ? 'Social Security Number' : null,
        value: dataAPI.uanNumber,
      },
    ];
    const newdata = dummyData.filter((item) => item.label !== null);
    const content = 'We require your gender for legal reasons.';

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {newdata.map((item) => (
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
