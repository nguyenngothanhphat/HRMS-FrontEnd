import React, { Component } from 'react';
import { Link, formatMessage, connect } from 'umi';
import { Button } from 'antd';
import offerIcon from './assets/offer-icon.svg';
import sentIcon from './assets/sent-icon.svg';
import styles from './index.less';

@connect(
  ({
    employeeSetting: {
      currentTemplate: { title = '', htmlContent = '' } = {},
      newTemplateData: { settings = [], fullname = '', signature = '' },
    },
  }) => ({
    settings,
    fullname,
    signature,
    title,
    htmlContent,
  }),
)
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
    const { dispatch, onNext = {}, settings, fullname, signature, title, htmlContent } = this.props;
    dispatch({
      type: 'employeeSetting/addCustomTemplate',
      payload: {
        title,
        html: htmlContent,
        settings,
        fullname,
        signature,
      },
    });
    onNext();
  };

  _renderModal = () => {
    const { modalContent } = this.state;
    const { content = {} } = this.props;
    return (
      <>
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
            <Button type="primary">{modalContent[content].button}</Button>
          </Link>
        )}
      </>
    );
  };

  render() {
    // const { urlImage } = this.props;
    // console.log(urlImage);
    return <div className={styles.ModalContent}>{this._renderModal()}</div>;
  }
}

export default ModalContent;
