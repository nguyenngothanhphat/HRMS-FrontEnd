import { CloseOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';
import { singularify } from '@/utils/utils';
import styles from './index.less';

const FilterCountTag = ({ count = 0, onClearFilter = () => {} }) => {
  if (count > 0)
    return (
      <Tag
        className={styles.FilterCountTag}
        closable
        closeIcon={<CloseOutlined />}
        onClose={onClearFilter}
      >
        {count} {singularify('filter', count)} applied
      </Tag>
    );

  return '';
};

export default FilterCountTag;
