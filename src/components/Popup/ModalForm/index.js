import React, { useState } from 'react';
import { Modal, Form, Input } from 'antd';
import styles from './index.less';

const ModalFormComponent = ({
  visible,
  onCancel,
  onCreate,
  form,
  title,
  placeholder,
  des,
  okText,
  errorMes,
  popupType,
}) => {
  const [wordLength, setWordLength] = useState(0);

  const getOkButtonClassName = () => {
    switch (popupType.toLowerCase()) {
      case 'reject':
        return styles.okBtnReject;
      case 'askmoreinfo':
        return styles.okBtnAskMore;
      case 'approve':
        return styles.okBtnApprove;
      default:
        return '';
    }
  };
  const { getFieldDecorator } = form;
  const { TextArea } = Input;
  const countWords = e => {
    return setWordLength(e.currentTarget.value.length);
  };
  return (
    <Modal
      wrapClassName={styles.wrapModalPopup}
      visible={visible}
      title={title}
      okText={okText}
      onCancel={onCancel}
      onOk={onCreate}
      okButtonProps={{ className: getOkButtonClassName() }}
      cancelButtonProps={{ className: styles.cancelBtn }}
    >
      <Form layout="vertical" className={styles.wrapFormModal}>
        <span className={styles.des}>{des}</span>
        <Form.Item style={{ marginTop: '10px', marginBottom: '0px' }}>
          {getFieldDecorator('message', {
            rules: [
              {
                required: true,
                max: 250,
                message: errorMes,
              },
            ],
          })(<TextArea onChange={e => countWords(e)} placeholder={placeholder} />)}
          <div className={styles.countWord}>{wordLength} / 250</div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ModalForm = Form.create({ name: 'modal_form' })(ModalFormComponent);

export default ModalForm;
