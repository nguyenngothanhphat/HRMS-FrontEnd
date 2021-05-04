import React, { PureComponent } from 'react';
import { EditFilled } from '@ant-design/icons';
import { Row, Col } from 'antd';

import styles from './index.less';

class ViewProfile extends PureComponent {
  render() {
    const {
      handleClickEdit = () => {},
      currentUser: { email = '', firstName = '', signInRole = [], password = '' } = {},
    } = this.props;

    const formatPassword = () => {
      const arr = password.split('');
      const string = [];
      arr.map((item) => {
        string.push('*');
      });
      const newPassword = string.join().replace(/,/g, '');
      return newPassword;
    };

    formatPassword();

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>User Information</div>
          <div className={styles.header__icon} onClick={() => handleClickEdit(true)}>
            <EditFilled /> <span>Edit</span>
          </div>
        </div>
        <div className={styles.userInfo}>
          <Row gutter={[0, 16]} className={styles.rootView}>
            <Col span={6} className={styles.textLabel}>
              Name
            </Col>
            <Col span={18} className={styles.textValue}>
              {firstName}
            </Col>
            <Col span={6} className={styles.textLabel}>
              Email
            </Col>
            <Col span={18} className={styles.textValue}>
              {email}
            </Col>
            <Col span={6} className={styles.textLabel}>
              Password
            </Col>
            <Col span={18} className={styles.textValue}>
              {formatPassword()}
            </Col>
            <Col span={6} className={styles.textLabel}>
              Role
            </Col>
            <Col span={18} className={styles.textValue}>
              {signInRole.join()}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ViewProfile;
