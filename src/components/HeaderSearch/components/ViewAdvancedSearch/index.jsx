import React, { PureComponent } from 'react';
import iconClose from '@/assets/iconClose.png';
import FormSearch from '../FormSearch';
import s from './index.less';

class ViewAdvancedSearch extends PureComponent {
  render() {
    const { changeMode = () => {} } = this.props;
    return (
      <div className={s.root}>
        <div className={s.viewTop}>
          <p className={s.viewTop__title}>Advanced Search</p>
          <img
            className={s.viewTop__icon}
            onClick={() => changeMode('history')}
            src={iconClose}
            alt="iconClose"
          />
        </div>
        <FormSearch />
      </div>
    );
  }
}

export default ViewAdvancedSearch;
