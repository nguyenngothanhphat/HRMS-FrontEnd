/* eslint-disable react/jsx-curly-newline */
import { Affix, Col, Row } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import ItemMenu from './components/ItemMenu';
import UploadLogoCompany from './components/UploadLogoCompany';
import ViewInformation from './components/ViewInformation';
import s from './index.less';

@connect(
  ({
    companiesManagement: { selectedNewCompanyTab = 1 },
    employeeProfile: { isModified } = {},
    user: { currentUser } = {},
  }) => ({
    isModified,
    currentUser,
    selectedNewCompanyTab,
  }),
)
class CommonLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
    };
  }

  componentDidMount() {
    const { listMenu, selectedNewCompanyTab } = this.props;
    this.setState({
      selectedItemId: selectedNewCompanyTab || listMenu[0].id,
      displayComponent: listMenu[0].component,
    });
  }

  componentDidUpdate(prevProps) {
    const { listMenu, selectedNewCompanyTab } = this.props;

    // auto direct from company details to work locations
    if (prevProps.selectedNewCompanyTab !== selectedNewCompanyTab) {
      this.handleCLickItemMenu(listMenu[selectedNewCompanyTab - 1]);
    }

    const prevListMenu = prevProps.listMenu.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });

    const nextListMenu = listMenu.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });

    if (!_.isEqual(prevListMenu, nextListMenu)) {
      this.initItemMenu(listMenu);
    }
  }

  initItemMenu = (listMenu) => {
    this.setState({
      selectedItemId: listMenu[0].id,
      displayComponent: listMenu[0].component,
    });
  };

  handleCLickItemMenu = (item) => {
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    const {
      listMenu = [],
      employeeLocation = '',
      permissions = {},
      profileOwner = false,
      isCompanyProfile = false,
      isAddingCompany = false,
    } = this.props;
    const { displayComponent, selectedItemId } = this.state;
    return (
      <div className={s.root}>
        <Affix
          // offsetTop={isCompanyProfile ? 0 : 100}
          offsetTop={isAddingCompany ? 75 : 90}
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
              {/* {isCompanyProfile && (
                <Button
                  className={s.viewLeft__menu__btn}
                  disabled={currentUser?.firstCreated}
                  onClick={() =>
                    history.push({
                      pathname: '/',
                    })
                  }
                >
                  Go to dashboard
                </Button>
              )} */}
            </div>
          </div>
        </Affix>
        <Row className={s.viewRight} gutter={[24, 0]}>
          <Col span={isCompanyProfile ? 16 : 18}>{displayComponent}</Col>
          <Col span={isCompanyProfile ? 8 : 6}>
            {isCompanyProfile ? (
              <UploadLogoCompany />
            ) : (
              <ViewInformation
                permissions={permissions}
                profileOwner={profileOwner}
                employeeLocation={employeeLocation}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonLayout;
