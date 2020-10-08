import React, { useState } from 'react';
import { connect } from 'umi';

import { Row, Col, Layout, Button, Steps } from 'antd';

import { RightOutlined } from '@ant-design/icons';
import logo from '../../public/assets/images/terralogic-logo.png';
import BottomBar from '../components/BottomBar';
import s from './CandidateLayout.less';

const { Header, Content } = Layout;
const { Step } = Steps;

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

const getLineWidth = (value) => {
  switch (value) {
    case 1:
      return s.one;
    case 2:
      return s.two;
    case 3:
      return s.three;
    case 4:
      return s.four;
    case 5:
      return s.five;
    case 6:
      return s.six;

    default:
      return '';
  }
};

const CandidateLayout = (props) => {
  const { children, currentStep, dispatch } = props;

  const [current, setCurrent] = useState(currentStep);
  const [currentPage, setCurrentPage] = useState(10);

  const nextScreen = () => {
    if (!dispatch || current === 7) {
      return;
    }

    dispatch({
      type: 'candidateProfile/save',
      payload: {
        currentStep: current + 1,
      },
    });

    setCurrent((prevState) => prevState + 1);
    setCurrentPage((prevState) => prevState + 1);
  };

  return (
    <div className={s.candidate}>
      {/* <Header className={`${s.header} ${s.one}`}> */}
      <Header className={`${s.header} ${getLineWidth(current - 1)}`}>
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

      <Content className={s.main}>
        <Row gutter={24}>
          <Col md={5}>
            <div className={s.stepContainer}>
              <Steps current={current - 1} direction="vertical">
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </div>

            {/* <button style={{ marginTop: '20px' }} onClick={() => nextScreen()}>
              Next
            </button> */}
          </Col>
          <Col md={19}>
            {children}
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <BottomBar
                  // onClickPrev={handlePrev}
                  onClickNext={nextScreen}
                  currentPage={currentPage}
                />
                {/* <button style={{ marginTop: '20px' }} onClick={() => nextScreen()}>
                  Next
                </button> */}
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </div>
  );
};

// export default CandidateLayout;
export default connect(({ candidateProfile: { currentStep } = {} }) => ({
  currentStep,
}))(CandidateLayout);
