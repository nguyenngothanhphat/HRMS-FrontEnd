import React, { useState } from 'react';

import { Row, Col, Typography } from 'antd';
import NoteComponent from '../NoteComponent';
import CustomModal from '@/components/CustomModal/index';
import { Document, Page, pdfjs } from 'react-pdf';
import FileIcon from '@/assets/pdf_icon.png';
import LeftArrow from '@/assets/arrow-left_icon.svg';
import RightArrow from '@/assets/arrow-right_icon.svg';

import s from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Note = {
  title: 'Note',
  data: (
    <Typography.Text style={{ marginTop: '24px' }}>
      The candidate <span>must sign</span> the confidentiality document as part of acceptance of
      employment with Terralogic Private Limited..
    </Typography.Text>
  ),
};

const documentWarning = (msg) => (
  <div className={s.documentWarning}>
    <p>{msg}</p>
  </div>
);

const Benefits = () => {
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

  return (
    <div className={s.benefitContainer}>
      <Row gutter={24}>
        <Col md={16}>
          <div className={s.benefits}>
            <header>
              <h2>Benefits</h2>
              <p>The list of benefits the candidate is eligible for is populated below.</p>
            </header>

            <main>
              <div className={s.global}>
                <h2>For Global employees</h2>

                {/* Medical */}
                <h3>Medical</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Open Access Plus - Choice Plan.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] OAP - Base Plan.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>

                {/* Dental */}
                <h3>Dental</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Voluntary Dental.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
                {/* Vision */}
                <h3>Vision</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Vision PPO.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>

                {/* Life */}
                <h3>Life</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Basic Life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Vol life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>

                {/* disability */}
                <h3>Short-term disability</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Basic Life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Vol life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
              </div>

              <div className={s.nation}>
                <h2>For India employees</h2>

                <h3>Paytm Wallet</h3>
                <p>Coverage will take effect on 20/04/2020</p>

                <h3>Employee Provident Fund</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Open Access Plus - Choice Plan.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
              </div>
            </main>
          </div>

          {/* <Document file="http://www.africau.edu/images/default/sample.pdf" /> */}
          <div className={s.viewFile}>
            <Document
              file="http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff"
              onLoadSuccess={onLoadSuccess}
              loading={documentWarning('Loading document. Please wait...')}
              noData={documentWarning('URL is not available.')}
            >
              <Page pageNumber={currentPage} height={650} width={750} />
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
        </Col>

        <Col md={8}>
          <NoteComponent note={Note} />
        </Col>
      </Row>
    </div>
  );
};

export default Benefits;
