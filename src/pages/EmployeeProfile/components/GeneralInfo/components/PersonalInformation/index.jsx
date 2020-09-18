import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import Edit from './components/Edit';
import View from './components/View';

@connect(({ loading, employeeProfile }) => ({
  loadingGeneral: loading.effects['employeeProfile/fetchGeneralInfo'],
  employeeProfile,
}))
class PersonalInformation extends PureComponent {
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

  handleCancel = () => {
    this.setState({
      isEdit: false,
    });
  };

  render() {
    const {
      employeeProfile: { tempData: { generalData = {} } = {} },
    } = this.props;
    const { isEdit } = this.state;
    const renderComponent = isEdit ? <Edit /> : <View dataAPI={generalData} />;
    return (
      <div className={styles.PersonalInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Personal Information</p>
          <div className={styles.flexEdit} onClick={this.handleEdit}>
            <EditFilled className={styles.IconEdit} />
            <p className={styles.Edit}>Edit</p>
          </div>
        </div>
        <div className={styles.viewBottom}>{renderComponent}</div>
        {isEdit ? (
          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter} onClick={this.handleCancel}>
              Cancel
            </div>
            <Button className={styles.buttonFooter}>Save</Button>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default PersonalInformation;
