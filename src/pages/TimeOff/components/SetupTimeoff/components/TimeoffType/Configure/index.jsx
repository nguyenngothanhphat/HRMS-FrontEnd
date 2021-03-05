/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Affix, Button, Row, Col } from 'antd';
import BaseAccual from './BaseAccual';
import TenuaAccrua from './TenuaAccrua';
import AccrualSchedule from './AccrualSchedule';
import Balance from './Balance';
// import NegativeBalances from './NegativeBalances';
import AnnualReset from './AnnualReset';
import CarryoverCap from './CarryoverCap';
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
      isActive: 'baseAccrual',
      step: 1,
      baseAccual: {},
      tenuaAccrua: {},
      balance: {},
      negativeBalance: {},
      carryoverCap: {},
      waitingPeriod: {},
      minIncrements: {},
      hireProbation: {},
      list: [
        {
          key: 1,
          id: 'baseAccrual',
          title: 'Base accrual rate',
          ref: React.createRef(),
          componnet: <BaseAccual onChangeValue={this.onChangeBaseAccual} />,
        },
        {
          key: 2,
          id: 'tenuaAccrua',
          title: 'Tenure accrual rate',
          ref: React.createRef(),
          componnet: <TenuaAccrua onChangeValue={this.onChangetenuaAccrua} />,
        },
        {
          key: 3,
          id: 'accrualSchedule',
          title: 'Accrual schedule',
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
          title: 'Annual reset',
          ref: React.createRef(),
          componnet: <AnnualReset onChangeValue={this.onChangeBalance} />,
        },
        // {
        //   key: 6,
        //   id: 'negativeBalances',
        //   title: 'Negative balances',
        //   ref: React.createRef(),
        //   componnet: <NegativeBalances onChangeValue={this.onChangeNegative} />,
        // },
        {
          key: 6,
          id: 'carryoverCap',
          title: 'Carryover cap',
          ref: React.createRef(),
          componnet: <CarryoverCap onChangeValue={this.onChangeCarryover} />,
        },
        // {
        //   key: 8,
        //   id: 'minimumIncrements',
        //   title: 'Minimum Increments',
        //   ref: React.createRef(),
        //   componnet: <Increaments onChangeValue={this.onChangeIncrements} />,
        // },
        // {
        //   key: 9,
        //   id: 'waitingPeriods',
        //   title: 'Waiting periods',
        //   ref: React.createRef(),
        //   componnet: <WaitingPeriod onChangeValue={this.onChangeWaiting} />,
        // },
        // {
        //   key: 10,
        //   id: 'hireProbation',
        //   title: 'New Hire proration',
        //   ref: React.createRef(),
        //   componnet: <HireProbation onChangeValue={this.onChangeHireProbation} />,
        // },
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
      // } else if (position > 1600 && position < 1800) {
      //   this.setState({ select: 'negativeBalances' });
    } else if (position > 1600 && position < 1800) {
      this.setState({ select: 'carryoverCap' });
      // } else if (position > 2000 && position < 2200) {
      //   this.setState({ select: 'minimumIncrements' });
      // } else if (position > 2220 && position < 2400) {
      //   this.setState({ select: 'waitingPeriods' });
      // } else if (position > 2400 && position < 2600) {
      //   this.setState({ select: 'hireProbation' });
    }
  };

  handleClick = (item) => {
    const { id, ref } = item;
    this.setState({ select: id, isActive: id });
    ref.current.scrollIntoView(true);
    // window.scrollBy(0, -150);
    window.scrollBy({
      top: -100,
      left: 0,
      behavior: 'smooth',
    });
  };

  onChange = () => {};

  renderItem = (item) => {
    const { isActive } = this.state;

    return (
      <div
        className={isActive === item.id ? styles.itemMenuActive : styles.itemMenu}
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

  onChangeNegative = (value = {}) => {
    this.setState({ negative: value });
  };

  onChangeCarryover = (value = {}) => {
    this.setState({ carryoverCap: value });
  };

  onChangeIncrements = (value = {}) => {
    this.setState({ minIncrements: value });
  };

  onChangeWaiting = (value = {}) => {
    this.setState({ waitingPeriod: value });
  };

  onChangeHireProbation = (value = {}) => {
    this.setState({ hireProbation: value });
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
    }
  };

  render() {
    // const { tabKey = '' } = this.props;
    const { select, list, waitingPeriod, hireProbation } = this.state;
    // console.log(hireProbation);
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
                  &lt; Prev
                </Button>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center' }}>
                <div className={styles.detailStep}>
                  <span>{`${selectStep}/5`}</span> Steps
                </div>
              </Col>
              <Col>
                <Button
                  disabled={selectStep === 5}
                  onClick={() => this.nextStep(selectStep)}
                  className={selectStep === 5 ? styles.prevStep : styles.nextStep}
                >
                  Next &gt;
                </Button>
              </Col>
            </Row>
            <Button
              disabled={!(selectStep > 1)}
              className={selectStep > 1 ? styles.btnSave : styles.disableBtnSave}
            >
              Save
            </Button>
          </div>
        </Affix>
      </div>
    );
  }
}

export default Configure;
