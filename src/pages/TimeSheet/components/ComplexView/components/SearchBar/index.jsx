import React from 'react';
import CustomSearchBox from '@/components/CustomSearchBox';

const SearchBar = (props) => {
  const { activeView = '', onChangeSearch = () => {} } = props;

  const VIEW_TYPE = {
    PROJECT_VIEW: 'project-view',
    TEAM_VIEW: 'team-view',
    FINANCE_REPORTS: 'finance-reports',
    HR_REPORTS: 'hr-reports',
  };

  const renderPlaceholder = (val) => {
    if (val === VIEW_TYPE.TEAM_VIEW || val === VIEW_TYPE.HR_REPORTS || VIEW_TYPE.PROJECT_VIEW) {
      return 'Search by Employee';
    }
    if (val === VIEW_TYPE.FINANCE_REPORTS) {
      return 'Search by Project';
    }
    return 'Search by Name, Task...';
  };

  return (
    <CustomSearchBox
      onSearch={(e) => onChangeSearch(e.target.value)}
      placeholder={renderPlaceholder(activeView)}
    />
  );
};
export default SearchBar;
