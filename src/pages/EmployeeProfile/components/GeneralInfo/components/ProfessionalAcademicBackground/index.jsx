import { Card } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const ProfessionalAcademicBackground = (props) => {
  const { permissions = {}, isProfileOwner = false } = props;

  const [isEditing, setIsEditing] = useState(false);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const options = () => {
    return (
      !isEditing &&
      (permissions.editProfessionalAcademic !== -1 || isProfileOwner) && (
        <CustomEditButton onClick={() => setIsEditing(true)}>Edit</CustomEditButton>
      )
    );
  };

  return (
    <Card
      className={styles.ProfessionalAcademicBackground}
      title="Professional &amp; Academic Background"
      extra={options()}
    >
      <div className={styles.container}>
        {isEditing ? (
          <Edit isProfileOwner={isProfileOwner} handleCancel={handleCancel} />
        ) : (
          <View />
        )}
      </div>
    </Card>
  );
};

export default connect()(ProfessionalAcademicBackground);
