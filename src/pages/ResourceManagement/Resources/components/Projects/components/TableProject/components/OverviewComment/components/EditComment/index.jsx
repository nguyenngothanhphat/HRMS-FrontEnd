import React, { PureComponent } from 'react';
import { Modal, Input, Form, notification } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import editIcon from '@/assets/resource-management-edit-history.svg';

const { TextArea } = Input;
@connect(({ loading }) => ({
  loadingEditComment: loading.effects['resourceManagement/addAndUpdateCommentsProject'],
}))
class EditComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openCommentView = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onFinish = async (values, obj) => {
    if (values.comment === undefined) {
      notification.error({
        message: 'Value comment cannot empty',
      });
      return;
    }
    if (obj.projectId === undefined) {
      notification.error({
        message: 'Project Id undefined',
      });
      return;
    }
    const payload = {
      projectId: obj.projectId,
      comments: values.comment,
    };
    const { dispatch } = this.props;
    await dispatch({
      type: 'resourceManagement/addAndUpdateCommentsProject',
      payload: {
        ...payload,
      },
    });
    await dispatch({
      type: 'resourceManagement/fetchProjectList',
    });
    this.handleCancel();
  };

  render() {
    const { dataRow } = this.props;
    const { visible } = this.state;
    return (
      <div className={styles.EditComment}>
        <img src={editIcon} alt="historyIcon" onClick={this.openCommentView} />
        <Modal
          className={styles.modalEditComment}
          title="Edit Comments"
          width="40%"
          visible={visible}
          onCancel={() => this.handleCancel()}
          okText="Update"
          cancelButtonProps={{ style: { color: 'red', border: '1px solid white' } }}
          okButtonProps={{
            style: {
              background: '#FFA100',
              border: '1px solid #FFA100',
              color: 'white',
              borderRadius: '25px',
            },
            form: 'commentForm',
            key: 'submit',
            htmlType: 'submit',
          }}
        >
          <Form
            id="commentForm"
            layout="vertical"
            className={styles.formComment}
            onFinish={(values) => this.onFinish(values, dataRow)}
            initialValues={{
              comment: dataRow.comment,
            }}
          >
            <Form.Item label="Comments" name="comment">
              <TextArea
                placeholder="Enter Comments"
                defaultValue={dataRow.comment}
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default EditComment;
