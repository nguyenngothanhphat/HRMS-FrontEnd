import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './index.less';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { handleCancel = () => {} } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>User Infomation</div>
        </div>
        <div className={styles.userInfo}>
          <Button onClick={() => handleCancel(false)}>Cancel</Button>
        </div>
      </div>
    );
  }
}

export default EditProfile;
