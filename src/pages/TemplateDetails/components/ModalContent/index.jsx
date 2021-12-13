import React, { Component } from 'react';
import { Link, formatMessage, connect } from 'umi';
import { Button } from 'antd';
import { getCurrentTenant } from '@/utils/authority';
import offerIcon from './assets/offer-icon.svg';
import sentIcon from './assets/sent-icon.svg';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeSetting: {
      currentTemplate: { title = '', htmlContent = '', thumbnail = '' } = {},
      newTemplateData: { settings = [], fullname = '', signature = '' },
    },
  }) => ({
    loadingAddCustomTemplate: loading.effects['employeeSetting/addCustomTemplate'],
    settings,
    fullname,
    thumbnail,
    signature,
    title,
    htmlContent,
  }),
)
class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAbleToSubmit: false,
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

  checkSubmit = () => {
    const { dispatch, settings, fullname, signature, title } = this.props;
    const newSetting = settings.filter((item) => item !== null && item !== undefined);
    const check = newSetting.map((data) => data.value !== '').every((data) => data === true);
    if (check === true && title !== '' && fullname !== '' && signature !== '') {
      dispatch({
        type: 'employeeSetting/save',
        payload: {
          isAbleToSubmit: true,
        },
      });
    } else {
      dispatch({
        type: 'employeeSetting/save',
        payload: {
          isAbleToSubmit: false,
        },
      });
    }
  };

  onNext = () => {
    const {
      dispatch,
      onNext = {},
      settings,
      fullname,
      signature,
      title,
      htmlContent,
      thumbnail,
    } = this.props;
    const newSetting = settings.filter((item) => item !== null && item !== undefined);
    const tenantId = getCurrentTenant();
    dispatch({
      type: 'employeeSetting/addCustomTemplate',
      payload: {
        title,
        html: htmlContent,
        settings: newSetting,
        fullname,
        signature,
        thumbnail,
        tenantId,
      },
    }).then(() => {
      onNext();
    });
  };

  _renderModal = () => {
    const { modalContent } = this.state;
    const { content = {}, loadingAddCustomTemplate } = this.props;
    return (
      <>
        <img src={modalContent[content].icon} alt="icon" />
        <div className={styles.ModalContent_title}>{modalContent[content].title}</div>
        <div className={styles.ModalContent_content}>{modalContent[content].content}</div>
        {content === 0 ? (
          <Button loading={loadingAddCustomTemplate} onClick={this.onNext} type="primary">
            {modalContent[content].button}
          </Button>
        ) : (
          <Link
            to={{
              pathname: '/onboarding/settings/documents-templates',
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
