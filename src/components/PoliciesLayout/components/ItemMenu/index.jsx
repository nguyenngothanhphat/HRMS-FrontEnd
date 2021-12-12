import React, { PureComponent } from 'react';
import s from './index.less';

export default class ItemMenu extends PureComponent {
  render() {
    const { item = {}, handelClick = () => {}, selectedItemId } = this.props;
    const { id = '', name = '', isComplete = false } = item;
    const isActive = selectedItemId === id;
    const className = isActive ? s.itemMenuActive : s.itemMenu;
    const isTabTopActive = id === selectedItemId - 1;
    return (
      <div
        onClick={() => handelClick(item)}
        className={className}
        style={isTabTopActive ? { borderBottomColor: '#fff' } : {}}
      >
        <p className={s.textName}>{name}</p>
        {isComplete && (
          <img src="/assets/images/iconCheck.svg" alt="iconCheck" className={s.iconCheck} />
        )}
      </div>
    );
  }
}
