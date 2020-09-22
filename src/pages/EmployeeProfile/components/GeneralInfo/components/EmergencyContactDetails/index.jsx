import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { connect } from 'umi';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    generalDataOrigin,
    generalData,
  }),
)
class EmergencyContact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  handleEdit = () => {
    this.setState({
      isEdit: true,
    });
  };

  processDataChanges = () => {
    const { generalData: generalDataTemp } = this.props;
    const { emergencyContact = '', personName = '', relation = '', _id: id = '' } = generalDataTemp;
    const payloadChanges = {
      id,
      emergencyContact,
      personName,
      relation,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { generalData } = this.props;
    const newObj = { ...generalData };
    const listKey = ['emergencyContact', 'personName', 'relation'];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleSave = () => {
    const { dispatch } = this.props;
    const payload = this.processDataChanges() || {};
    const dataTempKept = this.processDataKept() || {};
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
    });
  };

  handleCancel = () => {
    const { generalDataOrigin, generalData, dispatch } = this.props;
    this.setState({
      isEdit: false,
    });
    const { emergencyContact = '', personName = '', relation = '' } = generalDataOrigin;
    const reverseFields = {
      emergencyContact,
      personName,
      relation,
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
  };

  render() {
    const { generalData, loading } = this.props;
    const { isEdit } = this.state;
    const renderComponent = isEdit ? <Edit /> : <View dataAPI={generalData} />;
    return (
      <div className={styles.EmergencyContact}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Emergency Contact Details</p>
          {isEdit ? (
            ''
          ) : (
            <div className={styles.flexEdit} onClick={this.handleEdit}>
              <EditFilled className={styles.IconEdit} />
              <p className={styles.Edit}>Edit</p>
            </div>
          )}
        </div>
        <div className={styles.viewBottom}>{renderComponent}</div>
        {isEdit ? (
          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={this.handleCancel}>
              Cancel
            </div>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.buttonFooter}
              loading={loading}
              onClick={this.handleSave}
            >
              Save
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default EmergencyContact;
