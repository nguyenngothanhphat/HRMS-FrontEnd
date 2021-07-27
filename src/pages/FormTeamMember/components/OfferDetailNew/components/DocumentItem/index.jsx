import React, { PureComponent } from 'react';
import TrashIcon from '@/assets/trash.svg';
import { Row, Col } from 'antd';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';
import styles from './index.less';

class DocumentItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewDocumentModal: false,
    };
  }

  handlePreview = (value) => {
    this.setState({ viewDocumentModal: value });
  };

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'webp':
      case 'tiff':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      case 'doc':
      case 'docx':
        return 2;

      default:
        return 0;
    }
  };

  render() {
    const { item = {}, onRemove = () => {}, disableAll = false } = this.props;
    const { name = '', attachmentName = '', attachmentUrl = '', attachment = '' } = item || {};
    const renderName = attachmentName || attachment?.name;
    const { viewDocumentModal = false } = this.state;
    return (
      <div className={styles.DocumentItem}>
        <span className={styles.docTitle}>{name}</span>
        <Row className={styles.fileBox} align="middle" justify="space-between">
          <Col span={12}>
            <div className={styles.fileName} onClick={() => this.handlePreview(true)}>
              <span>{renderName}</span>
              {this.identifyImageOrPdf(renderName) === 1 ? (
                <img src={PDFIcon} alt="pdf" />
              ) : (
                <img src={ImageIcon} alt="img" />
              )}
            </div>
          </Col>
          <Col span={12}>
            {!disableAll && (
              <div
                className={styles.deleteIcon}
                onClick={() => onRemove(attachment || attachment._id)}
              >
                <img src={TrashIcon} alt="move-to-trash" />
              </div>
            )}
          </Col>
        </Row>

        <ViewDocumentModal
          visible={viewDocumentModal}
          url={attachmentUrl}
          onClose={() => this.handlePreview(false)}
        />
      </div>
    );
  }
}
export default DocumentItem;
