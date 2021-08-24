import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import MessageIcon from '@/assets/candidatePortal/messageIcon.svg';
import { Button, Input } from 'antd';
import React, { PureComponent } from 'react';
import styles from './index.less';

const { TextArea } = Input;

const messages = [
  {
    _id: 1,
    sender: 'HR Lolypop',
    title: `What’s next?`,
    time: 'Today',
    chat: [
      {
        _id: 1,
        sender: true,
        content: `Hello! We are excited to have you onboard on this amazing journey with...`,
      },
      {
        _id: 2,
        sender: false,
        content: `Thank you for the warm welcome!`,
      },
      {
        _id: 3,
        sender: false,
        content: `Thank you!`,
      },
    ],
    icon: HRIcon1,
  },
];
class MessageBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.mesRef = React.createRef();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (messages.length > 0) {
      this.mesRef.current.scrollTop = this.mesRef.current?.scrollHeight;
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

  renderChatContent = (message) => {
    const { chat = [], icon = '' } = message;

    const senderMessage = (item, index) => {
      return (
        <div key={index} className={styles.senderMessage}>
          <div className={styles.above}>
            <div className={styles.avatar}>
              <img src={icon} alt="sender-avatar" />
            </div>
            <div className={styles.messageBody}>
              <span className={styles.name}>{item.content || ''}</span>
            </div>
          </div>
          <div className={styles.seenDate}>
            <span className={styles.name}>03:02pm</span>
          </div>
        </div>
      );
    };

    const candidateMessage = (item, index) => {
      return (
        <div key={index} className={styles.candidateMessage}>
          <div className={styles.above}>
            <div className={styles.avatar}>
              <img src={icon} alt="sender-avatar" />
            </div>
            <div className={styles.messageBody}>
              <span className={styles.name}>{item.content || ''}</span>
            </div>
          </div>
          <div className={styles.seenDate}>
            <span className={styles.name}>03:02pm</span>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.contentContainer} ref={this.mesRef}>
        {chat.map((item, index) => {
          if (item.sender) {
            return senderMessage(item, index);
          }
          return candidateMessage(item, index);
        })}
      </div>
    );
  };

  // chat input
  renderInput = () => {
    return (
      <div className={styles.inputContainer}>
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 4 }}
          maxLength={255}
          placeholder="Type a message..."
        />
        <Button onClick={this.onSendClick}>Reply</Button>
      </div>
    );
  };

  onSendClick = () => {
    this.scrollToBottom();
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
    return (
      <div className={styles.queryContent}>
        <span className={styles.describeText}>Message</span>

        <TextArea placeholder="Type a message..." autoSize={{ minRows: 4, maxRows: 10 }} />
        <div className={styles.emptySendButton}>
          <Button type="primary">Send</Button>
        </div>
      </div>
    );
  };

  render() {
    const message = messages[0];
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
          {this.renderSender(message)}
          {this.renderChatContent(message)}
        </div>
        {this.renderInput()}
      </div>
    );
  }
}

export default MessageBox;
