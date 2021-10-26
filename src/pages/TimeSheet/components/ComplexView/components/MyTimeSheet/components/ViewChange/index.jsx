import { Radio } from 'antd';
import React from 'react';

const ViewChange = (props) => {
  const { selectedView = '', setSelectedView = () => {} } = props;

  const onViewChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setSelectedView(value);
  };

  return (
    <Radio.Group value={selectedView} onChange={onViewChange} buttonStyle="solid">
      <Radio.Button value="daily">Daily</Radio.Button>
      <Radio.Button value="weekly">Weekly</Radio.Button>
      <Radio.Button value="monthly">Monthly</Radio.Button>
    </Radio.Group>
  );
};
export default ViewChange;
