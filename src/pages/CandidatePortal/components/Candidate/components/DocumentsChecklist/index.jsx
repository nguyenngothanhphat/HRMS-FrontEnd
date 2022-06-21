import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Collapse, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import MessageBox from '../MessageBox';
import NoteComponent from '../NoteComponent';
import styles from './index.less';
import PanelItem from './components/PanelItem';
import DocumentButton from './components/DocumentButton';
// import ViewDocumentModal from '@/components/ViewDocumentModal';

const { Panel } = Collapse;

const DocumentsChecklist = (props) => {
  const { dispatch } = props;
  const [documentsChecklist, setDocumentsChecklist] = useState([]);
  // const [currentFileName, setCurrentFileName] = useState('');

  useEffect(() => {
    let componentMounted = true;
    const getDocumentsChecklist = async () => {
      const response = await dispatch({
        type: 'candidatePortal/getDocumentsChecklist',
        payload: {
          tenantId: getCurrentTenant(),
          isFormat: true,
        },
      });
      if (componentMounted && response) setDocumentsChecklist(response.data);
    };
    getDocumentsChecklist();
    return () => {
      componentMounted = false;
    };
  }, []);

  const handleSelectFile = () => {};

  const getActionText = (type) => {
    switch (type) {
      case 'Scan & Upload':
        return 'Upload';
      case 'Electronically Sign':
        return 'Sign';
      default:
        return '';
    }
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.title}>Pre-Joining Documents</p>
        <p className={styles.description}>Please fill or upload each particular document type</p>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className={styles.collapseContainer}>
            {documentsChecklist.map((item) => {
              const { documents, type } = item;
              const actionText = getActionText(type);
              return (
                <Collapse
                  expandIconPosition="right"
                  defaultActiveKey={type}
                  expandIcon={({ isActive }) => {
                    return isActive ? (
                      <MinusOutlined className={styles.expandIcon} />
                    ) : (
                      <PlusOutlined className={styles.expandIcon} />
                    );
                  }}
                  key={type}
                  style={{ marginBottom: 16 }}
                >
                  <Panel
                    header={
                      <div className={styles.card}>
                        <span className={styles.title}>{type}</span>
                      </div>
                    }
                    key={type}
                  >
                    {documents.map((document) => (
                      <PanelItem
                        onSelectFile={handleSelectFile}
                        document={document}
                        actionText={actionText}
                        key={document._id}
                      />
                    ))}
                  </Panel>
                </Collapse>
              );
            })}
          </div>
        </Col>
      </Row>
    );
  };

  const renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        <DocumentButton primary={false}> Previous </DocumentButton>
        <DocumentButton>Complete </DocumentButton>
      </div>
    );
  };

  return (
    <Row gutter={[24, 24]} className={styles.documentsChecklist}>
      <Col xs={24} sm={24} md={16} xl={16}>
        {renderHeader()}
        {documentsChecklist.length ? renderContent() : null}
        {renderBottomBar()}
      </Col>
      <Col xs={24} sm={24} md={8} xl={8}>
        <Row>
          <NoteComponent
            note={{
              title: 'Note',
              data: 'All the documents that are marked as mandatory need to be uploaded and one or more of the documents that are optional can be uploaded.',
            }}
          />
          <MessageBox />
        </Row>
      </Col>
      {/* <ViewDocumentModal
        visible={true}
        fileName={displayDocumentName}
        url={urlDocument}
        onClose={() => setVisiable(false)}
      /> */}
    </Row>
  );
};

export default connect((data) => data)(DocumentsChecklist);
