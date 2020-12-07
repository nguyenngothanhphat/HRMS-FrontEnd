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
      baseAccual: {},
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
    if (position < 200) {
      this.setState({ select: 'baseAccrual' });
    } else if (position > 200 && position < 400) {
      this.setState({ select: 'tenuaAccrua' });
    }
  };

  handleClick = (item) => {
    const { id, ref } = item;
    this.setState({ select: id });
    ref.current.scrollIntoView({ behavior: 'smooth' });
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

  render() {
    // const { tabKey = '' } = this.props;
    const { baseAccual } = this.state;
    console.log(baseAccual, 'baseAccual');
    const list = [
      {
        id: 'baseAccrual',
        title: 'Base  accrual',
        ref: React.createRef(),
        componnet: <BaseAccual onChangeValue={this.onChangeBaseAccual} />,
      },
      {
        id: 'tenuaAccrua',
        title: 'Tenua Accrua',
        ref: React.createRef(),
        componnet: <TenuaAccrua />,
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
