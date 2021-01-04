import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { dataAPI } = this.props;
    const { emergencyContactDetails = [] } = dataAPI;

    return (
      <div>
        {emergencyContactDetails.length > 0 ? (
          <Row gutter={[0, 16]} className={styles.root}>
            {emergencyContactDetails.map((item, index) => {
              const {
                emergencyContact = '',
                emergencyPersonName = '',
                emergencyRelation = '',
              } = item;
              return (
                <>
                  <Fragment key={item.label}>
                    <Col span={6} className={styles.textLabel}>
                      Emergency Contact
                    </Col>
                    <Col span={18} className={styles.textValue}>
                      {emergencyContact}
                    </Col>
                  </Fragment>
                  <Fragment key={item.label}>
                    <Col span={6} className={styles.textLabel}>
                      Person’s Name
                    </Col>
                    <Col span={18} className={styles.textValue}>
                      {emergencyPersonName}
                    </Col>
                  </Fragment>
                  <Fragment key={item.label}>
                    <Col span={6} className={styles.textLabel}>
                      Relation
                    </Col>
                    <Col span={18} className={styles.textValue}>
                      {emergencyRelation}
                    </Col>
                  </Fragment>
                  {index === emergencyContactDetails.length - 1 ? null : (
                    <div className={styles.line} />
                  )}
                </>
              );
            })}
          </Row>
        ) : (
          <Row gutter={[0, 16]} className={styles.rootNoValue}>
            <Fragment>
              <Col span={6} className={styles.textLabel}>
                Emergency Contact
              </Col>
            </Fragment>
            <Fragment>
              <Col span={6} className={styles.textLabel}>
                Person’s Name
              </Col>
            </Fragment>
            <Fragment>
              <Col span={6} className={styles.textLabel}>
                Relation
              </Col>
            </Fragment>
          </Row>
        )}
      </div>
    );
  }
}

export default View;
