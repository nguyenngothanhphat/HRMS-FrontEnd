import { Popover } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CloseIcon from '@/assets/directory/closeX.svg';
import styles from './index.less';

const FilterPopover = (props) => {
  const { children, placement = 'bottom', content = '' } = props;
  const [showPopover, setShowPopover] = useState(false);

  const renderPopup = () => {
    return <div className={styles.popupContainer}>{content}</div>;
  };

  return (
    <Popover
      placement={placement}
      title={() => (
        <div className={styles.popoverHeader}>
          <span className={styles.headTitle}>Filters</span>
          <span
            className={styles.closeIcon}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPopover(false)}
          >
            <img src={CloseIcon} alt="close" />
          </span>
        </div>
      )}
      content={() => renderPopup()}
      trigger="click"
      visible={showPopover}
      overlayClassName={styles.FilterPopover}
      onVisibleChange={() => {
        setShowPopover(!showPopover);
      }}
    >
      {children}
    </Popover>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  FilterPopover,
);
