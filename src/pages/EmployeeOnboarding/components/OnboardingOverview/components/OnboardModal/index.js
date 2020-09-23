import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

const OnboardModal = (props) => {
  //   constructor(props) {
  //     super(props);
  //     const {open, close} = this.props;
  //     this.state = { visible: false };
  //   }

  const { open } = props;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open, close]);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    console.log(e);
    setVisible(false);
  };

  const handleCancel = (e) => {
    console.log(e);
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal title={<span>asd123</span>} visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default OnboardModal;
