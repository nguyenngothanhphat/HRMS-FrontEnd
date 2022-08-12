import { Col, Dropdown, Menu } from 'antd';
import React from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'umi';
import UpdateIcon from '@/assets/editMailExit.svg';
import FlagIcon from '@/assets/homePage/flagIcon.svg';
import HideIcon from '@/assets/homePage/hideIcon.svg';
import MenuIcon from '@/assets/offboarding/menuIcon.png';
import DeleteIcon from '@/assets/relievingDel.svg';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import EmployeeTag from '../EmployeeTag';
import LikeComment from '../LikeComment';
import PostContent from '../PostContent';
import styles from './index.less';

function AnnouncementsCard(props) {
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

  const actionMenu = (data) => {
    let menu = '';
    if (data?.createdBy?._id === employeeId) {
      menu = (
        <Menu>
          <Menu.Item
            onClick={() => {
              setIsVisible(true);
              setIsEdit(true);
              setRecord(data);
            }}
          >
            <img className={styles.actionIcon} src={UpdateIcon} alt="updateIcon" />
            <span>Edit your post</span>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setIsDelete(true);
              setRecord(data);
            }}
          >
            <img className={styles.actionIcon} src={DeleteIcon} alt="deleteIcon" />
            <span>Delete your post</span>
          </Menu.Item>
        </Menu>
      );
    } else if (viewSettingHomePage === 1) {
      menu = (
        <Menu>
          <Menu.Item
            onClick={() => {
              hiddenPost(data._id);
            }}
          >
            <img className={styles.actionIcon} src={HideIcon} alt="hideIcon" />
            <span>Hide this post</span>
          </Menu.Item>
        </Menu>
      );
    } else if (!data?.flag?.includes(employeeId)) {
      menu = (
        <Menu>
          <Menu.Item onClick={() => flagPost(data?._id)}>
            <img className={styles.actionIcon} src={FlagIcon} alt="flagIcon" />
            <span>Flag as inappropriate</span>
          </Menu.Item>
        </Menu>
      );
    }

    return menu;
  };

  return (
    <LazyLoad key={item._id} height={200} offset={[-100, 0]}>
      <Col span={24}>
        <div className={styles.AnnouncementsCard}>
          <div className={styles.cardTitle}>
            <EmployeeTag
              postAsCompany={item.postAsCompany}
              company={item.company}
              employee={item.createdBy}
              createDate={item.createdAt}
            />
            {isSocial && (
              <Dropdown
                className={styles.menuIcon}
                overlay={actionMenu(item)}
                placement="bottomRight"
                trigger="click"
              >
                <img style={{ padding: 24 }} src={MenuIcon} alt="menu-icon" />
              </Dropdown>
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
}))(AnnouncementsCard);
