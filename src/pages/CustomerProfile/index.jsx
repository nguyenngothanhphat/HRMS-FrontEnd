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

@connect(
  ({ loading, customerProfile: { info, listTag = [], temp: { selectedTab = '' } = {} } = {} }) => ({
    info,
    listTag,
    selectedTab,
    loadingFetchCustomer: loading.effects['customerProfile/fetchCustomerInfo'],
  }),
)
class CustomerProfile extends Component {
  componentDidMount = async () => {
    const { dispatch, match: { params: { reId = '', tabName = '' } = {} } = {} } = this.props;
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
      type: 'customerManagement/fetchEmployeeList',
    });
  };

  render() {
    const {
      match: { params: { reId = '', tabName = '' } = {} },
      info = {},
      loadingFetchCustomer = false,
      info: { dba = '', legalName = '' } = {},
    } = this.props;
    const listMenu = [
      {
        id: 1,
        name: 'Contact Info',
        component: <ContactInfo />,
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
        component: <Projects reId={reId} />,
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
          <Affix offsetTop={42}>
            <div className={styles.titlePage}>
              <p className={styles.titlePage__text}>{dba || legalName || 'Customer Profile'}</p>
            </div>
          </Affix>

          <LayoutCustomerProfile
            info={info}
            listMenu={listMenu}
            reId={reId}
            tabName={tabName}
            loading={loadingFetchCustomer}
          />
        </div>
      </PageContainer>
    );
  }
}

export default CustomerProfile;
