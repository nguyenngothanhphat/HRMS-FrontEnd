/* eslint-disable react/jsx-no-target-blank */
import React, { PureComponent } from 'react';
import { Row, Col, Pagination } from 'antd';
import relievingTemlateIcon from '@/assets/relievingTemlate.svg';
import templateIcon from '@/assets/templateIcon.svg';
import emailIcon from '@/assets/relievingMail.svg';
import editIcon from '@/assets/relievingEdit.svg';
import delIcon from '@/assets/relievingDel.svg';
import addIcon from '@/assets/relievingAdd.svg';
import uploadIcon from '@/assets/relievingUpload.svg';
import styles from './index.less';

class RelievingTemplates extends PureComponent {
  onClickEdit = (id, isDefault) => {
    const { isOpenModal = () => {} } = this.props;
    isOpenModal(id, isDefault);
  };

  _renderPagination = () => {
    return <Pagination simple defaultCurrent={2} total={50} />;
  };

  _renderExitInterview = () => {
    const { exitPackageTemplates = [], listTitle } = this.props;

    // if (exitPackageTemplates.length === 0) {
    //   return null;
    // }

    if (listTitle === 'Custom Templates')
      return (
        <div className={styles.templateList} style={{ paddingTop: '30px' }}>
          <div className={styles.list}>
            <Row>
              <Col span={22}>
                {exitPackageTemplates.map((template) => {
                  return (
                    <div key={template._id} className={styles.template}>
                      <Row justify="space-between">
                        <Col span={2}>
                          <img src={templateIcon} alt="template-icon" />
                        </Col>
                        <Col span={12}>
                          <a
                            // href={template.attachment.url}
                            // target="_blank"
                            className={styles.templateName}
                          >
                            {template.name}
                          </a>
                        </Col>
                        <Col className={styles.icons} align="right" span={10}>
                          <img src={emailIcon} alt="icon" />
                          <img
                            src={editIcon}
                            alt="icon"
                            onClick={() =>
                              this.onClickEdit(template._id, template.templateType === 'DEFAULT')
                            }
                          />
                          <img src={delIcon} alt="icon" />
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </div>
        </div>
      );

    return (
      <div className={styles.templateList} style={{ paddingTop: '30px' }}>
        <div className={styles.title}>
          <Row gutter={24} align="middle">
            <Col span={2}>
              {' '}
              <img src={relievingTemlateIcon} alt="icon" />
            </Col>
            <Col span={22} style={{ paddingLeft: '4px' }}>
              <div className={styles.title__text}>
                Exit interview package <span>(System Defaults)</span>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.list}>
          <Row justify="center">
            <Col span={22} offset={2}>
              {exitPackageTemplates.map((template) => {
                return (
                  <div key={template._id} className={styles.template}>
                    <Row justify="space-between">
                      <Col span={2}>
                        <img src={templateIcon} alt="template-icon" />
                      </Col>
                      <Col span={12}>
                        <a
                          // href={template.attachment.url}
                          // target="_blank"
                          className={styles.templateName}
                        >
                          {template.name}
                        </a>
                      </Col>
                      <Col className={styles.icons} align="right" span={10}>
                        <img src={emailIcon} alt="icon" />
                        <img
                          src={editIcon}
                          alt="icon"
                          onClick={() =>
                            this.onClickEdit(template._id, template.templateType === 'DEFAULT')
                          }
                        />
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  _renderClosingPackage = () => {
    const { closingPackageTemplates = [], listTitle } = this.props;
    // if (closingPackageTemplates.length === 0) {
    //   return null;
    // }

    if (listTitle === 'Custom Templates')
      return (
        <div className={styles.templateList}>
          <div className={styles.list}>
            <Row gutter={24}>
              <Col span={22}>
                {closingPackageTemplates.map((template) => {
                  return (
                    <div key={template._id} className={styles.template}>
                      <Row justify="space-between">
                        <Col span={2}>
                          <img src={templateIcon} alt="template-icon" />
                        </Col>
                        <Col span={12}>
                          <a
                            // href={template.attachment.url}
                            // target="_blank"
                            className={styles.templateName}
                          >
                            {template.name}
                          </a>
                        </Col>
                        <Col className={styles.icons} align="right" span={10}>
                          <img src={emailIcon} alt="icon" />
                          <img
                            src={editIcon}
                            alt="icon"
                            onClick={() =>
                              this.onClickEdit(template._id, template.templateType === 'DEFAULT')
                            }
                          />
                          <img src={delIcon} alt="icon" />
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </div>
        </div>
      );

    return (
      <>
        <hr style={listTitle === 'Custom Templates' ? { display: 'none' } : {}} />
        <div className={styles.templateList}>
          <div className={styles.title}>
            <Row gutter={24} align="middle">
              <Col span={2}>
                {' '}
                <img src={relievingTemlateIcon} alt="icon" />
              </Col>
              <Col style={{ paddingLeft: '4px' }} span={22}>
                <div className={styles.title__text}>
                  Closing package <span>(System Defaults)</span>
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.list}>
            <Row gutter={24} justify="center">
              <Col span={22} offset={2}>
                {closingPackageTemplates.map((template) => {
                  return (
                    <div key={template._id} className={styles.template}>
                      <Row justify="space-between">
                        <Col span={2}>
                          <img src={templateIcon} alt="template-icon" />
                        </Col>
                        <Col span={12}>
                          <a
                            // href={template.attachment.url}
                            // target="_blank"
                            className={styles.templateName}
                          >
                            {template.name}
                          </a>
                        </Col>
                        <Col className={styles.icons} align="right" span={10}>
                          <img src={emailIcon} alt="icon" />
                          <img
                            src={editIcon}
                            alt="icon"
                            onClick={() =>
                              this.onClickEdit(template._id, template.templateType === 'DEFAULT')
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              </Col>
            </Row>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { listTitle } = this.props;
    // if (exitPackageTemplates.length === 0 && closingPackageTemplates.length === 0) {
    //   return null;
    // }
    return (
      <div className={styles.relievingTemplates}>
        <div className={styles.header}>
          <p>{listTitle}</p>
          {listTitle === 'Custom Templates' ? (
            <div className={styles.actions}>
              <img src={addIcon} alt="icon" />
              <img src={uploadIcon} alt="icon" />
            </div>
          ) : null}
        </div>
        <hr className={styles.border} />
        {this._renderExitInterview()}

        {this._renderClosingPackage()}
      </div>
    );
  }
}

export default RelievingTemplates;
