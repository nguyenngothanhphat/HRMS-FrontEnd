// import { Tooltip, Tag } from 'antd';
import { CalendarOutlined, BellOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
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
      <Link to="/time-off">
        <div className={`${styles.action} ${styles.calendar}`}>
          <CalendarOutlined />
        </div>
      </Link>

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

export default connect(({ settings, employeesManagement, loading }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  employeesManagement,
  loadingList: loading.effects['employeesManagement/fetchSearchEmployeesList'],
}))(GlobalHeaderRight);
