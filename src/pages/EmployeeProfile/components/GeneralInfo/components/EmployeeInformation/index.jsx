/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import EditBtn from '@/assets/edit.svg';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
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
)
class EmployeeInformation extends PureComponent {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/closeModeEdit',
    });
  }

  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openEmployeeInfo: true },
    });
  };

  handleCancel = () => {
    const { generalDataOrigin, generalData, dispatch } = this.props;
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

  render() {
    const {
      // employmentData,
      generalData,
      openEmployeeInfo,
      permissions = {},
      taxData = {},
      bankData = {},
    } = this.props;
    const renderComponent = openEmployeeInfo ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View dataAPI={generalData} taxData={taxData} bankData={bankData} />
    );
    return (
      <div className={styles.EmployeeInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Employee Information</p>
          {openEmployeeInfo
            ? ''
            : permissions.editEmployeeInfo !== -1 && (
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

export default EmployeeInformation;
