import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import styles from './index.less';

const SearchBar = (props) => {
  const { placeholder = 'Search by Name, Task...', onSearch = () => {} } = props;

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
        placeholder={placeholder}
        prefix={searchPrefix()}
        onChange={onSearch}
      />
    </div>
  );
};
export default SearchBar;
