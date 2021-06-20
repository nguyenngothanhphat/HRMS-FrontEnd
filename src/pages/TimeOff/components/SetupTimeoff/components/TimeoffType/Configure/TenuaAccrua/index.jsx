import React, { Component } from 'react';
import { Button } from 'antd';
import ItemTenure from './components/ItemTenure';
import styles from './index.less';

class TenuaAccrua extends Component {
  constructor(props) {
    const { tenureAccrual } = props;
    super(props);
    this.state = {
      tenureAccrual,
    };
  }

  onChangeEffectiveDate = (value, item) => {
    const { tenureAccrual } = this.state;
    const { onChangeValue } = this.props;
    const newArr = [...tenureAccrual];
    const index = newArr.indexOf(item);

    newArr[index].effectiveFrom = value;
    this.setState({
      tenureAccrual: newArr,
    });
    onChangeValue(newArr);
  };

  onChangeRadio = (value, item) => {
    const { tenureAccrual } = this.state;
    const { onChangeValue } = this.props;
    const newArr = [...tenureAccrual];
    const index = newArr.indexOf(item);
    newArr[index].date = value;
    this.setState({
      tenureAccrual: newArr,
    });
    onChangeValue(newArr);
  };

  onChangeTotalLeave = (value, item) => {
    // console.log(value);
    const { tenureAccrual } = this.state;
    const { onChangeValue } = this.props;
    const newArr = [...tenureAccrual];
    const index = newArr.indexOf(item);
    newArr[index].totalLeave = value;
    this.setState({
      tenureAccrual: newArr,
    });
    onChangeValue(newArr);
  };

  onChangeYear = (value, item) => {
    const { tenureAccrual } = this.state;
    const { onChangeValue } = this.props;
    const newArr = [...tenureAccrual];
    const index = newArr.indexOf(item);
    newArr[index].yearOfEmployment = value;
    this.setState({
      tenureAccrual: newArr,
    });
    onChangeValue(newArr);
  };

  onAddItem = () => {
    const { tenureAccrual } = this.state;
    const newArr = tenureAccrual;
    const data = {
      date: 'day',
      totalLeave: 0,
      yearOfEmployment: '0',
      effectiveFrom: new Date(),
    };
    newArr.push(data);
    this.setState({
      tenureAccrual: newArr,
    });
    // return <ItemTenure />;
  };

  onRemove = (id) => {
    const { tenureAccrual } = this.state;

    const arr = tenureAccrual;

    const newArr = arr.splice(id, 1);
    console.log(newArr);

    // this.setState({
    //   tenureAccrual: newArr,
    // });
  };

  render() {
    const { tenureAccrual } = this.state;
    console.log(tenureAccrual);
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
