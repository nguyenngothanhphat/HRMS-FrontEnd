import icon from '@/assets/lightIcon.svg';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Button, DatePicker, Input, Spin } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
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
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
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
            tenantId: getCurrentTenant(),
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
            Your Last Working Day (LWD) will be 90 day from the submission of this request. Check
            our <span className={styles.offboardingPolicy}>Offboarding policy</span> to learn more.
            The LWD is system generated. Any change request has to be approved by the HR manager to
            come into effect.
          </span>
        </div>
        <div className={styles.titleBody}>
          <div className={styles.center}>
            <p className={styles.textBox}>Reason for leaving us?</p>
            {/* <p className={styles.textTime}>
              <span style={{ color: 'black', fontSize: '13px' }}>{date}</span>
            </p> */}
          </div>
          <TextArea
            className={styles.boxReason}
            value={reasonForLeaving}
            onChange={this.handleChange}
            placeholder="The reason I have decided to end my journey with Lollypop here is because…"
            disabled={sendleaveRequest || checkSendRequest}
          />
        </div>
        <div className={styles.lastWorkingDay}>
          <span className={styles.title}>Last working date (System generated)</span>
          <div className={styles.datePicker}>
            <DatePicker format="MM.DD.YY" />
            <div className={styles.notice}>
              <span className={styles.content}>
                The LWD is generated as per a 90 days period according to our{' '}
                <span className={styles.link}>Standard Offboarding Policy</span>
              </span>
            </div>
          </div>
          <div className={styles.requestToChange}>
            <Checkbox>Request to change</Checkbox>
          </div>
        </div>
        {!sendleaveRequest && !checkSendRequest && (
          <div className={styles.subbmitForm}>
            <div className={styles.subbmiText}>
              By default notifications will be sent to HR, your manager and recursively loop to your
              department head.
            </div>
            <Button
              className={styles.buttonSaveToDraft}
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
