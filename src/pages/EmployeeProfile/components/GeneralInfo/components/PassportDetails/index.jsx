import { Card, Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const PassportDetails = (props) => {
  const { isProfileOwner = false, permissions = {} } = props;

  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderComponent = isEditing ? <Edit handleCancel={handleCancel} /> : <View />;
  const editPassportPermission = permissions.editPassportAndVisa !== -1;
  const disabledFields = true; // temporarily disable fields

  const options = () => {
    return (
      !isEditing &&
      (!isProfileOwner || editPassportPermission) && (
        <CustomEditButton onClick={disabledFields ? null : () => setIsEditing(true)}>
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

export default connect()(PassportDetails);
