import React, { Component } from 'react';
import { Row, Col } from 'antd';

import styles from './index.less';

class ViewPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClickChange = () => {
    const { handleChange = () => {} } = this.props;
    handleChange();
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>Primary administrator</div>
          <div className={styles.header__action} onClick={this.onClickChange}>
            Change
          </div>
        </div>
        <div className={styles.primaryList}>
          <Row gutter={[0, 16]}>
            <Col span={8}>
              <div className={styles.primaryList__left}>
                <div>Employee Name</div>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.primaryList__right}>
                <div className={styles.name}>Renil Komitla</div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.primaryList__left}>
                <div>Email</div>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.primaryList__right}>
                <div className={styles.email}>renil@terralogic.com</div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.primaryList__left}>
                <div>Position</div>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.primaryList__right}>
                <div className={styles.email}>
                  renil@terralogic.comRenil’s permission apply to everyone in the company
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ViewPrimary;
