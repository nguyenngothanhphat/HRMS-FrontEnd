import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tooltip } from 'antd';
import EditBtn from '@/assets/edit.svg';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    upload: { passPortURL = '' } = {},
    employeeProfile: {
      editGeneral: { openPassport = false },
      originData: { passportData: passportDataOrigin = [] } = {},
      tempData: { passportData = [] } = {},
    } = {},
  }) => ({
    openPassport,
    passportDataOrigin,
    passportData,
    passPortURL,
  }),
)
class PassportDetails extends PureComponent {
  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPassport: true },
    });
  };

  handleCancel = () => {
    const { passportDataOrigin, passportData, dispatch } = this.props;
    const {
      urlFile = '',
      passportNumber = '',
      passportIssuedCountry = '',
      passportIssuedOn = '',
      passportValidTill = '',
    } = passportDataOrigin;
    const reverseFields = {
      urlFile,
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
    };
    const payloadPassPort = { ...passportData, ...reverseFields };
    const isModified = JSON.stringify(payloadPassPort) !== JSON.stringify(passportDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: passportDataOrigin },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPassport: false },
    });
  };

  tooltipTitle = () => {
    return 'Temporarily Disabled - will be enabled shortly.';
  };

  render() {
    const { openPassport, isProfileOwner = false, permissions = {} } = this.props;
    const renderComponent = openPassport ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View />
      // <View dataAPI={passportData} />
    );
    const editPassportPermission = permissions.editPassportAndVisa !== -1;
    const disabledFields = true; // temporarily disable fields

    return (
      <div className={styles.PassportDetails}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Passport Details</p>
          {!openPassport && (!isProfileOwner || editPassportPermission) && (
            <div onClick={disabledFields ? null : this.handleEdit}>
              <Tooltip className={styles.flexEdit} placement="topLeft" title={this.tooltipTitle()}>
                <img src={EditBtn} alt="" className={styles.IconEdit} />
                <p className={styles.Edit}>Edit</p>
              </Tooltip>
            </div>
          )}
        </div>
        <div className={styles.viewBottom}>{renderComponent}</div>
      </div>
    );
  }
}

export default PassportDetails;
