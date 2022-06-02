import { Affix } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import LayoutEmployeeProfile from '@/components/LayoutEmployeeProfile';
import { PageContainer } from '@/layouts/layout/src';
import BenefitTab from '@/pages/EmployeeProfile/components/BenefitTab';
import EmploymentTab from '@/pages/EmployeeProfile/components/EmploymentTab';
import { IS_TERRALOGIC_LOGIN } from '@/utils/login';
// import AccountsPaychecks from './components/Accounts&Paychecks';
import Compensation from './components/Compensation';
import Documents from './components/Documents';
import GeneralInfo from './components/GeneralInfo';
import PerformanceHistory from './components/PerformanceHistory';
import styles from './index.less';

const EmployeeProfile = (props) => {
  const {
    dispatch,
    match: { params: { tabName = '', reId = '' } = {} },
    currentUser: { employee: { generalInfo: { userId = '' } = {} } = {} },
    permissions = {},
    location: { state: { location = '' } = {} } = {},
    employeeProfile: { employee = '' } = {},
  } = props;

  const checkProfileOwner = (currentUserID, employeeID) => {
    return currentUserID === employeeID;
  };

  const isProfileOwner = checkProfileOwner(userId, reId);

  const fetchData = async (id) => {
    dispatch({
      type: 'employeeProfile/fetchEmploymentInfo',
      payload: { id },
    });

    dispatch({
      type: 'employeeProfile/fetchGeneralInfo',
      payload: { employee: id },
    });
  };

  const fetchUser = () => {
    dispatch({
      type: 'employeeProfile/fetchEmployeeIdByUserId',
      payload: {
        userId: reId,
      },
    }).then(({ statusCode, data }) => {
      if (statusCode === 200) {
        fetchData(data);
      }
    });
  };

  useEffect(() => {
    if (tabName && reId) {
      fetchUser();
    }
  }, [reId]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'employeeProfile/clearState',
      });
    };
  }, []);

  const renderListMenu = () => {
    let listMenu = [];
    listMenu.push({
      name: 'General Info',
      component: <GeneralInfo permissions={permissions} profileOwner={isProfileOwner} />,
      link: 'general-info',
    });
    if (permissions.viewTabEmployment !== -1 || isProfileOwner) {
      listMenu.push({
        name: `Employment Info`,
        component: <EmploymentTab profileOwner={isProfileOwner} />,
        link: 'employment-info',
      });
    }

    if (!IS_TERRALOGIC_LOGIN) {
      if (permissions.viewTabEmployment !== -1 || isProfileOwner) {
        listMenu.push({
          name: `Compensation`,
          component: <Compensation profileOwner={isProfileOwner} />,
          link: 'compensation',
        });
      }

      if (permissions.viewTabAccountPaychecks !== -1 || isProfileOwner) {
        listMenu.push({
          name: 'Performance History',
          component: <PerformanceHistory />,
          link: 'performance-history',
        });
      }
    }

    if (permissions.viewTabDocument !== -1 || isProfileOwner) {
      listMenu.push({ name: 'Documents', component: <Documents />, link: 'documents' });
    }
    if (permissions.viewTabBenefitPlans !== -1 || isProfileOwner) {
      listMenu.push({
        name: 'Benefits',
        component: <BenefitTab profileOwner={isProfileOwner} />,
        link: 'benefits',
      });
    }

    listMenu = listMenu.map((x, i) => {
      return {
        ...x,
        id: i + 1,
      };
    });

    return listMenu;
  };

  const listMenu = renderListMenu();

  if (!tabName) return null;
  return (
    <PageContainer>
      <div className={styles.containerEmployeeProfile}>
        <Affix offsetTop={42}>
          <div className={styles.titlePage}>
            <p className={styles.titlePage__text}>Employee Profile</p>
          </div>
        </Affix>

        <LayoutEmployeeProfile
          listMenu={listMenu}
          tabName={tabName}
          reId={reId}
          employeeLocation={location}
          permissions={permissions}
          profileOwner={isProfileOwner}
        />
      </div>
    </PageContainer>
  );
};

export default connect(
  ({
    employee: { listEmployeeActive = [] } = {},
    employeeProfile,
    user: { currentUser = {}, permissions = {} },
  }) => ({
    employeeProfile,
    currentUser,
    listEmployeeActive,
    permissions,
  }),
)(EmployeeProfile);
