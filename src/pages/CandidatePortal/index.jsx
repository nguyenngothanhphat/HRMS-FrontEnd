import { getCurrentTenant } from '@/utils/authority';
import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import Dashboard from './components/Dashboard';
import Messages from './components/Messages';
import WelcomeModal from './components/WelcomeModal';
import styles from './index.less';

const { TabPane } = Tabs;

const messages = [
  {
    title: `What’s next?`,
    content: `Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with... Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Lollypop Design Studio!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Terralogic Family!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: `What’s next?`,
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Lollypop Design Studio!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
  {
    title: 'Welcome to Terralogic Family!',
    content: `Hello! We are excited to have you onboard on this amazing journey with...`,
  },
];

@connect(
  ({
    candidatePortal: { localStep, data, tempData } = {},
    user: { currentUser: { candidate = '' } = {} } = {},
    loading,
  }) => ({
    localStep,
    data,
    tempData,
    candidate,
    loadingFetchCandidate: loading.effects['candidatePortal/fetchCandidateById'],
  }),
)
class CandidatePortal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openWelcomeModal: true,
    };
  }

  componentDidMount = () => {
    const { dispatch, candidate = '' } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidatePortal/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    });
  };

  handleWelcomeModal = (value) => {
    this.setState({
      openWelcomeModal: value,
    });
  };

  renderMessageTitle = (data) => {
    const addZeroToNumber = (number) => {
      if (number < 10 && number >= 0) return `0${number}`.slice(-2);
      return number;
    };

    return (
      <span className={styles.messageTitle}>
        Messages <span className={styles.messageIndex}>{addZeroToNumber(data.length)}</span>
      </span>
    );
  };

  render() {
    const { openWelcomeModal } = this.state;
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;

    return (
      <div className={styles.CandidatePortal}>
        <Tabs
          activeKey={tabName || 'dashboard'}
          onChange={(key) => {
            history.push(`/candidate-portal/${key}`);
          }}
        >
          <TabPane tab="Dashboard" key="dashboard">
            <Dashboard />
          </TabPane>
          <TabPane tab={this.renderMessageTitle(messages)} key="messages">
            <Messages messages={messages} />
          </TabPane>
        </Tabs>
        <WelcomeModal visible={openWelcomeModal} onClose={() => this.handleWelcomeModal(false)} />
      </div>
    );
  }
}

export default CandidatePortal;
