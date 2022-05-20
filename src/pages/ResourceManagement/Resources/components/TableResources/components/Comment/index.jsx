import React, { PureComponent } from 'react';
import { Row, Col, Modal, Input, Button, Form } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
@connect(({ loading }) => ({
  loading: loading.effects['resourceManagement/updateComment'],
}))
class CommentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isDisabled: true,
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
    const payload = {
      commentResource: values.comment,
      id: obj.employeeId,
    };
    const { dispatch, refreshData } = this.props;
    await dispatch({
      type: 'resourceManagement/updateComment',
      payload: {
        ...payload,
      },
    }).then(() => {
      refreshData();
    });
    this.handleCancel();
  };

  handleChange = (values) => {
    if (values.comment) {
      this.setState({
        isDisabled: false,
      });
    } else {
      this.setState({
        isDisabled: true,
      });
    }
  };

  render() {
    const { data } = this.props;
    const { visible, isDisabled } = this.state;
    return (
      <div className={styles.CommentModal}>
        <div className={styles.options}>
          <Row>
            <Col>
              <Button
                icon={<PlusCircleFilled />}
                // className={styles.generate}
                type="text"
                onClick={this.openCommentView}
              >
                Add Comment
              </Button>
            </Col>
          </Row>
        </div>
        <Modal
          className={styles.modalAdd}
          title="Add Comment"
          width="40%"
          visible={visible}
          // onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          okText="Add"
          cancelButtonProps={{ style: { color: 'red', border: '1px solid white' } }}
          okButtonProps={{
            style: {
              background: '#FFA100',
              border: '1px solid #FFA100',
              color: 'white',
              borderRadius: '25px',
              opacity: isDisabled && '0.5',
            },
            form: 'commentForm',
            key: 'submit',
            htmlType: 'submit',
            disabled: isDisabled,
          }}
        >
          <Form
            id="commentForm"
            layout="vertical"
            className={styles.formComment}
            onValuesChange={(values) => this.handleChange(values)}
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

export default CommentModal;
