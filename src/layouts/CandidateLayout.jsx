import React, { useState, useEffect } from 'react';
import { connect, Link } from 'umi';

import { Row, Col, Layout, Button, Steps, Result } from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';

import { RightOutlined } from '@ant-design/icons';
import logo from '../../public/assets/images/terralogic-logo.png';
// import BottomBar from '../components/BottomBar';
import s from './CandidateLayout.less';

const { Header, Content } = Layout;
const { Step } = Steps;

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/login">Go Login</Link>
      </Button>
    }
  />
);

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
    title: 'Salary Structure',
    content: 'Third-content',
  },
  {
    title: 'Eligibility documents',
    content: 'Fourth-content',
  },
  {
    title: 'Offer Details',
    content: 'Fifth-content',
  },
  {
    title: 'Benefits',
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
  const {
    children,
    localStep,
    location = {
      pathname: '/',
    },
    route: { routes } = {},
    ticketId,
  } = props;

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    setCurrent(localStep);
  }, [localStep]);

  useEffect(() => {
    console.log('candidate layout');
  }, []);

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
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
          <span className={s.id}>Rookie ID : {ticketId}</span>

          <Button type="link" block>
            Cancel
          </Button>
        </div>
      </Header>
      <Authorized authority={authorized.authority} noMatch={noMatch}>
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
              {/* <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                  <BottomBar
                    onClickPrev={prevScreen}
                    onClickNext={nextScreen}
                    currentPage={currentPage}
                  />
                </Col>
              </Row> */}
            </Col>
          </Row>
        </Content>
      </Authorized>
    </div>
  );
};

// export default CandidateLayout;
export default connect(
  ({ candidateProfile: { localStep, ticketId, checkCandidateMandatory } = {} }) => ({
    localStep,
    checkCandidateMandatory,
    ticketId,
  }),
)(CandidateLayout);
