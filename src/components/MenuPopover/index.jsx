import { Popover } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const MenuPopover = (props) => {
  const { children, placement = 'bottomRight', items = [] } = props;

  const [menuVisible, setMenuVisible] = React.useState(false);

  const renderMenuDropdown = () => {
    return (
      <div className={styles.containerDropdown}>
        {items
          .filter((x) => x.visible)
          .map((x) => (
            <div
              className={styles.btn}
              onClick={() => {
                x.onClick();
                setMenuVisible(false);
              }}
            >
              <img className={styles.actionIcon} src={x.icon || 'src="data:,"'} alt="" />
              <span>{x.label}</span>
            </div>
          ))}
      </div>
    );
  };

  return (
    <Popover
      trigger="click"
      overlayClassName={styles.MenuPopover}
      content={renderMenuDropdown()}
      placement={placement}
      visible={menuVisible}
      onVisibleChange={(visible) => setMenuVisible(visible)}
    >
      {children}
    </Popover>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  MenuPopover,
);
