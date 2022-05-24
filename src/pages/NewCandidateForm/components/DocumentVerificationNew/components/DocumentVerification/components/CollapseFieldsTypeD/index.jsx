import { Col, Collapse } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseFieldsTypeD = () => {
  const renderHeader = () => {
    const title = 'Type D: Technical Certifications';

    return (
      <div className={styles.header}>
        <span className={styles.titleText}>{title}</span>
      </div>
    );
  };

  return (
    <Col span={24}>
      <div className={styles.CollapseFieldsTypeD}>
        <Collapse accordion expandIconPosition="right">
          <Panel header={renderHeader()} key="1" disabled showArrow={false} />
        </Collapse>
      </div>
    </Col>
  );
};

export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(CollapseFieldsTypeD);
