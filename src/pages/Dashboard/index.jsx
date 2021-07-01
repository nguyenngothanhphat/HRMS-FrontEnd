import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Row, Col, Affix, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import { connect } from 'umi';
import { isAdmin, isOwner } from '@/utils/authority';
import Greeting from './components/Greeting';
import ActivityLog from './components/ActivityLog';
import MyApps from './components/MyApps';
import TabManageTeamWork from './components/TabManageTeamWork';
import Links from './components/Links';
import Carousel from './components/Carousel';
import styles from './index.less';

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
    frequentlyAskedQuestions: { getListByCompany = {} } = {},
    locationSelection,
    locationSelection: { listLocationsByCompany = [] } = {},
  }) => ({
    fetchMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
    fetchListProject: loading.effects['offboarding/getListProjectByEmployee'],
    fetchLocationList: loading.effects['locationSelection/fetchLocationsByCompany'],
    fetchLocationListParent: loading.effects['locationSelection/fetchLocationListByParentCompany'],
    currentUser,
    roles,
    listEmployeeMyTeam,
    listProjectByEmployee,
    getListByCompany,
    locationSelection,
    listLocationsByCompany,
  }),
)
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    // const {
    // dispatch,
    //   currentUser: {
    //     location: { _id: locationId = '' } = {},
    //     company: { _id: companyId = '' } = {},
    //     employee: { _id: employee = '' } = {},
    //     company: { _id: idCompany = '' } = {},
    //   } = {},
    // } = this.props;
    // dispatch({
    //   type: 'employee/fetchListEmployeeMyTeam',
    //   payload: {
    //     location: [locationId],
    //   },
    // });
    // dispatch({
    //   type: 'offboarding/getListProjectByEmployee',
    //   payload: {
    //     employee,
    //   },
    // });

    // dispatch({
    //   type: 'frequentlyAskedQuestions/getListInit',
    // }).then(
    //   dispatch({
    //     type: 'frequentlyAskedQuestions/getListByCompany',
    //     payload: { company: companyId },
    //   }),
    // );

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  // componentDidUpdate(prevProps) {
  //   const { listLocationsByCompany = [] } = this.props;
  //   const {currentLocation}
  //   if (JSON.stringify(listLocationsByCompany) !== JSON.stringify(prevProps.fetchLocationList)) {
  //     this.setLocation();
  //   }
  // }

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
      getListByCompany = {},
    } = this.props;
    const { faq = [] } = getListByCompany;

    const listQuestion = [];
    faq.forEach(({ questionAndAnswer, category }) => {
      const listQAs = questionAndAnswer.map((qa) => ({ ...qa, category }));
      listQuestion.push(...listQAs);
      return listQuestion;
    });

    return (
      <PageContainer>
        <div className={styles.containerDashboard}>
          <Row gutter={[24, 24]} style={{ padding: '24px 20px 0 0' }}>
            <Col span={8}>
              <Affix offsetTop={10}>
                <Greeting name={currentUser?.firstName} />
                <div className={styles.leftContainer}>
                  <ActivityLog />
                </div>
              </Affix>
            </Col>
            <Col span={16}>
              <Carousel />
              <MyApps />

              {!isOwner() && !isAdmin() && (
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <TabManageTeamWork
                      listMyTeam={listEmployeeMyTeam}
                      loadingMyTeam={fetchMyTeam}
                      listProject={listProjectByEmployee}
                      loadingProject={fetchListProject}
                    />
                  </Col>
                  <Col span={14}>
                    <Links title="FAQs" showButton listData={listQuestion} type="link" />
                  </Col>
                  <Col span={10}>
                    <Links title="Quick Links" listData={listQuickLinks} type="viewPDF" />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </PageContainer>
    );
  }
}

export default Dashboard;
