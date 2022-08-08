import { Affix } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import LayoutCustomerProfile from '../../components/LayoutCustomerProfile';
import Appointments from './components/Appointments';
import AuditTrail from './components/AuditTrail';
import ContactInfo from './components/ContactInfo';
import Divisions from './components/Divisions';
import Documents from './components/Documents';
import Emails from './components/Emails';
import Leads from './components/Leads';
import Notes from './components/Notes';
import People from './components/People';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import Tickets from './components/Tickets';
import styles from './index.less';

const CustomerProfile = (props) => {
  const {
    match: { params: { reId = '', tabName = '' } = {} },
    info = {},
    loadingFetchCustomer = false,
    info: { dba = '', legalName = '' } = {},
    dispatch,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'customerProfile/fetchCustomerInfo',
      payload: {
        id: reId,
      },
    });
  }, []);

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

  if (!tabName) return null;
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
};

export default connect(
  ({ loading, customerProfile: { info, listTag = [], temp: { selectedTab = '' } = {} } = {} }) => ({
    info,
    listTag,
    selectedTab,
    loadingFetchCustomer: loading.effects['customerProfile/fetchCustomerInfo'],
  }),
)(CustomerProfile);
