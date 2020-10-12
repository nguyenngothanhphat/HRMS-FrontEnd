import React, { useState } from 'react';

import FileIcon from '@/assets/pdf_icon.png';
import { Row, Col, Typography } from 'antd';
import CustomModal from '@/components/CustomModal/index';
import NoteComponent from '../NoteComponent';
import FileContent from './components/FileContent';
import mockFiles from './components/utils';

import s from './index.less';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Note = {
  title: 'Note',
  data: (
    <Typography.Text style={{ marginTop: '24px' }}>
      The candidate <span>must sign</span> the confidentiality document as part of acceptance of
      employment with Terralogic Private Limited..
    </Typography.Text>
  ),
};

const Benefits = () => {
  const [fileUrl, setFileUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const _renderFile = (url) => {
    return <FileContent url={url} />;
  };

  const { medical, dental, vision, life, disablity, fund } = mockFiles;

  const handleClick = (url) => {
    // setFileUrl(
    //   'http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff',
    // );
    setFileUrl(url);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const _renderFiles = (list) => {
    return list.map((item, index) => {
      const { name, url } = item;
      return (
        <div key={`${index} + a`} className={s.file} onClick={() => handleClick(url)}>
          <span className={s.fileName}>{name}</span>
          <img src={FileIcon} alt="file icon" />
        </div>
      );
    });
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
                {/* {medical.map((item, index) => {
                  const { name, url } = item;
                  return (
                    <div key={`${index} + a`} className={s.file} onClick={() => handleClick(url)}>
                      <span className={s.fileName}>{name}</span>
                      <img src={FileIcon} alt="file icon" />
                    </div>
                  );
                })} */}
                {_renderFiles(medical)}
                {/* <div className={s.file} onClick={() => handleClick()}>
                  <span className={s.fileName}>[ 2020 ] Open Access Plus - Choice Plan.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] OAP - Base Plan.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div> */}

                {/* Dental */}
                <h3>Dental</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                {_renderFiles(dental)}
                {/* <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Voluntary Dental.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div> */}

                {/* Vision */}
                <h3>Vision</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                {_renderFiles(vision)}
                {/* <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Vision PPO.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div> */}

                {/* Life */}
                <h3>Life</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                {_renderFiles(life)}
                {/* <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Basic Life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Vol life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div> */}

                {/* disability */}
                <h3>Short-term disability</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                {_renderFiles(disablity)}
                {/* <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Basic Life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div>
                <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Vol life / AD & D.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div> */}
              </div>

              <div className={s.nation}>
                <h2>For India employees</h2>

                <h3>Paytm Wallet</h3>
                <p>Coverage will take effect on 20/04/2020</p>

                <h3>Employee Provident Fund</h3>
                <p>Coverage will take effect on 20/04/2020</p>
                {_renderFiles(fund)}
                {/* <div className={s.file}>
                  <span className={s.fileName}>[ 2020 ] Open Access Plus - Choice Plan.pdf</span>
                  <img src={FileIcon} alt="file icon" />
                </div> */}
              </div>
            </main>
          </div>

          {/* <Document file="http://www.africau.edu/images/default/sample.pdf" /> */}
          {/* <div className={s.viewFile}>
            <Document
              file="http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff"
              onLoadSuccess={onLoadSuccess}
              loading={documentWarning('Loading document. Please wait...')}
              noData={documentWarning('URL is not available.')}
            >
              <Page
                pageNumber={currentPage}
                // height={650} width={750}
              />
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
          </div> */}
        </Col>

        <Col md={8}>
          <NoteComponent note={Note} />
        </Col>
      </Row>

      {/* <FileView url="http://api-stghrms.paxanimi.ai/api/attachments/5f7d4f3825b10e8b115d3e27/PR_report1_Jenny%20Wong.pdff" /> */}

      <CustomModal
        width={700}
        // open={openEditBio}
        open={modalVisible}
        closeModal={closeModal}
        content={_renderFile(fileUrl)}
      />
    </div>
  );
};

export default Benefits;
