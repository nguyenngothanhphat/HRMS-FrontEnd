import { Col, Popover } from 'antd';
import React from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'umi';
import UpdateIcon from '@/assets/editMailExit.svg';
import FlagIcon from '@/assets/homePage/flagIcon.svg';
import HideIcon from '@/assets/homePage/hideIcon.svg';
import MenuIcon from '@/assets/offboarding/menuIcon.png';
import DeleteIcon from '@/assets/relievingDel.svg';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import EmployeeTag from './components/EmployeeTag';
import LikeComment from './components/LikeComment';
import PostContent from './components/PostContent';
import styles from './index.less';

function PostCard(props) {
  const {
    dispatch,
    item = {},
    isSocial = false,
    activePostID = '',
    setActivePostID = () => {},
    isView = false,
    fetchData = () => {},
    setRecord = () => {},
    limitSocial = 5,
    setIsDelete = () => {},
    setIsEdit = () => {},
    setIsVisible = () => {},
    user: {
      currentUser: { employee: { _id: employeeId = '' } = {} } = {},
      permissions: { viewSettingHomePage = -1 } = {},
    },
  } = props;

  const [menuVisible, setMenuVisible] = React.useState(false);

  const flagPost = (postId = '') => {
    return dispatch({
      type: 'homePage/flagPostEffect',
      payload: {
        post: postId,
        postType: POST_TYPE.SOCIAL,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const hiddenPost = (postId = '') => {
    return dispatch({
      type: 'homePage/updatePostEffect',
      payload: {
        id: postId,
        postType: POST_TYPE.SOCIAL,
        status: STATUS_POST.HIDDEN,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
      }
    });
  };

  const renderMenuDropdown = () => {
    const isMe = item?.createdBy?._id === employeeId;

    return (
      <div className={styles.containerDropdown}>
        {isMe && (
          <>
            <div
              className={styles.btn}
              onClick={() => {
                setIsVisible(true);
                setIsEdit(true);
                setRecord(item);
                setMenuVisible(false);
              }}
            >
              <img className={styles.actionIcon} src={UpdateIcon} alt="updateIcon" />
              <span>Edit</span>
            </div>

            <div
              className={styles.btn}
              onClick={() => {
                setIsDelete(true);
                setRecord(item);
                setMenuVisible(false);
              }}
            >
              <img className={styles.actionIcon} src={DeleteIcon} alt="deleteIcon" />
              <span>Delete</span>
            </div>
          </>
        )}

        {viewSettingHomePage === 1 && (
          <div
            className={styles.btn}
            onClick={() => {
              hiddenPost(item._id);
              setMenuVisible(false);
            }}
          >
            <img className={styles.actionIcon} src={HideIcon} alt="hideIcon" />
            <span>Hide this post</span>
          </div>
        )}

        {!item?.flag?.includes(employeeId) && (
          <div
            className={styles.btn}
            onClick={() => {
              flagPost(item?._id);
              setMenuVisible(false);
            }}
          >
            <img className={styles.actionIcon} src={FlagIcon} alt="flagIcon" />
            <span>Flag as inappropriate</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <LazyLoad key={item._id} height={200} offset={[-100, 0]}>
      <Col span={24}>
        <div className={styles.PostCard}>
          <div className={styles.cardTitle}>
            <EmployeeTag
              postAsCompany={item.postAsCompany}
              company={item.company}
              employee={item.createdBy}
              createDate={item.createdAt}
            />
            {isSocial && (
              <Popover
                trigger="click"
                overlayClassName={styles.dropdownPopover}
                content={renderMenuDropdown()}
                placement="bottomRight"
                visible={menuVisible}
                onVisibleChange={(visible) => setMenuVisible(visible)}
              >
                <img src={MenuIcon} alt="" style={{ cursor: 'pointer', padding: '4px 10px' }} />
              </Popover>
            )}
          </div>
          <PostContent post={item} />
          <LikeComment
            post={item}
            activePostID={activePostID}
            setActivePostID={setActivePostID}
            isView={isView}
          />
        </div>
      </Col>
    </LazyLoad>
  );
}

export default connect(({ user }) => ({
  user,
}))(PostCard);
