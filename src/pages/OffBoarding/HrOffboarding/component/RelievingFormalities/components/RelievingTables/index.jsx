import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import { getTimezoneViaCity } from '@/utils/times';

import InQueueTable from '../InQueueTable';
import ClosedTable from '../ClosedTable';
import AllTable from '../AllTable';
import TableSearch from '../TableSearch';

import styles from './index.less';

@connect(({ locationSelection: { listLocationsByCompany = [] } }) => ({
  listLocationsByCompany,
}))
class RelievingTables extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      queuesList: '',
      timezoneList: [],
    };
  }

  componentDidMount() {
    this.fetchTimezone();
  }

  componentDidUpdate(prevProps) {
    const { listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchTimezone();
    }
  }

  onSearch = (value) => {
    this.setState({ queuesList: value });
  };

  fetchTimezone = () => {
    const { listLocationsByCompany = [] } = this.props;
    const timezoneList = [];
    listLocationsByCompany.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    this.setState({
      timezoneList,
    });
  };

  render() {
    const { TabPane } = Tabs;
    const { queuesList, timezoneList } = this.state;
    const data = [
      {
        id: 1,
        name: 'All',
        component: <AllTable timezoneList={timezoneList} dataSearch={queuesList} />,
      },
      {
        id: 2,
        name: 'In Queues',
        component: <InQueueTable timezoneList={timezoneList} dataSearch={queuesList} />,
      },
      {
        id: 3,
        name: 'Closed records',
        component: <ClosedTable timezoneList={timezoneList} dataSearch={queuesList} />,
      },
    ];
    return (
      <div className={styles.relievingTables}>
        <Tabs defaultActiveKey={1} tabBarExtraContent={<TableSearch onSearch={this.onSearch} />}>
          {data.map((item) => {
            return (
              <TabPane tab={item.name} key={item.id}>
                {item.component}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}

export default RelievingTables;
