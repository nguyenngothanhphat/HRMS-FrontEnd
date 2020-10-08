import React from 'react';

import { Row, Col, Typography } from 'antd';
import NoteComponent from '../NoteComponent';
import FileIcon from '@/assets/pdf_icon.png';
import CustomModal from '@/components/CustomModal/index';

import s from './index.less';

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
        </Col>

        <Col md={8}>
          <NoteComponent note={Note} />
        </Col>
      </Row>
    </div>
  );
};

export default Benefits;
