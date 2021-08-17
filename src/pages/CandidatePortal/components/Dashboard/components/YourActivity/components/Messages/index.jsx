import React, { PureComponent } from 'react';
import HRIcon1 from '@/assets/candidatePortal/HRCyan.svg';
import HRIcon2 from '@/assets/candidatePortal/HRViolet.svg';
import HRIcon3 from '@/assets/candidatePortal/HRRed.svg';
import ViewMessageModal from '../../../ViewMessageModal';
import styles from './index.less';

const icons = [HRIcon1, HRIcon2, HRIcon3];

class Messages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      selectedItem: { item: {}, icon: '' },
    };
  }

  handleModal = (value) => {
    this.setState({
      openModal: value,
    });
  };

  handleLongString = (str) => {
    if (str.length <= 70) return str;
    return `${str.slice(0, 70)}...`;
  };

  renderItem = (item, listLength, index) => {
    const icon = icons[index % icons.length];
    const selectedItem = { item, icon };
    return (
      <>
        <div
          className={styles.eachItem}
          onClick={() => {
            this.setState({
              selectedItem,
            });
            this.handleModal(true);
          }}
        >
          <div className={styles.messageIcon}>
            <img src={icon} alt="message" />
          </div>
          <div className={styles.messageContent}>
            <span className={styles.messageTitle}>{item?.title || ''}</span>
            <span className={styles.message}>{this.handleLongString(item?.content) || ''}</span>
          </div>
        </div>
        {index + 1 < listLength && <div className={styles.divider} />}
      </>
    );
  };

  getData = () => {
    const { messages = [], sliceNumber = 0 } = this.props;
    if (sliceNumber === 0 || !sliceNumber) return messages;
    return messages.slice(0, sliceNumber);
  };

  render() {
    const { openModal, selectedItem } = this.state;
    const data = this.getData();

    return (
      <div className={styles.Messages}>
        {data.map((val, index) => this.renderItem(val, data.length, index))}
        <ViewMessageModal
          onClose={() => this.handleModal(false)}
          visible={openModal}
          item={selectedItem.item}
          icon={selectedItem.icon}
        />
      </div>
    );
  }
}

export default Messages;
