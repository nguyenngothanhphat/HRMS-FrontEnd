/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Row, Col, Divider } from 'antd';

import styles from './index.less';

class CompanySignatoryForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.CompanySignatoryForm}>
        <div className={styles.CompanySignatoryForm_form}>
          <Row gutter={[24, 12]} align="middle">
            <Col className={styles.CompanySignatoryForm_title} span={6}>
              Name of the signatory
            </Col>
            <Col className={styles.CompanySignatoryForm_title} span={12}>
              Signature
            </Col>
            <Col className={styles.CompanySignatoryForm_title} span={6}>
              Actions
            </Col>
          </Row>
          <Divider />
          <Row gutter={[24, 12]} align="middle">
            <Col className={styles.CompanySignatoryForm_content} span={6}>
              SanDeep Meta
            </Col>
            <Col className={styles.CompanySignatoryForm_content} span={12}>
              Very long signature
            </Col>
            <Col className={styles.CompanySignatoryForm_content} span={6}>
              Actions
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CompanySignatoryForm;
