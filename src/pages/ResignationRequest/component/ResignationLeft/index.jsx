import icon from '@/assets/lightIcon.svg';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Button, Input, Spin } from 'antd';
// import Checkbox from 'antd/lib/checkbox/Checkbox';
// import moment from 'moment';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import styles from './index.less';

const { TextArea } = Input;
class ResigationLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonForLeaving: '',
      sendleaveRequest: false,
      changeLWD: '',
      viewDocumentModal: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    // dispatch({
    //   type: 'offboarding/fetchApprovalFlowList',
    //   payload: {
    //     company: companyID,
    //     location: locationID,
    //   },
    // });
    dispatch({
      type: 'offboarding/fetchList',
      payload: {
        status: 'IN-PROGRESS',
      },
    });
  }

  setViewDocumentModal = (value) => {
    this.setState({
      viewDocumentModal: value,
    });
  };

  onLinkClick = () => {
    this.setViewDocumentModal(true);
  };

  submitForm = (action) => {
    const { dispatch, approvalflow = [] } = this.props;
    const { reasonForLeaving, lastLWD } = this.state;
    const fiterActive = approvalflow.find((item) => item.status === 'ACTIVE') || {};
    dispatch({
      type: 'offboarding/sendRequest',
      payload: {
        reasonForLeaving,
        action,
        approvalFlow: fiterActive._id,
        requestLastDate: lastLWD,
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
        history.push('/offboarding');
      }
    });
  };

  handleChange = (e) => {
    this.setState({
      reasonForLeaving: e.target.value,
    });
  };

  handleRequestToChange = (e) => {
    const { target: { checked = '' } = {} } = e;
    this.setState({
      changeLWD: checked,
    });
  };

  handleLWD = (value) => {
    this.setState({
      lastLWD: value,
    });
  };

  getCurrentCompanyName = () => {
    const { companiesOfUser = [] } = this.props;
    const currentCompanyId = getCurrentCompany();
    let getName = companiesOfUser.map((item) => (item._id === currentCompanyId ? item.name : null));
    getName = getName.filter((item) => item !== null);
    return getName[0];
  };

  render() {
    const { reasonForLeaving = '', sendleaveRequest, changeLWD, viewDocumentModal } = this.state;
    const { loading, totalList = [], loadingFetchListRequest } = this.props;
    const checkInprogress = totalList.find(({ _id }) => _id === 'IN-PROGRESS') || {};
    const checkAccepted = totalList.find(({ _id }) => _id === 'ACCEPTED') || {};
    const checkSendRequest = checkInprogress.count > 0 || checkAccepted.count > 0;

    const companyName = this.getCurrentCompanyName() || '';
    const link =
      'https://api-stghrms.paxanimi.ai/api/attachments/60c6fda05c94a70561aaca2b/Revised_AIS_Rule_Vol_I_Rule_03.pdf';

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
            our{' '}
            <span onClick={this.onLinkClick} className={styles.offboardingPolicy}>
              Offboarding policy
            </span>{' '}
            to learn more. The LWD is system generated. Any change request has to be approved by the
            HR manager to come into effect.
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
            placeholder={
              companyName
                ? `The reason I have decided to end my journey with ${companyName} here is because…`
                : ''
            }
            disabled={sendleaveRequest || checkSendRequest}
          />
        </div>
        {/* <div className={styles.lastWorkingDay}>
          <span className={styles.title}>Last working date (System generated)</span>
          <div className={styles.datePicker}>
            <DatePicker format="MM.DD.YY" disabled defaultValue={moment().add('90', 'days')} />
            <div className={styles.notice}>
              <span className={styles.content}>
                The LWD is generated as per a 90 days period according to our{' '}
                <span className={styles.link}>Standard Offboarding Policy</span>
              </span>
            </div>
          </div>
          <div className={styles.requestToChange}>
            <Checkbox onClick={this.handleRequestToChange}>Request to change</Checkbox>
          </div>
          {changeLWD && (
            <div className={styles.datePicker}>
              <DatePicker onChange={this.handleLWD} format="MM.DD.YY" />
              <div className={styles.notice}>
                <span className={styles.content}>
                  Preferred LWD must be vetted by your reporting manager & approved by the HR
                  manager to come into effect.
                </span>
              </div>
            </div>
          )}
        </div> */}
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
        <ViewDocumentModal
          url={link}
          visible={viewDocumentModal}
          onClose={() => this.setViewDocumentModal(false)}
        />
      </div>
    );
  }
}

export default connect(
  ({
    offboarding: { approvalflow = [], totalList = [] } = {},
    user: {
      currentUser: { location: { _id: locationID = '' } = {} } = {},
      companiesOfUser = [],
    } = {},
    loading,
  }) => ({
    locationID,
    companiesOfUser,
    approvalflow,
    totalList,
    loading: loading.effects['offboarding/sendRequest'],
    loadingFetchListRequest: loading.effects['offboarding/fetchList'],
  }),
)(ResigationLeft);
