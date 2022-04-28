import React from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

function FilterCount(props) {
  const {
    applied = '',
    form = '',
    setApplied = () => {},
    setIsFiltering = () => {},
    initDataTable = () => {},
    selectedFilterTab = '',
    nameSearch = '',
    selectedLocations = [],
  } = props;
  const clearFilter = () => {
    initDataTable(selectedFilterTab, nameSearch, selectedLocations);
    setApplied();
    setIsFiltering();
    form?.resetFields();
  };
  return (
    <>
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
    </>
  );
}
export default connect(({ ticketManagement }) => ({ ticketManagement }))(FilterCount);
