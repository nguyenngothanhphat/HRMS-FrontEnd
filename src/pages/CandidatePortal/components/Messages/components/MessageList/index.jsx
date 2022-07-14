import React, { PureComponent } from 'react';
import { Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import HRIcon2 from '@/assets/candidatePortal/HRViolet.svg';
import HRIcon3 from '@/assets/candidatePortal/HRRed.svg';
import styles from './index.less';

const avatars = [HRIcon1, HRIcon2, HRIcon3];
class MessageList extends PureComponent {
  handleLongString = (str = '') => {
    if (str.length <= 70) return str;
    return `${str.slice(0, 70)}...`;
  };

  onListClick = (_id, isReplyable, hrAvatar) => {
    const { onChangeActiveId = () => {} } = this.props;
    onChangeActiveId(_id, isReplyable, hrAvatar);
  };

  getTime = (dateTime) => {
    const compare = (dateTimeA, dateTimeB) => {
      const momentA = moment(dateTimeA).format('DD/MM/YYYY');
      const momentB = moment(dateTimeB).format('DD/MM/YYYY');
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

  renderItem = (item, listLength, index) => {
    // const { icon } = item;
    // const lastMessage = item.chat[item.chat.length - 1].content || '';
    const { activeId = '', messages = [], listLastMessage = [], charCeoName = '' } = this.props;
    const isActive = activeId === item._id;

    const activeIndex = messages.findIndex((val) => val._id === activeId);
    const lastMessage = listLastMessage.find((message) => message?.conversationId === item._id);

    const hrAvatar = avatars[index % avatars.length];
    return (
      <div key={index}>
        <div
          className={`${styles.eachItem} ${isActive ? styles.active : ''}`}
          onClick={() => this.onListClick(item._id, item.isReplyable, hrAvatar)}
        >
          <div
            className={`${styles.messageIconOutline} ${
              !item.isReplyable ? styles.messageBgOutline : ''
            }`}
          >
            <div
              className={`${styles.messageIcon} ${!item.isReplyable ? styles.messageBgIcon : ''}`}
            >
              <span className={styles.iconName}>{!item.isReplyable ? charCeoName : 'HR'}</span>
            </div>
          </div>
          <div className={styles.messageContent}>
            <div className={styles.messageTitleContainer}>
              <span className={styles.messageTitle}>{item.title || 'HR'}</span>
              <span className={styles.messageDate}>
                {lastMessage ? this.getTime(lastMessage?.createdAt) : ''}
              </span>
            </div>
            <span className={styles.message}>
              {lastMessage ? this.handleLongString(lastMessage?.text) : ''}
            </span>
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
    const { loading = false, activeConversationUnseen = [] } = this.props;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      const findNewMess = activeConversationUnseen.find((x) => x._id === data[i]._id)
      // swap list message
      const temp = data[i]
      if (findNewMess && i > 0) {
        data[i] = data[i-1]
        data[i-1] = temp
      }
    }
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
          {loading ? (
            <div style={{ margin: '15px', display: 'flex', justifyContent: 'center' }}>
              <Spin />
            </div>
          ) : (
            data.map((val, index) => this.renderItem(val, data.length, index))
          )}
        </div>
      </div>
    );
  }
}

export default MessageList;
