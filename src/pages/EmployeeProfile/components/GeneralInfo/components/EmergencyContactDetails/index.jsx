/* eslint-disable react/jsx-indent */
import { Card } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const EmergencyContact = (props) => {
  const {
    generalData,
    openContactDetails,
    permissions = {},
    isProfileOwner = false,
    generalDataOrigin,
    dispatch,
  } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openContactDetails: true },
    });
  };

  const handleCancel = () => {
    const { emergencyContactDetails = [] } = generalDataOrigin;
    const reverseFields = { emergencyContactDetails };
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
      payload: { openContactDetails: false },
    });
  };

  const options = () => {
    return openContactDetails
      ? ''
      : (permissions.editEmergencyContact !== -1 || isProfileOwner) && (
          <CustomEditButton onClick={handleEdit}>Edit</CustomEditButton>
        );
  };

  const renderComponent = openContactDetails ? (
    <Edit handleCancel={handleCancel} />
  ) : (
    <View dataAPI={generalData} />
  );

  return (
    <Card className={styles.EmergencyContact} title="Emergency Contact Details" extra={options()}>
      <div className={styles.container}>{renderComponent}</div>
    </Card>
  );
};

export default connect(
  ({
    employeeProfile: {
      editGeneral: { openContactDetails = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openContactDetails,
    generalDataOrigin,
    generalData,
  }),
)(EmergencyContact);
