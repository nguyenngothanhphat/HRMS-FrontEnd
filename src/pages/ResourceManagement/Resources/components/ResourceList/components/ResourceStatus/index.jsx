import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import BlueArrowDownIcon from '@/assets/resourceManagement/blueArrowDown.svg';

const { Option } = Select;

// const { TabPane } = Tabs;
@connect(({ resourceManagement: { 
  resourceStatuses = [],
  selectedLocations = [],
} }) => ({ 
  resourceStatuses ,
  selectedLocations,
}))
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

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.selectedLocations !== prevProps.selectedLocations) {
      this.fetchAvailableStatus();
    }
  };

  fetchAvailableStatus = () => {
    const { dispatch, selectedLocations = [] } = this.props;
    const payload = { location: selectedLocations }
    dispatch({
      type: 'resourceManagement/fetchResourceAvailableStatus',
      payload,
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

  // handleSelect = (value) => {
  //   // console.log(value);
  //   this.setState({
  //     currentType: value,
  //   });
  // };

  render() {
    const { resourceStatuses = [], currentType = 'ALL' } = this.state;
    const { changeAvailableStatus } = this.props;
    return (
      <div className={styles.ResourceStatus}>
        <Select
          // placement="bottomCenter"
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
