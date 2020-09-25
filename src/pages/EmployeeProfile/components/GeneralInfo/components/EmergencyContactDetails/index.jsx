import React, { Component } from 'react';
import { EditFilled } from '@ant-design/icons';
import { connect } from 'umi';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

@connect(
  ({
    employeeProfile: {
      editGeneral: { openContactDetails = false },
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
    } = {},
  }) => ({
    openContactDetails,
    generalDataOrigin,
    generalData,
  }),
)
class EmergencyContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
    this.editRef = React.createRef();
  }

  handleEdit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveOpenEdit',
      payload: { openContactDetails: true },
    });
    // this.setState({
    //   isEdit: true,
    // });
  };

  handleCancel = () => {
    const { generalDataOrigin, generalData, dispatch } = this.props;
    // this.setState({
    //   isEdit: false,
    // });
    const {
      emergencyContact = '',
      emergencyPersonName = '',
      emergencyRelation = '',
    } = generalDataOrigin;
    const reverseFields = {
      emergencyContact,
      emergencyPersonName,
      emergencyRelation,
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
      payload: { openContactDetails: false },
    });
  };

  render() {
    const { generalData, openContactDetails } = this.props;
    const { isEdit } = this.state;
    const renderComponent = openContactDetails ? (
      <Edit refForm={this.editRef} handleCancel={this.handleCancel} />
    ) : (
      <View dataAPI={generalData} />
    );
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
      </div>
    );
  }
}

export default EmergencyContact;
