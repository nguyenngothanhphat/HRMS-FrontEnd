// import { Tooltip, Tag } from 'antd';
import { BellOutlined, BuildOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import GlobalEmployeeSearch from './components/GlobalEmployeeSearch';
import styles from './index.less';

const GlobalHeaderRight = (props) => {
  const {
    theme,
    layout,
    dispatch,
    employeesManagement: { searchEmployeesList = [] },
    loadingList,
  } = props;
  const [visible, setVisible] = useState(false);
  let className = styles.right;

  const handleCancel = () => {
    setVisible(!visible);
  };

  const handleSearch = (value) => {
    setVisible(!visible);
    dispatch({
      type: 'employeesManagement/fetchSearchEmployeesList',
      payload: {
        query: value,
      },
    });
  };

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Search"
        visible={visible}
        onSearch={(value) => {
          if (value) {
            handleSearch(value);
          }
        }}
      />
      <div className={`${styles.action} ${styles.notify}`}>
        <BellOutlined />
      </div>
      <Tooltip title="Switch company">
        <div className={`${styles.action} ${styles.notify}`}>
          <BuildOutlined />
        </div>
      </Tooltip>
      <Avatar />
      <GlobalEmployeeSearch
        titleModal="GLOBAL EMPLOYEE SEARCH"
        visible={visible}
        handleCancel={handleCancel}
        employeesList={searchEmployeesList}
        loading={loadingList}
      />
    </div>
  );
};

export default connect(({ settings, employeesManagement, loading }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  employeesManagement,
  loadingList: loading.effects['employeesManagement/fetchSearchEmployeesList'],
}))(GlobalHeaderRight);
