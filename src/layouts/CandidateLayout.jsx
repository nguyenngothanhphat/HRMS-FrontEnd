import React, { useState } from 'react';

import { Row, Col, Layout, Button, Steps } from 'antd';

const { Header, Content } = Layout;
const { Step } = Steps;

import logo from '../../public/assets/images/terralogic-logo.png';
import { RightOutlined } from '@ant-design/icons';

import s from './CandidateLayout.less';

const steps = [
  {
    title: 'Basic Infomation',
    content: 'First-content',
  },
  {
    title: 'Job Details',
    content: 'Second-content',
  },
  {
    title: 'Eligibility documents',
    content: 'Third-content',
  },
  {
    title: 'Offer Details',
    content: 'Fourth-content',
  },
  {
    title: 'Benefits',
    content: 'Fifth-content',
  },
  {
    title: 'Salary Structure',
    content: 'Last-content',
  },
];

const CandidateLayout = (props) => {
  const { children } = props;

  const [current, setCurrent] = useState(0);

  return (
    <div className={s.candidate}>
      <Header className={`${s.header} ${s.one}`}>
        <div className={s.headerLeft}>
          <div className={s.imgContainer}>
            <img src={logo} alt="terralogic logo" />
          </div>

          <RightOutlined className={s.icon} />

          <span className={s.description}>Candidature for UX designer </span>
        </div>

        <div className={s.headerRight}>
          <span className={s.id}>Rookie ID : 213222434</span>

          <Button type="link" block>
            Cancel
          </Button>
        </div>
      </Header>

      <Content>
        <Row gutter={24}>
          <Col md={5}>
            <div className={s.stepContainer}>
              <Steps current={current} direction="vertical">
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>

              {/* <button
                onClick={() => {
                  setCurrent((prevState) => prevState + 1);
                }}
              >
                Next
              </button> */}
            </div>
          </Col>
          <Col md={18}>{children}</Col>
        </Row>
      </Content>
    </div>
  );
};

export default CandidateLayout;
