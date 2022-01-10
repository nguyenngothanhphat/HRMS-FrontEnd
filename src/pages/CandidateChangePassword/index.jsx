import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import ChangePasswordBox from '@/components/ChangePasswordBox';
import { getCurrentTenant } from '@/utils/authority';
import { PORTAL_TAB_NAME } from '@/utils/candidatePortal';
import styles from './index.less';

const { TabPane } = Tabs;
const { CHANGE_PASSWORD } = PORTAL_TAB_NAME;

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
class CandidateChangePassword extends PureComponent {
  componentDidMount = async () => {
    const { dispatch, candidate = '' } = this.props;

    if (!dispatch || !getCurrentTenant() || !candidate?._id) {
      return;
    }
    await dispatch({
      type: 'candidatePortal/fetchCandidateById',
      payload: {
        candidate: candidate._id,
        tenantId: getCurrentTenant(),
        rookieID: candidate.ticketID,
      },
    });
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
        type: 'conversation/getNumberUnseenConversationEffect',
        payload: {
          userId: candidate._id,
        },
      });
    }
  };

  onFinish = async (values) => {
    const { dispatch } = this.props;
    const payload = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    const res = await dispatch({
      type: 'changePassword/updatePassword',
      payload,
    });
    if (res?.statusCode === 200) {
      setTimeout(() => {
        history.push(`/candidate-portal/dashboard`);
      }, 1000);
    }
  };

  render() {
    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;

    return (
      <div className={styles.CandidateChangePassword}>
        <Tabs
          activeKey={tabName || 'change-password'}
          onChange={(key) => {
            history.push(`/candidate-portal/${key}`);
          }}
          destroyInactiveTabPane
        >
          <TabPane tab="Change Password" key={CHANGE_PASSWORD}>
            <div className={styles.content}>
              <ChangePasswordBox onFinish={this.onFinish} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default CandidateChangePassword;
