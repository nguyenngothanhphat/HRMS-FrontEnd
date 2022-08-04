import { Button, Form, Input, Popover, Spin } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import SeenIcon from '@/assets/candidatePortal/seen.svg';
import UnseenIcon from '@/assets/candidatePortal/unseen.svg';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { CHAT_EVENT } from '@/constants/socket';
import { socket } from '@/utils/socket';
import styles from './index.less';

@connect(
  ({
    conversation: {
      conversationList = [],
      activeConversationMessages = [],
      activeConversationUnseen = [],
    } = {},
    user: { currentUser: { candidate = {} } } = {},
    candidatePortal: {
      // candidate = '',
      data: { assignTo = {}, firstName: candidateFN = '', lastName: candidateLN = '' },
    } = {},
    candidatePortal: { data },
    conversation = {},
    candidatePortal = {},
    loading,
  }) => ({
    data,
    conversation,
    conversationList,
    candidate,
    candidateFN,
    candidateLN,
    activeConversationUnseen,
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
  }

  componentDidUpdate = () => {};

  componentWillUnmount = () => {
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

  getTime = (dateTime) => {
    const compare = (dateTimeA, dateTimeB) => {
      const momentA = moment(dateTimeA).format(DATE_FORMAT_MDY);
      const momentB = moment(dateTimeB).format(DATE_FORMAT_MDY);
      if (momentA === momentB) return 1;
      return 0;
    };

    const today = moment();
    const yesterday = moment().add(-1, 'days');

    if (compare(moment(dateTime), moment(today)) === 1) {
      return 'Today';
    }
    if (compare(moment(dateTime), moment(yesterday)) === 1) {
      return 'Yesterday';
    }
    return moment(dateTime).locale('en').format('MMMM Do');
  };

  // chat container
  renderSender = (messages = []) => {
    const {
      data: {
        CEOInfo: {
          generalInfoInfo: { legalName: ceoFullname = '', firstName = '', lastName = '' } = {} ||
            {},
        } = {} || {},
      },
      isReplyable = true,
    } = this.props;
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const charCeoName = firstName.charAt(0) + lastName.charAt(0);
    return (
      <div className={styles.senderContainer}>
        <div className={`${styles.avatarOutline} ${!isReplyable ? styles.avatarBgOutline : ''}`}>
          <div className={`${styles.avatar} ${!isReplyable ? styles.avatarBg : ''}`}>
            <span className={styles.avatarName}>{!isReplyable ? charCeoName : 'HR'}</span>
          </div>
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{!isReplyable ? ceoFullname : 'HR'}</span>
          <span className={styles.time}>
            {lastMessage ? this.getTime(lastMessage?.createdAt) : ''}
          </span>
        </div>
      </div>
    );
  };

  renderChatContent = (chat = []) => {
    const {
      candidate: { _id: candidateId = '' } = {},
      activeId = '',
      data: {
        CEOInfo: { generalInfoInfo: { firstName = '', lastName = '' } = {} || {} } = {} || {},
      },
      isReplyable = true,
    } = this.props;
    const charCeoName = firstName.charAt(0) + lastName.charAt(0);
    const senderMessage = (item, index) => {
      return (
        <div key={index} className={styles.senderMessage}>
          <div className={styles.above}>
            <div
              className={`${styles.avatarOutline} ${!isReplyable ? styles.avatarBgOutline : ''}`}
            >
              <div className={`${styles.avatar} ${!isReplyable ? styles.avatarBg : ''}`}>
                <span className={styles.avatarName}>{!isReplyable ? charCeoName : 'HR'}</span>
              </div>
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
          if (item.conversationId !== activeId) {
            return '';
          }
          if (item.sender === candidateId || item.senderId === candidateId) {
            return candidateMessage(item, index);
          }
          return senderMessage(item, index);
        })}
      </div>
    );
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

  // chat input
  renderInput = () => {
    const { loadingMessages, activeId = '', isReplyable = true } = this.props;
    const disabled = loadingMessages || !activeId || !isReplyable;
    const renderBtn = (
      <Button
        disabled={disabled}
        // className={isReplyable ? '' : styles.disabledBtn}
        htmlType="submit"
      >
        Send
      </Button>
    );

    const renderInputText = (
      <Input.TextArea
        onFocus={this.onSeenMessage}
        autoSize={{ minRows: 1, maxRows: 4 }}
        maxLength={255}
        placeholder="Type a message..."
        disabled={disabled}
      />
    );

    // if (!isReplyable) return '';
    return (
      <div className={styles.inputContainer}>
        <Form ref={this.formRef} name="inputChat" onFinish={this.onSendClick}>
          <Form.Item name="message">
            {disabled ? (
              <Popover content="Direct Messaging to this user has been disabled. Please raise all questions or concerns with the HR.">
                {renderInputText}
              </Popover>
            ) : (
              renderInputText
            )}
          </Form.Item>
          <Form.Item>
            {disabled ? (
              <Popover content="Direct Messaging to this user has been disabled. Please raise all questions or concerns with the HR.">
                {renderBtn}
              </Popover>
            ) : (
              renderBtn
            )}
          </Form.Item>
        </Form>
      </div>
    );
  };

  onSendClick = async (values) => {
    const {
      dispatch,
      activeId = '',
      candidate: { _id: candidateId = '', ticketID = '' } = {},
      assignTo = '',
    } = this.props;
    const { message } = values;
    if (activeId && message) {
      socket.emit(CHAT_EVENT.SEND_MESSAGE, {
        conversationId: activeId,
        senderId: candidateId,
        receiverId: assignTo?._id || assignTo || '',
        text: message,
      });

      dispatch({
        type: 'conversation/addNewMessageEffect',
        payload: {
          conversationId: activeId,
          sender: candidateId,
          text: message,
          isSeen: true,
          ticketID,
        },
      });

      this.formRef.current.setFieldsValue({
        message: '',
      });
      const { fetchUnseenTotal = () => {}, getListLastMessage = () => {} } = this.props;
      setTimeout(() => {
        fetchUnseenTotal();
        getListLastMessage();
      }, 100);
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
      <Spin spinning={loadingMessages}>
        <div className={styles.ActiveChat}>
          {this.renderSender(messages)}
          {this.renderChatContent(messages)}
          {this.renderInput()}
        </div>
      </Spin>
    );
  }
}

export default ActiveChat;
