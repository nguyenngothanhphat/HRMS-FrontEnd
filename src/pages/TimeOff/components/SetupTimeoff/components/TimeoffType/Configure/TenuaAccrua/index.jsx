import React, { Component } from 'react';
import { Radio, Select, Button, InputNumber, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';

class TenuaAccrua extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLeave: '',
      date: 'days',
      yearOfEmployment: '',
      effectiveFrom: '',
    };
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
    const { effectiveFrom, yearOfEmployment, date } = this.state;
    this.setState({
      totalLeave: value,
    });
    const data = {
      date,
      effectiveFrom,
      yearOfEmployment,
      totalLeave: value,
    };
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

  render() {
    const { date } = this.state;
    return (
      <div className={styles.contentTenua}>
        <div className={styles.flex}>
          <div className={styles.titleText}> Tenure accrual rate</div>
          <div>
            <Button className={styles.btnAdd}>Add a new tenure accrual rate</Button>
          </div>
        </div>
        <div className={styles.borderStyles} />
        <div className={styles.form}>
          <div className={styles.effectForm}>
            <Row gutter={[30, 20]}>
              <Col span={10} className={styles.effectForm__firstContent}>
                During the employee’s
              </Col>
              <Col span={10}>
                <InputNumber
                  min={0}
                  max={365}
                  formatter={(value) => `${value} days`}
                  parser={(value) => value.replace('days', '')}
                  onChange={this.onChange}
                />
              </Col>
              <Col span={4} className={styles.effectForm__deleteSection}>
                <div className={styles.effectForm__deleteIcon}>
                  <DeleteOutlined className={styles.iconImg} />
                </div>
              </Col>
            </Row>
            <Row gutter={[30, 20]}>
              <Col span={10} className={styles.effectForm__secondContent}>
                year of employment, additional casual leaves accrued per year is
              </Col>
              <Col span={10}>
                <Row gutter={[24, 0]} className={styles.inputText}>
                  <Col>
                    <InputNumber
                      min={0}
                      max={date === 'days' ? 365 : 12}
                      placeholder={date === 'days' ? 'days' : 'hours'}
                      formatter={(value) => (date === 'days' ? `${value} days` : `${value} hours`)}
                      parser={(value) =>
                        date === 'days' ? value.replace('days', '') : value.replace('hours', '')
                      }
                      onChange={this.onChangeYear}
                    />
                  </Col>
                  <Col>
                    <Radio.Group
                      value={date}
                      buttonStyle="solid"
                      className={styles.radioGroup}
                      onChange={this.onChangeRadio}
                    >
                      <Radio.Button value="days">Days</Radio.Button>
                      <Radio.Button value="hour">Hours</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[24, 12]}>
              <Col span={10} className={styles.effectForm__lastContent}>
                effective from
              </Col>
              {/* <Col span={10} xs={24} sm={24} md={24} lg={24} xl={10}> */}
              <Col span={10}>
                <Select
                  className={styles.date}
                  defaultValue="their anniversary date"
                  placeholder="their anniversary date"
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default TenuaAccrua;
