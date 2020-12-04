import React, { Component } from 'react';
import { Row, Col } from 'antd';
import BaseAccual from './BaseAccual';
import TenuaAccrua from './TenuaAccrua';
// import AccrualSchedule from './AccrualSchedule';
// import Balance from './Balance';
// import AnnualReset from './AnnualReset';
// import CarryoverCap from './CarryoverCap';
// import WaitingPeriod from './WaitingPeriod';
// import Increaments from './Increaments';
// import HireProbation from './HireProbation';
import styles from './index.less';

// const { TabPane } = Tabs;
class Configure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: 'baseAccrual',
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
  }

  listenToScroll = () => {
    const position = window.pageYOffset;
    if (position < 500) {
      this.setState({ select: 'baseAccrual' });
    } else if (position > 500 && position < 1000) {
      this.setState({ select: 'tenuaAccrua' });
    }
  };

  onChange = () => {};

  renderItem = (item) => {
    const { select } = this.state;

    return <div className={select === item.id && styles.itemMenuActive}>{item.title}</div>;
  };

  renderComponent = (item) => {
    return <div>{item.componnet}</div>;
  };

  render() {
    // const { tabKey = '' } = this.props;
    const { select } = this.state;
    console.log(select);
    const list = [
      {
        id: 'baseAccrual',
        title: 'Base  accrual',
        componnet: <BaseAccual />,
      },
      {
        id: 'tenuaAccrua',
        title: 'Tenua Accrua',
        componnet: <TenuaAccrua />,
      },
      {
        id: 'baseAccrual',
        title: 'Base  accrual',
        componnet: <BaseAccual />,
      },
      {
        id: 'baseAccrual',
        title: 'Base  accrual',
        componnet: <BaseAccual />,
      },
      {
        id: 'tenuaAccrua',
        title: 'Base  accrual',
        componnet: <BaseAccual />,
      },
      {
        id: 'tenuaAccrua',
        title: 'Base  accrual',
        componnet: <BaseAccual />,
      },
      {
        id: 'tenuaAccrua',
        title: 'Base  accrual',
        componnet: <BaseAccual />,
      },
    ];

    return (
      // <div className={styles.content}>
      //   <Tabs defaultActiveKey={tabKey}>
      //     <TabPane tab="Base accrual" key="Base">
      //       <BaseAccual />
      //     </TabPane>
      //     <TabPane tab="Tenua Accrua" key="Tenua">
      //       <TenuaAccrua />
      //     </TabPane>
      //     <TabPane tab="Accrual schedule" key="Accrual">
      //       <AccrualSchedule />
      //     </TabPane>
      //     <TabPane tab="Balance" key="Balance">
      //       <Balance />
      //     </TabPane>
      //     <TabPane tab="Annual reset" key="Annual">
      //       <AnnualReset />
      //     </TabPane>
      //     <TabPane tab="Carryover cap" key="Carryover">
      //       <CarryoverCap />
      //     </TabPane>
      //     <TabPane tab="Waiting period" key="Waiting">
      //       <WaitingPeriod />
      //     </TabPane>
      //     <TabPane tab="Increaments" key="Increaments">
      //       <Increaments />
      //     </TabPane>
      //     <TabPane tab="Hire Probation" key="Hire">
      //       <HireProbation />
      //     </TabPane>
      //   </Tabs>
      // </div>
      <Row>
        <Col>{list.map((item) => this.renderItem(item))}</Col>
        <Col>{list.map((item) => this.renderComponent(item))}</Col>
        {/* <BaseAccual />
        <TenuaAccrua />
        <AccrualSchedule />
        <Balance />
        <AnnualReset />
        <CarryoverCap /> */}
      </Row>
    );
  }
}

export default Configure;
