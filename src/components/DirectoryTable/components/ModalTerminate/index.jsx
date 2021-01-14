import React from 'react'
import { Button, Modal, Input } from 'antd';
import styles from './index.less';

const { TextArea } = Input;

const ModalTerminate = (props) => {

    const {
        visible = false,
        valueReason = '',
        onChange = () => {},
        handleSubmit = () => {},
        handleCandelModal = () => {},
    } = props;

    return (
      <Modal
        visible={visible}
        className={styles.terminateModal}
        title={false}
        onOk={handleSubmit}
        onCancel={handleCandelModal}
        destroyOnClose
        footer={[
          <div className={styles.flexContent}>
            <Button
              className={`${styles.btnGroup} ${styles.btnCancel}`}
              onClick={handleCandelModal}
            >
              Cancel
            </Button>
            <Button
              className={`${styles.btnGroup} ${styles.btnSubmit}`}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
          ]}
      >
        <div className={styles.contentModal}>
          <div className={styles.titleModal}>Reason</div>
          <div className={styles.fieldModal}>
            <TextArea 
              value={valueReason}
              onChange={onChange}
              placeholder="Fill in the box..."
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </div>
        </div>
      </Modal>
    )
}

export default ModalTerminate
