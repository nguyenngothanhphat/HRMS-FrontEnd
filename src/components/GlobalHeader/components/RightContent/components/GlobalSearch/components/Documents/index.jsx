import iconPDF from '@/assets/pdf-2.svg';
import React, { useState } from 'react';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';

const Document = (props) => {
  const { listDocument, onClick } = props;
  const [visable, setVisiable] = useState(false);
  const [urlDocument, setUrlDocument] = useState('');
  const [displayDocumentName, setDisplayDocumentName] = useState('');
  const viewDocument = (document) => {
    const { name: attachmentName = '', url: attachmentUrl = '' } = document;
    setVisiable(true);
    setUrlDocument(attachmentUrl);
    setDisplayDocumentName(attachmentName);
  };
  return (
    <div className={styles.document}>
      {listDocument.map(
        (item, index) =>
          index < 3 && (
            <div
              className={styles.document__item}
              onClick={() => {
                onClick();
                viewDocument(item.attachment);
              }}
            >
              <div className={styles.text}>{item.key}</div>
              <img alt="pdf-img" src={iconPDF} />
            </div>
          ),
      )}
      <ViewDocumentModal
        visible={visable}
        fileName={displayDocumentName}
        url={urlDocument}
        onClose={() => setVisiable(false)}
      />
    </div>
  );
};
export default Document;
