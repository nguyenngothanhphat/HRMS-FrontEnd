import React, { Component } from 'react';
import { Col, Row } from 'antd';

import BenefitPage from './components/BenefitSection';
import NoteBox from './components/NoteBox';

import styles from './index.less';

class BenefitsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.benefitManagement}>
        <Row gutter={[0, 24]}>
          <Col span={17}>
            <BenefitPage />
          </Col>
          <Col span={7}>
            <NoteBox />
          </Col>
        </Row>
      </div>
    );
  }
}

export default BenefitsManagement;
