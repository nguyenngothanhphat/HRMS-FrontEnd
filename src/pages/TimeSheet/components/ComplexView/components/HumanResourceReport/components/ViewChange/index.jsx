import { Radio } from 'antd';
import React from 'react';
import { VIEW_TYPE } from '@/utils/timeSheet';

const ViewChange = (props) => {
  const { selectedView = '', setSelectedView = () => {} } = props;

  const onViewChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setSelectedView(value);
  };

  return (
    <Radio.Group value={selectedView} onChange={onViewChange} buttonStyle="solid">
      <Radio.Button value={VIEW_TYPE.W}>Weekly</Radio.Button>
      <Radio.Button value={VIEW_TYPE.M}>Monthly</Radio.Button>
    </Radio.Group>
  );
};
export default ViewChange;
