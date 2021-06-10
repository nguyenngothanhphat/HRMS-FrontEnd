import React, { Component } from 'react';
import { Button } from 'antd';
import ItemTenure from './components/ItemTenure';
import styles from './index.less';

class TenuaAccrua extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenureAccrual: [],
    };
  }

  componentDidMount() {
    const { tenureAccrual } = this.props;
    this.setState({
      tenureAccrual: tenureAccrual,
    });
  }

  onChangeRadio = (e) => {
    const { onChangeValue = () => {} } = this.props;
    const { effectiveFrom, yearOfEmployment, totalLeave } = this.state;
    this.setState({
      date: e.target.value,
    });
    const data = {
      date: e.target.value,
      effectiveFrom,
      yearOfEmployment,
      totalLeave,
    };
    onChangeValue(data);
  };

  onChange = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { effectiveFrom, yearOfEmployment, date, tenureAccrual } = this.state;
    const data = {
      date,
      effectiveFrom,
      yearOfEmployment,
      totalLeave: value,
    };
    this.setState({
      totalLeave: value,
      tenureAccrual: tenureAccrual.push(data),
    });
    onChangeValue(data);
  };

  onChangeYear = (value) => {
    const { onChangeValue = () => {} } = this.props;
    const { effectiveFrom, date, totalLeave } = this.state;
    this.setState({
      yearOfEmployment: value,
    });
    const data = {
      date,
      effectiveFrom,
      yearOfEmployment: value,
      totalLeave,
    };
    onChangeValue(data);
  };

  onAddItem = () => {};

  render() {
    const { date, tenureAccrual } = this.state;
    // const { tenureAccrual = [] } = this.props;
    return (
      <div className={styles.contentTenua}>
        <div className={styles.flex}>
          <div className={styles.titleText}> Tenure accrual rate</div>
          <div>
            <Button className={styles.btnAdd}>Add a new tenure accrual rate</Button>
          </div>
        </div>
        <div className={styles.borderStyles} />
        {tenureAccrual.map((item, i) => {
          return <ItemTenure />;
        })}
      </div>
    );
  }
}

export default TenuaAccrua;
