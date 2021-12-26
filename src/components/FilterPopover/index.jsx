import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CloseIcon from '@/assets/directory/closeX.svg';
import styles from './index.less';

const FilterPopover = (props) => {
  const {
    children,
    placement = 'bottom',
    onSubmit = () => {},
    content = '',
    submitText = 'Submit',
    closeText = 'Close',
    onSecondButton,
    realTime = false,
  } = props;
  const [showPopover, setShowPopover] = useState(false);

  const onFormSubmit = (values) => {
    onSubmit(values);
  };

  const renderPopup = () => {
    return (
      <>
        <div className={styles.popupContainer}>{content}</div>
        {!realTime && (
          <div className={styles.buttons}>
            <Button
              className={styles.btnClose}
              onClick={onSecondButton || (() => setShowPopover(false))}
            >
              {closeText}
            </Button>
            <Button
              className={styles.btnApply}
              form="filter"
              htmlType="submit"
              key="submit"
              onClick={onFormSubmit}
            >
              {submitText}
            </Button>
          </div>
        )}
      </>
    );
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
