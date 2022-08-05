/* eslint-disable react/jsx-indent */
import { Card } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const PersonalInformation = (props) => {
  const {
    generalData,
    openPersonalInfo,
    permissions = {},
    isProfileOwner,
    generalDataOrigin,
    dispatch,
  } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPersonalInfo: true },
    });
  };

  const handleCancel = () => {
    const {
      personalNumber = '',
      personalEmail = '',
      Blood = '',
      maritalStatus = '',
      linkedIn = '',
      residentAddress = '',
      currentAddress = '',
    } = generalDataOrigin;
    const reverseFields = {
      personalNumber,
      personalEmail,
      Blood,
      maritalStatus,
      linkedIn,
      residentAddress,
      currentAddress,
    };
    const payload = { ...generalData, ...reverseFields };
    const isModified = JSON.stringify(payload) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: payload },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPersonalInfo: false },
    });
  };

  const options = () => {
    return (
      !openPersonalInfo &&
      (permissions.editPersonalInfo !== -1 || isProfileOwner) && (
        <CustomEditButton onClick={handleEdit}>Edit</CustomEditButton>
      )
    );
  };

  const renderComponent = openPersonalInfo ? (
    <Edit handleCancel={handleCancel} isProfileOwner={isProfileOwner} />
  ) : (
    <View dataAPI={generalData} permissions={permissions} isProfileOwner={isProfileOwner} />
  );
  return (
    <Card className={styles.PersonalInformation} title="Personal Information" extra={options()}>
      <div className={styles.container}>{renderComponent}</div>
    </Card>
  );
};

export default connect(
  ({
    employeeProfile: {
      editGeneral: { openPersonalInfo = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openPersonalInfo,
    generalDataOrigin,
    generalData,
  }),
)(PersonalInformation);
