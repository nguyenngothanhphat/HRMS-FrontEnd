import { Col } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const EmployeeTag = (props) => {
  const {
    employee: {
      generalInfoInfo: { avatar = '', legalName = '', userId = '', website = '' } = {} || {},
      titleInfo = {} || {},
    } = {} || {},
  } = props;

  const onViewProfileClick = () => {
    if (website) {
      window.open(website, '_blank');
    } else if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  return (
    <Col span={24} className={styles.EmployeeTag} onClick={onViewProfileClick}>
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>{legalName}</span>
          <span className={styles.title}>{titleInfo?.name}</span>
        </div>
      </div>
    </Col>
  );
};

export default connect(() => ({}))(EmployeeTag);
