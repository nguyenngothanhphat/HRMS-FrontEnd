import React, { PureComponent } from 'react';
import TrashIcon from '@/assets/trash.svg';
import { Row, Col } from 'antd';
import styles from './index.less';

class DocumentItem extends PureComponent {
  render() {
    const { item = {}, onRemove = () => {} } = this.props;
    const { name = '', attachmentName = '', attachmentUrl = '', attachment = '' } = item || {};
    return (
      <div className={styles.DocumentItem}>
        <span className={styles.docTitle}>{name}</span>
        <Row className={styles.fileBox} align="middle" justify="space-between">
          <Col span={12}>
            <div className={styles.fileName}>
              <span>{attachmentName || attachment?.name}</span>
              {/* <img src */}
            </div>
          </Col>
          <Col span={12}>
            <div
              className={styles.deleteIcon}
              onClick={() => onRemove(attachment || attachment._id)}
            >
              <img src={TrashIcon} alt="move-to-trash" />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default DocumentItem;
