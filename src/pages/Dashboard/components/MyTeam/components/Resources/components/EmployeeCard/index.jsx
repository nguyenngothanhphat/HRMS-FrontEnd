import { Col } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const EmployeeCard = (props) => {
  const {
    employee: {
      generalInfo: { avatar = '', legalName = '', userId = '' } = {},
      title: { name: position = '' } = {},
    } = {},
  } = props;

  // FUNCTIONS
  const getColorClassName = () => {
    const min = Math.ceil(1);
    const max = Math.floor(4);
    const colorType = Math.floor(Math.random() * (max - min) + min);

    switch (colorType) {
      case 1:
        return styles.greenBorder;
      case 2:
        return styles.orangeBorder;
      case 3:
        return styles.grayBorder;
      default:
        return styles.grayBorder;
    }
  };

  const onViewProfileClick = () => {
    history.push(`/directory/employee-profile/${userId}/general-info`);
  };

  return (
    <Col xs={12} xl={8} className={styles.EmployeeCard} onClick={onViewProfileClick}>
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} className={getColorClassName()} alt="" />
        </div>
        <span className={styles.employeeName}>{legalName}</span>
        <span className={styles.employeeInformation}>
          {userId} | {position}
        </span>
      </div>
    </Col>
  );
};

export default connect(() => ({}))(EmployeeCard);
