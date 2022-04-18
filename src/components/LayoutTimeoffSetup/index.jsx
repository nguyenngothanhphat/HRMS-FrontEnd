import { Col, Row, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { goToTop } from '@/utils/utils';
import ItemMenu from './components/ItemMenu';
import s from './index.less';

@connect(() => ({}))
class LayoutTimeoffSetup extends Component {
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
    const { listMenu = [], tabName = '' } = this.props;

    const findTab = listMenu.find((menu) => menu.link === tabName) || listMenu[0];
    this.setState({
      selectedItemId: findTab.id || 1,
      displayComponent: findTab.component,
    });
    goToTop();
  };

  _handleClick = (item) => {
    history.push(`/time-off/setup/${item.link}`);
  };

  render() {
    const { listMenu = [], loading = false } = this.props;
    const { displayComponent, selectedItemId } = this.state;

    return (
      <Row className={s.LayoutTimeoffSetup}>
        <Col xs={24} md={6} xl={4} className={s.viewLeft}>
          <div className={s.viewLeft__menu}>
            {listMenu.map((item) => (
              <ItemMenu
                key={item.id}
                item={item}
                handleClick={this._handleClick}
                selectedItemId={selectedItemId}
              />
            ))}
          </div>
        </Col>
        <Col xs={24} md={18} xl={20} className={s.viewRight}>
          <Row gutter={[24, 24]}>
            <Col xs={24} xl={18}>
              {loading ? <Skeleton /> : displayComponent}
            </Col>
            <Col xs={24} xl={6} />
          </Row>
        </Col>
      </Row>
    );
  }
}

export default LayoutTimeoffSetup;
