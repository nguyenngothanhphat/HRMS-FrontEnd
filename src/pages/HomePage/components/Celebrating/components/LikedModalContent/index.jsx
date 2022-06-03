import React from 'react';
import { connect, history } from 'umi';
import styles from './index.less';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import EmptyComponent from '@/components/Empty';

const LikedModalContent = (props) => {
  const { list = [], currentUser: { employee = {} } = {} } = props;

  // functions
  const onViewProfileClick = (userId) => {
    if (userId) {
      history.push(`/directory/employee-profile/${userId}/general-info`);
    }
  };

  const renderUser = (user) => {
    const { legalName = '', avatar = '', userId = '' } = user?.generalInfoInfo || {};
    const { name: titleName = '' } = user?.titleInfo || {};
    const { _id = '' } = user || {};
    const isMe = _id === employee?._id;

    return (
      <div className={styles.user}>
        <div className={styles.avatar}>
          <img src={avatar || MockAvatar} alt="" />
        </div>
        <div className={styles.information}>
          <span
            className={`${styles.name} ${isMe ? styles.isMe : null}`}
            onClick={() => onViewProfileClick(userId)}
          >
            {legalName}
          </span>
          <span className={styles.title}>{titleName}</span>
        </div>
      </div>
    );
  };

  if (list.length === 0) return <EmptyComponent />;

  return <div className={styles.LikedModalContent}>{list.map((x) => renderUser(x))}</div>;
};
export default connect(({ user: { currentUser } = {} }) => ({
  currentUser,
}))(LikedModalContent);
