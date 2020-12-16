import React, { Component } from 'react';
import { Card, Row, Col, Popconfirm } from 'antd';
import { connect, formatMessage } from 'umi';
import templateIcon from '@/assets/template-icon.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import removeIcon from '@/assets/remove-template-icon.svg';
import sendTemplateIcon from '@/assets/send-template-icon.svg';
import addTemplateIcon from '@/assets/add-template-icon.svg';
import checkTemplateIcon from '@/assets/check-template-icon.svg';
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
      <div>
        <img
          className={styles.mailExit__card__iconExtra}
          style={{ paddingRight: '20px' }}
          src={addTemplateIcon}
          alt="add-template-icon"
        />
        <img
          onClick={this.sendMailPackage}
          className={styles.mailExit__card__iconExtra}
          src={sendTemplateIcon}
          alt="send-template-icon"
        />
      </div>
    );
  };

  sendMailPackage = () => {
    const { dispatch, ticketId } = this.props;
    dispatch({
      type: 'offboarding/sendOffBoardingPackage',
      payload: {
        packageType: 'EXIT-PACKAGE',
        ticketId,
      },
    });
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

  render() {
    const { isSent = false, exitPackageTemplates, customDocuments } = this.state;
    return (
      <div className={styles.mailExit}>
        <Card
          className={styles.mailExit__card}
          title={formatMessage({ id: 'pages.relieving.mailExit' })}
          extra={this.renderExtraContent()}
        >
          <Row gutter={[10, 20]}>
            {exitPackageTemplates?.map((template, index) => {
              const { packageName } = template;
              return (
                <Col key={`${index + 1}`}>
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
                    {isSent ? (
                      <img src={checkTemplateIcon} alt="check-icon" />
                    ) : (
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
                    )}
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
        </Card>
        {this.renderModalEditTemplate()}
      </div>
    );
  }
}

export default MailExit;
