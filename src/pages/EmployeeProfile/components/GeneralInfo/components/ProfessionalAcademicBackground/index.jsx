import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import View from './components/View';
import Edit from './components/Edit';
import styles from './index.less';

class ProfessionalAcademicBackground extends PureComponent {
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

  render() {
    const { isEdit } = this.state;
    const renderComponent = isEdit ? <Edit /> : <View />;
    return (
      <div className={styles.root}>
        <div className={styles.viewTitle}>
          <p className={styles.viewTitle__text}>Professional &amp; Academic Background</p>
          <div className={styles.viewTitle__edit} onClick={this.handleEdit}>
            <EditFilled className={styles.viewTitle__edit__icon} />
            <p className={styles.viewTitle__edit__text}>Edit</p>
          </div>
        </div>
        <div className={styles.viewBottom}>{renderComponent}</div>
      </div>
    );
  }
}

export default ProfessionalAcademicBackground;
