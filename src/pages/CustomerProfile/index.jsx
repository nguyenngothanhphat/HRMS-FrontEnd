import React, { Component } from 'react';
import {
  Affix,
  // Skeleton
} from 'antd';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import styles from './index.less';
import LayoutCustomerProfile from '../../components/LayoutCustomerProfile';
import ContactInfo from './components/ContactInfo';
import AuditTrail from './components/AuditTrail';
import Divisions from './components/Divisions';
import People from './components/People';
import Documents from './components/Documents';
import Projects from './components/Projects';
import Leads from './components/Leads';
import Tickets from './components/Tickets';
import Emails from './components/Emails';
import Appointments from './components/Appointments';
import Tasks from './components/Tasks';
import Notes from './components/Notes';

@connect(({ customerProfile: { info, listTag = [], temp: { selectedTab = '' } = {} } = {} }) => ({
  info,
  listTag,
  selectedTab,
}))
class CustomerProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: '',
    };
  }

  componentDidMount = async () => {
    const { dispatch, match: { params: { reId = '', tabName = '' } = {} } = {} } = this.props;
    const { selectedItem } = this.state;

    if (!tabName) {
      history.replace(`/customer-management/customers/customer-profile/${reId}`);
    } else {
      history.replace(`/customer-management/customers/customer-profile/${reId}/${tabName}`);
      // this.fetchData();
    }

    dispatch({
      type: 'customerProfile/fetchCustomerInfo',
      payload: {
        id: reId,
      },
    });

    dispatch({
      type: 'customerProfile/fetchTagList',
      payload: {
        id: reId,
      },
    });

    // this.fetchTab(selectedItem);
  };

  // fetchData = async () => {
  // };

  // componentWillUnmount = () => {
  //   const { dispatch } = this.props;
  //   localStorage.removeItem('tenantCurrentEmployee');
  //   localStorage.removeItem('companyCurrentEmployee');
  //   localStorage.removeItem('idCurrentEmployee');
  //   dispatch({
  //     type: 'employeeProfile/clearState',
  //   });
  // };

  setItem = (value) => {
    this.setState({
      selectedItem: value,
    });
  };

  render() {
    const {
      match: { params: { reId = '', tabName = '' } = {} },
      info = {},
      listTag,
    } = this.props;
    const listMenu = [
      {
        id: 1,
        name: 'Contact Info',
        component: <ContactInfo info={info} />,
        link: 'contact-info',
      },
      {
        id: 2,
        name: 'Divisions',
        component: <Divisions reId={reId} />,
        link: 'divisions',
      },
      {
        id: 3,
        name: 'People',
        component: <People />,
        link: 'people',
      },
      {
        id: 4,
        name: 'Documents',
        component: <Documents reId={reId} />,
        link: 'documents',
      },
      {
        id: 5,
        name: 'Projects',
        component: <Projects />,
        link: 'projects',
      },
      {
        id: 6,
        name: 'Leads',
        component: <Leads />,
        link: 'leads',
      },
      {
        id: 7,
        name: 'Tickets',
        component: <Tickets />,
        link: 'tickets',
      },
      {
        id: 8,
        name: 'Emails',
        component: <Emails />,
        link: 'emails',
      },
      {
        id: 9,
        name: 'Appointments',
        component: <Appointments />,
        link: 'appointments',
      },
      {
        id: 10,
        name: 'Tasks',
        component: <Tasks />,
        link: 'tasks',
      },
      {
        id: 11,
        name: 'Notes',
        component: <Notes reId={reId} />,
        link: 'notes',
      },
      {
        id: 12,
        name: 'Audit Trail',
        component: <AuditTrail reId={reId} />,
        link: 'audit-trail',
      },
    ];

    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile}>
          <Affix offsetTop={30}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>Customer Profile</p>
            </div>
          </Affix>

          <LayoutCustomerProfile
            // listTag={listTag}
            info={info}
            listMenu={listMenu}
            reId={reId}
            tabName={tabName}
          />
          {/* ) : (
            <div style={{ padding: '24px' }}>
              <Skeleton />
            </div>
          )} */}
        </div>
      </PageContainer>
    );
  }
}

export default CustomerProfile;
