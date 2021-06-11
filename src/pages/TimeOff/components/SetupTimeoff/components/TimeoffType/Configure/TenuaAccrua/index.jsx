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
      tenureAccrual,
    });
  }

  onChangeEffectiveDate = (value) => {
    console.log(value);
  };

  onChangeRadio = (value) => {
    console.log(value);
  };

  onChangeTotalLeave = (value) => {
    console.log(value);
  };

  onChangeYear = (value) => {
    console.log(value);
  };

  onAddItem = () => {
    const { tenureAccrual } = this.state;
    const data = {
      date: 'day',
      totalLeave: 0,
      yearOfEmployment: '0',
      effectiveFrom: new Date(),
    };
    this.setState({
      tenureAccrual: [...tenureAccrual, data],
    });
    // return <ItemTenure />;
  };

  onRemove = (id) => {
    const { tenureAccrual } = this.state;

    const arr = [...tenureAccrual];
    const newArr = arr.splice(id, 1);

    this.setState({
      tenureAccrual: newArr,
    });
  };

  render() {
    const { tenureAccrual } = this.state;
    return (
      <div className={styles.contentTenua}>
        <div className={styles.flex}>
          <div className={styles.titleText}> Tenure accrual rate</div>
          <div>
            <Button onClick={this.onAddItem} className={styles.btnAdd}>
              Add a new tenure accrual rate
            </Button>
          </div>
        </div>
        <div className={styles.borderStyles} />
        {tenureAccrual.map((item, index) => {
          return (
            <div key={item._id || index}>
              <ItemTenure
                item={item}
                index={index}
                onRemove={this.onRemove}
                onChangeRadio={this.onChangeRadio}
                onChangeTotalLeave={this.onChangeTotalLeave}
                onChangeYear={this.onChangeYear}
                onChangeEffectiveDate={this.onChangeEffectiveDate}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default TenuaAccrua;
