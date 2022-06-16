import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import ReactJoyride from 'react-joyride';
import { NEW_COMER_CLASS, NEW_COMER_STEPS, PORTAL_TAB_NAME } from '@/utils/candidatePortal';
import { getCurrentTenant, getIsFirstLogin, setIsFirstLogin } from '@/utils/authority';
import Dashboard from './components/Dashboard';
import Messages from './components/Messages';
import WelcomeModal from './components/WelcomeModal';
import styles from './index.less';

const { TabPane } = Tabs;
const { DASHBOARD, MESSAGES, CHANGE_PASSWORD } = PORTAL_TAB_NAME;
@connect(
  ({
    candidatePortal: { localStep, data, tempData } = {},
    user: { currentUser: { candidate = {} } = {} } = {},
    loading,
    conversation: { conversationList = [], unseenTotal = 0 } = {},
  }) => ({
    localStep,
    data,
    tempData,
    candidate,
    conversationList,
    unseenTotal,
    loadingFetchCandidate: loading.effects['candidatePortal/fetchCandidateById'],
  }),
)
class CandidatePortal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openWelcomeModal: false,
    };
  }

  fetchCandidate = () => {
    const { dispatch, candidate = '' } = this.props;
    dispatch({
      type: 'candidatePortal/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    });
  };

  componentDidMount = async () => {
    const {
      dispatch,
      candidate = '',
      match: { params: { tabName = '' } = {} },
    } = this.props;

    if (!dispatch || !getCurrentTenant() || !candidate?._id) {
      return;
    }
    this.fetchCandidate();
    dispatch({
      type: 'candidatePortal/fetchDocumentByCandidate',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'candidatePortal/refreshPendingTasks',
    });

    const conversations = await dispatch({
      type: 'conversation/getUserConversationsEffect',
      payload: {
        userId: candidate._id,
      },
    });
    if (conversations.statusCode === 200) {
      dispatch({
        type: 'conversation/getConversationUnSeenEffect',
        payload: {
          userId: candidate._id,
        },
      });
    }

    // get welcome modal from local storage
    const openWelcomeModal = localStorage.getItem('openWelcomeModal');
    if (openWelcomeModal !== 'false' && tabName !== CHANGE_PASSWORD) {
      this.setState({
        openWelcomeModal: true,
      });
    }
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'candidatePortal/clearState',
      });
    }
  };

  handleWelcomeModal = (value) => {
    this.setState({
      openWelcomeModal: value,
    });
    localStorage.setItem('openWelcomeModal', value);
  };

  renderMessageTitle = () => {
    const { unseenTotal = 0 } = this.props;
    const addZeroToNumber = (number) => {
      if (number < 10 && number >= 0) return `0${number}`.slice(-2);
      return number;
    };

    return (
      <span className={styles.messageTitle}>
        Messages{' '}
        {unseenTotal > 0 && (
          <span className={styles.messageIndex}>{addZeroToNumber(unseenTotal)}</span>
        )}
      </span>
    );
  };

  onChangeTab = (key) => {
    history.push(`/candidate-portal/${key}`);
    this.fetchCandidate();
  };

  handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === 'finished') {
      setIsFirstLogin(false);
    }
  };

  render() {
    const { openWelcomeModal } = this.state;
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;
    const isFirstLogin = getIsFirstLogin();

    return (
      <div className={styles.CandidatePortal}>
        <Tabs activeKey={tabName || 'dashboard'} onChange={this.onChangeTab} destroyInactiveTabPane>
          <TabPane
            tab={<span className={NEW_COMER_CLASS.DASHBOARD_TAB}>Dashboard</span>}
            key={DASHBOARD}
          >
            <Dashboard />
          </TabPane>
          <TabPane
            tab={<span className={NEW_COMER_CLASS.MESSAGES_TAB}>{this.renderMessageTitle()}</span>}
            key={MESSAGES}
          >
            <Messages />
          </TabPane>
        </Tabs>
        <WelcomeModal
          visible={openWelcomeModal}
          onClose={() => {
            this.handleWelcomeModal(false);
          }}
        />
        <ReactJoyride
          steps={NEW_COMER_STEPS}
          continuous
          showProgress
          showSkipButton
          run={isFirstLogin}
          callback={this.handleJoyrideCallback}
          close
          styles={{
            options: {
              primaryColor: '#ffa100',
              width: 300,
              zIndex: 2023,
            },
          }}
        />
      </div>
    );
  }
}

export default CandidatePortal;
