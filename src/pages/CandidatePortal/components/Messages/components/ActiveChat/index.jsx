import { Button, Form, Input, Skeleton } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { io } from 'socket.io-client';
import { connect } from 'umi';
import { ChatEvent, SOCKET_URL } from '@/utils/chatSocket';
import UnseenIcon from '@/assets/candidatePortal/unseen.svg';
import SeenIcon from '@/assets/candidatePortal/seen.svg';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import styles from './index.less';

@connect(
  ({
    conversation: { conversationList = [], activeConversationMessages = [] } = {},
    user: { currentUser: { candidate = {} } } = {},
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
  }),
)
class ActiveChat extends PureComponent {
  formRef = React.createRef();

  socket = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
    this.mesRef = React.createRef();
    // this.onMessageChange = debounce(this.onMessageChange, 250);
  }

  componentDidMount() {
    this.scrollToBottom();
    // realtime get message
    // const { candidate } = this.props;
    this.socket.current = io(SOCKET_URL);
    // this.socket.current.emit(ChatEvent.ADD_USER, candidate._id);
    // this.socket.current.on(ChatEvent.GET_USER, (users) => {
    //   console.log('users messages', users);
    // });
    // this.socket.current.on(ChatEvent.GET_MESSAGE, (message) => {
    //   console.log('message a', message);
    //   this.saveNewMessage(message);
    // });
  }

  componentDidUpdate = () => {};

  componentWillUnmount = () => {
    // socket.on(ChatEvent.DISCONNECT, () => {});
    // socket.disconnect();
    const { dispatch } = this.props;
    dispatch({
      type: 'conversation/clearState',
    });
  };

  saveNewMessage = (message) => {
    const { dispatch, activeId = '', fetchUnseenTotal = () => {} } = this.props;
    setTimeout(() => {
      fetchUnseenTotal();
    }, 100);
    const { conversationId = '' } = message;
    if (conversationId === activeId) {
      dispatch({
        type: 'conversation/saveNewMessage',
        payload: message,
      });
    }
  };

  fetchMessages = async () => {
    const { dispatch, activeId = '' } = this.props;

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

  componentDidUpdate = (prevProps) => {
    const { activeId = '' } = this.props;
    if (prevProps.activeId !== activeId) {
      this.fetchMessages();
    }

    const { activeConversationMessages = [] } = this.props;
    if (
      JSON.stringify(activeConversationMessages) !==
      JSON.stringify(prevProps.conversation.activeConversationMessages)
    ) {
      this.scrollToBottom();
    }
  };

  scrollToBottom = () => {
    if (this.mesRef.current) {
      this.mesRef.current.scrollTop = this.mesRef.current.scrollHeight;
    }
  };

  // chat container
  renderSender = () => {
    return (
      <div className={styles.senderContainer}>
        <div className={styles.avatar}>
          <img src={HRIcon1} alt="message" />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>HR</span>
          <span className={styles.time}>Today</span>
        </div>
      </div>
    );
  };

  renderChatContent = (chat = []) => {
    const { candidate: { _id: candidateId = '' } = {} } = this.props;
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
            <img src={SeenIcon} alt="seen" />
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
            <img src={UnseenIcon} alt="seen" />
            <span className={styles.name}>{moment(item.createdAt).locale('en').format('LT')}</span>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.contentContainer} ref={this.mesRef}>
        {chat.map((item, index) => {
          if (item.sender === candidateId || item.senderId === candidateId) {
            return candidateMessage(item, index);
          }
          return senderMessage(item, index);
        })}
      </div>
    );
  };

  // chat input
  renderInput = () => {
    const { loadingMessages, activeId = '', isReplyable = true } = this.props;
    const disabled = loadingMessages || !activeId || !isReplyable;
    // if (!isReplyable) return '';
    return (
      <div className={styles.inputContainer}>
        <Form ref={this.formRef} name="inputChat" onFinish={this.onSendClick}>
          <Form.Item name="message">
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              maxLength={255}
              placeholder="Type a message..."
              disabled={disabled}
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={disabled}
              className={isReplyable ? '' : styles.disabledBtn}
              htmlType="submit"
            >
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  onSendClick = async (values) => {
    const {
      dispatch,
      activeId = '',
      candidate: { _id: candidateId = '' } = {},
      assignTo = '',
    } = this.props;
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
        const { fetchUnseenTotal = () => {} } = this.props;
        setTimeout(() => {
          fetchUnseenTotal();
        }, 100);
      }
    }
    this.scrollToBottom();
  };

  render() {
    const {
      activeConversationMessages: messages = [],
      activeId = '',
      loadingMessages = false,
    } = this.props;

    if (!activeId) {
      return (
        <div className={styles.ActiveChat}>
          <div className={styles.chatContainer}>
            <div style={{ margin: '32px' }}>No active conversation</div>
          </div>
          {this.renderInput()}
        </div>
      );
    }
    return (
      <div className={styles.ActiveChat}>
        <div className={styles.chatContainer}>
          {loadingMessages ? (
            <div style={{ margin: '32px' }}>
              <Skeleton />
            </div>
          ) : (
            <>
              {this.renderSender(messages)}
              {this.renderChatContent(messages)}
            </>
          )}
        </div>
        {this.renderInput()}
      </div>
    );
  }
}

export default ActiveChat;
