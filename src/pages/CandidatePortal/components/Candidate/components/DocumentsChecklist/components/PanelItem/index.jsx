import { Col, Row } from 'antd';
import React from 'react';
import styles from './index.less';

const PanelItem = ({ document, actionText }) => {
  const { attachment, displayName } = document;
  const fileName = attachment ? attachment.fileName : '';
  return (
    <Row gutter={[24, 24]} className={styles.panelItem}>
      <Col span={12}>{displayName}</Col>
      <Col span={6} className={styles.txtFileName}>
        {fileName}
      </Col>
      <Col span={6} className={styles.txtUpload}>
        {actionText}
      </Col>
    </Row>
  );
};

export default PanelItem;
