import { Card, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const PassportDetails = (props) => {
  const {
    openPassport,
    isProfileOwner = false,
    permissions = {},
    passportDataOrigin,
    passportData,
    dispatch,
  } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPassport: true },
    });
  };

  const handleCancel = () => {
    const {
      urlFile = '',
      passportNumber = '',
      passportIssuedCountry = '',
      passportIssuedOn = '',
      passportValidTill = '',
    } = passportDataOrigin;
    const reverseFields = {
      urlFile,
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
    };
    const payloadPassPort = { ...passportData, ...reverseFields };
    const isModified = JSON.stringify(payloadPassPort) !== JSON.stringify(passportDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: passportDataOrigin },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPassport: false },
    });
  };

  const renderComponent = openPassport ? <Edit handleCancel={handleCancel} /> : <View />;
  const editPassportPermission = permissions.editPassportAndVisa !== -1;
  const disabledFields = true; // temporarily disable fields

  const options = () => {
    return (
      !openPassport &&
      (!isProfileOwner || editPassportPermission) && (
        <CustomEditButton onClick={disabledFields ? null : handleEdit}>
          <Tooltip placement="topLeft" title="Temporarily Disabled - will be enabled shortly.">
            Edit
          </Tooltip>
        </CustomEditButton>
      )
    );
  };

  return (
    <Card className={styles.PassportDetails} title="Passport Details" extra={options()}>
      <div className={styles.container}>{renderComponent}</div>
    </Card>
  );
};

export default connect(
  ({
    upload: { passPortURL = '' } = {},
    employeeProfile: {
      editGeneral: { openPassport = false },
      originData: { passportData: passportDataOrigin = [] } = {},
      tempData: { passportData = [] } = {},
    } = {},
  }) => ({
    openPassport,
    passportDataOrigin,
    passportData,
    passPortURL,
  }),
)(PassportDetails);
