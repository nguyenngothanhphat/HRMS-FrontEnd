import React, { PureComponent } from 'react';
import s from './index.less';
import TickMarkIcon from '@/assets/tickMarkIcon.svg';

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
    const {
      item = {},
      handelClick = () => {},
      selectedItemId,
      isDisabled = false,
      isCompleted = false,
    } = this.props;

    const { id = '', name = '' } = item;
    const isActive = selectedItemId === id;
    // const className = isActive ? s.itemMenuActive : s.itemMenu;
    const isTabTopActive = id === selectedItemId - 1;

    const className = this.getClassName();
    return (
      <div
        onClick={() => {
          if (isDisabled) {
            return;
          }
          handelClick(item);
        }}
        className={`${className}`}
        style={isTabTopActive ? { borderBottomColor: '#fff' } : {}}
      >
        <p className={s.textName}>{name}</p>
        {isCompleted && <img src={TickMarkIcon} alt="iconCheck" className={s.iconCheck} />}
      </div>
    );
  }
}
