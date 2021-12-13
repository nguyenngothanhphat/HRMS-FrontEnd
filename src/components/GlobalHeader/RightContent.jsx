// import { Tooltip, Tag } from 'antd';
import { BuildOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { isOwner } from '@/utils/authority';
import MessageIcon from '@/assets/dashboard/message.svg';
import AvatarDropdown from './AvatarDropdown';
import GlobalSearchNew from './components/GlobalSearchNew/index';
import SelectCompanyModal from './components/SelectCompanyModal';
import styles from './index.less';
import QuestionDropdown from './QuestionDropdown';


const GlobalHeaderRight = (props) => {
  const { theme, layout, currentUser, companiesOfUser } = props;

  const [isSwitchCompanyVisible, setIsSwitchCompanyVisible] = useState(false);
  const checkIsOwner =
    isOwner() && currentUser.signInRole.map((role) => role.toLowerCase()).includes('owner');

  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Search"
        visible={visible}
        onSearch={(value) => {
          if (value) {
            handleSearch(value);
          }
        }}
      /> */}
      <GlobalSearchNew />
      <QuestionDropdown />
      <div className={`${styles.action} ${styles.notify}`}>
        <img src={MessageIcon} alt="" />
      </div>
      {!(!checkIsOwner && companiesOfUser.length === 1) && (
        <>
          <Tooltip title="Switch company">
            <div
              className={`${styles.action} ${styles.notify}`}
              onClick={() => setIsSwitchCompanyVisible(true)}
            >
              <BuildOutlined />
            </div>
          </Tooltip>
        </>
      )}

      <AvatarDropdown />
      <SelectCompanyModal visible={isSwitchCompanyVisible} onClose={setIsSwitchCompanyVisible} />
    </div>
  );
};

export default connect(
  ({
    settings,
    user: { companiesOfUser = [], currentUser = {} },
    employeesManagement,
    loading,
  }) => ({
    theme: settings.navTheme,
    layout: settings.layout,
    employeesManagement,
    currentUser,
    companiesOfUser,
    loadingList: loading.effects['employeesManagement/fetchSearchEmployeesList'],
  }),
)(GlobalHeaderRight);
