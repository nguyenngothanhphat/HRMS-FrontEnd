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
    id: 1,
    title: 'Basic Infomation',
    content: 'First-content',
  },
  {
    id: 2,
    title: 'Job Details',
    content: 'Second-content',
  },
  {
    id: 3,
    title: 'Salary Structure',
    content: 'Third-content',
  },
  {
    id: 4,
    title: 'Background Check',
    content: 'Fourth-content',
  },
  {
    id: 5,
    title: 'Offer Details',
    content: 'Fifth-content',
  },
  {
    id: 6,
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
    dispatch,
  } = props;

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    setCurrent(localStep);
  }, [localStep]);

  // useEffect(() => {
  //   console.log('candidate layout');
  // }, []);

  const authorized = getAuthorityFromRouter(routes, location.pathname || '/') || {
    authority: undefined,
  };

  const handleCancel = () => {
    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'login/logout',
    });
  };

  const renderPreviewOffer = () => {
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: 7,
      },
    });
  };

  const handleStepClick = (id) => {
    console.log(id);
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'candidateProfile/save',
      payload: {
        localStep: id,
      },
    });
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

          <Button type="link" block onClick={handleCancel}>
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
                  {steps.map((item) => {
                    const { title, id } = item;
                    return <Step key={title} title={title} onClick={() => handleStepClick(id)} />;
                  })}
                </Steps>
                <button className={s.btn} onClick={renderPreviewOffer}>
                  Preview offer letter
                </button>
              </div>
            </Col>
            <Col md={19}>{children}</Col>
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
