import { Button, Col, Row, Skeleton } from 'antd';
import React, { Suspense, useEffect } from 'react';
import { connect, history } from 'umi';
import SettingIcon from '@/assets/dashboard/setting.svg';
import styles from './index.less';

import { goToTop } from '@/utils/utils';
import Announcements from './components/Announcements';
import Carousel from './components/Carousel';
import MyInformation from './components/MyInformation';
import QuickLinks from './components/QuickLinks';
import TimeOff from './components/TimeOff';
import TimeSheet from './components/TimeSheet';
import Voting from './components/Voting';
import Welcome from './components/Welcome';
import ApprovalIcon from '@/assets/homePage/noteIcon.svg';
import ROLES from '@/utils/roles';

const Gallery = React.lazy(() => import('./components/Gallery'));
const Celebrating = React.lazy(() => import('./components/Celebrating'));

const HomePage = (props) => {
  const { dispatch } = props;
  const {
    user: { permissions: { viewSettingHomePage = -1 } = {}, currentUser: { roles = [] } = {} } = {},
    // loadingMain = false
  } = props;
  console.log(roles);
  console.log(roles.includes(ROLES.MANAGER.toUpperCase()));
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
      {/* <Spin spinning={loadingMain} size="large"> */}
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
            {roles.some((x) => x.includes(ROLES.MANAGER.toUpperCase())) && (
              <Col span={24}>
                <Button
                  className={styles.approval}
                  onClick={() => history.push('/dashboard/approvals')}
                >
                  <img style={{ paddingRight: 13 }} src={ApprovalIcon} alt="approval-icon" />{' '}
                  Approval Page
                </Button>
              </Col>
            )}
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
      {/* </Spin> */}
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
