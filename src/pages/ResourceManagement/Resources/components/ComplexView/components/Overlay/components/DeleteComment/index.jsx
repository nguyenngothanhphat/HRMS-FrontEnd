import React, { useState } from 'react';
import { Col, Row, Form } from 'antd';
import { connect } from 'umi';
import DeleteIcon from '@/assets/projectManagement/deleteIcon.svg';
import CommonModal from '@/components/CommonModal';
import styles from './index.less';

const DeleteComment = (props) => {
  const { id, dispatch, refreshData, loading } = props;

  const [visible, setVisible] = useState(false);

  const handleFinish = async () => {
    await dispatch({
      type: 'resourceManagement/updateComment',
      payload: {
        commentResource: '',
        id,
      },
    });
    setVisible(false);
    refreshData();
  };

  return (
    <div className={styles.DeleteComment}>
      <img
        src={DeleteIcon}
        className={styles.iconDelete}
        alt="historyIcon"
        onClick={() => setVisible(true)}
      />
      <CommonModal
        visible={visible}
        onClose={() => setVisible(false)}
        loading={loading}
        firstText="Delete"
        width="500px"
        content={
          <Form name="delete" id="myForm" onFinish={handleFinish}>
            <Row gutter={[24, 0]} className={styles.abovePart}>
              <Col span={24}>Are you sure you want to delete this comment?</Col>
            </Row>
          </Form>
        }
        title="Delete comment"
      />
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['resourceManagement/updateComment'],
}))(DeleteComment);
