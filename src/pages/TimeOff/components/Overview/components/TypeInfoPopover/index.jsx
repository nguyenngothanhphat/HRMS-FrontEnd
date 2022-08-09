import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Collapse, Popover } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import CloseX from '@/assets/dashboard/closeX.svg';
import styles from './index.less';

const { Panel } = Collapse;

const TypeInfoPopover = (props) => {
  const { children, placement = 'top', data = [] } = props;

  const [showPopover, setShowPopover] = useState(false);

  const renderExpandIcon = (isActive) =>
    isActive ? (
      <MinusOutlined className={styles.alternativeExpandIcon} />
    ) : (
      <PlusOutlined className={styles.alternativeExpandIcon} />
    );

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.title}>
          <span>All you need to know about Leave balances</span>
        </div>
        <p className={styles.description}>
          The leave balance shown is across all the type of leaves. Please look at the Leave
          Breakdown option to look at the types of leaves and balances.
        </p>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={styles.collapseInfoContainer}>
        <Collapse
          bordered={false}
          expandIconPosition="right"
          expandIcon={({ isActive }) => renderExpandIcon(isActive)}
        >
          {data.map((x, index) => (
            <Panel className={styles.eachCollapse} header={x.name} key={`${index + 1}`}>
              <p>{x.description || 'No data'}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  };

  const renderPopup = () => {
    return (
      <div className={styles.popupContainer}>
        <img
          className={styles.closeButton}
          src={CloseX}
          alt=""
          onClick={() => setShowPopover(!showPopover)}
        />
        {renderHeader()}
        {renderContent()}
      </div>
    );
  };

  return (
    <Popover
      placement={placement}
      content={showPopover ? renderPopup() : null}
      title={null}
      trigger="click"
      visible={showPopover}
      overlayClassName={styles.TypeInfoPopover}
      onVisibleChange={() => {
        setShowPopover(!showPopover);
      }}
    >
      {children}
    </Popover>
  );
};

export default connect(({ user: { currentUser: { employee = {} } = {} } }) => ({ employee }))(
  TypeInfoPopover,
);
