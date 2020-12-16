import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Popconfirm } from 'antd';
import { formatMessage, connect } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import lightBulbIcon from '@/assets/offboarding-schedule.svg';
import removeIcon from '@/assets/remove-template-icon.svg';
import RelievingTemplates from '../RelievingTemplates';
import ModalContent from '../RelievingTemplates/components/ModalContent';
import styles from './index.less';

const closePackage = [
  {
    id: 1,
    attachment: {
      name: 'Relieving letter',
    },
  },
  {
    id: 2,
    attachment: {
      name: 'Experience letter',
    },
  },
];

@connect(({ offboarding: { relievingDetails: { closingPackage = {}, _id = '' } } }) => ({
  closingPackage,
  ticketId: _id,
}))
class ClosingPackage extends PureComponent {
  constructor(props) {
    super(props);
    const {
      closingPackage: { waitList = [], packages = [] },
    } = this.props;
    this.state = {
      isSent: false,
      closingPackage: waitList,
      customDocuments: packages,
      isOpenModalEdit: false,
      template: {},
      mode: '',
    };
  }

  handleSendMail = () => {
    this.setState({
      isSent: true,
    });
  };

  handleOnClick = (item, type) => {
    switch (type) {
      case 'template':
        this.setState({
          mode: 'View',
          template: item,
          isOpenModalEdit: true,
        });
        break;
      case 'doc':
        window.open(item.attachment?.url, '_blank');
        break;
      default:
        break;
    }
  };

  handleEdit = (template) => {
    this.setState({
      isOpenModalEdit: true,
      template,
      mode: 'Edit',
    });
  };

  handleCancelEdit = () => {
    this.setState({
      template: {},
      isOpenModalEdit: false,
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
            type: 'closingPackage',
            templateRelieving: item.templateRelieving,
          },
        });
        break;
      case 'doc':
        dispatch({
          type: 'offboarding/removeOffBoardingPackage',
          payload: {
            offboardRequest: ticketId,
            type: 'closingPackage',
            packageId: item._id,
          },
        });
        break;
      default:
        break;
    }
  };

  renderModalEditTemplate = () => {
    const { isOpenModalEdit, template, mode } = this.state;
    return (
      <RelievingTemplates
        mode={mode}
        visible={isOpenModalEdit}
        template={template}
        content={<ModalContent packageType="CLOSING-PACKAGE" template={template} mode={mode} />}
        handleCancelEdit={this.handleCancelEdit}
      />
    );
  };

  renderBeforeSendMail = () => {
    const { closingPackage, customDocuments } = this.state;
    return (
      <>
        <Row gutter={[40, 15]}>
          {closingPackage.map((template, index) => {
            const { packageName } = template;
            return (
              <Col span={10} key={`${index + 1}`}>
                <div className={styles.template}>
                  <div
                    className={styles.template__content}
                    onClick={() => this.handleOnClick(template, 'template')}
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
                      className={styles.edit__icon}
                      src={editIcon}
                      onClick={() => this.handleEdit(template, 'Edit')}
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
          {customDocuments.map((doc, index) => {
            const { key } = doc;
            return (
              <Col span={10} key={`${index + 1}`}>
                <div className={styles.template}>
                  <div className={styles.template__content}>
                    <img
                      src={templateIcon}
                      alt="template-icon"
                      onClick={() => this.handleOnClick(doc, 'doc')}
                    />
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
                </div>
              </Col>
            );
          })}
        </Row>
        <Row gutter={[40, 15]}>
          <Col span={14}>
            <Input
              className={styles.closingPackage__input}
              placeholder={formatMessage({ id: 'pages.relieving.placeholder.sendMail' })}
            />
          </Col>
          <Col span={7}>
            <Button
              type="default"
              className={styles.closingPackage__btn}
              onClick={this.handleSendMail}
            >
              {formatMessage({ id: 'pages.relieving.btn.sendMail' })}
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  renderAfterSendMail = () => {
    return (
      <>
        <Row gutter={[40, 15]}>
          {closePackage.map((template) => {
            const { attachment } = template;
            return (
              <Col span={10}>
                <div className={styles.template}>
                  <div className={styles.template__content}>
                    <img src={templateIcon} alt="template-icon" />
                    <span>{attachment.name}</span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
        <Row gutter={[10, 15]} align="middle">
          <Col span={12}>
            <div className={styles.template}>avvk.krisna@gmail.com</div>
          </Col>
          <Col span={12}>
            <div className={styles.closingPackage__notification}>
              <img src={lightBulbIcon} alt="light-buld-icon" />
              <span>
                {formatMessage({ id: 'pages.relieving.closePackage.notification' })}{' '}
                avvk.krishna@gmail.com
              </span>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  render() {
    const { isSent } = this.state;
    return (
      <div className={styles.closingPackage}>
        <p className={styles.closingPackage__title}>
          {formatMessage({ id: 'pages.relieving.closePackage' })}
        </p>
        {isSent ? this.renderAfterSendMail() : this.renderBeforeSendMail()}
        {this.renderModalEditTemplate()}
      </div>
    );
  }
}

export default ClosingPackage;
