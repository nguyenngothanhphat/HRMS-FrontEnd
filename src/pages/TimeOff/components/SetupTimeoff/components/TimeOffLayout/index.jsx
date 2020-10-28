import React, { Component } from 'react';
import s from './index.less';

class TimeOffLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItemKey: '',
      displayComponent: '',
    };
  }

  componentDidMount() {
    const { listMenu } = this.props;
    this.setState({
      selectedItemKey: listMenu[0].key,
      displayComponent: listMenu[0].component,
    });
  }

  onClickItemMenu = ({ key, component }) => {
    this.setState({ selectedItemKey: key, displayComponent: component });
  };

  _renderItemMenu = (item) => {
    const { selectedItemKey } = this.state;
    const classNameItemMenu = selectedItemKey === item.key ? s.itemMenuAcive : s.itemMenu;
    return (
      <div onClick={() => this.onClickItemMenu(item)} className={classNameItemMenu} key={item.key}>
        {item.name}
      </div>
    );
  };

  render() {
    const { listMenu = [] } = this.props;
    const { displayComponent } = this.state;
    return (
      <div className={s.root}>
        <div className={s.leftMenu}>{listMenu.map((item) => this._renderItemMenu(item))}</div>
        <div className={s.contentWrap}>{displayComponent}</div>
      </div>
    );
  }
}

export default TimeOffLayout;
