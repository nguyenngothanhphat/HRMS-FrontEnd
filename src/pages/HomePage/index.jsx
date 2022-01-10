import React from 'react';
import { Row, Col } from 'antd';
import Welcome from './components/Welcome';
import Voting from './components/Voting';
import MyInformation from './components/MyInformation';
import QuickLinks from './components/QuickLinks';
import Carousel from './components/Carousel';
import TimeSheet from './components/TimeSheet';
import TimeOff from './components/TimeOff';
import Annoucements from './components/Annoucements';
import Celebrating from './components/Celebrating';
import Gallery from './components/Gallery';
import styles from './index.less';

const HomePage = () => {
  return (
    <div className={styles.HomePage}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Welcome />
            </Col>
            <Col span={24}>
              <Voting />
            </Col>
            <Col span={24}>
              <MyInformation />
            </Col>
            <Col span={24}>
              <QuickLinks />
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Carousel />
            </Col>
            <Col span={12}>
              <TimeSheet />
            </Col>
            <Col span={12}>
              <TimeOff />
            </Col>
            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col span={16}>
                  <Annoucements />
                </Col>
                <Col span={8}>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Celebrating />
                    </Col>
                    <Col span={24}>
                      <Gallery />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
