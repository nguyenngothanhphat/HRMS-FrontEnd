import React, { Component } from 'react';
import { Tabs } from 'antd';
import BaseAccual from './BaseAccual';
import TenuaAccrua from './TenuaAccrua';
import AccrualSchedule from './AccrualSchedule';
import Balance from './Balance';
import AnnualReset from './AnnualReset';
import CarryoverCap from './CarryoverCap';
import WaitingPeriod from './WaitingPeriod';
import Increaments from './Increaments';
import HireProbation from './HireProbation';
import styles from './index.less';

const { TabPane } = Tabs;
class Configure extends Component {
  onChange = () => {};

  render() {
    const { tabKey = '' } = this.props;
    return (
      <div className={styles.content}>
        <Tabs defaultActiveKey={tabKey}>
          <TabPane tab="Base accrual" key="Base">
            <BaseAccual />
          </TabPane>
          <TabPane tab="Tenua Accrua" key="Tenua">
            <TenuaAccrua />
          </TabPane>
          <TabPane tab="Accrual schedule" key="Accrual">
            <AccrualSchedule />
          </TabPane>
          <TabPane tab="Balance" key="Balance">
            <Balance />
          </TabPane>
          <TabPane tab="Annual reset" key="Annual">
            <AnnualReset />
          </TabPane>
          <TabPane tab="Carryover cap" key="Carryover">
            <CarryoverCap />
          </TabPane>
          <TabPane tab="Waiting period" key="Waiting">
            <WaitingPeriod />
          </TabPane>
          <TabPane tab="Increaments" key="Increaments">
            <Increaments />
          </TabPane>
          <TabPane tab="Hire Probation" key="Hire">
            <HireProbation />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Configure;
