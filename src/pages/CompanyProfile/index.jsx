/* eslint-disable react/jsx-curly-newline */
import Breadcrumb from '@/components/Breadcrumb';
import Layout from '@/components/LayoutEmployeeProfile';
import { Spin, Tabs } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import CompanyDetails from './components/CompanyDetails';
import WorkLocations from './components/WorkLocations';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    user: { currentUser = {} } = {},
    global: { fromCompanyManagement = '' } = {},
    departmentManagement: { listByCompany: listDepartment = [] } = {},
    companiesManagement: {
      originData: { companyDetails: { company: companyDetails = {} } = {} } = {},
    } = {},
  }) => ({
    currentUser,
    listDepartment,
    loading: loading.effects['companiesManagement/fetchCompanyDetails'],
    companyDetails,
    fromCompanyManagement,
  }),
)
class CompanyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch,
      // match: { params: { id = '' } = {} },
    } = this.props;

    dispatch({
      type: 'country/fetchListCountry',
    });
    dispatch({
      type: 'departmentManagement/fetchListDefaultDepartment',
    });
    dispatch({
      type: 'user/fetchCompanyOfUser',
    });
    dispatch({
      type: 'companiesManagement/fetchCompanyTypeList',
    });
    dispatch({
      type: 'companiesManagement/fetchIndustryList',
    });

    // if (id) {
    //   dispatch({
    //     type: 'companiesManagement/fetchCompanyDetails',
    //     payload: { id },
    //   });
    // }
  }

  componentWillUnmount() {
    this.clearState();
  }

  clearState = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'companiesManagement/saveOrigin',
      payload: { companyDetails: {} },
    });
    dispatch({
      type: 'companiesManagement/saveTemp',
      payload: { companyDetails: {} },
    });
  };

  onCancel = () => {
    const { fromCompanyManagement = '', dispatch } = this.props;
    if (fromCompanyManagement) {
      dispatch({
        type: 'global/save',
        payload: { fromCompanyManagement: '' },
      });
      history.push(fromCompanyManagement);
    } else {
      history.push('/control-panel');
    }
  };

  cancelButton = () => {
    return (
      <div className={styles.cancelButton} onClick={this.onCancel}>
        <span>Cancel</span>
      </div>
    );
  };

  render() {
    const {
      // currentUser,
      match: { params: { id = '' } = {} },
      loading = false,
    } = this.props;

    const routes = [
      { name: 'Control Panel', path: '/control-panel' },
      {
        name: id ? 'Account Setup' : 'Add new company',
        path: id ? `/control-panel/company-profile/${id}` : '/control-panel/add-company',
      },
    ];

    const listMenu = [
      {
        id: 1,
        name: 'Company Details',
        component: <CompanyDetails companyId={id} />,
        link: 'company-details',
      },
      {
        id: 2,
        name: 'Work Locations',
        component: <WorkLocations companyId={id} />,
        link: 'work-locations',
      },
    ];

    const {
      match: { params: { tabName = '' } = {} },
    } = this.props;

    return (
      <div className={styles.CompanyProfile}>
        <Breadcrumb routes={routes} />
        <div className={styles.root}>
          <Tabs defaultActiveKey="1" tabBarExtraContent={this.cancelButton()}>
            <TabPane tab="Profile Information" key="1">
              {loading ? (
                <div className={styles.viewLoading}>
                  <Spin size="large" />
                </div>
              ) : (
                <Layout listMenu={listMenu} isCompanyProfile isAddingCompany tabName={tabName} />
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default CompanyProfile;
