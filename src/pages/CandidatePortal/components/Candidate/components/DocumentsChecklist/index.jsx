import React, { useState } from 'react';
import { Col, Collapse, Row } from 'antd';
import { connect, history } from 'umi';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import MessageBox from '../MessageBox';
import NoteComponent from '../NoteComponent';
import styles from './index.less';
import PanelItem from './components/PanelItem';
import DocumentButton from './components/DocumentButton';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import ModalUpload from '@/components/ModalUpload';
import SignatureModal from '@/components/SignatureModal';
import { DOCUMENT_KEYS, DOCUMENT_TYPES } from '@/utils/candidatePortal';

const { Panel } = Collapse;

const initCurrentFile = {
  fileName: '',
  url: '',
};

const DocumentsChecklist = (props) => {
  const { dispatch, candidatePortal } = props;
  const [documentModal, setDocumentModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [signatureModal, setSignatureModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(initCurrentFile);
  const [documentKey, setDocumentKey] = useState('');
  const documentsChecklist = candidatePortal?.data?.documentChecklist || [];

  const handleClickFile = (document) => {
    const attachment = document?.attachment;
    setCurrentFile({
      fileName: attachment?.fileName,
      url: attachment?.url,
    });
    setDocumentModal(true);
  };

  const handleClickAction = (type, key) => {
    setDocumentKey(key);
    if (type === DOCUMENT_KEYS.UPLOAD) {
      setUploadModal(true);
      return;
    }
    if (type === DOCUMENT_KEYS.SIGN) setSignatureModal(true);
  };

  const updateDocuments = async (attachmentId, attachment) => {
    const response = await dispatch({
      type: 'candidatePortal/upsertCandidateDocumentEffect',
      payload: { attachment: attachmentId },
    });

    const updateDocument = {
      document: { ...response.data, attachment },
      status: DOCUMENT_TYPES.VERIFYING,
    };
    const newDocumentsChecklist = [...documentsChecklist];

    // Find and update Document item
    newDocumentsChecklist.every((list, index) => {
      list.documents.every((doc, idx) => {
        if (doc.key === documentKey) {
          newDocumentsChecklist[index].documents[idx] = { ...doc, ...updateDocument };
          return false;
        }
        return true;
      });
      return true;
    });

    await dispatch({
      type: 'candidatePortal/updateByCandidateEffect',
      payload: {
        documentChecklist: newDocumentsChecklist,
      },
    });
  };

  const handleUpdateDocument = async (attachmentRes) => {
    setUploadModal(false);
    const attachment = attachmentRes?.data?.length && attachmentRes?.data[0];
    updateDocuments(attachment?.id, attachment);
  };

  const handleSubmitSignature = async (attachmentId, attachment) => {
    setSignatureModal(false);
    updateDocuments(attachmentId, attachment);
  };

  const handleGoBack = () => {
    history.push('/candidate-portal/dashboard');
  };

  const getActionText = (type) => {
    switch (type) {
      case DOCUMENT_KEYS.UPLOAD:
        return 'Upload';
      case DOCUMENT_KEYS.SIGN:
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
                    {documents.length
                      ? documents.map((document) => {
                          return (
                            <PanelItem
                              onClickFile={() => handleClickFile(document?.document)}
                              onClickAction={() => handleClickAction(type, document.key)}
                              document={{ ...document, type }}
                              actionText={actionText}
                              key={document._id}
                            />
                          );
                        })
                      : null}
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
        <DocumentButton onClick={handleGoBack} primary={false}>
          Previous
        </DocumentButton>
        <DocumentButton onClick={handleGoBack}>Complete </DocumentButton>
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
      <ViewDocumentModal
        visible={documentModal}
        fileName="View Document"
        url={currentFile.url}
        onClose={() => setDocumentModal(false)}
      />
      <ModalUpload
        titleModal="Upload file"
        visible={uploadModal}
        handleCancel={() => setUploadModal(false)}
        widthImage="40%"
        getResponse={handleUpdateDocument}
      />
      <SignatureModal
        visible={signatureModal}
        onClose={() => setSignatureModal(false)}
        onFinish={handleSubmitSignature}
        titleModal="Signature of the candidate"
      />
    </Row>
  );
};

export default connect((data) => data)(DocumentsChecklist);
