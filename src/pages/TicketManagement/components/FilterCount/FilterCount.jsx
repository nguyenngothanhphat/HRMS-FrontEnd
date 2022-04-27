import React from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

function FilterCount(props) {
  const {
    dispatch,
    applied = '',
    form = '',
    setApplied = () => {},
    initDataTable = () => {},
    selectedFilterTab = '',
    nameSearch = '',
    selectedLocations = [],
  } = props;
  const clearFilter = () => {
    initDataTable(selectedFilterTab, nameSearch, selectedLocations);
    setApplied();
    form?.resetFields();
  };
  return (
    <div className={styles.filterCounts}>
      {applied > 0 && (
        <Tag
          className={styles.tagCountFilter}
          closable
          closeIcon={<CloseOutlined />}
          onClose={() => {
            clearFilter();
          }}
        >
          {applied} applied
        </Tag>
      )}
    </div>
  );
}
export default connect(({ ticketManagement }) => ({ ticketManagement }))(FilterCount);
