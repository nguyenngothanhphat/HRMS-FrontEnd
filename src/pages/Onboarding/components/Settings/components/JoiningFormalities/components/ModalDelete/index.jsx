import { Modal, Button } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from '../../index.less';

const ModalDelete = (props) => {
  const {
    openModal,
    onCancel,
    item: { name = '', _id = '' } = {},
    loadingRemove,
    dispatch,
  } = props;
  const onDelete = async () => {
    await dispatch({
      type: 'onboard/removeJoiningFormalities',
      payload: {
        _id,
      },
    });
    onCancel();
  };
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      onCancel={onCancel}
      centered
      destroyOnClose
      title="Delete checklist Item"
      maskClosable={false}
      width={500}
      footer={[
        <div key="cancel" className={styles.btnCancel} onClick={onCancel}>
          Cancel
        </div>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          onClick={() => onDelete(_id)}
          className={styles.btnSubmit}
          loading={loadingRemove}
        >
          Yes, Delete
        </Button>,
      ]}
    >
      Are you sure you want to delete the item <strong>{name}</strong>?
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loadingRemove: loading.effects['onboard/removeJoiningFormalities'],
}))(ModalDelete);
