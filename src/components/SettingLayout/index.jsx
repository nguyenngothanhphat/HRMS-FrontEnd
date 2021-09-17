/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import { Row, Col, Button } from 'antd';
import { history } from 'umi';
import ItemMenu from './components/ItemMenu';
// import PreviewOffer from '../../pages/NewCandidateForm/components/PreviewOffer/index';

// import BottomBar from '../BottomBar';

import s from './index.less';

class SettingLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemId: '',
      displayComponent: '',
    };
  }

  componentDidMount() {
    this.fetchTab();
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
      selectedItemId: findTab.component ? findTab.id : 1,
      displayComponent: findTab.component,
    });
  };

  _handleClick = (item) => {
    const { route = '' } = this.props;
    history.push(`/${route}/settings/${item.link}`);
  };

  render() {
    const { listMenu = [], currentPage = '' } = this.props;
    const { displayComponent, selectedItemId } = this.state;
    return (
      <div className={s.containerCommonLayout}>
        <Row>
          <Col sm={24} md={6} xl={5} className={s.viewLeft}>
            <div className={s.viewLeft__menu}>
              {listMenu.map((item) => (
                <ItemMenu
                  key={item.id}
                  item={item}
                  handelClick={this._handleClick}
                  selectedItemId={selectedItemId}
                />
              ))}
              <div className={s.viewLeft__menu__btnPreviewOffer} />
            </div>
          </Col>
          <Col
            sm={24}
            md={18}
            xl={19}
            className={s.viewRight}
            style={currentPage === 'settings' ? { padding: '0' } : {}}
          >
            {displayComponent}
          </Col>
        </Row>
      </div>
    );
  }
}

export default SettingLayout;
