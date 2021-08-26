import { Button, Input, Skeleton, Form } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { io } from 'socket.io-client';
import ChatEvent from '@/utils/chatSocket';

import SeenIcon from '@/assets/candidatePortal/seen.svg';
import UnseenIcon from '@/assets/candidatePortal/unseen.svg';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';

import styles from './index.less';

const socket = io('ws://file-stghrms.paxanimi.ai');

@connect(
  ({
    conversation: { conversationList = [], activeConversationMessages = [] } = {},
    // user: { currentUser: { candidate = {} } } = {},
    candidatePortal: {
      candidate = '',
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

  constructor(props) {
    super(props);
    this.state = {};
    this.mesRef = React.createRef();
    // this.onMessageChange = debounce(this.onMessageChange, 250);
  }

  componentDidMount() {
    this.scrollToBottom();
    // realtime get message
    const { candidate } = this.props;
    socket.emit(ChatEvent.ADD_USER, candidate);
    socket.on(ChatEvent.GET_USER, () => {});

    socket.on(ChatEvent.GET_MESSAGE, (data) => {
      this.saveNewMessage(data);
    });
  }

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
    const { candidate = '' } = this.props;
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
    const { loadingMessages, activeId = '' } = this.props;
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
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  onSendClick = async (values) => {
    const { dispatch, activeId = '', candidate: candidateId = '' } = this.props;
    const { message } = values;
    if (activeId && message) {
      const res = await dispatch({
        type: 'conversation/addNewMessageEffect',
        payload: {
          conversationId: activeId,
          sender: candidateId,
          text: message,
        },
      });

      if (res.statusCode === 200) {
        this.scrollToBottom();
        this.formRef.current.setFieldsValue({
          message: '',
        });
      }
    }
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
