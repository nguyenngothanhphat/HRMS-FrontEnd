import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import documentIcon from './assets/documentIcon.png';
import emailIcon from './assets/emailIcon.png';
import editIcon from './assets/editIcon.png';
import styles from './index.less';

class RelievingTemplates extends PureComponent {
  onClickEdit = (id) => {
    const { isOpenModal } = this.props;
    isOpenModal(id);
  };

  _renderExitInterview = () => {
    const { exitPackageTemplates } = this.props;

    return (
      <div className={styles.templateList} style={{ paddingTop: '30px' }}>
        <p className={styles.title}>
          <Row gutter={24} align="middle">
            <Col span={2}>
              {' '}
              <img src={documentIcon} alt="icon" />
            </Col>
            <Col span={22}>Exit interview package (System Defaults)</Col>
          </Row>
        </p>
        <div className={styles.list}>
          <Row gutter={24} justify="center">
            <Col span={22} offset={2}>
              {exitPackageTemplates?.map((template) => {
                return (
                  <div className={styles.template}>
                    <Row justify="space-between">
                      <Col span={18}>
                        <a className={styles.templateName}>{template.title}</a>
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
    return (
      <>
        <hr />
        <div className={styles.templateList}>
          <p className={styles.title}>
            <Row gutter={24} align="middle">
              <Col span={2}>
                {' '}
                <img src={documentIcon} alt="icon" />
              </Col>
              <Col span={22}>Closing package (System Defaults)</Col>
            </Row>
          </p>
          <div className={styles.list}>
            <Row gutter={24} justify="center">
              <Col span={22} offset={2}>
                <div className={styles.template}>
                  <Row justify="space-between">
                    <Col span={18}>
                      <a className={styles.templateName}>Experience letter</a>
                    </Col>
                    <Col className={styles.icons} align="right" span={6}>
                      <img src={emailIcon} alt="icon" />
                      <img src={editIcon} alt="icon" />
                    </Col>
                  </Row>
                </div>
                <div className={styles.template}>
                  <Row justify="space-between">
                    <Col span={18}>
                      <a className={styles.templateName}>Exit interview form</a>
                    </Col>
                    <Col className={styles.icons} align="right" span={6}>
                      <img src={emailIcon} alt="icon" />
                      <img src={editIcon} alt="icon" />
                    </Col>
                  </Row>
                </div>
                <div className={styles.template}>
                  <Row justify="space-between">
                    <Col span={18}>
                      <a className={styles.templateName}>Exit interview form</a>
                    </Col>
                    <Col className={styles.icons} align="right" span={6}>
                      <img src={emailIcon} alt="icon" />
                      <img src={editIcon} alt="icon" />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { listTitle } = this.props;
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
