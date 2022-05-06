import React from 'react';
import { Col, Form, Row } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

const DeleteCustomerModalContent = (props) => {
  const {
    dispatch,
    onClose = () => {},
    onRefresh = () => {},
    selectedCustomer: { customerId = '', dba = '' } = {},
  } = props;

  const handleFinish = async () => {
    const res = await dispatch({
      type: 'customerManagement/removeCustomerEffect',
      payload: {
        customerId,
      },
    });
    if (res.statusCode === 200) {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className={styles.DeleteCustomerModalContent}>
      <Form name="basic" id="myForm" onFinish={handleFinish}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            Are you sure you want to delete the item <strong>{dba}</strong>?
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect()(DeleteCustomerModalContent);
