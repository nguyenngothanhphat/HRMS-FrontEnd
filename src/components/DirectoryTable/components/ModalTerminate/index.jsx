import React from 'react'
import { Button, Modal, Input, Form } from 'antd';
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
          <div className={styles.titleModal}>Terminate employee</div>
          <Form>
            <Form.Item 
              label='Reason' 
              name='reason' 
              className={styles.formModal}
              rules={[
                    {
                        // pattern: /[a-zA-Z] {0,10}$/,
                        pattern: /^[\w ]{0,1000}$/,
                        message: 'Value should be character and limit characters is 1000',
                    }
                ]}
            >
              <TextArea 
                className={styles.fieldModal}
                value={valueReason}
                onChange={onChange}
                placeholder='Fill in the box...'
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    )
}

export default ModalTerminate
