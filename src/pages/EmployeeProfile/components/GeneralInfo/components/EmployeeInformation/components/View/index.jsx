import Icon from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import Moment from 'moment';
import React, { Fragment, useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import ConfirmIconData from '../../../ConfirmIconData';
import QuestionIcon from '../../../Icon/icon';
import styles from './index.less';

const View = (props) => {
  const {
    dataAPI = {},
    AdhaarCard = {},
    currentUser: { employee: { _id: idEmployee = '' } = {} || {} } = {},
    permissions = [],
    employee = '',
    locationProp: { headQuarterAddress: { country = {} } = {} } = {},
  } = props;

  const [visible, setVisible] = useState(false);
  const [linkImage, setLinkImage] = useState('');

  const handleCancel = () => {
    setVisible(false);
    setLinkImage('');
  };

  const onViewDocument = (l) => {
    setVisible(true);
    setLinkImage(l);
  };

  let adhaarCardName = '';
  let adhaarCardUrl = '';
  if (AdhaarCard && AdhaarCard?.document) {
    const { document: { attachment: { name = '', url = '' } = {} } = {} } = AdhaarCard;
    adhaarCardName = name;
    adhaarCardUrl = url;
  }

  const checkVisible = employee === idEmployee || permissions.editEmployeeInfo !== -1;

  const checkIndiaLocation = country?._id === 'IN';
  const checkVietNamLocation = country?._id === 'VN';
  const checkUSALocation = country?._id === 'US';

  const data = [
    { label: 'Full Name', value: dataAPI.legalName },
    {
      label: checkVisible ? 'Date of Birth' : null,
      value: dataAPI.DOB ? Moment.utc(dataAPI.DOB).locale('en').format('Do MMMM YYYY') : '',
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

  const content = 'We require your gender for legal reasons.';
  const newData = data.filter((item) => item.label);

  return (
    <Row gutter={[0, 16]} className={styles.root}>
      {newData.map((item) => (
        <Fragment key={item.label}>
          <Col span={6} className={styles.textLabel}>
            {item.label}
            {item.label === 'Gender' && (
              <Tooltip
                placement="top"
                title={content}
                overlayClassName={styles.GenEITooltip}
                color="#568afa"
              >
                <Icon component={QuestionIcon} className={styles.questionIcon} />
              </Tooltip>
            )}
          </Col>
          <Col span={18} className={styles.textValue}>
            {item.value}
            {item.label === 'Adhaar Card Number' && !isEmpty(AdhaarCard) && (
              <div className={styles.viewFileUpLoad}>
                <p onClick={() => onViewDocument(adhaarCardUrl)} className={styles.urlData}>
                  {adhaarCardName}
                </p>
                <ConfirmIconData data={adhaarCardName} />
              </div>
            )}
          </Col>
        </Fragment>
      ))}
      <ViewDocumentModal visible={visible} onClose={handleCancel} url={linkImage} />
    </Row>
  );
};

export default connect(
  ({
    employeeProfile: {
      AdhaarCard = {},
      originData: { employmentData: { location: locationProp = {} } = {} } = {},
      employee = '',
    } = {},
    user: { currentUser = [], permissions = [] },
  }) => ({
    AdhaarCard,
    currentUser,
    permissions,
    employee,
    locationProp,
  }),
)(View);
