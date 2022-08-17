import React from 'react';
import { connect } from 'umi';
import EditIcon from '@/assets/edit-customField.svg';
import { POST_TYPE, STATUS_POST } from '@/constants/homePage';
import { getCurrentLocation } from '@/utils/authority';
import { getCompanyName } from '@/utils/utils';
import styles from './index.less';

const ModeSwitcher = (props) => {
  const {
    fetchData = () => {},
    setIsVisible = () => {},
    user: { currentUser: { name = '' } = {} } = {},
    isSocial = false,
    setIsSocial = () => {},
    limitSocial = 0,
    limitCompany = 0,
  } = props;

  const handleCompanyClick = () => {
    setIsSocial(false);
    fetchData(POST_TYPE.COMPANY, limitCompany, getCurrentLocation());
  };

  const handleSocialClick = () => {
    setIsSocial(true);
    fetchData(POST_TYPE.SOCIAL, limitSocial, '', STATUS_POST.ACTIVE);
  };

  // RENDER UI
  return (
    <div className={styles.ModeSwitcher}>
      <div className={styles.header}>
        <span className={styles.text}>Announcements</span>
        <div style={{ position: 'relative' }} className={styles.button}>
          <button
            className={`${styles.spanTabs} ${!isSocial && styles.buttonTabs}`}
            onClick={handleCompanyClick}
            disabled={!isSocial}
            type="button"
          >
            {getCompanyName()}
          </button>
          <button
            style={{
              marginLeft: 5,
            }}
            className={`${styles.spanTabs} ${isSocial && styles.buttonTabs}`}
            onClick={handleSocialClick}
            disabled={isSocial}
            type="button"
          >
            Social
          </button>
          <div
            className={
              !isSocial
                ? `${styles.active} ${styles.active2}`
                : `${styles.active} ${styles.active1}`
            }
          />
        </div>
      </div>
      {isSocial && (
        <div className={styles.sharePost}>
          <p
            className={styles.sharePost__content}
            onClick={() => {
              setIsVisible(true);
            }}
          >
            <img src={EditIcon} alt="editIcon" style={{ paddingRight: 10 }} />
            <span>Hi {name}, let share something today!</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default connect(({ homePage, user }) => ({
  homePage,
  user,
}))(ModeSwitcher);
