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
      originData: { passportData: passportDataOrigin = {} } = {},
      tempData: { passportData = {} } = {},
    } = {},
  }) => ({
    openPassportandVisa,
    passportDataOrigin,
    passportData,
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
    const { passportDataOrigin, passportData, dispatch } = this.props;
    const { number = '', issuedCountry = '', issuedOn = '', validTill = '' } = passportDataOrigin;
    const reverseFields = {
      number,
      issuedCountry,
      issuedOn,
      validTill,
    };
    const payload = { ...passportData, ...reverseFields };
    const isModified = JSON.stringify(payload) !== JSON.stringify(passportDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { passportData: payload },
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
