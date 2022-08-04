import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tooltip } from 'antd';
import EditBtn from '@/assets/edit.svg';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    upload: { visa0URL = '', visa1URL = '' } = {},
    employeeProfile: {
      editGeneral: { openVisa = false },
      originData: { visaData: visaDataOrigin = [] } = {},
      tempData: { visaData = [] } = {},
    } = {},
  }) => ({
    openVisa,
    visaDataOrigin,
    visaData,
    visa0URL,
    visa1URL,
  }),
)
class VisaDetails extends PureComponent {
  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openVisa: true },
    });
  };

  handleCancel = () => {
    const { visaDataOrigin, dispatch } = this.props;
    const payloadVisa = [...visaDataOrigin];
    const isModified = JSON.stringify(payloadVisa) !== JSON.stringify(visaDataOrigin);

    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { visaData: visaDataOrigin },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openVisa: false },
    });
  };

  tooltipTitle = () => {
    return 'Temporarily Disabled - will be enabled shortly.';
  };

  render() {
    const { openVisa, isProfileOwner = false, permissions = {} } = this.props;
    const renderComponent = openVisa ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View />
      // <View dataAPI={passportData} />
    );
    const editVisaPermission = permissions.editPassportAndVisa !== -1;
    const disabledFields = true; // temporarily disable fields

    return (
      <div className={styles.VisaDetails}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Visa Details</p>
          {!openVisa && (!isProfileOwner || editVisaPermission) && (
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

export default VisaDetails;
