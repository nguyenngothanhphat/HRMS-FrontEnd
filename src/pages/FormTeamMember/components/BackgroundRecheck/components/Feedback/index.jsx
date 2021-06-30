import React, { Component } from 'react';
import { Radio } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

class Feedback extends Component {
  componentDidUpdate = () => {
    const { dispatch, checkStatus = () => {}, docsList = [] } = this.props;
    const allDocumentStatus = checkStatus(docsList);

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
  };

  render() {
    const radioStyle = {
      width: '100%',
      display: 'flex',
    };
    const { checkStatus = () => {}, docsList = [] } = this.props;
    const allDocumentStatus = checkStatus(docsList);

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
