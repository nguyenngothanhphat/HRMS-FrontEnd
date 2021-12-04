import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import BlueArrowDownIcon from '@/assets/resourceManagement/blueArrowDown.svg';

const { Option } = Select;

// const { TabPane } = Tabs;
@connect(({ resourceManagement: { resourceStatuses = [] } }) => ({ resourceStatuses }))
class AvailableStatus extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { resourceStatuses: [], currentType: 'ALL' };
  }

  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  componentDidMount = async () => {
    this.fetchAvailableStatus();
  };

  fetchAvailableStatus = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/fetchResourceAvailableStatus',
    }).then(() => {
      const { resourceStatuses = [] } = this.props || {};
      this.setState({
        resourceStatuses: resourceStatuses || [],
      });
    });
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  handleSelect = (value) => {
    // console.log(value);
    this.setState({
      currentType: value,
    });
  };

  render() {
    const { resourceStatuses = [], currentType = 'ALL' } = this.state;
    const { changeAvailableStatus } = this.props;
    // const statusData = [
    //   { availableStatus: 'ALL', compareKey: 'totalResource', display: 'All Resources', number: 10 },
    //   { availableStatus: 'AVAILABLE_NOW', compareKey: 'totalAvailableNow', display: 'Available now', number: 10 },
    //   { availableStatus: 'AVAILABLE_SOON', compareKey: 'totalAvailableSoon', display: 'Available soon', number: 10 },
    // ];
    // // eslint-disable-next-line no-restricted-syntax
    // for(const[key, value] of Object.entries(resourceStatuses)) {
    //   const obj = statusData.find((x) => x.compareKey === key)
    //   obj.number = value
    // }
    // {"totalResource":857,"totalAvailableNow":854,"totalAvailableSoon":3}
    return (
      <div className={styles.ResourceStatus}>
        <Select
          placement="bottomCenter"
          onChange={(value) => changeAvailableStatus(value)}
          defaultValue={currentType}
          suffixIcon={<img src={BlueArrowDownIcon} alt="" />}
        >
          {resourceStatuses.map((item) => (
            <Option value={item.availableStatus} key={item.availableStatus}>
              {item.display} ({item.number})
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default AvailableStatus;
