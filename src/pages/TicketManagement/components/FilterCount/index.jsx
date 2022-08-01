import React from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import styles from './index.less';

const FilterCount = (props) => {
  const { applied = '', form, setPageSelected = () => {}, dispatch } = props;
  const clearFilter = () => {
    dispatch({
      type: 'ticketManagement/clearFilter',
    });
    setPageSelected(1);
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
};
export default connect(({ ticketManagement }) => ({ ticketManagement }))(FilterCount);
