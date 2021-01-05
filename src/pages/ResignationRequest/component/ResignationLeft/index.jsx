import icon from '@/assets/offboarding-schedule.svg';
import { Button, Input, Spin } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
class ResigationLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonForLeaving: '',
      sendleaveRequest: false,
    };
  }

  componentDidMount() {
    const { dispatch, locationID, companyID } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'offboarding/fetchApprovalFlowList',
      payload: {
        company: companyID,
        location: locationID,
      },
    });
    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        status: 'IN-PROGRESS',
      },
    });
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
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        this.setState({
          sendleaveRequest: true,
        });
        dispatch({
          type: 'offboarding/fetchList',
          payload: {
            status: 'IN-PROGRESS',
          },
        });
      }
    });
  };

  handleChange = (e) => {
    this.setState({
      reasonForLeaving: e.target.value,
    });
  };

  render() {
    const { reasonForLeaving = '', sendleaveRequest } = this.state;
    const { loading, totalList = [], loadingFetchListRequest } = this.props;
    const checkInprogress = totalList.find(({ _id }) => _id === 'IN-PROGRESS') || {};
    const checkAccepted = totalList.find(({ _id }) => _id === 'ACCEPTED') || {};
    const checkSendRequest = checkInprogress.count > 0 || checkAccepted.count > 0;
    const date = moment().format('DD.MM.YY | h:mm A');
    if (loadingFetchListRequest)
      return (
        <div className={styles.viewLoading}>
          <Spin size="large" />
        </div>
      );
    return (
      <div className={styles.resignationLeft}>
        <div className={styles.title_Box}>
          <img src={icon} alt="iconCheck" className={styles.icon} />
          <span className={styles.title_Text}>
            A last working date (LWD) will generated after your request is approved by your manager
            and the HR.
            <div>
              The Last Working Day (LWD) will be generated as per our Standard Offboarding Policy.
            </div>
          </span>
        </div>
        <div className={styles.titleBody}>
          <div className={styles.center}>
            <p className={styles.textBox}>Reason for leaving us?</p>
            <p className={styles.textTime}>
              <span style={{ color: 'black' }}>{date}</span>
            </p>
          </div>
          <TextArea
            className={styles.boxReason}
            value={reasonForLeaving}
            onChange={this.handleChange}
            disabled={sendleaveRequest || checkSendRequest}
          />
        </div>
        {!sendleaveRequest && !checkSendRequest && (
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
        )}
      </div>
    );
  }
}

export default connect(
  ({
    offboarding: { approvalflow = [], totalList = [] } = {},
    user: {
      currentUser: {
        location: { _id: locationID = '' } = {},
        company: { _id: companyID } = {},
      } = {},
    } = {},
    loading,
  }) => ({
    locationID,
    companyID,
    approvalflow,
    totalList,
    loading: loading.effects['offboarding/sendRequest'],
    loadingFetchListRequest: loading.effects['offboarding/fetchList'],
  }),
)(ResigationLeft);
