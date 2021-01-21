import React, { PureComponent } from 'react';
import { history } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import FormSearch from '../FormSearch';
import s from './index.less';

class ViewAdvancedSearch extends PureComponent {
  handleSearch = (query) => {
    const { closeSearch = () => {}, keySearch } = this.props;
    history.push({
      pathname: '/search-result',
      query: { ...query, keySearch },
    });
    closeSearch(true);
  };

  render() {
    const { closeSearch = () => {} } = this.props;
    return (
      <div className={s.root}>
        <div className={s.viewTop}>
          <p className={s.viewTop__title}>Advanced Search</p>
          <div className={s.viewTop__circle} onClick={() => closeSearch(true)}>
            <CloseOutlined className={s.viewTop__circle__icon} />
          </div>
        </div>
        <FormSearch handleSearch={this.handleSearch} />
      </div>
    );
  }
}

export default ViewAdvancedSearch;
