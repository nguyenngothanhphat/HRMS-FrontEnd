import React, { Component } from 'react';
import { Affix, Button, Row, Col } from 'antd';
import BaseAccual from './BaseAccual';
import TenuaAccrua from './TenuaAccrua';
import AccrualSchedule from './AccrualSchedule';
import Balance from './Balance';
import NegativeBalances from './NegativeBalances';
import AnnualReset from './AnnualReset';
import CarryoverCap from './CarryoverCap';
import WaitingPeriod from './WaitingPeriod';
import Increaments from './Increaments';
import HireProbation from './HireProbation';
import styles from './index.less';

// const { TabPane } = Tabs;
class Configure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: 'baseAccrual',
      step: 1,
      baseAccual: {},
      tenuaAccrua: {},
      balance: {},
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
    if (position < 300) {
      this.setState({ select: 'baseAccrual' });
    } else if (position > 300 && position < 600) {
      this.setState({ select: 'tenuaAccrua' });
    } else if (position > 600 && position < 1000) {
      this.setState({ select: 'accrualSchedule' });
    } else if (position > 1000 && position < 1300) {
      this.setState({ select: 'balance' });
    } else if (position > 1300 && position < 1600) {
      this.setState({ select: 'annualReset' });
    } else if (position > 1600 && position < 1800) {
      this.setState({ select: 'negativeBalances' });
    } else if (position > 1800 && position < 2000) {
      this.setState({ select: 'carryoverCap' });
    } else if (position > 2000 && position < 2300) {
      this.setState({ select: 'minimumIncrements' });
    } else if (position > 2300 && position < 2500) {
      this.setState({ select: 'waitingPeriods' });
    } else if (position > 2500 && position < 3000) {
      this.setState({ select: 'hireProbation' });
    }
  };

  handleClick = (item) => {
    const { id, ref } = item;
    this.setState({ select: id });
    ref.current.scrollIntoView(true);
    window.scrollBy(0, -150);
  };

  onChange = () => {};

  renderItem = (item) => {
    const { select } = this.state;

    return (
      <div
        className={select === item.id ? styles.itemMenuActive : styles.itemMenu}
        onClick={() => this.handleClick(item)}
      >
        {item.title}
      </div>
    );
  };

  renderComponent = (item) => {
    const { step } = this.state;
    return (
      <div ref={item.ref}>
        {item.componnet}
        {/* <Affix offsetBottom={0} style={{ bottom: '0px' }}>
          <div className={styles.bottom}>
            <Row className={styles.stepNode} gutter={[60, 0]}>
              <Col>Prev</Col>
              <Col>{`${step}/10 Steps `}</Col>
              <Col onClick={this.nextStep}>Next</Col>
            </Row>
            <Button className={styles.btnSave}>Save</Button>
          </div>
        </Affix> */}
      </div>
    );
  };

  onChangeBaseAccual = (value = {}) => {
    this.setState({ baseAccual: value });
  };

  onChangetenuaAccrua = (value = {}) => {
    this.setState({ tenuaAccrua: value });
  };

  onChangeBalance = (value = {}) => {
    this.setState({ balance: value });
  };

  nextStep = () => {};

  render() {
    // const { tabKey = '' } = this.props;
    const { select, tenuaAccrua, balance, step } = this.state;
    console.log(select);
    const list = [
      {
        key: 1,
        id: 'baseAccrual',
        title: 'Base  accrual',
        ref: React.createRef(),
        componnet: <BaseAccual onChangeValue={this.onChangeBaseAccual} />,
      },
      {
        key: 2,
        id: 'tenuaAccrua',
        title: 'Tenua Accrua',
        ref: React.createRef(),
        componnet: <TenuaAccrua onChangeValue={this.onChangetenuaAccrua} />,
      },
      {
        key: 3,
        id: 'accrualSchedule',
        title: 'Accrual Schedule',
        ref: React.createRef(),
        componnet: <AccrualSchedule onChangeValue={this.onChangetenuaAccrua} />,
      },
      {
        key: 4,
        id: 'balance',
        title: 'Maximum balance',
        ref: React.createRef(),
        componnet: <Balance onChangeValue={this.onChangeBalance} />,
      },
      {
        key: 5,
        id: 'annualReset',
        title: 'Annual Reset',
        ref: React.createRef(),
        componnet: <AnnualReset onChangeValue={this.onChangeBalance} />,
      },
      {
        key: 6,
        id: 'negativeBalances',
        title: 'Negative balances',
        ref: React.createRef(),
        componnet: <NegativeBalances onChangeValue={this.onChangeBalance} />,
      },
      {
        key: 7,
        id: 'carryoverCap',
        title: 'Carryover Cap',
        ref: React.createRef(),
        componnet: <CarryoverCap onChangeValue={this.onChangeBalance} />,
      },
      {
        key: 8,
        id: 'minimumIncrements',
        title: 'Minimum Increments',
        ref: React.createRef(),
        componnet: <Increaments onChangeValue={this.onChangeBalance} />,
      },
      {
        key: 9,
        id: 'waitingPeriods',
        title: 'Waiting periods',
        ref: React.createRef(),
        componnet: <WaitingPeriod onChangeValue={this.onChangeBalance} />,
      },
      {
        key: 9,
        id: 'hireProbation',
        title: 'New Hire proration',
        ref: React.createRef(),
        componnet: <HireProbation onChangeValue={this.onChangeBalance} />,
      },
    ];

    return (
      <div className={styles.content}>
        <div className={styles.tabSelect}>{list.map((item) => this.renderItem(item))}</div>
        <div className={styles.borderStyles} />
        <div>{list.map((item) => this.renderComponent(item))}</div>
      </div>
    );
  }
}

export default Configure;
