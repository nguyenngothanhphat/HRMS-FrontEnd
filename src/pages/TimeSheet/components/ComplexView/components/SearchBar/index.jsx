import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import styles from './index.less';

const SearchBar = (props) => {
  const { activeKey = '', onChangeSearch = () => {} } = props;
  const VIEW_TYPE = {
    TEAM_VIEW: 'team-view',
  };
  const searchPrefix = () => {
    return (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: 'black',
          marginRight: '10px',
        }}
      />
    );
  };

  return (
    <div className={styles.SearchBar}>
      <Input
        className={styles.searchInput}
        placeholder={
          activeKey === VIEW_TYPE.TEAM_VIEW ? 'Search by Name, task...' : 'Search by Funtional Area'
        }
        prefix={searchPrefix()}
        onChange={(e) => onChangeSearch(e.target.value)}
      />
    </div>
  );
};
export default SearchBar;
