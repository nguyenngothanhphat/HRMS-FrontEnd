import React, { PureComponent } from 'react';
import { Row, Col, Modal, Input, Button, Form, notification } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
@connect(({ loading }) => ({
  loading: loading.effects['resourceManagement/addAndUpdateCommentsProject'],
  loadingRefesherList: loading.effects['resourceManagement/fetchProjectList']
}))
class AddComment extends PureComponent {
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
    if(values.comment === undefined){
      notification.error({
        message: 'Value comment cannot empty',
      });
      return
    }
    if(obj.projectId === undefined){
      notification.error({
        message: 'Project Id undefined',
      });
      return
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
    const { data } = this.props;
    const { visible } = this.state;
    return (
      <div className={styles.AddComment}>
        <div>
          <Row gutter={[24, 0]}>
            <Col>
              <Button
                icon={<PlusCircleFilled />}
                type="text"
                onClick={this.openCommentView}
                className={styles.btnAddComment}
              >
                Add Comment
              </Button>
            </Col>
          </Row>
        </div>
        <Modal
          className={styles.modalAddComment}
          title="Add Comment"
          width="40%"
          visible={visible}
          onCancel={() => this.handleCancel()}
          okText="Add"
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
            onFinish={(values) => this.onFinish(values, data)}
          >
            <Form.Item label="Comments" name="comment">
              <TextArea placeholder="Enter Comments" autoSize={{ minRows: 4, maxRows: 8 }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default AddComment;
