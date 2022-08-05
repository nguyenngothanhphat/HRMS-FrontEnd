import { Card } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const ProfessionalAcademicBackground = (props) => {
  const { openAcademic, permissions = {}, isProfileOwner = false } = props;
  const { generalDataOrigin, generalData, dispatch } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openAcademic: true },
    });
  };

  const handleCancel = () => {
    const {
      preJobTitle = '',
      skills = [],
      preCompany = '',
      pastExp = 0,
      totalExp = 0,
      qualification = '',
      certification = [],
      linkedIn = '',
    } = generalDataOrigin;
    const reverseFields = {
      preJobTitle,
      skills,
      preCompany,
      pastExp,
      totalExp,
      qualification,
      certification,
      linkedIn,
    };
    const payload = { ...generalData, ...reverseFields };
    const isModified = JSON.stringify(payload) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: payload },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openAcademic: false },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  const options = () => {
    return (
      !openAcademic &&
      (permissions.editProfessionalAcademic !== -1 || isProfileOwner) && (
        <CustomEditButton onClick={handleEdit}>Edit</CustomEditButton>
      )
    );
  };

  const renderComponent = openAcademic ? (
    <Edit isProfileOwner={isProfileOwner} handleCancel={handleCancel} />
  ) : (
    <View />
  );
  return (
    <Card
      className={styles.ProfessionalAcademicBackground}
      title="Professional &amp; Academic Background"
      extra={options()}
    >
      <div className={styles.container}>{renderComponent}</div>
    </Card>
  );
};

export default connect(
  ({
    employeeProfile: {
      editGeneral: { openAcademic = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    generalDataOrigin,
    generalData,
    openAcademic,
  }),
)(ProfessionalAcademicBackground);
