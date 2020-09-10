import React, { PureComponent } from 'react';
import s from './index.less';

export default class ItemMenu extends PureComponent {
  render() {
    const { item = {}, handelClick = () => {}, selectedItemId } = this.props;
    const { name = '' } = item;
    const isActive = selectedItemId === item.id;
    return (
      <div
        onClick={() => handelClick(item)}
        className={s.itemMenu}
        style={isActive ? { fontWeight: '600' } : {}}
      >
        {name}
      </div>
    );
  }
}
