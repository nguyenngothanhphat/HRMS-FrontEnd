import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import templateIcon from '@/assets/template-icon.svg';
import editIcon from '@/assets/edit-template-icon.svg';
import removeIcon from '@/assets/remove-template-icon.svg';
import sendTemplateIcon from '@/assets/send-template-icon.svg';
import addTemplateIcon from '@/assets/add-template-icon.svg';
import checkTemplateIcon from '@/assets/check-template-icon.svg';
import RelievingTemplates from '../RelievingTemplates';
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

class MailExit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSend: false,
      templateId: '',
      isOpenModalEdit: false,
    };
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
      isSend: true,
    });
  };

  handleClickEdit = (id) => {
    this.setState({
      isOpenModalEdit: true,
      templateId: id,
    });
  };

  handleCancelEdit = () => {
    this.setState({
      isOpenModalEdit: false,
      templateId: '',
    });
  };

  renderModalEditTemplate = () => {
    const { isOpenModalEdit, templateId } = this.state;
    return (
      <RelievingTemplates
        visible={isOpenModalEdit}
        templateId={templateId}
        handleCancelEdit={this.handleCancelEdit}
      />
    );
  };

  render() {
    const { isSend = false } = this.state;
    return (
      <div className={styles.mailExit}>
        <Card
          className={styles.mailExit__card}
          title="Mail exit interview package"
          extra={this.renderExtraContent()}
        >
          {isSend ? (
            <Row gutter={[10, 20]}>
              {mailInterviewPackage.map((template) => {
                const { attachment } = template;
                return (
                  <Col span={this.renderSpanColumn(attachment.name)}>
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
              {mailInterviewPackage.map((template) => {
                const { id, attachment } = template;
                return (
                  <Col span={this.renderSpanColumn(attachment.name)}>
                    <div className={styles.template}>
                      <div className={styles.template__content}>
                        <img src={templateIcon} alt="template-icon" />
                        <span>{attachment.name}</span>
                      </div>
                      <div className={styles.template__action}>
                        <img
                          onClick={() => this.handleClickEdit(id)}
                          className={styles.edit__icon}
                          src={editIcon}
                          alt="edit-icon"
                        />
                        <img src={removeIcon} alt="remove-icon" />
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
