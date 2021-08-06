import { Modal, Button } from 'antd';
import React from 'react';
import { formatMessage } from 'umi';
import styles from './index.less';
import QuestionItem from '../Question/QuestionItem/index';

const ModalAddQuestion = (props) => {
  const { openModal, onCancel, onSave, title, onChangeQuestionItem, questionItem, action } = props;
  // const [form] = Form.useForm();
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      title={title}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      maskClosable={false}
      width={700}
      footer={[
        <div key="cancel" className={styles.btnCancel} onClick={onCancel}>
          {formatMessage({ id: 'employee.button.cancel' })}
        </div>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          // form="add"
          onClick={onSave}
          // loading={loading}
          className={styles.btnSubmit}
        >
          {/* {formatMessage({ id: 'employee.button.save' })} */}
          {action}
        </Button>,
      ]}
    >
      <QuestionItem onChangeQuestionItem={onChangeQuestionItem} questionItem={questionItem} />
    </Modal>
  );
};
export default ModalAddQuestion;
