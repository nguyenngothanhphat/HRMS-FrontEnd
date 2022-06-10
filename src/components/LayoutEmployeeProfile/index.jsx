/* eslint-disable react/jsx-curly-newline */
import { Affix, Col, Row, Skeleton, Spin } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import RequestDetails from '@/pages/EmployeeProfile/components/RequestDetails';
import RaiseTermination from '@/pages/EmployeeProfile/components/RaiseTermination';
import PutOnLeave from '@/pages/EmployeeProfile/components/PutOnLeave';
import { isOwner } from '@/utils/authority';
import ItemMenu from './components/ItemMenu';
import UploadLogoCompany from './components/UploadLogoCompany';
import ViewInformation from './components/ViewInformation';
import s from './index.less';
import { goToTop } from '@/utils/utils';

@connect(
  ({
    loading,
    companiesManagement: { selectedNewCompanyTab = 1 },
    employeeProfile: { isModified, isProfileOwner = false } = {},
    user: { currentUser } = {},
  }) => ({
    isModified,
    currentUser,
    selectedNewCompanyTab,
    isProfileOwner,
    loadingFetchEmployee:
      loading.effects['employeeProfile/fetchGeneralInfo'] ||
      loading.effects['employeeProfile/fetchEmployeeIdByUserId'] ||
      loading.effects['employeeProfile/fetchEmploymentInfo'],
  }),
)
class CommonLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
      displayComponentActions: null,
    };
  }

  componentDidMount() {
    const { selectedNewCompanyTab = 1, isAddingCompany = false } = this.props;

    // auto direct from  work locations to company details if company details were not filled
    if (selectedNewCompanyTab === 1 && isAddingCompany) {
      history.push(`/control-panel/add-company/company-details`);
    }

    this.fetchTab();
  }

  componentDidUpdate(prevProps) {
    const { tabName = '' } = this.props;

    if (tabName !== prevProps.tabName) {
      this.fetchTab();
    }
  }

  fetchTab = () => {
    goToTop();
    const { listMenu = [], tabName = '' } = this.props;
    const selectedTab = listMenu.find((m) => m.link === tabName) || listMenu[0];

    this.setState({
      selectedItemId: selectedTab.id,
      displayComponent: selectedTab.component,
    });
  };

  handleCLickItemMenu = (item) => {
    const { reId, isAddingCompany = false } = this.props;

    if (!isAddingCompany) {
      const link = isOwner() ? 'employees' : 'directory';
      history.push(`/${link}/employee-profile/${reId}/${item.link}`);
    } else {
      history.push(`/control-panel/add-company/${item.link}`);
    }
  };

  listItemActions = () => {
    const listItemActions = [
      {
        key: '0',
        component: <PutOnLeave cancel={this.cancelDisplayItemAction} />,
      },
      {
        key: '1',
        component: <RaiseTermination cancel={this.cancelDisplayItemAction} />,
      },
      {
        key: '2',
        component: <RequestDetails cancel={this.cancelDisplayItemAction} />,
      },
    ];

    return listItemActions;
  };

  cancelDisplayItemAction = () => {
    this.setState({
      displayComponentActions: null,
    });
  };

  handleClickOnActions = (keyItem) => {
    const list = this.listItemActions();

    list.forEach((item) => {
      const { key = '', component } = item;
      if (key === keyItem) {
        this.setState({
          displayComponentActions: component,
        });
      }
    });
  };

  render() {
    const {
      listMenu = [],
      employeeLocation = '',
      permissions = {},
      isProfileOwner = false,
      isCompanyProfile = false,
      isAddingCompany = false,
      loadingFetchEmployee = false,
    } = this.props;

    const { displayComponent, selectedItemId, displayComponentActions } = this.state;

    return (
      <div className={s.root}>
        <Affix
          // offsetTop={isCompanyProfile ? 0 : 100}
          offsetTop={isAddingCompany ? 75 : 102}
          className={s.affix}
        >
          <div className={s.viewLeft}>
            <div
              className={s.viewLeft__menu}
              style={isCompanyProfile ? { padding: '24px 0 24px 40px' } : {}}
            >
              {listMenu.map((item) => (
                <ItemMenu
                  key={item.id}
                  item={item}
                  handleClick={this.handleCLickItemMenu}
                  selectedItemId={selectedItemId}
                  isAddingCompany={isAddingCompany}
                />
              ))}
            </div>
          </div>
        </Affix>

        <Row xs={24} md={18} xl={20} gutter={[24, 24]} className={s.viewRight}>
          <Col xl={isCompanyProfile ? 16 : 18} xs={24}>
            <Spin spinning={loadingFetchEmployee}>
              {displayComponentActions || displayComponent}
            </Spin>
          </Col>
          <Col xl={isCompanyProfile ? 8 : 6} xs={24}>
            {isCompanyProfile ? (
              <UploadLogoCompany />
            ) : (
              <ViewInformation
                permissions={permissions}
                isProfileOwner={isProfileOwner}
                employeeLocation={employeeLocation}
                handleClickOnActions={this.handleClickOnActions}
                loadingFetchEmployee={loadingFetchEmployee}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonLayout;
