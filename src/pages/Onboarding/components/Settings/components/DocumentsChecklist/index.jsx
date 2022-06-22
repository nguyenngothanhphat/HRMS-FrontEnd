import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import Header from './components/Header';
import TableDocuments from './components/TableDocuments';
import UploadDocument from './components/UploadDocument';
import styles from './index.less';

const DocumentsChecklist = (props) => {
  const {
    onboardingSettings: { lisDocumentCheckList = [], selectedLocations = [] } = {},
    loading = false,
    dispatch,
  } = props;
  const [uploadDocument, setUploadDocument] = useState(false);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);

  const onChangePage = (p, l) => {
    console.log('🚀 ~ p', p, l);

    setPage(p);
    setSize(l || size);
  };

  const handleUploadDocument = () => {
    setUploadDocument(true);
    dispatch({
      type: 'onboardingSettings/save',
      payload: {
        action: 'add',
      },
    });
  };

  const handleCancelUploadDocument = () => {
    setUploadDocument(false);
  };

  const fetchListDocumentCheckList = () => {
    dispatch({
      type: 'onboardingSettings/getListDocumentCheckList',
      payload: {
        location: selectedLocations,
        limit: size,
        page,
      },
    });
  };

  const onEdit = (record) => {
    dispatch({
      type: 'onboardingSettings/save',
      payload: {
        recordEdit: record,
        action: 'edit',
      },
    });
    setUploadDocument(true);
  };

  const onDelete = (record) => {
    dispatch({
      type: 'onboardingSettings/delete',
      payload: {
        id: record?._id,
      },
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        fetchListDocumentCheckList();
      }
    });
  };

  useEffect(() => {
    fetchListDocumentCheckList();
  }, [JSON.stringify(selectedLocations), page, size]);

  if (uploadDocument)
    return <UploadDocument handleCancelUploadDocument={handleCancelUploadDocument} />;
  return (
    <Row className={styles.DocumentsChecklist} gutter={[24, 24]}>
      <Col span={24}>
        <Header selectedLocations={selectedLocations} handleUploadDocument={handleUploadDocument} />
      </Col>
      <Col span={24}>
        <TableDocuments
          data={lisDocumentCheckList}
          loading={loading}
          onDelete={onDelete}
          onEdit={onEdit}
          onChangePage={onChangePage}
          size={size}
          page={page}
        />
      </Col>
    </Row>
  );
};

export default connect(({ onboardingSettings, loading }) => ({
  onboardingSettings,
  loading: loading.effects['onboardingSettings/getListDocumentCheckList'],
}))(DocumentsChecklist);
