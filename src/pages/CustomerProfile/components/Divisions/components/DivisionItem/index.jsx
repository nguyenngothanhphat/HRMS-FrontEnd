import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../../index.less';

class DivisionItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showMoreLess = () => {
    const { visible } = this.state;
    console.log('assss');
    this.setState({
      visible: !visible,
    });
  };

  render() {
    const { visible } = this.state;
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
            <p className={styles.label}>Division ID:</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{devisionId}</p>
          </Col>

          <Col span={12}>
            <p className={styles.label}>Division Name:</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{devisionName}</p>
          </Col>
        </Row>
        <Row className={styles.divisionPrimary}>
          <Col span={12}>
            <p className={styles.label}>Primary POC Name:</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{primaryPOCName}</p>
          </Col>

          <Col span={12}>
            <p className={styles.label}>Primary POC Ph No.</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{primaryPOCNumber}</p>
          </Col>

          <Col span={12}>
            <p className={styles.label}>Primary POC Email ID:</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{primaryPOCEmail}</p>
          </Col>

          <Col span={12} style={{ marginBottom: '0' }}>
            <p className={styles.label} style={{ marginBottom: '0' }}>
              Primary POC Designation:
            </p>
          </Col>
          <Col span={12} style={{ marginBottom: '0' }}>
            <p className={styles.value} style={{ marginBottom: '0' }}>
              {primaryPOCDesignation}
            </p>
          </Col>
        </Row>

        <Row className={styles.divisionPrimary}>
          <Col span={12}>
            <p className={styles.label}>Secondary POC Name:</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{secondaryPOCName}</p>
          </Col>

          <Col span={12}>
            <p className={styles.label}>Secondary POC Ph No.</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{secondaryPOCNumber}</p>
          </Col>

          <Col span={12}>
            <p className={styles.label}>Secondary POC Email ID:</p>
          </Col>
          <Col span={12}>
            <p className={styles.value}>{secondaryPOCEmail}</p>
          </Col>

          <Col span={12} style={{ marginBottom: '0' }}>
            <p className={styles.label} style={{ marginBottom: '0' }}>
              Secondary POC Designation:
            </p>
          </Col>
          <Col span={12} style={{ marginBottom: '0' }}>
            <p className={styles.value} style={{ marginBottom: '0' }}>
              {secondaryPOCDesignation}
            </p>
          </Col>
        </Row>

        <div
          className={styles.divisionSecondary}
          style={visible ? { display: 'block' } : { display: 'none' }}
        >
          <Row>
            <Col span={12} style={{ margin: '0' }}>
              <p className={styles.label}>Address Line 1</p>
            </Col>
            <Col span={12} style={{ margin: '0' }}>
              <p className={styles.value}>{addressLine1}</p>
            </Col>
            <Col span={12}>
              <p className={styles.label}>Address Line 2</p>
            </Col>
            <Col span={12}>
              <p className={styles.value}>{addressLine2}</p>
            </Col>

            <Col span={12}>
              <p className={styles.label}>City</p>
            </Col>
            <Col span={12}>
              <p className={styles.value}>{city}</p>
            </Col>

            <Col span={12}>
              <p className={styles.label}>State</p>
            </Col>
            <Col span={12}>
              <p className={styles.value}>{state}</p>
            </Col>

            <Col span={12}>
              <p className={styles.label}>Country</p>
            </Col>
            <Col span={12}>
              <p className={styles.value}>{country}</p>
            </Col>

            <Col span={12}>
              <p className={styles.label}>Zip/Postal Code</p>
            </Col>
            <Col span={12}>
              <p className={styles.value}>{postalCode}</p>
            </Col>
          </Row>
        </div>
        <div style={{ padding: '32px' }}>
          {!visible ? (
            <p
              style={{ color: '#2C6DF9', fontWeight: '700', cursor: 'pointer' }}
              onClick={this.showMoreLess}
            >
              <PlusOutlined /> View More
            </p>
          ) : (
            <p
              style={{ color: '#2C6DF9', fontWeight: '700', cursor: 'pointer' }}
              onClick={this.showMoreLess}
            >
              <MinusOutlined /> View less
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default DivisionItem;
