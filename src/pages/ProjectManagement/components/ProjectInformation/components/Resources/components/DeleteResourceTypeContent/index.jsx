import { Col, Form, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const DeleteResourceTypeContent = (props) => {
  const [form] = Form.useForm();
  const {
    // visible = false,
    dispatch,
    deleteRecord: { id = '' } = {},
    onClose = () => {},
    refreshData = () => {},
  } = props;

  const handleFinish = async (values) => {
    const res = await dispatch({
      type: 'projectDetails/deleteResourceTypeEffect',
      payload: {
        ...values,
        id,
      },
    });
    if (res.statusCode === 200) {
      form.resetFields();
      onClose();
      refreshData();
    }
  };

  return (
    <div className={styles.DeleteResourceTypeContent}>
      <Form name="basic" form={form} id="myForm" onFinish={handleFinish}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>Are you sure you want to delete this resource type?</Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(
  ({ loading, projectDetails, user: { currentUser: { employee = {} } = {} } }) => ({
    employee,
    projectDetails,
    loadingFetchTitleList: loading.effects['projectDetails/fetchTitleListEffect'],
  }),
)(DeleteResourceTypeContent);
