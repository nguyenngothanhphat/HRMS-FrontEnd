import React from 'react';

import { Row, Col } from 'antd';

import s from './CandidateLayout.less';

const CandidateLayout = (props) => {
  const { children } = props;
  return (
    <div className={s.candidate}>
      <Row>
        <Col md={24}>
          <div className={s.header}>Header</div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <div>Menu</div>
        </Col>
        <Col md={18}>{children}</Col>
      </Row>
    </div>
  );
};

export default CandidateLayout;
