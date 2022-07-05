import { Spin, Button } from 'antd';
import React from 'react';
import { connect, history } from 'umi';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import EmptyComponent from '@/components/Empty';
import MockAvatar from '@/assets/dashboard/mockAvatar.jpg';
import styles from './index.less';

const PostLikedModalContent = (props) => {
  const {
    list = [],
    currentUser: { employee = {} } = {},
    loading = false,
    total = 0,
    loadMore = () => {},
  } = props;

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

  const renderShowMoreBtn = () => {
    const showMore = list.length < total;
    if (!showMore) return null;
    return (
      <div className={styles.loadMore}>
        <Button onClick={() => loadMore()}>
          Show more
          <img src={ShowMoreIcon} alt="" />
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.PostLikedModalContent}>
      <Spin spinning={loading}>
        {list.length > 0 ? (
          list.map((x) => renderUser(x))
        ) : (
          <EmptyComponent height={70} showDescription={false} />
        )}
      </Spin>
      {renderShowMoreBtn()}
    </div>
  );
};
export default connect(({ user: { currentUser } = {} }) => ({
  currentUser,
}))(PostLikedModalContent);
