import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import SignaturePad from 'react-signature-canvas';
import styles from './index.less';

const ModalDrawSignature = (props) => {
  const { visible, onOk, onCancel, title } = props;
  let sigPad = {};
  return (
    <Modal
      className={styles.modalCustom}
      visible={visible}
      title={title}
      onOk={() => onOk(sigPad.getTrimmedCanvas().toDataURL('image/png'))}
      onCancel={onCancel}
      footer={[
        <Button
          key="back"
          className={styles.btnCancel}
          onClick={() => {
            sigPad.clear();
            onCancel();
          }}
        >
          Cancel
        </Button>,
        <Button
          className={styles.btnSubmit}
          key="submit"
          type="primary"
          onClick={() => sigPad.clear()}
        >
          Clear
        </Button>,
        <Button
          className={styles.btnSubmit}
          type="primary"
          onClick={() => {
            onOk(sigPad.getTrimmedCanvas().toDataURL('image/png'));
            sigPad.clear();
          }}
        >
          Done
        </Button>,
      ]}
    >
      <div className={styles.container}>
        <div className={styles.sigContainer}>
          <SignaturePad
            canvasProps={{ className: styles.sigPad }}
            ref={(ref) => {
              sigPad = ref;
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
ModalDrawSignature.prototype = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default ModalDrawSignature;
