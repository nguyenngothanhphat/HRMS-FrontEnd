import { Button, Form, Input, Skeleton } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { io } from 'socket.io-client';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import MessageIcon from '@/assets/candidatePortal/messageIcon.svg';
import { ChatEvent, SOCKET_URL } from '@/utils/chatSocket';

import styles from './index.less';

const { TextArea } = Input;

// const socket = io('http://localhost:8900');
@connect(
  ({
    conversation: { conversationList = [], activeConversationMessages = [] } = {},
    user: { currentUser: { candidate = {} || {} } } = {},
    candidatePortal: {
      // candidate = '',
      data: { assignTo = {}, firstName: candidateFN = '', lastName: candidateLN = '' },
    } = {},
    conversation = {},
    candidatePortal = {},
    loading,
  }) => ({
    conversation,
    conversationList,
    candidate,
    candidateFN,
    candidateLN,
    assignTo,
    candidatePortal,
    activeConversationMessages,
    loadingMessages: loading.effects['conversation/getConversationMessageEffect'],
    loadingAddMessage: loading.effects['conversation/addNewMessageEffect'],
  }),
)
class MessageBox extends PureComponent {
  formRef = React.createRef();

  formRefEmptyChat = React.createRef();

  socket = React.createRef();

  constructor(props) {
    super(props);
    this.state = { activeId: '' };
    this.mesRef = React.createRef();
  }

  componentDidMount = async () => {
    this.scrollToBottom();
    const { dispatch, candidate: { _id: candidate = '' } = {} } = this.props;

    if (candidate) {
      const getConversationList = () => {
        return dispatch({
          type: 'conversation/getUserConversationsEffect',
          payload: {
            userId: candidate,
          },
        });
      };

      const res = await getConversationList();
      const { statusCode, data = [] } = res || {};
      if (statusCode === 200) {
        if (data.length > 0) {
          this.setState({
            activeId: res.data[data.length - 1]._id,
          });
          this.fetchMessages();
        }
      }

      // realtime get message
      // socket.on(ChatEvent.DISCONNECT);
      // socket.emit(ChatEvent.ADD_USER, candidate);
      // socket.on(ChatEvent.GET_USER, () => {});

      this.socket.current = io(SOCKET_URL);
    }
  };

  componentDidUpdate = (prevProps) => {
    const { activeConversationMessages = [] } = this.props;
    if (
      JSON.stringify(activeConversationMessages) !==
      JSON.stringify(prevProps.conversation.activeConversationMessages)
    ) {
      this.scrollToBottom();
    }
  };

  componentWillUnmount = () => {
    // socket.on(ChatEvent.DISCONNECT, () => {});
    // socket.disconnect();
    const { dispatch } = this.props;
    dispatch({
      type: 'conversation/clearState',
    });
  };

  saveNewMessage = (message) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'conversation/saveNewMessage',
      payload: message,
    });
  };

  scrollToBottom = () => {
    if (this.mesRef.current) {
      this.mesRef.current.scrollTop = this.mesRef.current.scrollHeight;
    }
  };

  fetchMessages = async () => {
    const { dispatch } = this.props;
    const { activeId } = this.state;
    if (activeId) {
      await dispatch({
        type: 'conversation/getConversationMessageEffect',
        payload: {
          conversationId: activeId,
        },
      });
      this.scrollToBottom();
    }
  };

  // chat container
  renderSender = () => {
    return (
      <div className={styles.senderContainer}>
        <div className={styles.avatar}>
          <img src={MessageIcon} alt="message" />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>Messages</span>
        </div>
      </div>
    );
  };

  renderChatContent = (chat = []) => {
    const { candidate: { _id: candidate = '' } = {} } = this.props;
    const senderMessage = (item, index) => {
      return (
        <div key={index} className={styles.senderMessage}>
          <div className={styles.above}>
            <div className={styles.avatar}>
              <img src={HRIcon1} alt="sender-avatar" />
            </div>
            <div className={styles.messageBody}>
              <span className={styles.name}>{item.text || ''}</span>
            </div>
          </div>
          <div className={styles.seenDate}>
            <span className={styles.name}>{moment(item.createdAt).locale('en').format('LT')}</span>
          </div>
        </div>
      );
    };
    const candidateMessage = (item, index) => {
      const { candidateFN = '', candidateLN = '' } = this.props;
      return (
        <div key={index} className={styles.candidateMessage}>
          <div className={styles.above}>
            <div className={styles.textAvatar}>
              {`${candidateFN.charAt(0)}${candidateLN.charAt(0)}` || 'U'}
            </div>
            <div className={styles.messageBody}>
              <span className={styles.name}>{item.text || ''}</span>
            </div>
          </div>
          <div className={styles.seenDate}>
            <span className={styles.name}>{moment(item.createdAt).locale('en').format('LT')}</span>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.contentContainer} ref={this.mesRef}>
        {chat.map((item, index) => {
          if (item.sender === candidate || item.senderId === candidate) {
            return candidateMessage(item, index);
          }
          return senderMessage(item, index);
        })}
      </div>
    );
  };

  // chat input
  renderInput = () => {
    const { loadingMessages } = this.props;
    const { activeId } = this.state;

    return (
      <div className={styles.inputContainer}>
        <Form ref={this.formRef} name="inputChat" onFinish={this.onSendClick}>
          <Form.Item name="message">
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              maxLength={255}
              placeholder="Type a message..."
              disabled={loadingMessages || !activeId}
            />
          </Form.Item>
          <Form.Item>
            <Button disabled={loadingMessages || !activeId} htmlType="submit">
              Reply
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  onSendClick = async (values) => {
    const { dispatch, candidate: { _id: candidateId = '' } = {}, assignTo } = this.props;
    const { activeId } = this.state;
    const { message } = values;
    if (activeId && message) {
      this.socket.current.emit(ChatEvent.SEND_MESSAGE, {
        conversationId: activeId,
        senderId: candidateId,
        receiverId: assignTo?._id || assignTo || '',
        text: message,
      });

      const res = await dispatch({
        type: 'conversation/addNewMessageEffect',
        payload: {
          conversationId: activeId,
          sender: candidateId,
          text: message,
          isSeen: true,
        },
      });

      if (res.statusCode === 200) {
        this.formRef.current.setFieldsValue({
          message: '',
        });
        setTimeout(() => {
          this.fetchUnseenTotal();
        }, 100);
      }
    }
    this.scrollToBottom();
  };

  fetchUnseenTotal = () => {
    const { dispatch, candidate: { _id: candidateId = '' } = {} } = this.props;
    dispatch({
      type: 'conversation/getNumberUnseenConversationEffect',
      payload: {
        userId: candidateId,
      },
    });
  };

  // for empty chat
  renderEmptyChat = () => {
    return (
      <div className={styles.senderContainer} style={{ borderBottom: 'none' }}>
        <div className={styles.avatar}>
          <img src={MessageIcon} alt="message" />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>Send a note</span>
        </div>
      </div>
    );
  };

  renderFirstMessageTextArea = () => {
    const { loadingAddMessage = false } = this.props;
    return (
      <div className={styles.queryContent}>
        <span className={styles.describeText}>Message</span>

        <Form ref={this.formRef1} name="inputChatEmpty" onFinish={this.onSendClick}>
          <Form.Item name="message">
            <TextArea placeholder="Type a message..." autoSize={{ minRows: 4, maxRows: 10 }} />
          </Form.Item>
          <div className={styles.emptySendButton}>
            <Form.Item>
              <Button loading={loadingAddMessage} htmlType="submit" type="primary">
                Send
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  };

  render() {
    const { activeConversationMessages: messages = [], loadingMessages = false } = this.props;

    if (loadingMessages) {
      return (
        <div className={styles.MessageBox}>
          <div style={{ margin: '32px' }}>
            <Skeleton />
          </div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className={styles.MessageBox}>
          <div className={styles.chatContainer}>
            {this.renderEmptyChat()}
            {this.renderFirstMessageTextArea()}
          </div>
        </div>
      );
    }
    return (
      <div className={styles.MessageBox}>
        <div className={styles.chatContainer}>
          {this.renderSender(messages)}
          {this.renderChatContent(messages)}
        </div>
        {this.renderInput()}
      </div>
    );
  }
}

export default MessageBox;
