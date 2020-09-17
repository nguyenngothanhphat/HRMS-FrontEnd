import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

class EmployeeInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  handleEdit = () => {
    // console.log('click ne');
    this.setState({
      isEdit: true,
    });
  };

  render() {
    // const { dataAPI = {} } = this.props;
    // console.log('generalData', dataAPI);
    const { isEdit } = this.state;
    const renderComponent = isEdit ? <Edit /> : <View />;
    return (
      <div className={styles.EmployeeInformation}>
        <div className={styles.spaceTitle}>
          <p className={styles.EmployeeTitle}>Employee Information</p>
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

export default EmployeeInformation;
