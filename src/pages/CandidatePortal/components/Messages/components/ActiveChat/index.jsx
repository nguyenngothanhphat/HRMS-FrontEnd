import { Button, Input } from 'antd';
import React, { PureComponent } from 'react';
import SeenIcon from '@/assets/candidatePortal/seen.svg';
import UnseenIcon from '@/assets/candidatePortal/unseen.svg';
import styles from './index.less';

class ActiveChat extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // chat container
  renderSender = (message) => {
    const { icon = '', sender = '', time = '' } = message;

    return (
      <div className={styles.senderContainer}>
        <div className={styles.avatar}>
          <img src={icon} alt="message" />
        </div>
        <div className={styles.info}>
          <span className={styles.name}>{sender || ''}</span>
          <span className={styles.time}>{time}</span>
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
            <img src={SeenIcon} alt="seen" />
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
            <img src={UnseenIcon} alt="seen" />
            <span className={styles.name}>03:02pm</span>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.contentContainer}>
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
        <Button>Send</Button>
      </div>
    );
  };

  render() {
    const { messages = {}, activeId = '' } = this.props;
    const message = messages.find((val) => val._id === activeId);
    return (
      <div className={styles.ActiveChat}>
        <div className={styles.chatContainer}>
          {this.renderSender(message)}
          {this.renderChatContent(message)}
        </div>
        {this.renderInput()}
      </div>
    );
  }
}

export default ActiveChat;
