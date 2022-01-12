import { Modal } from 'antd';
import React from 'react';
import { connect } from 'umi';
import EmptyComponent from '@/components/Empty';
import HolidayCalendar from '../HolidayCalendar';
import MyCalendar from '../MyCalendar';
import styles from './index.less';

const CommonModal = (props) => {
  const {
    visible = false,
    tabKey = '',
    data = [],
    loading = false,
    title = '',
    onClose = () => {},
  } = props;

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const renderModalContent = () => {
    if (data.length === 0) return <EmptyComponent />;
    switch (tabKey) {
      case '1':
        return <MyCalendar isInModal data={data} loading={loading} />;
      case '2':
        return <HolidayCalendar isInModal listHolidays={data} loading={loading} />;
      default:
        return '';
    }
  };

  return (
    <>
      <Modal
        className={`${styles.CommonModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        footer={null}
        title={renderModalHeader()}
        centered
        visible={visible}
        width={750}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(() => ({}))(CommonModal);
