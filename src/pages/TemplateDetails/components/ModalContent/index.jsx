import React, { Component } from 'react';
import { Button } from 'antd';
import offerIcon from './assets/offer-icon.svg';
import sentIcon from './assets/sent-icon.svg';
import styles from './index.less';

class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalContent: [
        {
          icon: offerIcon,
          title: ' Offer letter template has been successfully created',
          content:
            'In order to use the template, it must be signed by the 2nd level authority. Template will be directly sent to the concerned 2nd level authority',
          button: 'Send for approval',
        },
        {
          icon: sentIcon,
          title: 'Offer  letter template sent for approval',
          content: '',
          button: 'OK',
        },
      ],
    };
  }

  onNext = () => {
    const { onNext = {} } = this.props;
    onNext();
  };

  render() {
    const { modalContent } = this.state;
    const { content = {} } = this.props;
    return (
      <div className={styles.ModalContent}>
        <img src={modalContent[content].icon} alt="icon" />
        <div className={styles.ModalContent_title}>{modalContent[content].title}</div>
        <div className={styles.ModalContent_content}>{modalContent[content].content}</div>
        <Button onClick={this.onNext} type="primary">
          {' '}
          {modalContent[content].button}
        </Button>
      </div>
    );
  }
}

export default ModalContent;
