import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import ModalAddInfo from '../ModalAddInfo/index';
import EmergencyContact from './components/EmergencyContactDetails';
import EmployeeInformation from './components/EmployeeInformation';
import PassportDetails from './components/PassportDetails';
import PersonalInformation from './components/PersonalInformation';
import ProfessionalAcademicBackground from './components/ProfessionalAcademicBackground';
import VisaDetails from './components/VisaDetails';
import styles from './index.less';

const GeneralInfo = (props) => {
  const {
    permissions = {},
    currentUserId,
    dispatch,
    employeeProfile: {
      employee = '',
      originData: { generalData: { isNewComer = false } = {} } = {},
      visibleSuccess = false,
      isProfileOwner = false,
    } = {},
  } = props;

  const [newComerModalVisible, setNewComerModalVisible] = useState(false);

  const checkProfessionalAcademicVisible =
    isProfileOwner || permissions.editProfessionalAcademic !== -1;

  const checkEmergencyContactVisible = isProfileOwner || permissions.editEmergencyContact !== -1;

  useEffect(() => {
    setNewComerModalVisible(isNewComer && currentUserId === employee);
  }, [isNewComer]);

  const handleCancelModelSuccess = () => {
    dispatch({
      type: 'employeeProfile/save',
      payload: { visibleSuccess: false },
    });
  };

  useEffect(() => {
    if (employee) {
      dispatch({
        type: 'employeeProfile/fetchCountryList',
      });
      dispatch({
        type: 'employeeProfile/fetchPassPort',
        payload: { employee },
      });
      dispatch({
        type: 'employeeProfile/fetchVisa',
        payload: { employee },
      });
      dispatch({
        type: 'employeeProfile/fetchAdhaarCard',
        payload: { employee },
      });
      dispatch({
        type: 'employeeProfile/fetchListSkill',
      });
      dispatch({
        type: 'employeeProfile/fetchListTitle',
      });
    }
  }, [employee]);

  return (
    <div className={styles.GeneralInfo}>
      <EmployeeInformation permissions={permissions} />
      <PersonalInformation permissions={permissions} isProfileOwner={isProfileOwner} />
      {(permissions.viewPassportAndVisa !== -1 || isProfileOwner) && (
        <>
          <PassportDetails isProfileOwner={isProfileOwner} permissions={permissions} />
          <VisaDetails isProfileOwner={isProfileOwner} permissions={permissions} />
        </>
      )}
      {checkEmergencyContactVisible && (
        <EmergencyContact permissions={permissions} isProfileOwner={isProfileOwner} />
      )}
      {checkProfessionalAcademicVisible && (
        <ProfessionalAcademicBackground permissions={permissions} isProfileOwner={isProfileOwner} />
      )}
      <ModalAddInfo visible={newComerModalVisible} />
      <CommonModal
        width={550}
        visible={visibleSuccess}
        hasFooter={false}
        onClose={handleCancelModelSuccess}
        hasHeader={false}
        content={
          <>
            <div style={{ textAlign: 'center' }}>
              <img src={imageAddSuccess} alt="update success" />
            </div>
            <br />
            <br />
            <p style={{ textAlign: 'center', color: '#707177', fontWeight: 500 }}>
              Update information successfully
            </p>
            <div className={styles.spaceFooterModalSuccess}>
              <Button onClick={handleCancelModelSuccess} className={styles.btnOkModalSuccess}>
                Okay
              </Button>
            </div>
          </>
        }
      />
    </div>
  );
};

export default connect(
  ({
    user: { currentUser: { employee: { _id: currentUserId = '' } = {} } = {}, permissions = {} },
    employeeProfile,
  }) => ({
    currentUserId,
    employeeProfile,
    permissions,
  }),
)(GeneralInfo);
