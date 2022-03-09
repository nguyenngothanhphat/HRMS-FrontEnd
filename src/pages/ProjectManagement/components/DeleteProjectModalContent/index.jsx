import React from 'react';
import { Col, Form, Row } from 'antd';

import styles from './index.less';

const DeleteProjectModalContent = (props) => {
  const {
    dispatch,
    onClose = () => {},
    onRefresh = () => {},
    selectedProject: { projectName = '', id = '' } = {},
  } = props;

  const handleFinish = async () => {
    const res = await dispatch({
      type: 'projectManagement/',
      payload: {
        id,
      },
    });
    if (res.statusCode === 200) {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className={styles.DeleteProjectModalContent}>
      <Form name="basic" id="myForm" onFinish={handleFinish}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            Are you sure you want to delete the item <strong>{projectName}</strong>?
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DeleteProjectModalContent;
