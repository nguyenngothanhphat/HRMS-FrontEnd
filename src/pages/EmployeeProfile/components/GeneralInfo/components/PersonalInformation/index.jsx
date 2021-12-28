/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import EditBtn from '@/assets/edit.svg';
import styles from './index.less';
import Edit from './components/Edit';
import View from './components/View';

@connect(
  ({
    employeeProfile: {
      editGeneral: { openPersonalInfo = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openPersonalInfo,
    generalDataOrigin,
    generalData,
  }),
)
class PersonalInformation extends PureComponent {
  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPersonalInfo: true },
    });
  };

  handleCancel = () => {
    const { generalDataOrigin, generalData, dispatch } = this.props;
    const {
      personalNumber = '',
      personalEmail = '',
      Blood = '',
      maritalStatus = '',
      linkedIn = '',
      residentAddress = '',
      currentAddress = '',
    } = generalDataOrigin;
    const reverseFields = {
      personalNumber,
      personalEmail,
      Blood,
      maritalStatus,
      linkedIn,
      residentAddress,
      currentAddress,
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
      payload: { openPersonalInfo: false },
    });
  };

  render() {
    const { generalData, openPersonalInfo, permissions = {}, profileOwner } = this.props;
    const renderComponent = openPersonalInfo ? (
      <Edit handleCancel={this.handleCancel} profileOwner={profileOwner} />
    ) : (
      <View dataAPI={generalData} permissions={permissions} profileOwner={profileOwner} />
    );
    return (
      <div className={styles.PersonalInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Personal Information</p>
          {openPersonalInfo
            ? ''
            : (permissions.editPersonalInfo !== -1 || profileOwner) && (
                <div className={styles.flexEdit} onClick={this.handleEdit}>
                  <img src={EditBtn} alt="" className={styles.IconEdit} />
                  <p className={styles.Edit}>Edit</p>
                </div>
              )}
        </div>
        <div className={styles.viewBottom}>{renderComponent}</div>
      </div>
    );
  }
}

export default PersonalInformation;
