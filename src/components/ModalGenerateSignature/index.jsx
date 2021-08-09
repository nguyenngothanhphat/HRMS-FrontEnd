import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Modal, Radio, Row, Space, Input } from 'antd';
import TextSignature from '@/components/TextSignature';
import styles from './index.less';

const ModalGenerateSignature = (props) => {
  const { visible, onOk, onCancel, title } = props;
  const [valueDigitalSignature, setValueDigitalSignature] = useState(0);
  const [arrImgBase64, setArrImgBase64] = useState([]);
  const [nameSignature, setNameSignature] = useState('');
  const textRef = useRef(null);

  const setValueSignature = () => {
    setArrImgBase64([]);
    setNameSignature(textRef.current.state.value);
  };

  const getImg = (e) => {
    const arr = arrImgBase64;
    arr.push(e);
    setArrImgBase64(arr);
  };
  const renderSignature = () => {
    return (
      nameSignature && (
        <Row>
          <Radio.Group
            onChange={(e) => {
              setValueDigitalSignature(e.target.value);
            }}
            value={valueDigitalSignature}
          >
            <Space direction="vertical">
              {['Airin', 'GermanyScript', 'SH Imogen Agnes', 'AudreyAndReynold'].map(
                (item, index) => (
                  // <Col span={12}>
                  <Radio value={index} style={{ display: 'flex', alignItems: 'center' }}>
                    <TextSignature
                      name={nameSignature}
                      getImage={getImg}
                      x={10}
                      y={75}
                      height={100}
                      font={item === 'Airin' ? `48px ${item}` : `60px ${item}`}
                    />
                  </Radio>
                  // </Col>
                ),
              )}
            </Space>
          </Radio.Group>
        </Row>
      )
    );
  };
  const resetDefaultState = () => {
    setValueDigitalSignature(0);
    setNameSignature('');
    setArrImgBase64([]);
    textRef.current.state.value = '';
  };
  const saveImage = () => {
    if (arrImgBase64.length === 0) onOk();
    else onOk(arrImgBase64[valueDigitalSignature]);
    resetDefaultState();
  };
  return (
    <Modal
      className={styles.modalCustom}
      visible={visible}
      title={title}
      onOk={saveImage}
      onCancel={() => {
        resetDefaultState();
        onCancel();
      }}
      footer={[
        <Button
          key="back"
          className={styles.btnCancel}
          onClick={() => {
            resetDefaultState();
            onCancel();
          }}
        >
          Cancel
        </Button>,

        <Button className={styles.btnSubmit} type="primary" onClick={saveImage}>
          Done
        </Button>,
      ]}
    >
      <Row justify="space-around">
        <Col span={12}>
          <Input type="text" ref={textRef} placeholder="input your name" />
        </Col>
        <Col span={4}>
          <Button type="default" className={styles.btnSubmit} onClick={() => setValueSignature()}>
            Generate
          </Button>
        </Col>
      </Row>
      {renderSignature()}
    </Modal>
  );
};
ModalGenerateSignature.prototype = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default ModalGenerateSignature;
