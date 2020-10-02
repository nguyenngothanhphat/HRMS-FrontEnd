import React, { Component } from 'react';
import { Link, formatMessage } from 'umi';
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
          title: formatMessage({ id: 'component.modalContent.title1' }),
          content: formatMessage({ id: 'component.modalContent.content' }),
          button: formatMessage({ id: 'component.modalContent.buttonApproval' }),
        },
        {
          icon: sentIcon,
          title: formatMessage({ id: 'component.modalContent.title2' }),
          content: '',
          button: formatMessage({ id: 'component.modalContent.buttonOK' }),
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
        {content === 0 ? (
          <Button onClick={this.onNext} type="primary">
            {modalContent[content].button}
          </Button>
        ) : (
          <Link
            to={{
              pathname: '/employee-onboarding',
              state: { defaultActiveKey: '2' },
            }}
          >
            <Button onClick={this.onNext} type="primary">
              {modalContent[content].button}
            </Button>
          </Link>
        )}
      </div>
    );
  }
}

export default ModalContent;
