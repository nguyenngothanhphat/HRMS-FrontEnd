import React, { PureComponent } from 'react';
import { Select } from 'antd';
import styles from './index.less';

const {Option} = Select;



// const { TabPane } = Tabs;

export default class Summary extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {resourceType: 'ALL'}
  }
  // selected = 'ALL';

  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  getCount = (value) => {
    // const { countdata = [] } = this.props;
    console.log(value);
  };
  
  handleSelect = (value) => {
    // console.log(value);
    this.setState({
      resourceType: value
    })
  };

  render() {
    const statusData = [
      { billStatus: 'ALL', display: 'All Resources', number: 10}, 
      { billStatus: 'AVAILABLE_NOW', display: 'Available now', number: 10},
      { billStatus: 'AVAILABLE_SOON', display: 'Available soon', number: 10}, 
    ];
    const {resourceType} = this.state;
  return (
    
    <Select placement="bottomCenter" onChange={() =>this.handleSelect()} defaultValue={resourceType}>
      {statusData.map((item) => (
        <Option value={item.billStatus}>{item.display} ({item.number})</Option>
       ))}
    </Select>
          )
 }
}
