import { Radio } from 'antd';
import React from 'react';
import { VIEW_TYPE } from '@/utils/timeSheet';
import styles from './index.less'

const ViewTypeSelector = (props) => {
  const {
    showDay = true,
    showWeek = true,
    showMonth = true,
    selectedView = '',
    setSelectedView = () => {},
  } = props;

  const onViewChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setSelectedView(value);
  };

  return (
    <div className={styles.ViewTypeSelector}>
      <Radio.Group value={selectedView} onChange={onViewChange} buttonStyle="solid">
        {showDay && <Radio.Button value={VIEW_TYPE.D}>Daily</Radio.Button>}
        {showWeek && <Radio.Button value={VIEW_TYPE.W}>Weekly</Radio.Button>}
        {showMonth && <Radio.Button value={VIEW_TYPE.M}>Monthly</Radio.Button>}
      </Radio.Group>
    </div>
  );
};
export default ViewTypeSelector;
