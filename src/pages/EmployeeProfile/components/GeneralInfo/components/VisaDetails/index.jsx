import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { connect } from 'umi';
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

  render() {
    const { openVisa } = this.props;
    const renderComponent = openVisa ? (
      <Edit handleCancel={this.handleCancel} />
    ) : (
      <View />
      // <View dataAPI={passportData} />
    );
    return (
      <div className={styles.VisaDetails}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Visa Details</p>
          {openVisa ? (
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

export default VisaDetails;
