import React, { PureComponent } from 'react';
import { Row, Col, Input, Button, Popconfirm, Form, notification } from 'antd';
import { formatMessage, connect } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import addTemplateIcon from '@/assets/add-template-icon.svg';
import lightBulbIcon from '@/assets/offboarding-schedule.svg';
import checkTemplateIcon from '@/assets/check-template-icon.svg';
import removeIcon from '@/assets/remove-template-icon.svg';
import RelievingTemplates from '../RelievingTemplates';
import ModalContent from '../RelievingTemplates/components/ModalContent';
import styles from './index.less';

@connect(
  ({
    offboarding: {
      relievingDetails: { closingPackage = {}, _id = '', employee = {}, exitPackage = {} },
    },
    loading,
  }) => ({
    closingPackage,
    exitPackage,
    employee,
    ticketId: _id,
    loading: loading.effects['offboarding/sendClosePackage'],
  }),
)
class ClosingPackage extends PureComponent {
  constructor(props) {
    super(props);
    const {
      closingPackage: { waitList = [], packages = [], isSent },
    } = this.props;
    this.state = {
      isSent,
      closingPackage: waitList,
      customDocuments: packages,
      isOpenModalEdit: false,
      template: {},
      mode: '',
      emailInput: '',
    };
  }

  componentDidMount() {
    const { employee: { generalInfo: { workEmail = '' } = {} } = {} } = this.props;
    this.setState({
      emailInput: workEmail,
    });
  }

  // renderExtraContent = () => {
  //   const { isSent } = this.state;
  //   return (
  //     <div>
  //       {isSent ? null : (
  //         <img
  //           className={styles.closingPkg__card__iconExtra}
  //           style={{ paddingRight: '20px' }}
  //           src={addTemplateIcon}
  //           alt="add-template-icon"
  //         />
  //       )}
  //     </div>
  //   );
  // };

  handleSendMail = (value) => {
    const { toEmail } = value;
    const { dispatch, ticketId, closingPackage: { isSent = false } = {} } = this.props;

    // if (isSent) {
    //   dispatch({
    //     type: 'offboarding/sendClosePackage',
    //     payload: {
    //       packageType: 'CLOSING-PACKAGE',
    //       ticketId,
    //       toEmail,
    //     },
    //   });
    // } else {
    //   notification.warn({
    //     message: 'Cannot closing package!',
    //   });
    // }
    dispatch({
      type: 'offboarding/sendClosePackage',
      payload: {
        packageType: 'CLOSING-PACKAGE',
        ticketId,
        toEmail,
      },
    });
  };

  onValueChange = (value) => {
    this.setState({
      emailInput: value.toEmail,
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
    const { closingPackage, customDocuments, emailInput } = this.state;
    const {
      employee: { generalInfo: { workEmail = '' } = {} } = {},
      loading,
      exitPackage: { isSent = false } = {},
    } = this.props;

    return (
      <>
        <Row gutter={[40, 15]}>
          {closingPackage?.map((template, index) => {
            const { packageName } = template;
            return (
              <Col span={12} key={`${index + 1}`}>
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
          {customDocuments?.map((doc, index) => {
            if (typeof doc !== 'object') return null;
            const { key } = doc;
            return (
              <Col span={12} key={`${index + 1}`}>
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
        <Form
          id="packageToEmail"
          name="packageToEmail"
          onFinish={this.handleSendMail}
          onValuesChange={this.onValueChange}
          initialValues={{ toEmail: workEmail }}
          className={styles.formClosingPackage}
        >
          <Row gutter={[40, 15]} className={styles.closingPackage__inputSection}>
            <Col span={24}>
              <Form.Item
                name="toEmail"
                rules={[
                  {
                    type: 'email',
                    message: 'Email is invalid',
                  },
                ]}
              >
                <Input
                  placeholder={formatMessage({ id: 'pages.relieving.placeholder.sendMail' })}
                  className={styles.closingPackage__input}
                />
              </Form.Item>
            </Col>
            <Col span={24} className={styles.closingPackage__btnSection}>
              <Form.Item>
                <Button
                  type="default"
                  htmlType="submit"
                  className={styles.closingPackage__btn}
                  form="packageToEmail"
                  disabled={emailInput === '' || !isSent}
                  loading={loading}
                >
                  {formatMessage({ id: 'pages.relieving.btn.sendMail' })}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  renderAfterSendMail = () => {
    const {
      closingPackage: { packages = [], toEmail = '' },
      employee: {
        generalInfo: { workEmail = '' },
      },
    } = this.props;
    return (
      <>
        <Row gutter={[40, 15]}>
          {packages.map((doc, index) => {
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
        <Row gutter={[10, 15]} align="middle">
          <Col span={12}>
            <div className={styles.template}>{toEmail || workEmail || null}</div>
          </Col>
          <Col span={12}>
            <div className={styles.closingPackage__notification}>
              <img src={lightBulbIcon} alt="light-buld-icon" />
              <span>
                {formatMessage({ id: 'pages.relieving.closePackage.notification' })}{' '}
                {toEmail || workEmail || null}
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
        <div className={styles.closingPackage__title}>
          {formatMessage({ id: 'pages.relieving.closePackage' })}
          {/* {this.renderExtraContent()} */}
        </div>
        {isSent ? this.renderAfterSendMail() : this.renderBeforeSendMail()}
        {this.renderModalEditTemplate()}
      </div>
    );
  }
}

export default ClosingPackage;
