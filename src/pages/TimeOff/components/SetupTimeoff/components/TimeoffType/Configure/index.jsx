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
      list: [
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
          key: 10,
          id: 'hireProbation',
          title: 'New Hire proration',
          ref: React.createRef(),
          componnet: <HireProbation onChangeValue={this.onChangeBalance} />,
        },
      ],
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
    } else if (position > 2000 && position < 2200) {
      this.setState({ select: 'minimumIncrements' });
    } else if (position > 2220 && position < 2400) {
      this.setState({ select: 'waitingPeriods' });
    } else if (position > 2400 && position < 2600) {
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
    return <div ref={item.ref}>{item.componnet}</div>;
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

  prevStep = (data) => {
    if (data > 1) {
      const dataPrev = data - 1;
      const { list } = this.state;
      const renderStep = list.find((item) => item.key === dataPrev);
      const { ref } = renderStep;
      ref.current.scrollIntoView(true);
      window.scrollBy(0, -150);
    }
  };

  nextStep = (data) => {
    if (data <= 11) {
      const dataAdd = data + 1;
      const { list } = this.state;
      const renderStep = list.find((item) => item.key === dataAdd);
      const { ref } = renderStep;
      ref.current.scrollIntoView(true);
      window.scrollBy(0, -150);
    } else return;
  };

  render() {
    // const { tabKey = '' } = this.props;
    const { select, tenuaAccrua, balance, step, list, baseAccual } = this.state;
    console.log(baseAccual);
    const selectStep = list.find((item) => item.id === select).key;

    return (
      <div className={styles.contentConfigure}>
        <div className={styles.tabSelect}>{list.map((item) => this.renderItem(item))}</div>
        <div className={styles.borderStyles} />
        <div>{list.map((item) => this.renderComponent(item))}</div>
        <Affix offsetBottom={0} style={{ bottom: '0px' }}>
          <div className={styles.bottom}>
            <Row className={styles.stepNode} gutter={[60, 0]}>
              <Col>
                <Button
                  disabled={selectStep === 1}
                  onClick={() => this.prevStep(selectStep)}
                  className={selectStep > 1 ? styles.nextStep : styles.prevStep}
                >
                  Prev
                </Button>
              </Col>
              <Col>{`${selectStep}/10 Steps `}</Col>
              <Col>
                <Button
                  disabled={selectStep === 10}
                  onClick={() => this.nextStep(selectStep)}
                  className={styles.nextStep}
                >
                  Next &gt;
                </Button>
              </Col>
            </Row>
            <Button className={styles.btnSave}>Save</Button>
          </div>
        </Affix>
      </div>
    );
  }
}

export default Configure;
