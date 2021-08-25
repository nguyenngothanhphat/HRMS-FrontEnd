import { Button, Input, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import moment from 'moment';
import SeenIcon from '@/assets/candidatePortal/seen.svg';
import UnseenIcon from '@/assets/candidatePortal/unseen.svg';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import styles from './index.less';

@connect(
  ({
    conversation: { conversationList = [], activeConversationMessages = [] } = {},
    // user: { currentUser: { candidate = {} } } = {},
    candidatePortal: { candidate = '', data: { assignTo = {} } } = {},
    candidatePortal = {},
    loading,
  }) => ({
    conversationList,
    candidate,
    assignTo,
    candidatePortal,
    activeConversationMessages,
    loadingMessages: loading.effects['conversation/getConversationMessageEffect'],
  }),
)
class ActiveChat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
    this.mesRef = React.createRef();
    // this.onMessageChange = debounce(this.onMessageChange, 250);
  }

  componentDidMount() {
    this.scrollToBottom();
  }

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
    if (
      prevProps.activeId !== activeId
      // JSON.stringify(messages) !== JSON.stringify(prevProps.messages)
    ) {
      this.fetchMessages();
    }
  };

  scrollToBottom = () => {
    if (this.mesRef.current) {
      this.mesRef.current.scrollTop = this.mesRef.current?.scrollHeight;
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
      return (
        <div key={index} className={styles.candidateMessage}>
          <div className={styles.above}>
            <div className={styles.avatar}>
              <img src={HRIcon1} alt="sender-avatar" />
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
    const { loadingMessages } = this.props;
    const { message } = this.state;
    return (
      <div className={styles.inputContainer}>
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          maxLength={255}
          placeholder="Type a message..."
          onChange={this.onMessageChange}
          disabled={loadingMessages}
          value={message}
        />
        <Button disabled={loadingMessages} onClick={this.onSendClick}>
          Send
        </Button>
      </div>
    );
  };

  onMessageChange = (e) => {
    this.setState({
      message: e.target?.value || '',
    });
  };

  onSendClick = async () => {
    const { dispatch, activeId = '', candidate: candidateId = '' } = this.props;
    const { message } = this.state;
    if (activeId) {
      const res = await dispatch({
        type: 'conversation/addNewMessageEffect',
        payload: {
          conversationId: activeId,
          sender: candidateId,
          text: message,
        },
      });

      if (res.statusCode === 200) {
        this.setState({ message: '' });
        this.scrollToBottom();
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
          <div className={styles.chatContainer}>No messages</div>
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
