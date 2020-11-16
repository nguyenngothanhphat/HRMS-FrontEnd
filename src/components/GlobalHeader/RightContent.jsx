// import { Tooltip, Tag } from 'antd';
import { CalendarOutlined, BellOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { connect } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import GlobalEmployeeSearch from './components/GlobalEmployeeSearch';
import styles from './index.less';

// const ENVTagColor = {
//   dev: 'orange',
//   test: 'green',
//   pre: '#87d068',
// };

const GlobalHeaderRight = (props) => {
  const {
    theme,
    layout,
    dispatch,
    employeesManagement: { searchEmployeesList = [] },
    loadingList,
    currentUser: { roles = [], company = {} },
  } = props;
  const [visible, setVisible] = useState(false);
  let className = styles.right;

  const handleCancel = () => {
    setVisible(!visible);
  };

  const handleSearch = (value) => {
    setVisible(!visible);
    let companyID = [company._id];
    // Admin-sa no need param company
    const filterRoles = roles.filter((item) => item._id === 'ADMIN-SA');
    if (filterRoles.length > 0) {
      companyID = [];
    }
    dispatch({
      type: 'employeesManagement/fetchSearchEmployeesList',
      payload: {
        name: value,
        company: companyID,
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
          handleSearch(value);
        }}
      />
      <div className={`${styles.action} ${styles.calendar}`}>
        <CalendarOutlined />
      </div>
      <div className={`${styles.action} ${styles.notify}`}>
        <BellOutlined />
      </div>
      {/* <Tooltip title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip> */}
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

export default connect(
  ({ settings, employeesManagement, user: { currentUser = {} }, loading }) => ({
    theme: settings.navTheme,
    layout: settings.layout,
    employeesManagement,
    currentUser,
    loadingList: loading.effects['employeesManagement/fetchSearchEmployeesList'],
  }),
)(GlobalHeaderRight);
