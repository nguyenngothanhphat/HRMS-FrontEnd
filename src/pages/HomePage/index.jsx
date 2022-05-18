import { Col, Row, Skeleton, Spin } from 'antd';
import React, { Suspense, useEffect } from 'react';
import { history, connect } from 'umi';
import SettingIcon from '@/assets/dashboard/setting.svg';
import styles from './index.less';

import Announcements from './components/Announcements';
import Carousel from './components/Carousel';
import MyInformation from './components/MyInformation';
import QuickLinks from './components/QuickLinks';
import TimeOff from './components/TimeOff';
import TimeSheet from './components/TimeSheet';
import Voting from './components/Voting';
import Welcome from './components/Welcome';
import { goToTop } from '@/utils/utils';

const Gallery = React.lazy(() => import('./components/Gallery'));
const Celebrating = React.lazy(() => import('./components/Celebrating'));

const HomePage = (props) => {
  const { dispatch } = props;
  const { user: { permissions: { viewSettingHomePage = -1 } = {} } = {}, loadingMain = false } =
    props;

  useEffect(() => {
    goToTop();
    return () => {
      dispatch({
        type: 'homePage/clearState',
      });
    };
  }, []);

  const viewSettingPage = () => {
    history.push('/home/settings');
  };

  const renderSettingIcon = () => {
    return (
      <div className={styles.settingIcon} onClick={viewSettingPage}>
        <img src={SettingIcon} alt="" />
        <span>Settings</span>
      </div>
    );
  };

  return (
    <div className={styles.HomePage}>
      <Spin spinning={loadingMain} size="large">
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
              <Col xs={24} xl={12}>
                <TimeSheet />
              </Col>
              <Col xs={24} xl={12}>
                <TimeOff />
              </Col>
              <Col span={24}>
                <Row gutter={[24, 24]}>
                  <Col
                    xs={{ order: 2, span: 24 }}
                    xl={{ order: 1, span: 14 }}
                    xxl={{ order: 1, span: 16 }}
                  >
                    <Announcements />
                  </Col>
                  <Col
                    xs={{ order: 1, span: 24 }}
                    xl={{ order: 2, span: 10 }}
                    xxl={{ order: 2, span: 8 }}
                  >
                    <Row gutter={[24, 24]}>
                      <Col span={24}>
                        <Suspense fallback={<Skeleton active />}>
                          <Celebrating />
                        </Suspense>
                      </Col>
                      <Col span={24}>
                        <Suspense fallback={<Skeleton active />}>
                          <Gallery />
                        </Suspense>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>
      {viewSettingHomePage !== -1 && renderSettingIcon()}
    </div>
  );
};

export default connect(({ homePage, user, loading }) => ({
  homePage,
  user,
  loadingMain:
    loading.effects['homePage/fetchPollsEffect'] ||
    loading.effects['homePage/fetchPollResultEffect'] ||
    loading.effects['homePage/fetchBannersEffect'] ||
    loading.effects['homePage/fetchAnnouncementsEffect'],
}))(HomePage);
