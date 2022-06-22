import { Form, Input } from 'antd';
import React from 'react';
import styles from './index.less';

const CommentModalContent = (props) => {
  const { onFinish = () => {} } = props;
  return (
    <div className={styles.CommentModalContent}>
      <Form name="basic" id="myForm" onFinish={onFinish}>
        <Form.Item
          name="notAvailableComment"
          label="Enter comments"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: 'Please input your comment!',
            },
          ]}
        >
          <Input.TextArea
            placeholder="Comment"
            autoSize={{
              minRows: 4,
              maxRows: 7,
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
export default CommentModalContent;
