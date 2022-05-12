/* eslint-disable react/jsx-curly-newline */
import { Col, Row, Skeleton } from 'antd';
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
    const { listMenu = [], loading = false } = this.props;
    const { selectedItemId, displayComponent, displayComponentActions } = this.state;
    return (
      <Row className={s.root}>
        <Col xs={24} md={6} xl={4} className={s.viewLeft}>
          <div className={s.viewLeft}>
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
          </div>
        </Col>

        <Col xs={24} md={18} xl={20} className={s.viewRight}>
          <Row gutter={[24, 24]}>
            <Col xs={24} xl={18}>
              {loading ? <Skeleton /> : displayComponentActions || displayComponent}
            </Col>
            <Col xs={24} xl={6}>
              <ViewInformation />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default CommonLayout;
