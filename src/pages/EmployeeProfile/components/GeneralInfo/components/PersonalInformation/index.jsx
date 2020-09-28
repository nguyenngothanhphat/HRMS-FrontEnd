import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';
import Edit from './components/Edit';
import View from './components/View';

@connect(
  ({
    employeeProfile: {
      editGeneral: { openPersonnalInfor = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openPersonnalInfor,
    generalDataOrigin,
    generalData,
  }),
)
class PersonalInformation extends PureComponent {
  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openPersonnalInfor: true },
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
      payload: { openPersonnalInfor: false },
    });
  };

  render() {
    const { generalData, openPersonnalInfor } = this.props;
    const renderComponent = openPersonnalInfor ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View dataAPI={generalData} />
    );
    return (
      <div className={styles.PersonalInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Personal Information</p>
          {openPersonnalInfor ? (
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

export default PersonalInformation;
