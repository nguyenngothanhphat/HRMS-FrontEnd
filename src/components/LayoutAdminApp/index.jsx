/* eslint-disable react/jsx-curly-newline */
import { Affix, Col, Row, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import UploadLogoCompany from './components/UploadLogoCompany';
import ItemMenu from './components/ItemMenu';
import s from './index.less';

@connect(({ loading, employeeProfile: { isModified } = {}, user: { currentUser } = {} }) => ({
  isModified,
  currentUser,
  loadingFetchCompanyById: loading.effects['companiesManagement/fetchCompanyDetails'],
}))
class CommonLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
    };
  }

  componentDidMount() {
    this.fetchTab();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  componentDidUpdate(prevProps) {
    const { tabName = '' } = this.props;

    if (prevProps.tabName !== tabName) {
      this.fetchTab();
    }
  }

  fetchTab = () => {
    const { listMenu, tabName = '' } = this.props;
    const findTab = listMenu.find((menu) => menu.link === tabName) || listMenu[0];

    this.setState({
      selectedItemId: findTab.id || 1,
      displayComponent: findTab.component,
    });
  };

  handleCLickItemMenu = (item) => {
    history.push(`/admin-app/${item.link}`);
  };

  render() {
    const { listMenu = [], loadingFetchCompanyById = false } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <div className={s.LayoutAdminApp}>
        <Affix offsetTop={42}>
          <div className={s.titlePage}>Admin App</div>
        </Affix>

        <Row className={s.root}>
          <Col xs={24} md={6} xl={4} className={s.viewLeft}>
            <div className={s.viewLeft__menu}>
              {listMenu.map((item) => (
                <ItemMenu
                  key={item.id}
                  item={item}
                  handleClick={this.handleCLickItemMenu}
                  selectedItemId={selectedItemId}
                />
              ))}
            </div>
          </Col>
          <Col xs={24} md={18} xl={20} className={s.viewRight}>
            <Row gutter={[24, 24]}>
              {loadingFetchCompanyById ? (
                <Skeleton />
              ) : (
                <>
                  <Col span={16}>{displayComponent}</Col>
                  <Col span={8}>
                    <UploadLogoCompany />
                  </Col>
                </>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonLayout;
