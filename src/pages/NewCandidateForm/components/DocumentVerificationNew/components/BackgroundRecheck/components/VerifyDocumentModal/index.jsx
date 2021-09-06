import React, { Component } from 'react';
import { Button, Modal, Input, Form, Divider } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

const { TextArea } = Input;
@connect(
  ({
    newCandidateForm: {
      data: { candidate = '' },
    },
    loading,
  }) => ({
    candidate,
    loadingVerified: loading.effects['newCandidateForm/checkDocumentEffect'],
  }),
)
class VerifyDocumentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCommentForm: false,
    };
  }

  renderTitle = (name) => {
    const { openCommentForm } = this.state;
    return (
      <>
        {openCommentForm ? (
          <div className={styles.titleName}>{`${name} for Resubmission`}</div>
        ) : (
          <div className={styles.titleName}>{name}</div>
        )}
      </>
    );
  };

  destroyOnClose = () => {
    const { onClose = () => {} } = this.props;
    this.setState({
      openCommentForm: false,
    });
    onClose();
  };

  onSubmit = (comment = '', option) => {
    const { dispatch, candidate, docProps: { documentId: document = '' } = {} } = this.props;
    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'newCandidateForm/checkDocumentEffect',
      payload: {
        comment,
        candidate,
        document,
        candidateDocumentStatus: option,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        this.destroyOnClose();
      }
    });
  };

  handleVerified = () => {
    this.onSubmit('', 1);
  };

  onReSubmit = (value) => {
    const { comment } = value;
    console.log(value);
    this.onSubmit(comment, 2);
  };

  openResubmitForm = (value) => {
    this.setState({
      openCommentForm: value,
    });
  };

  renderComments = () => {
    return (
      <div className={styles.commentForm}>
        <div className={styles.commentForm__divider}>
          <Divider className={styles.divider} />
        </div>
        <Form onFinish={this.onReSubmit}>
          <div className={styles.commentForm__form}>
            <Form.Item
              label="Enter comments"
              name="comment"
              rules={[
                {
                  pattern: /^[\W\S_]{0,1000}$/,
                  message: 'Only fill up to 1000 characters !',
                },
                {
                  required: true,
                  message: 'Please input field !',
                },
              ]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </div>
          {this.renderSecondBtns()}
        </Form>
      </div>
    );
  };

  renderFirstBtns = () => {
    const { docProps = {}, loadingVerified } = this.props;

    const { candidateDocStatus } = docProps;
    return (
      <div className={styles.verifyDocumentModal__bottom}>
        <Button
          onClick={() => this.openResubmitForm(true)}
          className={`${styles.btn} ${styles.resubmitBtn}`}
        >
          Resubmit
        </Button>
        <Button
          onClick={this.handleVerified}
          className={`${styles.btn} ${styles.verifiedBtn}`}
          loading={loadingVerified}
          disabled={candidateDocStatus === 'VERIFIED'}
        >
          Verified
        </Button>
      </div>
    );
  };

  renderSecondBtns = () => {
    return (
      <div className={styles.verifyDocumentModal__bottom}>
        <Button
          onClick={() => this.openResubmitForm(false)}
          className={`${styles.btn} ${styles.resubmitBtn}`}
        >
          Cancel
        </Button>
        <Button
          htmlType="submit"
          className={`${styles.btn} ${styles.verifiedBtn}`}
          //   loading={loadingVerified}
        >
          Submit
        </Button>
      </div>
    );
  };

  render() {
    const { visible = false, docProps = {} } = this.props;
    const { openCommentForm } = this.state;

    const { url, displayName: fileName } = docProps;

    return (
      <Modal
        visible={visible}
        className={styles.verifyDocumentModal}
        title={this.renderTitle(fileName)}
        onCancel={this.destroyOnClose}
        destroyOnClose={this.destroyOnClose}
        footer={false}
      >
        <div className={`${styles.document} ${openCommentForm ? styles.document1 : ''}`}>
          <img src={url} alt="document" />
        </div>
        {openCommentForm && this.renderComments()}

        {openCommentForm ? null : this.renderFirstBtns()}
      </Modal>
    );
  }
}

export default VerifyDocumentModal;
