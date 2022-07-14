import { Form, Input } from 'antd';
import React from 'react';
import { DOCUMENT_TYPES } from '@/utils/candidatePortal';
import styles from './index.less';

const ViewCommentModalContent = (props) => {
  const {
    selectedFile: { notAvailableComment = '', hrNotAvailableComment = '', status = '' } = {},
    action = '',
    onFinish = () => {},
  } = props;
  return (
    <div className={styles.ViewCommentModalContent}>
      <span>{notAvailableComment}</span>

      {(action || (hrNotAvailableComment && status === DOCUMENT_TYPES.NOT_AVAILABLE_REJECTED)) && (
        <div className={styles.commentContent}>
          <Form
            name="basic"
            id="myForm"
            onFinish={onFinish}
            initialValues={{ hrNotAvailableComment }}
          >
            <Form.Item name="hrNotAvailableComment" label="Enter comments" labelCol={{ span: 24 }}>
              <Input.TextArea
                placeholder="Comment"
                autoSize={{
                  minRows: 4,
                  maxRows: 7,
                }}
                disabled={!action}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};
export default ViewCommentModalContent;
