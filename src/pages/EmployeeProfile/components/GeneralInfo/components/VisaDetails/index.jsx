import { Card, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const VisaDetails = (props) => {
  const { openVisa, isProfileOwner = false, permissions = {}, visaDataOrigin, dispatch } = props;

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openVisa: true },
    });
  };

  const handleCancel = () => {
    const payloadVisa = [...visaDataOrigin];
    const isModified = JSON.stringify(payloadVisa) !== JSON.stringify(visaDataOrigin);

    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { visaData: visaDataOrigin },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openVisa: false },
    });
  };

  const renderComponent = openVisa ? <Edit handleCancel={handleCancel} /> : <View />;
  const editVisaPermission = permissions.editPassportAndVisa !== -1;
  const disabledFields = true; // temporarily disable fields

  const options = () => {
    return (
      !openVisa &&
      (!isProfileOwner || editVisaPermission) && (
        <CustomEditButton onClick={disabledFields ? null : handleEdit}>
          <Tooltip placement="topLeft" title="Temporarily Disabled - will be enabled shortly.">
            Edit
          </Tooltip>
        </CustomEditButton>
      )
    );
  };

  return (
    <Card className={styles.VisaDetails} title="Visa Details" extra={options()}>
      <div className={styles.container}>{renderComponent}</div>
    </Card>
  );
};

export default connect(
  ({
    upload: { visa0URL = '', visa1URL = '' } = {},
    employeeProfile: {
      editGeneral: { openVisa = false },
      originData: { visaData: visaDataOrigin = [] } = {},
      tempData: { visaData = [] } = {},
    } = {},
  }) => ({
    openVisa,
    visaDataOrigin,
    visaData,
    visa0URL,
    visa1URL,
  }),
)(VisaDetails);
