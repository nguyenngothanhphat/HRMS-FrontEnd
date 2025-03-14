import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import ActiveChat from './components/ActiveChat';
import MessageList from './components/MessageList';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';

import styles from './index.less';

@connect(
  ({
    conversation: { conversationList = [], listLastMessage = [], activeConversationUnseen } = {},
    user: { currentUser: { candidate: { _id: candidate = '' } = {} } } = {},
    candidatePortal: { data: { assignTo = {} } } = {},
    candidatePortal = {},
    candidatePortal: { data },
    loading,
  }) => ({
    data,
    conversationList,
    activeConversationUnseen,
    listLastMessage,
    candidate,
    assignTo,
    candidatePortal,
    loadingFetchConversations: loading.effects['conversation/getUserConversationsEffect'],
  }),
)
class Messages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeId: '',
      isReplyable: true,
    };
  }

  componentDidMount = () => {
    this.fetchConversations();
  };

  getListLastMessage = () => {
    const { dispatch, candidate: candidateId = '' } = this.props;
    dispatch({
      type: 'conversation/getListLastMessageEffect',
      payload: {
        userId: candidateId,
      },
    });
  };

  // fetch data
  fetchConversations = async () => {
    const { dispatch, candidate: candidateId = '' } = this.props;
    const getConversationList = () => {
      return dispatch({
        type: 'conversation/getUserConversationsEffect',
        payload: {
          userId: candidateId,
        },
      });
    };

    const res = await getConversationList();
    if (res.statusCode === 200) {
      // if (res.data.length === 0) {
      //   const res1 = await dispatch({
      //     type: 'conversation/addNewConversationEffect',
      //     payload: {
      //       senderId: candidateId,
      //       receiverId: hrId,
      //     },
      //   });
      //   if (res1.statusCode === 200) {
      //     getConversationList();
      //     // set active to created conversation
      //     this.onChangeActiveId(res1.data?._id, res1.data.isReplyable);
      //   }
      // } else {

      const { data = [] } = res;
      this.getListLastMessage();

      if (data.length > 0) {
        // set active to first message
        this.onChangeActiveId(data[0]._id, data[0].isReplyable, HRIcon1);
      }

      // }
    }
  };

  onChangeActiveId = (activeId, isReplyable, hrAvatar) => {
    this.setState({
      activeId,
      isReplyable,
      hrAvatar,
    });
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
    this.setSeenStatus(activeId);
  };

  onSeenMessage = () => {
    const {
      dispatch,
      activeId: conversationId = '',
      activeConversationUnseen,
      candidate: { _id: userId = '' } = {},
    } = this.props;
    activeConversationUnseen.forEach(async (item) => {
      if (item._id === conversationId) {
        await dispatch({
          type: 'conversation/seenMessageEffect',
          payload: {
            userId,
            conversationId,
          },
        });
        await dispatch({
          type: 'conversation/getConversationUnSeenEffect',
          payload: {
            userId,
          },
        });
      }
    });
  };

  setSeenStatus = async (conversationId) => {
    const { dispatch, candidate: candidateId = '' } = this.props;
    dispatch({
      type: 'conversation/seenMessageEffect',
      payload: {
        conversationId,
        userId: candidateId,
      },
    });

    this.fetchUnseenTotal();
  };

  fetchUnseenTotal = () => {
    const { dispatch, candidate: candidateId = '' } = this.props;
    dispatch({
      type: 'conversation/getConversationUnSeenEffect',
      payload: {
        userId: candidateId,
      },
    });
  };

  changeHrAvatar = (hrAvatar) => {
    this.setState({
      hrAvatar,
    });
  };

  render() {
    const { activeId, isReplyable, hrAvatar } = this.state;
    const {
      conversationList = [],
      listLastMessage = [],
      loadingFetchConversations = false,
      data: {
        CEOInfo: { generalInfoInfo: { firstName = '', lastName = '' } = {} || {} } = {} || {},
      },
      activeConversationUnseen = [],
    } = this.props;
    const charCeoName = firstName.charAt(0) + lastName.charAt(0);
    return (
      <div className={styles.Messages}>
        <Row type="flex" gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <MessageList
              messages={conversationList}
              activeId={activeId}
              onChangeActiveId={this.onChangeActiveId}
              loading={loadingFetchConversations}
              listLastMessage={listLastMessage}
              changeHrAvatar={this.changeHrAvatar}
              charCeoName={charCeoName}
              activeConversationUnseen={activeConversationUnseen}
            />
          </Col>
          <Col xs={24} lg={16}>
            <ActiveChat
              activeId={activeId}
              isReplyable={isReplyable}
              fetchUnseenTotal={this.fetchUnseenTotal}
              getListLastMessage={this.getListLastMessage}
              hrAvatar={hrAvatar}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
export default Messages;
