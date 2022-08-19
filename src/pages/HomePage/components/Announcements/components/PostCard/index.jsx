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
import MenuPopover from '@/components/MenuPopover';

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

  const menuItems = [
    {
      label: 'Edit',
      icon: UpdateIcon,
      onClick: () => {
        setIsVisible(true);
        setIsEdit(true);
        setRecord(item);
      },
      visible: item?.createdBy?._id === employeeId,
    },
    {
      label: 'Delete',
      icon: DeleteIcon,
      onClick: () => {
        setIsDelete(true);
        setRecord(item);
      },
      visible: item?.createdBy?._id === employeeId,
    },
    {
      label: 'Hide this post',
      icon: HideIcon,
      onClick: () => {
        hiddenPost(item._id);
      },
      visible: viewSettingHomePage === 1,
    },
    {
      label: 'Flag as inappropriate',
      icon: FlagIcon,
      onClick: () => {
        flagPost(item?._id);
      },
      visible: !item?.flag?.includes(employeeId),
    },
  ];

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
              <MenuPopover items={menuItems}>
                <img src={MenuIcon} alt="" style={{ cursor: 'pointer', padding: '4px 10px' }} />
              </MenuPopover>
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
