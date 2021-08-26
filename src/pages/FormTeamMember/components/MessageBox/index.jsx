import { Button, Input, Skeleton, Form } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { io } from 'socket.io-client';
import ChatEvent from '@/utils/chatSocket';

import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import MessageIcon from '@/assets/candidatePortal/messageIcon.svg';

import styles from './index.less';

const socket = io('ws://file-stghrms.paxanimi.ai');

const { TextArea } = Input;

@connect(
  ({
    conversation: { conversationList = [], activeConversationMessages = [] } = {},
    // user: { currentUser: { candidate = {} } } = {},
    candidateInfo: {
      data: {
        candidate = '',
        assignTo = '',
        firstName: candidateFN = '',
        lastName: candidateLN = '',
      },
    } = {},
    conversation = {},
    loading,
  }) => ({
    conversation,
    conversationList,
    candidate,
    candidateFN,
    candidateLN,
    assignTo,
    activeConversationMessages,
    loadingMessages: loading.effects['conversation/getConversationMessageEffect'],
    loadingAddMessage: loading.effects['conversation/addNewMessageEffect'],
  }),
)
class MessageBox extends PureComponent {
  formRef = React.createRef();

  formRefEmptyChat = React.createRef();

  constructor(props) {
    super(props);
    this.state = { activeId: '' };
    this.mesRef = React.createRef();
  }

  componentDidMount = async () => {
    this.scrollToBottom();
    const { dispatch, candidate, assignTo: hrId = '' } = this.props;

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
            activeId: res.data[0]._id,
          });
          this.fetchMessages();
        } else {
          const res1 = await dispatch({
            type: 'conversation/addNewConversationEffect',
            payload: {
              senderId: hrId,
              receiverId: candidate,
            },
          });
          if (res1.statusCode === 200) {
            await getConversationList();
            this.setState({ activeId: res1.data._id });
          }
        }
      }

      // realtime get message
      socket.emit(ChatEvent.ADD_USER, candidate);
      socket.on(ChatEvent.GET_USER, () => {});

      socket.on(ChatEvent.GET_MESSAGE, (newMessage) => {
        this.saveNewMessage(newMessage);
      });
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
    socket.on(ChatEvent.DISCONNECT);
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
    const { candidate = '' } = this.props;
    const { candidateFN = '', candidateLN = '' } = this.props;
    const candidateMessage = (item, index) => {
      return (
        <div key={index} className={styles.candidateMessage}>
          <div className={styles.above}>
            <div className={styles.textAvatar}>
              {`${candidateFN ? candidateFN.charAt(0) : 'U'}${
                candidateLN ? candidateLN.charAt(0) : 'S'
              }`}
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

    return (
      <div className={styles.contentContainer} ref={this.mesRef}>
        {chat.map((item, index) => {
          if (item.sender === candidate) {
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
    const { dispatch, assignTo: hrId = '' } = this.props;
    const { activeId } = this.state;
    const { message } = values;
    if (activeId && message) {
      const res = await dispatch({
        type: 'conversation/addNewMessageEffect',
        payload: {
          conversationId: activeId,
          sender: hrId,
          text: message,
        },
      });

      if (res.statusCode === 200) {
        this.scrollToBottom();
        if (this.formRef?.current) {
          this.formRef.current.setFieldsValue({
            message: '',
          });
        }
        if (this.formRefEmptyChat?.current) {
          this.formRefEmptyChat.current.setFieldsValue({
            message: '',
          });
        }
      }
    }
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
