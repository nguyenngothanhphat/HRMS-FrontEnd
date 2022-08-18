/* eslint-disable react/jsx-indent */
import { Card } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import CustomEditButton from '@/components/CustomEditButton';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

const EmployeeInformation = (props) => {
  const {
    // employmentData,
    generalData,
    openEmployeeInfo,
    permissions = {},
    taxData = {},
    bankData = {},
    generalDataOrigin,
    dispatch,
  } = props;

  useEffect(() => {
    return () => {
      dispatch({
        type: 'employeeProfile/closeModeEdit',
      });
    };
  }, []);

  const handleEdit = () => {
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openEmployeeInfo: true },
    });
  };

  const handleCancel = () => {
    const {
      legalGender = '',
      legalName = '',
      DOB = '',
      employeeId = '',
      workEmail = '',
      workNumber = '',
      adhaarCardNumber = '',
      uanNumber = '',
    } = generalDataOrigin;
    const reverseFields = {
      legalGender,
      legalName,
      DOB,
      employeeId,
      workEmail,
      workNumber,
      adhaarCardNumber,
      uanNumber,
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
      payload: { openEmployeeInfo: false },
    });
    dispatch({
      type: 'upload/cancelUpload',
      payload: { employeeInformationURL: '' },
    });
  };

  const options = () => {
    return openEmployeeInfo
      ? ''
      : permissions.editEmployeeInfo !== -1 && (
          <CustomEditButton onClick={handleEdit}>Edit</CustomEditButton>
        );
  };

  const renderComponent = openEmployeeInfo ? (
    <Edit handleCancel={handleCancel} />
  ) : (
    <View dataAPI={generalData} taxData={taxData} bankData={bankData} />
  );
  return (
    <Card className={styles.EmployeeInformation} title="Employee Information" extra={options()}>
      <div className={styles.container}>{renderComponent}</div>
    </Card>
  );
};

export default connect(
  ({
    upload: { employeeInformationURL = '' } = {},
    employeeProfile: {
      editGeneral: { openEmployeeInfo = false },
      originData: { generalData: generalDataOrigin = {}, taxData = {}, bankData = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openEmployeeInfo,
    generalDataOrigin,
    generalData,
    employeeInformationURL,
    taxData,
    bankData,
  }),
)(EmployeeInformation);
