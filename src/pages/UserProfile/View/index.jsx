import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';

import styles from './index.less';

class ViewProfile extends PureComponent {
  render() {
    const { handleClickEdit = () => {} } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>User Infomation</div>
          <div className={styles.header__icon} onClick={() => handleClickEdit(true)}>
            <EditFilled /> <span>Edit</span>
          </div>
        </div>
        <div className={styles.userInfo}>View</div>
      </div>
    );
  }
}

export default ViewProfile;
