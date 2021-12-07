import React, { PureComponent } from 'react';
import { Select } from 'antd';
import styles from './index.less';
import BlueArrowDownIcon from '@/assets/resourceManagement/blueArrowDown.svg';

const { Option } = Select;

// const { TabPane } = Tabs;

export default class Summary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { resourceType: 'ALL' };
  }
  // selected = 'ALL';

  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  handleSelect = (value) => {
    // console.log(value);
    this.setState({
      resourceType: value,
    });
  };

  render() {
    const statusData = [
      { billStatus: 'ALL', display: 'All Resources', number: 10 },
      { billStatus: 'AVAILABLE_NOW', display: 'Available now', number: 10 },
      { billStatus: 'AVAILABLE_SOON', display: 'Available soon', number: 10 },
    ];
    const { resourceType } = this.state;
    return (
      <div className={styles.Summary}>
        <Select
          placement="bottomCenter"
          onChange={() => this.handleSelect()}
          defaultValue={resourceType}
          suffixIcon={<img src={BlueArrowDownIcon} alt="" />}
        >
          {statusData.map((item) => (
            <Option value={item.billStatus}>
              {item.display} ({item.number})
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}
