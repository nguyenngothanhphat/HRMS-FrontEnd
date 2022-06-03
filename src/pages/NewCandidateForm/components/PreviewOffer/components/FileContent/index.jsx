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
  const [numPages, setNumPages] = useState(null);

  // eslint-disable-next-line no-shadow
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const { url = '' } = props;

  return (
    <div className={s.viewFile}>
      <Document
        file={url}
        onLoadSuccess={onLoadSuccess}
        loading={documentWarning('Loading document. Please wait...')}
        noData={documentWarning('URL is not available.')}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
};

export default FileContent;
