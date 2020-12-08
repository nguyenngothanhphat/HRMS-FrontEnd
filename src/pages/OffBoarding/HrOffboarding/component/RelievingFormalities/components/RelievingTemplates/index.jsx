/* eslint-disable react/jsx-no-target-blank */
import React, { PureComponent } from 'react';
import { Row, Col, Pagination } from 'antd';
import documentIcon from './assets/documentIcon.png';
import emailIcon from './assets/emailIcon.png';
import editIcon from './assets/editIcon.png';
import styles from './index.less';

class RelievingTemplates extends PureComponent {
  onClickEdit = (id) => {
    const { isOpenModal } = this.props;
    isOpenModal(id);
  };

  _renderPagination = () => {
    return <Pagination simple defaultCurrent={2} total={50} />;
  };

  _renderExitInterview = () => {
    const { exitPackageTemplates } = this.props;
    if (exitPackageTemplates.length === 0) {
      return null;
    }
    return (
      <div className={styles.templateList} style={{ paddingTop: '30px' }}>
        <div className={styles.title}>
          <Row gutter={24} align="middle">
            <Col span={2}>
              {' '}
              <img src={documentIcon} alt="icon" />
            </Col>
            <Col span={22}>Exit interview package (System Defaults)</Col>
          </Row>
        </div>
        <div className={styles.list}>
          <Row gutter={24} justify="center">
            <Col span={22} offset={2}>
              {exitPackageTemplates?.map((template) => {
                return (
                  <div key={template._id} className={styles.template}>
                    <Row justify="space-between">
                      <Col span={18}>
                        <a
                          // href={template.attachment.url}
                          // target="_blank"
                          className={styles.templateName}
                        >
                          {template.name}
                        </a>
                      </Col>
                      <Col className={styles.icons} align="right" span={6}>
                        <img src={emailIcon} alt="icon" />
                        <img
                          src={editIcon}
                          alt="icon"
                          onClick={() => this.onClickEdit(template._id)}
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
    const { closingPackageTemplates } = this.props;
    if (closingPackageTemplates.length === 0) {
      return null;
    }
    return (
      <>
        <hr />
        <div className={styles.templateList}>
          <div className={styles.title}>
            <Row gutter={24} align="middle">
              <Col span={2}>
                {' '}
                <img src={documentIcon} alt="icon" />
              </Col>
              <Col span={22}>Closing package (System Defaults)</Col>
            </Row>
          </div>
          <div className={styles.list}>
            <Row gutter={24} justify="center">
              <Col span={22} offset={2}>
                {closingPackageTemplates?.map((template) => {
                  return (
                    <div key={template._id} className={styles.template}>
                      <Row justify="space-between">
                        <Col span={18}>
                          <a
                            // href={template.attachment.url}
                            // target="_blank"
                            className={styles.templateName}
                          >
                            {template.name}
                          </a>
                        </Col>
                        <Col className={styles.icons} align="right" span={6}>
                          <img src={emailIcon} alt="icon" />
                          <img
                            src={editIcon}
                            alt="icon"
                            onClick={() => this.onClickEdit(template._id)}
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
    const { listTitle, exitPackageTemplates, closingPackageTemplates } = this.props;
    if (exitPackageTemplates.length === 0 && closingPackageTemplates.length === 0) {
      return null;
    }
    return (
      <div className={styles.relievingTemplates}>
        <div className={styles.header}>
          <p>{listTitle}</p>
        </div>
        <hr className={styles.border} />
        {this._renderExitInterview()}

        {this._renderClosingPackage()}
      </div>
    );
  }
}

export default RelievingTemplates;
