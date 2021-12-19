import React, { PureComponent } from 'react';
import View from './View';
// import Edit from './Edit';
import s from './index.less';

class DependentTabs extends PureComponent {
  render() {
    const {
      data = [],
      // isEditing = false,
      // isAdding = false,
      // setEditing = () => {},
      // setAdding = () => {},
    } = this.props;
    return (
      <div className={s.DependentTabs}>
        <View data={data} />
      </div>
    );
  }
}

export default DependentTabs;
