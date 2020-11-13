import React, { Component } from 'react';
import { Radio } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

class Feedback extends Component {
  componentDidUpdate() {
    const { feedbackStatus } = this.props;
    const valid = this.initDefaultValue(feedbackStatus);

    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    if (valid === 1) {
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

  initDefaultValue = (feedbackStatus) => {
    // console.log(feedbackStatus);
    switch (feedbackStatus) {
      case 'VERIFIED': {
        return 1;
      }
      case 'RE-SUBMIT': {
        return 2;
      }
      case 'INELIGIBLE': {
        return 3;
      }
      default: {
        return 1;
      }
    }
  };

  render() {
    const radioStyle = {
      width: '100%',
      display: 'flex',
    };
    const { feedbackStatus } = this.props;
    console.log(feedbackStatus);
    return (
      <div className={styles.feedback}>
        <Radio.Group
          value={this.initDefaultValue(feedbackStatus)}
          className={styles.feedback__radio}
          defaultValue={this.initDefaultValue(feedbackStatus)}
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
