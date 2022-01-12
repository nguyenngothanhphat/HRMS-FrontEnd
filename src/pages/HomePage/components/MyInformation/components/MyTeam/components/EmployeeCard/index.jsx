import { Col } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const EmployeeCard = (props) => {
  const {
    employee: {
      generalInfo: { avatar = '', legalName = '', userId = '' } = {},
      title = {} || {},
    } = {},
    isMySelf = false,
  } = props;

  const onViewProfileClick = () => {
    history.push(`/directory/employee-profile/${userId}/general-info`);
  };

  return (
    <Col
      span={24}
      className={styles.EmployeeCard}
      style={isMySelf ? { borderColor: '#2C6DF9' } : null}
      onClick={onViewProfileClick}
    >
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span
            className={styles.name}
            style={isMySelf ? { color: '#2C6DF9', fontWeight: 500 } : null}
          >
            {legalName}
          </span>
          <span className={styles.title}>{title?.name}</span>
        </div>
      </div>
    </Col>
  );
};

export default connect(() => ({}))(EmployeeCard);
