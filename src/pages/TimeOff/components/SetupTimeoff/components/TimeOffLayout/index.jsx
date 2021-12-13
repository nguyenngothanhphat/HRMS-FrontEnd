import React, { Component } from 'react';
import { Affix } from 'antd';
import { history } from 'umi';
import s from './index.less';

class TimeOffLayout extends Component {
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

  onClickItemMenu = ({ link }) => {
    // this.setState({ selectedItemId: id, displayComponent: component });
    history.push(`/time-off/setup/${link}`);
  };

  _renderItemMenu = (item) => {
    const { selectedItemId } = this.state;
    const { id = '' } = item;
    const classNameItemMenu = selectedItemId === item.id ? s.itemMenuAcive : s.itemMenu;
    const tabTop = selectedItemId - 1 === id;
    return (
      <div
        onClick={() => this.onClickItemMenu(item)}
        className={classNameItemMenu}
        style={tabTop ? { borderBottom: 'none' } : {}}
        key={item.key}
      >
        {item.name}{' '}
        {/* <Progress
          strokeColor={item.progress < 100 ? '#FFA100' : '#00C598'}
          strokeWidth={6}
          width={item.progress < 100 ? 30 : 20}
          type="circle"
          percent={item.progress}
        /> */}
      </div>
    );
  };

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent } = this.state;
    return (
      <div className={s.root}>
        <Affix className={s.affixTimeOff} offsetTop={42}>
          <div className={s.leftMenu}>
            <div className={s.leftMenu__menuItem}>
              {listMenu.map((item) => this._renderItemMenu(item))}
            </div>
          </div>
        </Affix>
        <div className={s.contentWrap}>{displayComponent}</div>
      </div>
    );
  }
}

export default TimeOffLayout;
