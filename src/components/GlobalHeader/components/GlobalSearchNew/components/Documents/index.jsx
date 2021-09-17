import iconPDF from '@/assets/pdf-2.svg';
import React, { useState } from 'react';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';

const Document = (props) => {
  const { listDocument } = props;
  const [openModal, setOpenModal] = useState(false);
  const [urlDocument, setUrlDocument] = useState('');
  const [displayDocumentName, setDisplayDocumentName] = useState('');
  const viewDocument = (document) => {
    const { attachmentName = '', attachmentUrl = '' } = document;
    setOpenModal(true);
    setUrlDocument(attachmentUrl);
    setDisplayDocumentName(attachmentName);
  };
  return (
    <div className={styles.document}>
      {listDocument.map((item) => (
        <div className={styles.document__item} onClick={() => viewDocument(item)}>
          <div className={styles.text}>abc</div>
          <img alt="pdf-img" src={iconPDF} />
        </div>
      ))}
      <ViewDocumentModal
        visible={openModal}
        fileName={displayDocumentName}
        url={urlDocument}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};
export default Document;
