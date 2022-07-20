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
    setPageSelected = () => {},
    dispatch,
  } = props;
  const clearFilter = () => {
    dispatch({
      type: 'ticketManagement/clearFilter',
    });
    setApplied();
    setPageSelected(1);
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
          {applied} filters applied
        </Tag>
      )}
    </>
  );
}
export default connect(({ ticketManagement }) => ({ ticketManagement }))(FilterCount);
