/* eslint-disable react/jsx-indent */
import { Card } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const EmergencyContact = (props) => {
  const {
    isProfileOwner = false,
    employeeProfile: { employmentData = {} } = {},
    user: { permissions = {} } = {},
  } = props;

  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const options = () => {
    return (
      !isEditing &&
      (permissions.editEmergencyContact !== -1 || isProfileOwner) && (
        <CustomEditButton onClick={() => setIsEditing(true)}>Edit</CustomEditButton>
      )
    );
  };

  return (
    <Card className={styles.EmergencyContact} title="Emergency Contact Details" extra={options()}>
      <div className={styles.container}>
        {isEditing ? (
          <Edit handleCancel={handleCancel} dataAPI={employmentData.generalInfo} />
        ) : (
          <View dataAPI={employmentData.generalInfo} />
        )}
      </div>
    </Card>
  );
};

export default connect(({ employeeProfile = {}, user }) => ({
  employeeProfile,
  user,
}))(EmergencyContact);
