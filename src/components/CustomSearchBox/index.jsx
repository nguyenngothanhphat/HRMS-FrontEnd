import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import styles from './index.less';

const CustomSearchBox = (props) => {
  const {
    placeholder = 'Search by Name, Task...',
    onSearch = () => {},
    borderRadius = 33,
    width = 250,
  } = props;

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
    <div
      className={styles.CustomSearchBox}
      style={{
        minWidth: width,
      }}
    >
      <Input
        className={styles.searchInput}
        style={{ borderRadius }}
        placeholder={placeholder}
        prefix={searchPrefix()}
        onChange={onSearch}
      />
    </div>
  );
};
export default CustomSearchBox;
