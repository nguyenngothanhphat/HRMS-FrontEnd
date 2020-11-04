import React, { PureComponent } from 'react';
import s from './index.less';

export default class ItemMenu extends PureComponent {
  getClassName = () => {
    const { item = {}, selectedItemId, isDisabled = false } = this.props;
    const { id = '' } = item;
    const isActive = selectedItemId === id;
    // let classStr = '';
    if (isDisabled) {
      return `${s.itemMenu} ${s.disabled}`;
    }
    if (isActive) {
      return `${s.itemMenuActive}`;
    }
    return `${s.itemMenu}`;
  };

  render() {
    const { item = {}, handelClick = () => {}, selectedItemId, isDisabled = false } = this.props;
    console.log(isDisabled);
    const { id = '', name = '', isComplete = false } = item;

    // const className = isActive ? s.itemMenuActive : s.itemMenu;
    const className = this.getClassName();
    const isTabTopActive = id === selectedItemId - 1;
    return (
      <div
        onClick={() => {
          if (isDisabled) {
            return;
          }
          handelClick(item);
        }}
        className={`${className}`}
        style={isTabTopActive ? { borderBottom: 'none' } : {}}
      >
        <p className={s.textName}>{name}</p>
        {isComplete && (
          <img src="/assets/images/iconCheck.svg" alt="iconCheck" className={s.iconCheck} />
        )}
      </div>
    );
  }
}
