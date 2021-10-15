import React, { Component } from 'react';
import { Skeleton } from 'antd';
import { connect } from 'umi';
import EmployeeInformation from './components/EmployeeInformation';
import ProfessionalAcademicBackground from './components/ProfessionalAcademicBackground';
import PersonalInformation from './components/PersonalInformation';
import PassportDetails from './components/PassportDetails';
import VisaDetails from './components/VisaDetails';
import EmergencyContact from './components/EmergencyContactDetails';
import styles from './index.less';
import ModalAddInfo from '../ModalAddInfo/index';

@connect(
  ({
    loading,
    user: { currentUser: { employee: { _id: currentUserId = '' } = {} } = {}, permissions = {} },
    employeeProfile: {
      idCurrentEmployee,
      originData: { generalData: { isNewComer = false } = {} } = {},
    },
  }) => ({
    loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
    currentUserId,
    idCurrentEmployee,
    isNewComer,
    permissions,
  }),
)
class GeneralInfo extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     visible: false,
  //   };
  // }

  // onCancel = () => {
  //   this.setState({ visible: false });
  // };

  render() {
    const {
      loadingGeneral = false,
      permissions = {},
      profileOwner = false,
      currentUserId,
      idCurrentEmployee,
      isNewComer,
    } = this.props;
    const checkVisible = profileOwner || permissions.viewOtherInformation !== -1;
    const visible = isNewComer && currentUserId === idCurrentEmployee;
    // const visible = currentUserId === idCurrentEmployee;
    if (loadingGeneral)
      return (
        <div className={styles.viewLoading}>
          <Skeleton loading={loadingGeneral} active />
        </div>
      );
    return (
      <div className={styles.GeneralInfo}>
        <EmployeeInformation permissions={permissions} />
        <PersonalInformation permissions={permissions} profileOwner={profileOwner} />
        {(permissions.viewPassportAndVisa !== -1 || profileOwner) && (
          <>
            <PassportDetails profileOwner={profileOwner} />
            <VisaDetails profileOwner={profileOwner} />
          </>
        )}
        {checkVisible ? (
          <EmergencyContact permissions={permissions} profileOwner={profileOwner} />
        ) : (
          ''
        )}
        {checkVisible ? (
          <ProfessionalAcademicBackground permissions={permissions} profileOwner={profileOwner} />
        ) : (
          ''
        )}
        <ModalAddInfo visible={visible} />
      </div>
    );
  }
}

export default GeneralInfo;
