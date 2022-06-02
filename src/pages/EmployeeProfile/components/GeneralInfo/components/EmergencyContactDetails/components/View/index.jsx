import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { dataAPI } = this.props;
    const { emergencyContactDetails = [] } = dataAPI;
    const result =
      emergencyContactDetails.length > 0
        ? emergencyContactDetails
        : [
            {
              emergencyContact: '',
              emergencyPersonName: '',
              emergencyPersonNumber: '',
            },
          ];

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {result.map((item, index) => {
          const { emergencyContact = '', emergencyPersonName = '', emergencyRelation = '' } = item;
          return (
            <>
              <Col span={6} className={styles.textLabel}>
                Emergency Contact Name
              </Col>
              <Col span={18} className={styles.textValue}>
                {emergencyPersonName}
              </Col>
              <Col span={6} className={styles.textLabel}>
                Relation
              </Col>
              <Col span={18} className={styles.textValue}>
                {emergencyRelation}
              </Col>
              <Col span={6} className={styles.textLabel}>
                Emergency Contact Number
              </Col>
              <Col span={18} className={styles.textValue}>
                {emergencyContact}
              </Col>
              {index === result.length - 1 ? null : <div className={styles.line} />}
            </>
          );
        })}
      </Row>
    );
  }
}

export default View;
