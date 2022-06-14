import { Col, Row } from 'antd';
import React, { useState } from 'react';
import Header from './components/Header';
import TableDocuments from './components/TableDocuments';
import UploadDocument from './components/UploadDocument';
import styles from './index.less';

const DocumentsChecklist = () => {
  const [uploadDocument, setUploadDocument] = useState(false);
  const handleUploadDocument = () => {
    setUploadDocument(true);
  };
  if (uploadDocument) return <UploadDocument />;
  return (
    <Row className={styles.DocumentsChecklist} gutter={[24, 24]}>
      <Col span={24}>
        <Header handleUploadDocument={handleUploadDocument} />
      </Col>
      <Col span={24}>
        <TableDocuments />
      </Col>
    </Row>
  );
};

export default DocumentsChecklist;
