import React, { Component } from 'react';
import { Button, Modal, Input, Form, Divider } from 'antd';
import { connect } from 'umi';
import { Document, Page, pdfjs } from 'react-pdf';

import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
      numPages: null,
    };
  }

  documentWarning = (msg) => (
    <div className={styles.viewLoading}>
      <p>{msg}</p>
    </div>
  );

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  };

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 0;
    }
  };

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
    const { openCommentForm, numPages } = this.state;

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
        {/* <div className={`${styles.document} ${openCommentForm ? styles.document1 : ''}`}>
          <img src={url} alt="document" />
        </div> */}
        <div className={`${styles.document} ${openCommentForm ? styles.document1 : ''}`}>
          {this.identifyImageOrPdf(url) === 0 ? (
            <div className={styles.imageFrame}>
              <img alt="document" src={url} />
            </div>
          ) : (
            <Document
              className={styles.pdfFrame}
              file={url}
              onLoadSuccess={this.onDocumentLoadSuccess}
              loading={this.documentWarning('Loading document. Please wait...')}
              noData={this.documentWarning('URL is not available.')}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  loading=""
                  className={styles.pdfPage}
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                />
              ))}
            </Document>
          )}
        </div>

        {openCommentForm && this.renderComments()}

        {openCommentForm ? null : this.renderFirstBtns()}
      </Modal>
    );
  }
}

export default VerifyDocumentModal;
