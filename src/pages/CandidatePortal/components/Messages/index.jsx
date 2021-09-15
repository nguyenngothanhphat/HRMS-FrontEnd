import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import ActiveChat from './components/ActiveChat';
import MessageList from './components/MessageList';
import styles from './index.less';

@connect(
  ({
    conversation: { conversationList = [] } = {},
    user: { currentUser: { candidate: { _id: candidate = '' } = {} } } = {},
    candidatePortal: { data: { assignTo = {} } } = {},
    candidatePortal = {},
    loading,
  }) => ({
    conversationList,
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

  // fetch data
  fetchConversations = async () => {
    const { dispatch, candidate: candidateId = '', assignTo: { _id: hrId = '' } = {} } = this.props;
    const getConversationList = () => {
      return dispatch({
        type: 'conversation/getUserConversationsEffect',
        payload: {
          userId: candidateId,
        },
      });
    };

    const getListLastMessage = (conversations) => {
      return dispatch({
        type: 'conversation/getListLastMessageEffect',
        payload: {
          conversations,
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

      console.log('res', res);
      const { data = [] } = res;
      console.log('data', data);
      const conversations = data.map((d) => d._id) || [];
      console.log('conversations', conversations);
      getListLastMessage(conversations);

      if (data.length > 0) {
        // set active to first message
        this.onChangeActiveId(data[0]._id, data[0].isReplyable);
      }

      // }
    }
  };

  onChangeActiveId = (activeId, isReplyable) => {
    this.setState({
      activeId,
      isReplyable,
    });
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
    this.setSeenStatus(activeId);
  };

  setSeenStatus = async (conversationId) => {
    const { dispatch } = this.props;
    const res1 = await dispatch({
      type: 'conversation/setSeenEffect',
      payload: {
        conversationId,
      },
    });
    if (res1.statusCode === 200) {
      this.fetchUnseenTotal();
    }
  };

  fetchUnseenTotal = () => {
    const { dispatch, candidate: candidateId = '' } = this.props;
    dispatch({
      type: 'conversation/getNumberUnseenConversationEffect',
      payload: {
        userId: candidateId,
      },
    });
  };

  render() {
    const { activeId, isReplyable } = this.state;
    const { conversationList = [], loadingFetchConversations = false } = this.props;
    return (
      <div className={styles.Messages}>
        <Row type="flex" gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <MessageList
              messages={conversationList}
              activeId={activeId}
              onChangeActiveId={this.onChangeActiveId}
              loading={loadingFetchConversations}
            />
          </Col>
          <Col xs={24} lg={16}>
            <ActiveChat
              activeId={activeId}
              isReplyable={isReplyable}
              fetchUnseenTotal={this.fetchUnseenTotal}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
export default Messages;
