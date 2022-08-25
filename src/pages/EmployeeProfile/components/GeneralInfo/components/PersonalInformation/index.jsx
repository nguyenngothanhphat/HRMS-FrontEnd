/* eslint-disable react/jsx-indent */
import { Card } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const PersonalInformation = (props) => {
  const { employeeProfile: { employmentData = {} } = {}, permissions = {}, isProfileOwner } = props;

  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const options = () => {
    return (
      !isEditing &&
      (permissions.editPersonalInfo !== -1 || isProfileOwner) && (
        <CustomEditButton onClick={() => setIsEditing(true)}>Edit</CustomEditButton>
      )
    );
  };

  return (
    <Card className={styles.PersonalInformation} title="Personal Information" extra={options()}>
      <div className={styles.container}>
        {isEditing ? (
          <Edit handleCancel={handleCancel} isProfileOwner={isProfileOwner} />
        ) : (
          <View
            dataAPI={employmentData.generalInfo}
            permissions={permissions}
            isProfileOwner={isProfileOwner}
          />
        )}
      </div>
    </Card>
  );
};

export default connect(({ employeeProfile }) => ({
  employeeProfile,
}))(PersonalInformation);
