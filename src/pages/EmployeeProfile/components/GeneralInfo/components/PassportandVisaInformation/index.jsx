import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { connect } from 'umi';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    employeeProfile: {
      editGeneral: { openPassportandVisa = false },
      originData: { passportvisaData: passportvisaDataOrigin = {} } = {},
      tempData: { passportvisaData = {} } = {},
    } = {},
  }) => ({
    openPassportandVisa,
    passportvisaDataOrigin,
    passportvisaData,
  }),
)
class PassportVisaInformation extends PureComponent {
  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPassportandVisa: true },
    });
  };

  handleCancel = () => {
    const { passportvisaDataOrigin, passportvisaData, dispatch } = this.props;
    const {
      number = '',
      issuedCountry = '',
      issuedOn = '',
      validTill = '',
      // visaNo = '',
      // visaType = '',
      // visaCountry = '',
      // visaEntryType = '',
      // visaIssuedOn = '',
      // visaValidTill = '',
    } = passportvisaDataOrigin;
    const reverseFields = {
      number,
      issuedCountry,
      issuedOn,
      validTill,
      // visaNo,
      // visaType,
      // visaCountry,
      // visaEntryType,
      // visaIssuedOn,
      // visaValidTill,
    };
    const payload = { ...passportvisaData, ...reverseFields };
    const isModified = JSON.stringify(payload) !== JSON.stringify(passportvisaDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportvisaData: payload },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPassportandVisa: false },
    });
  };

  render() {
    const { passportvisaData, openPassportandVisa } = this.props;
    const renderComponent = openPassportandVisa ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View dataAPI={passportvisaData} />
    );
    return (
      <div className={styles.PassportVisaInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Passport and Visa Information</p>
          {openPassportandVisa ? (
            ''
          ) : (
            <div className={styles.flexEdit} onClick={this.handleEdit}>
              <EditFilled className={styles.IconEdit} />
              <p className={styles.Edit}>Edit</p>
            </div>
          )}
        </div>
        <div className={styles.viewBottom}>{renderComponent}</div>
      </div>
    );
  }
}

export default PassportVisaInformation;
