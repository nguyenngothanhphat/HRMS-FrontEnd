import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from '../../index.less';

class DivisionItem extends PureComponent {
  render() {
    const { item } = this.props;
    const {
      devisionId = '',
      devisionName = '',
      primaryPOCName = '',
      primaryPOCNumber = '',
      primaryPOCEmail = '',
      primaryPOCDesignation = '',
      secondaryPOCName = '',
      secondaryPOCNumber = '',
      secondaryPOCEmail = '',
      secondaryPOCDesignation = '',
      addressLine1 = '',
      addressLine2 = '',
      city = '',
      state = '',
      country = '',
      postalCode = '',
    } = item;
    return (
      <div>
        <Row className={styles.divisionSecondary}>
          <Col span={12}>
            <p>Division ID:</p>
          </Col>
          <Col span={12}>
            <p>{devisionId}</p>
          </Col>

          <Col span={12}>
            <p>Division Name:</p>
          </Col>
          <Col span={12}>
            <p>{devisionName}</p>
          </Col>

          <Col span={12} style={{ marginBottom: '0' }}>
            <p style={{ marginBottom: '0' }}>Primary POC Name:</p>
          </Col>
          <Col span={12} style={{ marginBottom: '0' }}>
            <p style={{ marginBottom: '0' }}>{primaryPOCName}</p>
          </Col>
        </Row>
        <Row className={styles.divisionPrimary}>
          <Col span={12}>
            <p>Primary POC Name:</p>
          </Col>
          <Col span={12}>
            <p>{primaryPOCName}</p>
          </Col>

          <Col span={12}>
            <p>Primary POC Ph No.</p>
          </Col>
          <Col span={12}>
            <p>{primaryPOCNumber}</p>
          </Col>

          <Col span={12}>
            <p>Primary POC Email ID:</p>
          </Col>
          <Col span={12}>
            <p>{primaryPOCEmail}</p>
          </Col>

          <Col span={12} style={{ marginBottom: '0' }}>
            <p style={{ marginBottom: '0' }}>Primary POC Designation:</p>
          </Col>
          <Col span={12} style={{ marginBottom: '0' }}>
            <p style={{ marginBottom: '0' }}>{primaryPOCDesignation}</p>
          </Col>
        </Row>

        <Row className={styles.divisionPrimary}>
          <Col span={12}>
            <p>Secondary POC Name:</p>
          </Col>
          <Col span={12}>
            <p>{secondaryPOCName}</p>
          </Col>

          <Col span={12}>
            <p>Secondary POC Ph No.</p>
          </Col>
          <Col span={12}>
            <p>{secondaryPOCNumber}</p>
          </Col>

          <Col span={12}>
            <p>Secondary POC Email ID:</p>
          </Col>
          <Col span={12}>
            <p>{secondaryPOCEmail}</p>
          </Col>

          <Col span={12} style={{ marginBottom: '0' }}>
            <p style={{ marginBottom: '0' }}>Secondary POC Designation:</p>
          </Col>
          <Col span={12} style={{ marginBottom: '0' }}>
            <p style={{ marginBottom: '0' }}>{secondaryPOCDesignation}</p>
          </Col>
        </Row>

        <Row className={styles.divisionSecondary}>
          <Col span={12}>
            <p>Address Line 1</p>
          </Col>
          <Col span={12}>
            <p>{addressLine1}</p>
          </Col>

          <Col span={12}>
            <p>Address Line 1</p>
          </Col>
          <Col span={12}>
            <p>{addressLine1}</p>
          </Col>

          <Col span={12}>
            <p>Address Line 2</p>
          </Col>
          <Col span={12}>
            <p>{addressLine2}</p>
          </Col>

          <Col span={12}>
            <p>City</p>
          </Col>
          <Col span={12}>
            <p>{city}</p>
          </Col>

          <Col span={12}>
            <p>State</p>
          </Col>
          <Col span={12}>
            <p>{state}</p>
          </Col>

          <Col span={12}>
            <p>Country</p>
          </Col>
          <Col span={12}>
            <p>{country}</p>
          </Col>

          <Col span={12}>
            <p>Zip/Postal Code</p>
          </Col>
          <Col span={12}>
            <p>{postalCode}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DivisionItem;
