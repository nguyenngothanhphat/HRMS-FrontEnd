/* eslint-disable react/jsx-curly-newline */
import { Affix, Col, Row } from 'antd';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import UploadLogoCompany from './components/UploadLogoCompany';
import ItemMenu from './components/ItemMenu';
import s from './index.less';

@connect(({ employeeProfile: { isModified } = {}, user: { currentUser } = {} }) => ({
  isModified,
  currentUser,
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
    const { listMenu } = this.props;
    this.setState({
      selectedItemId: listMenu[0].id,
      displayComponent: listMenu[0].component,
    });
  }

  componentDidUpdate(prevProps) {
    const { listMenu } = this.props;

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
    const { listMenu = [] } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <div className={s.LayoutAdminApp}>
        <Affix offsetTop={30}>
          <div className={s.titlePage}>Admin App</div>
        </Affix>

        <div className={s.root}>
          <Affix offsetTop={90} className={s.affix}>
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
          </Affix>
          <Row className={s.viewRight} gutter={[24, 0]}>
            <Col span={16}>{displayComponent}</Col>
            <Col span={8}>
              <UploadLogoCompany />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default CommonLayout;
