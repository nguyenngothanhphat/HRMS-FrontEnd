import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import s from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const documentWarning = (msg) => (
  <div className={s.documentWarning} style={{ padding: '24px' }}>
    <p>{msg}</p>
  </div>
);

const FileContent = (props) => {
  const [currentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);

  // eslint-disable-next-line no-shadow
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const { url = '' } = props;

  return (
    <div className={s.viewFile}>
      <Document
        // file="http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff"
        file={url}
        onLoadSuccess={onLoadSuccess}
        loading={documentWarning('Loading document. Please wait...')}
        noData={documentWarning('URL is not available.')}
      >
        <Page pageNumber={currentPage} />
      </Document>
    </div>
  );
};

export default FileContent;
