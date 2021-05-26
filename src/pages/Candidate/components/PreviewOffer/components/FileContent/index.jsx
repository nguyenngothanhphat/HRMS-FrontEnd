import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import LeftArrow from '@/assets/arrow-left_icon.svg';
import RightArrow from '@/assets/arrow-right_icon.svg';
import s from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const documentWarning = (msg) => (
  <div className={s.documentWarning} style={{ padding: '24px' }}>
    <p>{msg}</p>
  </div>
);

const FileContent = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);

  const next = () => {
    if (currentPage === numPages) {
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const back = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage((prevPage) => prevPage - 1);
  };

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

      <div className={s.control}>
        <span>
          Page: <span className={s.current}>{currentPage}</span>/
          <span className={s.total}>{numPages}</span>
        </span>

        <div className={s.arrows}>
          <img src={LeftArrow} alt="back" className={s.back} onClick={() => back()} />
          <img src={RightArrow} alt="next" onClick={() => next()} />
        </div>
      </div>
    </div>
  );
};

export default FileContent;
