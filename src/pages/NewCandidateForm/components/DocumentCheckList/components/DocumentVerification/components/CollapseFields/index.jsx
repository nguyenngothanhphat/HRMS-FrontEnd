import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Collapse } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { DOCUMENTS_CHECKLIST_TYPE } from '@/utils/newCandidateForm';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';

const { Panel } = Collapse;

const CollapseFields = (props) => {
  const { items = [] } = props;

  const [openModal, setOpenModal] = useState(false);
  const [urlFile, setUrlFile] = useState('');
  const [fileName, setFileName] = useState('');

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.titleText}>{items.type}</span>
      </div>
    );
  };

  const handleViewFile = (record) => {
    setUrlFile(record?.attachment?.url);
    setFileName(record?.attachment?.name);
    setOpenModal(true);
  };

  return (
    <Col span={24}>
      <div className={styles.CollapseFields}>
        <Collapse
          accordion
          expandIconPosition="right"
          defaultActiveKey="1"
          expandIcon={({ isActive }) => {
            return isActive ? (
              <MinusOutlined className={styles.alternativeExpandIcon} />
            ) : (
              <PlusOutlined className={styles.alternativeExpandIcon} />
            );
          }}
        >
          <Panel header={renderHeader()} key="1">
            {items?.documents?.map((val) => {
              return (
                <div key={val.type} className={styles.nameDocument}>
                  <div>
                    {val.displayName}
                    <span className={styles.starSymbol}>*</span>
                  </div>
                  {items.type === DOCUMENTS_CHECKLIST_TYPE.E && (
                    <div className={styles.file} onClick={() => handleViewFile(val)}>
                      {val.attachment?.name}
                    </div>
                  )}
                </div>
              );
            })}
          </Panel>
        </Collapse>
      </div>
      <ViewDocumentModal
        visible={openModal}
        fileName={fileName}
        url={urlFile}
        onClose={() => setOpenModal(false)}
      />
    </Col>
  );
};

export default connect(({ newCandidateForm }) => ({
  newCandidateForm,
}))(CollapseFields);
