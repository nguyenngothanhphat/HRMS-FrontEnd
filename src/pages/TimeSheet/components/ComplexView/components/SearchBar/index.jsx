import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import styles from './index.less';

const SearchBar = (props) => {
  const { activeView = '', onChangeSearch = () => {} } = props;

  const VIEW_TYPE = {
    PROJECT_VIEW: 'project-view',
    TEAM_VIEW: 'team-view',
    FINANCE_REPORTS: 'finance-reports',
    HR_REPORTS: 'hr-reports',
  };

  const renderPlaceholder = (val) => {
    if (val === VIEW_TYPE.PROJECT_VIEW) {
      return 'Search by Funtional Area';
    }
    if (val === VIEW_TYPE.TEAM_VIEW || val === VIEW_TYPE.HR_REPORTS) {
      return 'Search by Employee';
    }
    if (val === VIEW_TYPE.FINANCE_REPORTS) {
      return 'Search by Project';
    }
    return 'Search by Name, Task...';
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
        placeholder={renderPlaceholder(activeView)}
        prefix={searchPrefix()}
        onChange={(e) => onChangeSearch(e.target.value)}
      />
    </div>
  );
};
export default SearchBar;
