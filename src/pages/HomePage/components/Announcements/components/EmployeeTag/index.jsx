import moment from 'moment';
import React from 'react';
import { connect, history } from 'umi';
import { dateFormat } from '@/utils/homePage';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import styles from './index.less';

const EmployeeTag = (props) => {
  const {
    employee: {
      generalInfoInfo: { avatar = '', legalName = '', userId = '', website = '' } = {} || {},
      titleInfo = {} || {},
    } = {} || {},
    createDate,
  } = props;

  const onViewProfileClick = () => {
    if (website) {
      window.open(website, '_blank');
    } else if (userId) {
      history.push(`/directory/employee-profile/${userId}`);
    }
  };

  const Timestamp = () => {
    const date = moment(createDate).locale('en').format(dateFormat);
    return <span className={styles.timestamp}>{date}</span>;
  };

  return (
    <div className={styles.EmployeeTag} onClick={onViewProfileClick}>
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img
            src={avatar || DefaultAvatar}
            alt=""
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>{legalName}</span>
          <span className={styles.title}>{titleInfo?.name}</span>
          <Timestamp />
        </div>
      </div>
    </div>
  );
};

export default connect(() => ({}))(EmployeeTag);
