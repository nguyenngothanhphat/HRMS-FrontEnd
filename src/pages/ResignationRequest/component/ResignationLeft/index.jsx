import React, { Component } from 'react';
import { Input, Button } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import icon from '@/assets/offboarding-schedule.svg';
import styles from './index.less';

const { TextArea } = Input;
class ResigationLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonForLeaving: '',
    };
  }

  submitForm = (action) => {
    const { dispatch, approvalflow = [] } = this.props;
    const { reasonForLeaving } = this.state;
    const fiterActive = approvalflow.find((item) => item.status === 'ACTIVE') || {};
    dispatch({
      type: 'offboarding/sendRequest',
      payload: {
        reasonForLeaving,
        action,
        approvalFlow: fiterActive._id,
      },
    });
  };

  handleChange = (e) => {
    this.setState({
      reasonForLeaving: e.target.value,
    });
  };

  render() {
    const { reasonForLeaving = '' } = this.state;
    const { loading } = this.props;
    const date = moment().format('DD.MM.YY | h:mm A');
    return (
      <div className={styles.resignationLeft}>
        <div className={styles.title_Box}>
          <div>
            <img src={icon} alt="iconCheck" className={styles.icon} />
          </div>
          <span className={styles.title_Text}>
            A last working date (LWD) will generated after your request is approved by your manager
            and the HR.
            <p>
              The Last Working Day (LWD) will be generated as per our Standard Offboarding Policy.
            </p>
          </span>
        </div>
        <div className={styles.titleBody}>
          <div className={styles.center}>
            <p className={styles.textBox}>Reason for leaving us?</p>
            <p className={styles.textTime}>
              <span style={{ color: 'black' }}> {date}</span>
            </p>
          </div>
          <TextArea
            className={styles.boxReason}
            value={reasonForLeaving}
            onChange={this.handleChange}
          />
        </div>

        <div className={styles.subbmitForm}>
          <div className={styles.subbmiText}>
            By default notifications will be sent to HR, your manager and recursively loop to your
            department head.
          </div>
          <Button
            disabled={!reasonForLeaving}
            onClick={() => this.submitForm('saveDraft')}
            type="link"
          >
            Save to draft
          </Button>
          <Button
            className={styles.buttonSubmit}
            htmlType="submit"
            onClick={() => this.submitForm('submit')}
            disabled={!reasonForLeaving}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(({ offboarding: { approvalflow = [] } = {}, loading }) => ({
  approvalflow,
  loading: loading.effects['offboarding/sendRequest'],
}))(ResigationLeft);
