import moment from 'moment';
import React from 'react';
import { connect, history } from 'umi';
import { DATE_FORMAT } from '@/constants/homePage';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import styles from './index.less';

const EmployeeTag = (props) => {
  const {
    employee: {
      generalInfoInfo: { avatar = '', legalName = '', userId = '', website = '' } = {} || {},
      titleInfo = {} || {},
    } = {} || {},
    createDate,
    postAsCompany = false,
    company: { name: companyName = '', logoUrl = '' } = {},
  } = props;

  const onViewProfileClick = () => {
    if (website) {
      window.open(website, '_blank');
    } else if (userId) {
      history.push(`/directory/employee-profile/${userId}`);
    }
  };

  const Timestamp = () => {
    const date = moment(createDate).locale('en').format(DATE_FORMAT);
    return <span className={styles.timestamp}>{date}</span>;
  };

  return (
    <div className={styles.EmployeeTag} onClick={!postAsCompany ? onViewProfileClick : () => {}}>
      <div className={styles.container}>
        <div className={styles.avatar}>
          <img
            src={postAsCompany ? logoUrl : avatar || DefaultAvatar}
            alt=""
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
        <div className={styles.information}>
          <span className={styles.name}>{postAsCompany ? companyName : legalName}</span>
          <span className={styles.title}>{postAsCompany ? '' : titleInfo?.name}</span>
          <Timestamp />
        </div>
      </div>
    </div>
  );
};

export default connect(() => ({}))(EmployeeTag);
