import { Button, Skeleton } from 'antd';
import React, { Component } from 'react';
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

@connect(
  ({
    loading,
    user: { currentUser: { employee: { _id: currentUserId = '' } = {} } = {}, permissions = {} },
    employeeProfile: {
      idCurrentEmployee,
      originData: { generalData: { isNewComer = false } = {} } = {},
      visibleSuccess = false,
    },
  }) => ({
    loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
    currentUserId,
    visibleSuccess,
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

  handleCancelModelSuccess = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/save',
      payload: { visibleSuccess: false },
    });
  };

  render() {
    const {
      loadingGeneral = false,
      permissions = {},
      profileOwner = false,
      currentUserId,
      idCurrentEmployee,
      isNewComer,
      visibleSuccess,
    } = this.props;
    const checkOtherInformationVisible = profileOwner || permissions.viewOtherInformation !== -1;
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
            <PassportDetails profileOwner={profileOwner} permissions={permissions} />
            <VisaDetails profileOwner={profileOwner} permissions={permissions} />
          </>
        )}
        {checkOtherInformationVisible && (
          <EmergencyContact permissions={permissions} profileOwner={profileOwner} />
        )}
        {checkOtherInformationVisible && (
          <ProfessionalAcademicBackground permissions={permissions} profileOwner={profileOwner} />
        )}
        <ModalAddInfo visible={visible} />
        <CommonModal
          visible={visibleSuccess}
          hasFooter={false}
          onClose={this.handleCancelModelSuccess}
          onFinish={this.handleCancelModelSuccess}
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
                <Button
                  onClick={this.handleCancelModelSuccess}
                  className={styles.btnOkModalSuccess}
                >
                  Okay
                </Button>
              </div>
            </>
          }
        />
      </div>
    );
  }
}

export default GeneralInfo;
