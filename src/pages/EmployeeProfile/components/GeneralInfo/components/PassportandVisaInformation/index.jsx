import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { connect } from 'umi';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    upload: { passPortURL = '', visa0URL = '', visa1URL = '' } = {},
    employeeProfile: {
      editGeneral: { openPassportandVisa = false },
      originData: { passportData: passportDataOrigin = {}, visaData: visaDataOrigin = [] } = {},
      tempData: { passportData = {}, visaData = [] } = {},
    } = {},
  }) => ({
    openPassportandVisa,
    passportDataOrigin,
    passportData,
    visaDataOrigin,
    visaData,
    passPortURL,
    visa0URL,
    visa1URL,
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
    const { passportDataOrigin, passportData, visaDataOrigin, dispatch } = this.props;
    const {
      passportNumber = '',
      passportIssuedCountry = '',
      passportIssuedOn = '',
      passportValidTill = '',
    } = passportDataOrigin;
    const reverseFields = {
      passportNumber,
      passportIssuedCountry,
      passportIssuedOn,
      passportValidTill,
    };
    const payloadVisa = [...visaDataOrigin];
    const payloadPassPort = { ...passportData, ...reverseFields };
    const isModified =
      JSON.stringify(payloadPassPort) !== JSON.stringify(passportDataOrigin) ||
      JSON.stringify(payloadVisa) !== JSON.stringify(visaDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: payloadPassPort },
    });
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { visaData: payloadVisa },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPassportandVisa: false },
    });
    dispatch({
      type: 'upload/cancelUpload',
      payload: { passPortURL: '', visa0URL: '', visa1URL: '' },
    });
  };

  render() {
    const { passportData, openPassportandVisa } = this.props;
    const renderComponent = openPassportandVisa ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View dataAPI={passportData} />
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
