import React, { useState, useCallback } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import ModalForm from './ModalForm';
import styles from './index.less';

const listType = ['reject', 'approve', 'askmoreinfo'];

const Popup = props => {
  const {
    openModalText = formatMessage({ id: 'popup.openModal' }),
    popupType = 'reject',
    fullName = '',
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [formRef, setFormRef] = useState(null);

  const handleOk = () => {
    formRef.validateFields((err, values) => {
      if (err) {
        return;
      }
      formRef.resetFields();
      setShowModal(false);
    });
  };
  const handleOpenModalClick = () => {
    setShowModal(!showModal);
  };

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);
  const getModalTitle = () => {
    switch (popupType.toLowerCase()) {
      case 'reject':
        return formatMessage({ id: 'popup.rejectTitle' });
      case 'askmoreinfo':
        return formatMessage({ id: 'popup.askTitle' });
      case 'approve':
        return formatMessage({ id: 'popup.approveTitle' });
      default:
        return '';
    }
  };
  const getPlaceHolder = () => {
    return formatMessage({ id: 'popup.textAreaPlaceHoder' });
  };
  const getDes = () => {
    switch (popupType.toLowerCase()) {
      case 'reject':
        return `${formatMessage({ id: 'popup.rejectDes' })} ${fullName}`;
      case 'askmoreinfo':
        return `${formatMessage({ id: 'popup.askDes' })} ${fullName}`;
      case 'approve':
        return `${formatMessage({ id: 'popop.approveDes' })} ${fullName}`;
      default:
        return '';
    }
  };
  const getOkText = () => {
    switch (popupType.toLowerCase()) {
      case 'reject':
        return formatMessage({ id: 'popup.rejectSubmitText' }).toUpperCase();
      case 'askmoreinfo':
        return formatMessage({ id: 'popup.askSubmitText' }).toUpperCase();
      case 'approve':
        return formatMessage({ id: 'popup.approveSubmitText' }).toUpperCase();
      default:
        return '';
    }
  };
  const getErrorMes = () => {
    return formatMessage({ id: 'popup.errorMesValidateRequired' });
  };
  return listType.indexOf(popupType) === -1 ? (
    <span>{formatMessage({ id: 'popup.errorTypeMes' })}</span>
  ) : (
    <div className={styles.popupWrapper}>
      <Button type="primary" className={styles.btnOpenModal} onClick={handleOpenModalClick}>
        {openModalText}
      </Button>
      <ModalForm
        ref={saveFormRef}
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onCreate={() => handleOk()}
        title={getModalTitle()}
        placeholder={getPlaceHolder()}
        des={getDes()}
        okText={getOkText()}
        errorMes={getErrorMes()}
        popupType={popupType}
      />
    </div>
  );
};

export default Popup;
