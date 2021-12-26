/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { connect } from 'umi';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    upload: { employeeInformationURL = '' } = {},
    employeeProfile: {
      editGeneral: { openEmployeeInfor = false },
      originData: { generalData: generalDataOrigin = {},  taxData = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openEmployeeInfor,
    generalDataOrigin,
    generalData,
    employeeInformationURL,
    taxData
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
      payload: { openEmployeeInfor: true },
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
      payload: { openEmployeeInfor: false },
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
      openEmployeeInfor,
      permissions = {},
      taxData = {}
    } = this.props;
    const renderComponent = openEmployeeInfor ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View dataAPI={generalData} taxData={taxData} />
    );
    return (
      <div className={styles.EmployeeInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Employee Information</p>
          {openEmployeeInfor
            ? ''
            : permissions.editEmployeeInfo !== -1 && (
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

export default EmployeeInformation;
