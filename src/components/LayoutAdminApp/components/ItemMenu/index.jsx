import React, { PureComponent } from 'react';
import s from './index.less';

export default class ItemMenu extends PureComponent {
  render() {
    const { item = {}, handleClick = () => {}, selectedItemId } = this.props;
    const { id = '', name = '' } = item;
    const isActive = selectedItemId === id;
    const className = isActive ? s.itemMenuActive : s.itemMenu;
    const isTabTopActive = id === selectedItemId - 1;
    return (
      <div
        onClick={() => handleClick(item)}
        className={className}
        style={isTabTopActive ? { borderBottom: 'none' } : {}}
      >
        <p className={s.textName}>{name}</p>
      </div>
    );
  }
}
