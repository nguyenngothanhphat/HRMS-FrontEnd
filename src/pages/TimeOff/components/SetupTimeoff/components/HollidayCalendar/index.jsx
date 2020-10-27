import React, { Component } from 'react';
import { Button, Tabs } from 'antd';
import { listMonths, mockData } from './ListData';
import CalanderTable from '../CalanderTable';
import s from './index.less';

const { TabPane } = Tabs;
class HollidayCalendar extends Component {
  _renderTable = () => {
    return <div>123</div>;
  };

  render() {
    const OperationsSlot = {
      left: <div className={s.leftTitle}>2020</div>,
    };
    return (
      <div className={s.root}>
        <div className={s.setUpWrap}>
          <div className={s.title}>Setup the standard company Holiday Calendar</div>
          <div className={s.description}>
            Below is a list of holidays celebrated in your region/country. Select the ones for which
            your company provides holidays. You may add holidays to the list as well.
          </div>
          <Button className="buttonStyle" type="primary" shape="round">
            Add a holliday
          </Button>
        </div>
        {/* tabBarExtraContent={OperationsSlot} */}
        <div className={s.tableWrap}>
          <Tabs tabPosition="top" defaultActiveKey="jan">
            {/* {listMonths.map(({ name, key }) => (
              <TabPane tab={name} key={key}>
                <CalanderTable data={mockData} />
                <div>12312</div>
              </TabPane>
            ))} */}
            <TabPane tab={12312311} key={1}>
              Content of tab 1
            </TabPane>
            <TabPane tab={22222} key={2}>
              Content of tab 1
            </TabPane>
            <TabPane tab={3333333} key={3}>
              Content of tab 1
            </TabPane>
            <TabPane tab={4444444} key={4}>
              Content of tab 1
            </TabPane>
            <TabPane tab={12312311} key={5}>
              Content of tab 1
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default HollidayCalendar;
