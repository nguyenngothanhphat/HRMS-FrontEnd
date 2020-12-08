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

const mailInterviewPackage = [
  {
    id: 1,
    attachment: {
      name: 'Exit interview form',
    },
  },
  {
    id: 2,
    attachment: {
      name: 'NOC form',
    },
  },
  {
    id: 3,
    attachment: {
      name: 'Off boarding checklist',
    },
  },
];

@connect(({ offboarding: { relievingDetails: { exitPackage = {} } } }) => ({ exitPackage }))
class MailExit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSent: false,
      template: {},
      isOpenModalEdit: false,
      exitPackageTemplates: [],
      mode: '',
    };
  }

  componentDidMount() {
    const { exitPackage } = this.props;
    this.setState({
      exitPackageTemplates: exitPackage.waitList,
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

  renderSpanColumn = (name) => {
    if (name === 'NOC form') {
      return 7;
    }
    if (name === 'Off boarding checklist') {
      return 9;
    }
    return 8;
  };

  sendMailPackage = () => {
    this.setState({
      isSent: true,
    });
  };

  handleClickEdit = (template, mode) => {
    this.setState({
      isOpenModalEdit: true,
      template,
      mode,
    });
  };

  handleRemoveTemplate = (template) => {
    const { exitPackageTemplates } = this.state;
    const findIndex = exitPackageTemplates.findIndex((temp) => temp._id === template._id);
    if (findIndex > -1) {
      exitPackageTemplates.splice(findIndex, 1);
    }
    this.setState({
      exitPackageTemplates,
    });
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
        content={<ModalContent template={template} mode={mode} />}
        handleCancelEdit={this.handleCancelEdit}
      />
    );
  };

  render() {
    const { isSent = false, exitPackageTemplates } = this.state;
    return (
      <div className={styles.mailExit}>
        <Card
          className={styles.mailExit__card}
          title={formatMessage({ id: 'pages.relieving.mailExit' })}
          extra={this.renderExtraContent()}
        >
          {isSent ? (
            <Row gutter={[10, 20]}>
              {mailInterviewPackage.map((template, index) => {
                const { attachment } = template;
                return (
                  <Col span={this.renderSpanColumn(attachment.name)} key={`${index + 1}`}>
                    <div className={styles.template}>
                      <div className={styles.template__content}>
                        <img src={templateIcon} alt="template-icon" />
                        <span>{attachment.name}</span>
                      </div>
                      <div className={styles.template__action}>
                        {/* <img className={styles.edit__icon} src={editIcon} alt="edit-icon" /> */}
                        <img src={checkTemplateIcon} alt="check-icon" />
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Row gutter={[10, 20]}>
              {exitPackageTemplates?.map((template, index) => {
                const { packageName } = template;
                return (
                  <Col span={this.renderSpanColumn(packageName)} key={`${index + 1}`}>
                    <div className={styles.template}>
                      <div
                        className={styles.template__content}
                        onClick={() => this.handleClickEdit(template, 'View')}
                      >
                        <img src={templateIcon} alt="template-icon" />
                        <span>{packageName}</span>
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
                          onConfirm={() => this.handleRemoveTemplate(template)}
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
          )}
        </Card>
        {this.renderModalEditTemplate()}
      </div>
    );
  }
}

export default MailExit;
