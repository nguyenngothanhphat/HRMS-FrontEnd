import React from 'react';
import { Comment, Button, List, Input, Empty, Row, Col, Avatar, Form, Skeleton, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const { TextArea } = Input;

const CommentList = ({ comments, user: { _id: currentUserId } }) => (
  <List
    className={styles.list}
    dataSource={comments}
    header={false}
    itemLayout="horizontal"
    renderItem={({ createdAt, content, user: { _id, fullName, avatarUrl } }) => (
      <Comment
        author={fullName}
        datetime={moment(createdAt).format('YYYY/MM/DD h:mm A')}
        avatar={<Avatar src={avatarUrl}>{fullName && fullName[0]}</Avatar>}
        content={content}
        className={currentUserId === _id ? styles.reverse : undefined}
      />
    )}
  />
);

@Form.create()
@connect(({ reimbursement: { action, item, errors }, loading }) => ({
  loading: loading.models.reimbursement,
  action,
  errors,
  item,
}))
class MessageBox extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      item: { id },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Modal.confirm({
          title: formatMessage({ id: 'reimbursement.message-box.confirm' }),
          onOk: () => {
            dispatch({
              type: 'reimbursement/review',
              payload: { action: 'need_more_info', reId: id, ...values },
            });
          },
        });
      }
    });
  };

  render() {
    const {
      user,
      isReview,
      loading,
      form: { getFieldDecorator },
      item: { comments = [] },
    } = this.props;

    return loading ? (
      <Skeleton avatar paragraph={{ rows: 4 }} />
    ) : (
      <div className={styles.root}>
        {comments.length > 0 ? (
          <CommentList user={user} comments={comments} />
        ) : (
          <Empty style={{ minHeight: '400px' }} />
        )}
        {isReview && (
          <Row
            className={styles.editor}
            type="flex"
            justify="space-between"
            align="bottom"
            gutter={8}
          >
            <Col span={19}>
              <Form.Item>
                {getFieldDecorator('message', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'reimbursement.message-box.placeholder' }),
                    },
                  ],
                })(
                  <TextArea
                    className={styles['comment-box']}
                    autosize={{ minRows: 1, maxRows: 4 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Button
                  className={styles.btn}
                  htmlType="submit"
                  loading={loading}
                  onClick={this.handleSubmit}
                  type="primary"
                >
                  <FormattedMessage id="reimbursement.message-box.button.send" />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default MessageBox;
