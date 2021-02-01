import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Row, Col, Affix } from 'antd';
import { connect } from 'umi';
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
  }) => ({
    fetchMyTeam: loading.effects['employee/fetchListEmployeeMyTeam'],
    fetchListProject: loading.effects['offboarding/getListProjectByEmployee'],
    currentUser,
    roles,
    listEmployeeMyTeam,
    listProjectByEmployee,
    getListByCompany,
    locationSelection,
  }),
)
class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: '',
    };
  }

  componentDidMount = async () => {
    const {
      dispatch,
      currentUser: {
        location: { _id: locationId = '' } = {},
        company: { _id: companyId = '' } = {},
        employee: { _id: employee = '' } = {},
        company: { _id: idCompany = '' } = {},
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
    dispatch({
      type: 'frequentlyAskedQuestions/getListByCompany',
      payload: { company: idCompany },
    });

    const locations = await dispatch({
      type: 'locationSelection/fetchLocationsByCompany',
      payload: {
        company: companyId,
      },
    });

    const currentLocation = localStorage.getItem('currentLocation');
    const locationName = locations.find((item) => item._id === currentLocation);
    this.setState({
      currentLocation: locationName?.name || '',
    });
  };

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

    const { currentLocation } = this.state;
    return (
      <PageContainer>
        <div className={styles.containerDashboard}>
          <Row gutter={[24, 24]} style={{ padding: '20px 20px 0 0' }}>
            <Col span={8}>
              <Affix offsetTop={10}>
                <Greeting
                  name={currentUser?.generalInfo?.firstName}
                  currentLocation={currentLocation}
                />
                <div className={styles.leftContainer}>
                  <ActivityLog />
                </div>
              </Affix>
            </Col>
            <Col span={16}>
              <Carousel />
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
                <Col span={14}>
                  <Links title="FAQs" showButton listData={listQuestion} type="link" />
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
