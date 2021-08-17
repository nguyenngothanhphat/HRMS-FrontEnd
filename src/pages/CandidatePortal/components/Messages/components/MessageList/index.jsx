import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './index.less';

class MessageList extends PureComponent {
  handleLongString = (str) => {
    if (str.length <= 70) return str;
    return `${str.slice(0, 70)}...`;
  };

  onListClick = (_id) => {
    const { onChangeActiveId = () => {} } = this.props;
    onChangeActiveId(_id);
  };

  renderItem = (item, listLength, index) => {
    const { icon } = item;
    const lastMessage = item.chat[item.chat.length - 1].content || '';
    const { activeId = '', messages } = this.props;
    const isActive = activeId === item._id;

    const activeIndex = messages.findIndex((val) => val._id === activeId);

    return (
      <div key={index}>
        <div
          className={`${styles.eachItem} ${isActive ? styles.active : ''}`}
          onClick={() => this.onListClick(item._id)}
        >
          <div className={styles.messageIcon}>
            <img src={icon} alt="message" />
          </div>
          <div className={styles.messageContent}>
            <div className={styles.messageTitleContainer}>
              <span className={styles.messageTitle}>{item?.title || ''}</span>
              <span className={styles.messageDate}>{item?.time || ''}</span>
            </div>
            <span className={styles.message}>{this.handleLongString(lastMessage) || ''}</span>
          </div>
        </div>
        {index + 1 < listLength && !isActive && index + 1 !== activeIndex ? (
          <div className={styles.divider} />
        ) : (
          <div className={styles.dividerTransparent} />
        )}
      </div>
    );
  };

  getData = () => {
    const { messages = [], sliceNumber = 0 } = this.props;
    if (sliceNumber === 0 || !sliceNumber) return messages;
    return messages.slice(0, sliceNumber);
  };

  // search box
  searchPrefix = () => {
    return (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: 'black',
          marginRight: '10px',
        }}
      />
    );
  };

  render() {
    const data = this.getData();

    return (
      <div className={styles.MessageList}>
        <div className={styles.header}>
          <span>Messages</span>
        </div>
        <div className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="Search messages..."
            prefix={this.searchPrefix()}
          />
        </div>
        <div className={styles.content}>
          {data.map((val, index) => this.renderItem(val, data.length, index))}
        </div>
      </div>
    );
  }
}

export default MessageList;
