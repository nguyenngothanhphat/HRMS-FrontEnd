import { BuildOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { isOwner } from '@/utils/authority';
import ActivityLogModalContent from '@/pages/Dashboard/components/ActivityLog/components/ActivityLogModalContent';
import CommonModal from '../CommonModal';
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
  const [modalVisible, setModalVisible] = useState(false);

  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <GlobalSearchNew />
      <QuestionDropdown />
      <div className={`${styles.action} ${styles.notify}`} onClick={() => setModalVisible(true)}>
        <svg
          width="18"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.6361 17.0573C16.5768 17.0188 16.1304 16.706 15.6835 15.76C14.8626 14.0228 14.6903 11.5756 14.6903 9.82857C14.6903 9.82097 14.6902 9.81344 14.6899 9.80587C14.6809 7.49695 13.2984 5.50656 11.3199 4.61352V3.24772C11.3199 2.00832 10.3132 1 9.07586 1H8.88989C7.65253 1 6.64587 2.00832 6.64587 3.24772V4.61344C4.66076 5.50936 3.27542 7.50991 3.27542 9.82857C3.27542 11.5756 3.10313 14.0228 2.28228 15.76C1.83534 16.706 1.38896 17.0187 1.32961 17.0573C1.07968 17.1729 0.956447 17.4401 1.01394 17.7109C1.07199 17.9844 1.3276 18.1729 1.60673 18.1729H5.93962C5.96382 19.8336 7.31925 21.1773 8.98289 21.1773C10.6465 21.1773 12.002 19.8336 12.0262 18.1729H16.359C16.6381 18.1729 16.8938 17.9844 16.9518 17.7109C17.0093 17.4401 16.8861 17.1729 16.6361 17.0573ZM7.82817 3.24772C7.82817 2.66128 8.30447 2.1842 8.88993 2.1842H9.0759C9.66135 2.1842 10.1376 2.66128 10.1376 3.24772V4.22967C9.76453 4.15255 9.37828 4.11196 8.98273 4.11196C8.5873 4.11196 8.20118 4.15251 7.82821 4.22956V3.24772H7.82817ZM8.98289 19.9931C7.97115 19.9931 7.14589 19.1807 7.12189 18.1729H10.8439C10.8199 19.1806 9.99463 19.9931 8.98289 19.9931ZM11.3632 16.9887C11.3631 16.9887 2.95393 16.9887 2.95393 16.9887C3.05619 16.8293 3.16027 16.6488 3.26372 16.4449C4.05599 14.8826 4.45773 12.6566 4.45773 9.82857C4.45773 7.32938 6.48764 5.29616 8.98269 5.29616C11.4777 5.29616 13.5077 7.32938 13.5077 9.83054C13.5077 9.83783 13.5078 9.84508 13.5081 9.85233C13.5103 12.669 13.912 14.887 14.7021 16.4449C14.8055 16.6489 14.9096 16.8293 15.0119 16.9887H11.3632Z"
            fill="#161C29"
            stroke="#161C29"
            strokeWidth="0.2"
          />
        </svg>
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
      <CommonModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Notifications"
        hasFooter={false}
        content={<ActivityLogModalContent tabKey="2" data={[]} />}
      />
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
