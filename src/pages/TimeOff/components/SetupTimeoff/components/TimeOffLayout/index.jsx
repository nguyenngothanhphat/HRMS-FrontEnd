import React, { Component } from 'react';
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
    const { listMenu } = this.props;
    this.setState({
      selectedItemId: listMenu[0].id,
      displayComponent: listMenu[0].component,
    });
  }

  onClickItemMenu = ({ id, component }) => {
    this.setState({ selectedItemId: id, displayComponent: component });
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
