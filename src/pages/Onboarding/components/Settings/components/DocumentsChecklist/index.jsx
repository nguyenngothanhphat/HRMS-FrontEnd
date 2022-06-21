import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import Header from './components/Header';
import TableDocuments from './components/TableDocuments';
import UploadDocument from './components/UploadDocument';
import styles from './index.less';

const DocumentsChecklist = (props) => {
  const {
    onboardingSettings: { lisDocumentCheckList = [] } = {},
    loading = false,
    dispatch,
  } = props;
  const [uploadDocument, setUploadDocument] = useState(false);

  const handleUploadDocument = () => {
    setUploadDocument(true);
  };

  const handleCancelUploadDocument = () => {
    setUploadDocument(false);
  };

  const fetchListDocumentCheckList = () => {
    dispatch({
      type: 'onboardingSettings/getListDocumentCheckList',
      payload: {},
    });
  };

  useEffect(() => {
    fetchListDocumentCheckList();
  }, []);

  if (uploadDocument)
    return <UploadDocument handleCancelUploadDocument={handleCancelUploadDocument} />;
  return (
    <Row className={styles.DocumentsChecklist} gutter={[24, 24]}>
      <Col span={24}>
        <Header handleUploadDocument={handleUploadDocument} />
      </Col>
      <Col span={24}>
        <TableDocuments data={lisDocumentCheckList} loading={loading} />
      </Col>
    </Row>
  );
};

export default connect(({ onboardingSettings, loading }) => ({
  onboardingSettings,
  loading: loading.effects['onboardingSettings/getListDocumentCheckList'],
}))(DocumentsChecklist);
