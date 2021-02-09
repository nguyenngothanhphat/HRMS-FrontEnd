import React, { PureComponent } from 'react';
import View from './View';
import Edit from './Edit';
import s from './index.less';

class DependentTabs extends PureComponent {
  render() {
    const { data = [], isEditing = false, setEditing = () => {} } = this.props;
    return (
      <div className={s.DependentTabs}>
        {!isEditing ? <View data={data} /> : <Edit data={data} setEditing={setEditing} />}
      </div>
    );
  }
}

export default DependentTabs;
