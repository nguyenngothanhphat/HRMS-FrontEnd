import { Form, Input } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;

@connect(() => ({}))
class AddCommentModalContent extends PureComponent {
  onFinish = async (values, obj) => {
    const payload = {
      projectId: obj.projectId,
      comments: values.comment,
    };
    const { dispatch, refreshData = () => {}, onClose = () => {} } = this.props;
    await dispatch({
      type: 'resourceManagement/addAndUpdateCommentsProject',
      payload: {
        ...payload,
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        onClose();
        refreshData();
      }
    });
  };

  render() {
    const { handlingRow = {} } = this.props;
    return (
      <div className={styles.AddCommentModalContent}>
        <Form
          id="commentForm"
          layout="vertical"
          className={styles.formComment}
          onFinish={(values) => this.onFinish(values, handlingRow)}
          initialValues={{
            comment: handlingRow?.comment,
          }}
        >
          <Form.Item
            label="Comments"
            name="comment"
            rules={[
              {
                required: true,
                message: 'Please input your comment!',
              },
            ]}
          >
            <TextArea placeholder="Enter Comments" autoSize={{ minRows: 5, maxRows: 8 }} />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default AddCommentModalContent;
