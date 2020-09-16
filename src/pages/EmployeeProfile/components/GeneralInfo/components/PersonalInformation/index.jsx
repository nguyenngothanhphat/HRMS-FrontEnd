import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';
import Edit from './components/Edit';
import View from './components/View';

class PersonalInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  handleEdit = () => {
    // console.log('click ne');
    // this.setState({
    //   isEdit: true,
    // });
  };

  render() {
    // const { dataAPI = {} } = this.props;
    // console.log('generalData', dataAPI);
    const { isEdit } = this.state;
    const renderComponent = isEdit ? <Edit /> : <View />;
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
      </div>
    );
  }
}

export default PersonalInformation;
