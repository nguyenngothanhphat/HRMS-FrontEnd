import { Col, Dropdown } from 'antd';
import React from 'react';
import LazyLoad from 'react-lazyload';
import EmployeeTag from '../EmployeeTag';
import LikeComment from '../LikeComment';
import PostContent from '../PostContent';
import MenuIcon from '@/assets/offboarding/menuIcon.png';
import styles from './index.less';

export default function AnnouncementsCard(props) {
  const {
    item = {},
    isSocial = false,
    actionMenu = () => {},
    activePostID = '',
    setActivePostID = () => {},
    isView = false,
  } = props;

  return (
    <LazyLoad key={item._id} height={200} offset={[-100, 0]}>
      <Col span={24}>
        <div className={styles.AnnouncementsCard}>
          <div className={styles.cardTitle}>
            <EmployeeTag employee={item.createdBy} createDate={item.createdAt} />
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
