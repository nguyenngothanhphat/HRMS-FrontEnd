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
      comments: '',
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
    onClose();
  };

  onSubmit = (comments = '') => {
    const {
      dispatch,
      candidate,
      docProps: { documentId: document = '' } = {},
      onClose = () => {},
    } = this.props;
    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'newCandidateForm/checkDocumentEffect',
      payload: {
        candidate,
        document,
        candidateDocumentStatus: 1,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
      }
    });
  };

  handleVerified = () => {
    this.onSubmit();
  };

  handleReSubmit = () => {
    const { comments } = this.state;
    this.onSubmit(comments);
  };

  openResubmitForm = () => {
    this.setState({
      openCommentForm: true,
    });
  };

  onValuesChange = (value) => {
    const { comments = '' } = value;
    this.setState({
      comments,
    });
  };

  renderComments = () => {
    return (
      <div className={styles.commentForm}>
        <Divider className={styles.divider} />
        <Form onValuesChange={this.onValuesChange}>
          <Form.Item label="Enter comments" name="comments">
            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Form>
      </div>
    );
  };

  renderFirstBtns = () => {
    const { docProps = {}, loadingVerified } = this.props;

    const { candidateDocStatus } = docProps;
    return (
      <div className={styles.verifyDocumentModal__bottom}>
        <Button onClick={this.openResubmitForm} className={`${styles.btn} ${styles.resubmitBtn}`}>
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
        <Button onClick={this.handleResubmit} className={`${styles.btn} ${styles.resubmitBtn}`}>
          Cancel
        </Button>
        <Button
          onClick={this.onReSubmit}
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

        {openCommentForm ? this.renderSecondBtns() : this.renderFirstBtns()}
      </Modal>
    );
  }
}

export default VerifyDocumentModal;
