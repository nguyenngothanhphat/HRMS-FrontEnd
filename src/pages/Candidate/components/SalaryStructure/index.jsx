import React from 'react';

import { Row, Col, Typography } from 'antd';
import NoteComponent from '../NoteComponent';
import SalaryAcceptance from '../../../FormTeamMember/components/SalaryStructure/components/SalaryAcceptance';
import SalaryAcceptanceContent from '../../../FormTeamMember/components/SalaryStructure/components/SalaryAcceptanceContent';

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

const SalaryStructure = () => {
  return (
    <div className={s.salaryStructureContainer}>
      <Row gutter={24}>
        <Col md={16}>
          <div className={s.salaryStructure}>
            <h3>salary structure</h3>
            <p>The pay division as per the position of ‘UX Designer’ has been given below.</p>
            <div className={s.content}>
              <p>
                The table of salary structure should populate here. Need clarification here if this
                table or information is editable by the HR?
              </p>
            </div>
          </div>
        </Col>
        <Col md={8}>
          <Row>
            <NoteComponent note={Note} />
          </Row>
          <Row>
            <SalaryAcceptance salaryStatus={2} />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SalaryStructure;
