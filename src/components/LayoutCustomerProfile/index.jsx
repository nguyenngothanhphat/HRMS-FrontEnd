/* eslint-disable react/jsx-curly-newline */
import { Affix, Col, Row } from 'antd';
// import _ from 'lodash';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
// import { isOwner } from '@/utils/authority';
import ItemMenu from './components/ItemMenu';
// import UploadLogoCompany from './components/UploadLogoCompany';
import ViewInformation from './components/ViewInformation';
import s from './index.less';

@connect()
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
    this.fetchTab();
  }

  componentDidUpdate(prevProps) {
    const { tabName = '' } = this.props;

    if (tabName !== prevProps.tabName) {
      this.fetchTab();
    }
  }

  fetchTab = () => {
    const { listMenu = [], tabName = '' } = this.props;
    const selectedTab = listMenu.find((m) => m.link === tabName) || listMenu[0];

    this.setState({
      selectedItemId: selectedTab.id,
      displayComponent: selectedTab.component,
    });
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  handleCLickItemMenu = (item) => {
    this.setState({
      selectedItemId: item.id,
      displayComponent: item.component,
    });
    const { reId } = this.props;

    history.push(`/customer-management/customers/customer-profile/${reId}/${item.link}`);
  };

  render() {
    const { listMenu = [] } = this.props;
    const { selectedItemId, displayComponent, displayComponentActions } = this.state;
    return (
      <div className={s.root}>
        <Affix
          // offsetTop={isCompanyProfile ? 0 : 100}
          offsetTop={90}
          className={s.affix}
        >
          <div className={s.viewLeft}>
            <div className={s.viewLeft__menu} style={{ padding: '24px 0 24px 40px' }}>
              {listMenu.map((item) => (
                <ItemMenu
                  key={item.id}
                  item={item}
                  handleClick={this.handleCLickItemMenu}
                  selectedItemId={selectedItemId}
                />
              ))}
            </div>
          </div>
        </Affix>
        <Row className={s.viewRight} gutter={[24, 0]}>
          <Col span={18}>{displayComponentActions || displayComponent}</Col>
          <Col span={6}>
            {/* {isCompanyProfile ? (
              <UploadLogoCompany />
            ) : ( */}
            <ViewInformation />
            {/* )} */}
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonLayout;
