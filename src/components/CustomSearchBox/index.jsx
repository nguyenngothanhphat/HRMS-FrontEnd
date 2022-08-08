import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const CustomSearchBox = ({
  placeholder = 'Search by Name, Task...',
  onSearch = () => {},
  borderRadius = 33,
  width = 250,
  value = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  const onChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e);
  };

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

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
        value={searchTerm}
        className={styles.searchInput}
        style={{ borderRadius }}
        placeholder={placeholder}
        prefix={searchPrefix()}
        onChange={onChange}
        allowClear
      />
    </div>
  );
};
export default CustomSearchBox;
