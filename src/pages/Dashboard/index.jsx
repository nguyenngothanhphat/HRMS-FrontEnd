import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import Greeting from './components/Greeting';
import ActivityLog from './components/ActivityLog';
import MyApps from './components/MyApps';
import TabManageTeamWork from './components/TabManageTeamWork';
// import TimeSheet from './components/TimeSheet';
import Links from './components/Links';
import Carousel from './components/Carousel';
import SwitchLocation from './components/SwitchLocation';
import styles from './index.less';

const listLinkFQAs = [
  { name: 'I cannot access an app?', href: '/faqpage' },
  { name: 'How do I integrate google calendar with the portal?', href: '/faqpage' },
  { name: 'I cannot access an app?', href: '/faqpage' },
  { name: 'How do I integrate google calendar with the portal?', href: '/faqpage' },
  { name: 'How do I remove an app from the list of apps?', href: '/faqpage' },
  { name: 'How do I remove an app from the list of apps?', href: '/faqpage' },
];

const listQuickLinks = [
  {
    name: 'Coronavirus resources',
    href: 'http://api-stghrms.paxanimi.ai/api/attachments/5f76c618d140e1d5b28833dc/sample_2.pdf',
    isNew: true,
  },
  {
    name: 'Work From Home guidelines',
    href: 'http://api-stghrms.paxanimi.ai/api/attachments/5f76c618d140e1d5b28833dc/sample_2.pdf',
    isNew: true,
  },
  {
    name: 'Employee Handbook',
    href: 'http://api-stghrms.paxanimi.ai/api/attachments/5f76c618d140e1d5b28833dc/sample_2.pdf',
  },
  {
    name: 'Annual Report 2020',
    href: 'http://api-stghrms.paxanimi.ai/api/attachments/5f76c618d140e1d5b28833dc/sample_2.pdf',
  },
  {
    name: 'Training Program 2020',
    href: 'http://api-stghrms.paxanimi.ai/api/attachments/5f76c618d140e1d5b28833dc/sample_2.pdf',
  },
  {
    name: 'Submit Commuter Claim',
    href: 'http://api-stghrms.paxanimi.ai/api/attachments/5f76c618d140e1d5b28833dc/sample_2.pdf',
  },
];

@connect(
  ({
    loading,
    user: { currentUser = {}, currentUser: { roles = [] } = {} } = {},
    employee: { listEmployeeMyTeam = [] } = {},
    offboarding: { listProjectByEmployee = [] } = {},
  }) => ({
    fetchMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
    fetchListProject: loading.effects['offboarding/getListProjectByEmployee'],
    currentUser,
    roles,
    listEmployeeMyTeam,
    listProjectByEmployee,
  }),
)
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAdminCSA: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      currentUser: {
        location: { _id: locationId } = {},
        employee: { _id: employee = '' } = {},
        roles = [],
      } = {},
    } = this.props;
    dispatch({
      type: 'employee/fetchListEmployeeMyTeam',
      payload: {
        location: [locationId],
      },
    });
    dispatch({
      type: 'offboarding/getListProjectByEmployee',
      payload: {
        employee,
      },
    });

    roles.forEach((role) => {
      const { _id = '' } = role;
      if (_id === 'ADMIN-CSA') {
        this.setState({
          isAdminCSA: true,
        });
      }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'offboarding/save',
      payload: {
        listProjectByEmployee: [],
      },
    });
  }

  render() {
    const {
      listEmployeeMyTeam = [],
      fetchMyTeam,
      currentUser = {},
      listProjectByEmployee = [],
      fetchListProject,
    } = this.props;
    const { isAdminCSA } = this.state;
    return (
      <PageContainer>
        <div className={styles.containerDashboard}>
          <Row gutter={[24, 24]} style={{ padding: '20px 20px 0 0' }}>
            <Col span={8}>
              <Greeting name={currentUser?.generalInfo?.firstName} />
              <div className={styles.leftContainer}>
                <ActivityLog />
              </div>
            </Col>
            <Col span={16}>
              <Carousel />
              {isAdminCSA && <SwitchLocation />}
              <MyApps />
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <TabManageTeamWork
                    listMyTeam={listEmployeeMyTeam}
                    loadingMyTeam={fetchMyTeam}
                    listProject={listProjectByEmployee}
                    loadingProject={fetchListProject}
                  />
                </Col>
                {/* <Col span={10}>
                  <TimeSheet />
                </Col> */}
                <Col span={14}>
                  <Links title="FAQs" showButton listData={listLinkFQAs} type="link" />
                </Col>
                <Col span={10}>
                  <Links title="Quick Links" listData={listQuickLinks} type="viewPDF" />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default Dashboard;
