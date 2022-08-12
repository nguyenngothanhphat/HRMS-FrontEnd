import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import BlueArrowDownIcon from '@/assets/resourceManagement/blueArrowDown.svg';

const { Option } = Select;

@connect(({ resourceManagement: { resourceStatuses = [], selectedLocations = [] } }) => ({
  resourceStatuses,
  selectedLocations,
}))
class AvailableStatus extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { currentType: 'ALL' };
  }

  onChangeTab = (activeKey) => {
    const { setSelectedTab } = this.props;
    setSelectedTab(activeKey);
  };

  componentDidMount = async () => {
    this.fetchAvailableStatus();
  };

  componentDidUpdate = async (prevProps) => {
    const { selectedLocations } = this.props;
    if (selectedLocations !== prevProps.selectedLocations) {
      this.fetchAvailableStatus();
    }
  };

  fetchAvailableStatus = () => {
    const { dispatch, selectedLocations = [] } = this.props;
    const payload = { location: selectedLocations };
    dispatch({
      type: 'resourceManagement/fetchResourceAvailableStatus',
      payload,
    })
  };

  renderTab = (value) => {
    return <div>{value}</div>;
  };

  render() {
    const { currentType = 'ALL' } = this.state;
    const { resourceStatuses = [], changeAvailableStatus } = this.props;
    return (
      <div className={styles.ResourceStatus}>
        <Select
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
