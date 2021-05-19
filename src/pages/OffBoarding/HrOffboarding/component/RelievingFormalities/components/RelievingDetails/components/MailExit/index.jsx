import React, { Component } from 'react';
import { Card, Row, Col, Popconfirm } from 'antd';
import { connect, formatMessage } from 'umi';
import templateIcon from '@/assets/templateIcon.svg';
import editIcon from '@/assets/editMailExit.svg';
import removeIcon from '@/assets/deleteMailExist.svg';
import sendMailIcon from '@/assets/sendMailOffboarding.svg';
import addMailIcon from '@/assets/addMailOffboarding.svg';
// import addTemplateIcon from '@/assets/add-template-icon.svg';
import checkTemplateIcon from '@/assets/check-template-icon.svg';
import { dialog } from '@/utils/utils';
import RelievingTemplates from '../RelievingTemplates';
import ModalContent from '../RelievingTemplates/components/ModalContent';
import styles from './index.less';

@connect(({ offboarding: { relievingDetails: { exitPackage = {}, _id = '' } } }) => ({
  exitPackage,
  ticketId: _id,
}))
class MailExit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSent: false,
      template: {},
      isOpenModalEdit: false,
      exitPackageTemplates: [],
      customDocuments: [],
      mode: '',
    };
  }

  componentDidMount() {
    const {
      exitPackage: { waitList = [], isSent, packages = [] },
    } = this.props;
    this.setState({
      exitPackageTemplates: waitList,
      customDocuments: packages,
      isSent,
    });
  }

  renderExtraContent = () => {
    return (
      <div className={styles.icons}>
        <img
          className={styles.mailExit__card__iconExtra}
          style={{ paddingRight: '16px' }}
          src={addMailIcon}
          alt="add-template-icon"
        />
        <img
          onClick={this.sendMailPackage}
          className={styles.mailExit__card__iconExtra}
          src={sendMailIcon}
          alt="send-template-icon"
        />
      </div>
    );
  };

  sendMailPackage = () => {
    const { dispatch, ticketId } = this.props;
    const { isSent } = this.state;
    if (isSent) return dialog({ message: 'This package has already been sent successfully' });
    dispatch({
      type: 'offboarding/sendOffBoardingPackage',
      payload: {
        packageType: 'EXIT-PACKAGE',
        ticketId,
      },
    });
    return null;
  };

  handleClickEdit = (template, mode) => {
    this.setState({
      isOpenModalEdit: true,
      template,
      mode,
    });
  };

  handleRemoveTemplate = (item, type) => {
    const { dispatch, ticketId } = this.props;
    switch (type) {
      case 'template':
        dispatch({
          type: 'offboarding/removeOffBoardingPackage',
          payload: {
            offboardRequest: ticketId,
            type: 'exitPackage',
            templateRelieving: item.templateRelieving,
          },
        });
        break;
      case 'doc':
        dispatch({
          type: 'offboarding/removeOffBoardingPackage',
          payload: {
            offboardRequest: ticketId,
            type: 'exitPackage',
            packageId: item._id,
          },
        });
        break;
      default:
        break;
    }
  };

  handleCancelEdit = () => {
    this.setState({
      isOpenModalEdit: false,
      template: {},
    });
  };

  renderModalEditTemplate = () => {
    const { isOpenModalEdit, template, mode } = this.state;
    return (
      <RelievingTemplates
        mode={mode}
        visible={isOpenModalEdit}
        template={template}
        content={<ModalContent packageType="EXIT-PACKAGE" template={template} mode={mode} />}
        handleCancelEdit={this.handleCancelEdit}
      />
    );
  };

  renderAfterSendMail = () => {
    const {
      exitPackage: { packages = [] },
    } = this.props;
    return (
      <>
        <Row gutter={[40, 15]}>
          {packages?.map((doc, index) => {
            if (typeof doc !== 'object') return null;
            const { key } = doc;
            return (
              <Col span={10} key={`${index + 1}`}>
                <div className={styles.template}>
                  <div className={styles.template__content}>
                    <img src={templateIcon} alt="template-icon" />
                    <span>{key}</span>
                  </div>
                  <img src={checkTemplateIcon} alt="check-icon" />
                </div>
              </Col>
            );
          })}
        </Row>
      </>
    );
  };

  renderBeforeSendMail = () => {
    const { isSent = false, exitPackageTemplates, customDocuments } = this.state;
    console.log(exitPackageTemplates);
    return (
      <Row gutter={[21, 12]}>
        {exitPackageTemplates?.map((template, index) => {
          const { packageName } = template;
          return (
            <Col span={12} key={`${index + 1}`}>
              <div className={styles.template}>
                <div
                  className={styles.template__content}
                  onClick={() => this.handleClickEdit(template, 'View')}
                >
                  <img src={templateIcon} alt="template-icon" />
                  <span
                    style={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      width: '130px',
                    }}
                  >
                    {packageName}
                  </span>
                </div>
                <div className={styles.template__action}>
                  <img
                    onClick={() => this.handleClickEdit(template, 'Edit')}
                    className={styles.edit__icon}
                    src={editIcon}
                    alt="edit-icon"
                  />
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={() => this.handleRemoveTemplate(template, 'template')}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <img src={removeIcon} alt="remove-icon" />
                  </Popconfirm>
                </div>
              </div>
            </Col>
          );
        })}
        {customDocuments?.map((doc, index) => {
          if (typeof doc === 'object') {
            const {
              key,
              attachment: { url = '' },
            } = doc;
            return (
              <Col key={`${index + 1}`}>
                <div className={styles.template}>
                  <div
                    className={styles.template__content}
                    onClick={() => window.open(url, '_blank')}
                  >
                    <img src={templateIcon} alt="template-icon" />
                    <span
                      style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        width: '130px',
                      }}
                    >
                      {key}
                    </span>
                  </div>
                  {isSent ? (
                    <img src={checkTemplateIcon} alt="check-icon" />
                  ) : (
                    <div className={styles.template__action}>
                      <Popconfirm
                        title="Are you sure?"
                        onConfirm={() => this.handleRemoveTemplate(doc, 'doc')}
                        // onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <img src={removeIcon} alt="remove-icon" />
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </Col>
            );
          }
          return null;
        })}
      </Row>
    );
  };

  render() {
    const { isSent } = this.state;
    return (
      <div className={styles.mailExit}>
        <Card
          className={styles.mailExit__card}
          title={formatMessage({ id: 'pages.relieving.mailExit' })}
          extra={this.renderExtraContent()}
        >
          {isSent ? this.renderAfterSendMail() : this.renderBeforeSendMail()}
        </Card>
        {this.renderModalEditTemplate()}
      </div>
    );
  }
}

export default MailExit;
