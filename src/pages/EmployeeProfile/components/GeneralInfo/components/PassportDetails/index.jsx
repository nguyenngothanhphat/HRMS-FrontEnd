import React, { PureComponent } from 'react';
import { connect } from 'umi';
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

  render() {
    const { openPassport, profileOwner = false } = this.props;
    const renderComponent = openPassport ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View />
      // <View dataAPI={passportData} />
    );
    return (
      <div className={styles.PassportDetails}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Passport Details</p>
          {openPassport
            ? ''
            : !profileOwner && (
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

export default PassportDetails;
