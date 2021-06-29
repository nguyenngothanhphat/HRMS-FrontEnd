import React, { Component } from 'react';
import { Radio } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

class Feedback extends Component {
  componentDidUpdate() {
    const allDocumentStatus = this.checkStatus();
    const { dispatch } = this.props;

    if (allDocumentStatus === 1) {
      dispatch({
        type: 'candidateInfo/updateAllDocumentVerified',
        payload: true,
      });
    } else {
      dispatch({
        type: 'candidateInfo/updateAllDocumentVerified',
        payload: false,
      });
    }
  }

  checkStatus = () => {
    const { docsList = [] } = this.props;
    const newVerifiedDocs = [];
    const newResubmitDocs = [];
    const newIneligibleDocs = [];

    const newDocumentList = [];

    const docsListFilter = docsList.map((item) => {
      const { data = [] } = item;
      let newData = [];
      data.forEach((doc) => {
        if (doc.isCandidateUpload) {
          newData = [...newData, doc];
        }
      });
      return {
        ...item,
        data: newData,
      };
    });

    docsListFilter.map((item) => {
      const { data = [] } = item;
      data.map((documentItem) => {
        newDocumentList.push(documentItem);
        return null;
      });
      return null;
    });

    newDocumentList.forEach((doc) => {
      const { candidateDocumentStatus: candidateDocStatus = '' } = doc;
      if (candidateDocStatus === 'RE-SUBMIT') {
        newResubmitDocs.push(doc);
      }
      if (candidateDocStatus === 'INELIGIBLE') {
        newIneligibleDocs.push(doc);
      }
      if (candidateDocStatus === 'VERIFIED') {
        newVerifiedDocs.push(doc);
      }
    });

    if (newVerifiedDocs.length > 0 && newVerifiedDocs.length === newDocumentList.length) {
      return 1;
    }
    if (newIneligibleDocs.length > 0) {
      return 3;
    }
    if (newResubmitDocs.length > 0) {
      return 2;
    }
    return 4;
  };

  render() {
    const radioStyle = {
      width: '100%',
      display: 'flex',
    };

    const allDocumentStatus = this.checkStatus();

    return (
      <div className={styles.feedback}>
        <Radio.Group
          value={allDocumentStatus}
          className={styles.feedback__radio}
          defaultValue={allDocumentStatus}
          onChange={this.onChange}
        >
          <Radio style={radioStyle} value={1}>
            <p>Mark as eligible.</p>
            <p>All documents have been verified</p>
          </Radio>
          <Radio style={radioStyle} value={2}>
            <p>Mark as eligible but additional document required.</p>
            <p>A few documents needs to be re-submitted</p>
          </Radio>
          <Radio style={radioStyle} value={3}>
            <p>Mark as ineligible.</p>
            <p>Documents submitted does not match requirement</p>
          </Radio>
        </Radio.Group>
      </div>
    );
  }
}

export default connect()(Feedback);
