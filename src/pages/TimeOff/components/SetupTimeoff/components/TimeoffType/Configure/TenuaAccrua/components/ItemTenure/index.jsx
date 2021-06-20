/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Radio, InputNumber, Row, Col, DatePicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'MM-DD-YYYY';
class ItemTenure extends Component {
  constructor(props) {
    const {
      item: { totalLeave, date, yearOfEmployment, effectiveFrom },
    } = props;
    super(props);
    this.state = {
      totalLeave,
      date,
      yearOfEmployment,
      effectiveFrom: moment(effectiveFrom).locale('en').format(dateFormat),
    };
  }

  // componentDidMount() {
  //   const {
  //     item: { date, totalLeave, yearOfEmployment, effectiveFrom },
  //   } = this.props;
  //   const newDateTemp = moment(effectiveFrom).locale('en').format(dateFormat);
  //   this.setState({
  //     date,
  //     totalLeave,
  //     yearOfEmployment,
  //     effectiveFrom: newDateTemp,
  //     // id: _id,
  //   });
  // }

  _handleChangeRadio = (e, item) => {
    this.setState({
      date: e.target.value,
    });
    const { onChangeRadio } = this.props;
    onChangeRadio(e.target.value, item);
  };

  _handleChangeEffectiveDate = (value, item) => {
    this.setState({
      effectiveFrom: value,
    });
    const { onChangeEffectiveDate } = this.props;
    onChangeEffectiveDate(value, item);
  };

  _handleChangeTotalLeave = (value, item) => {
    this.setState({
      totalLeave: value,
    });
    const { onChangeTotalLeave } = this.props;
    onChangeTotalLeave(value, item);
  };

  _handleChangeYear = (value, item) => {
    this.setState({
      yearOfEmployment: value,
    });
    const { onChangeYear } = this.props;
    onChangeYear(value, item);
  };

  removeItem = (item) => {
    const { onRemove } = this.props;
    onRemove(item);
  };

  render() {
    const { date, totalLeave, yearOfEmployment, effectiveFrom } = this.state;
    const listDayHour = [
      { label: 'Days', value: 'day' },
      { label: 'Hours', value: 'hour' },
    ];
    const { item } = this.props;
    const dateEffect = moment(effectiveFrom).locale('en').format(dateFormat);
    return (
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
                value={yearOfEmployment}
                // formatter={(value) => `${value} days`}
                // parser={(value) => value.replace('days', '')}
                onChange={(value) => this._handleChangeYear(value, item)}
              />
            </Col>
            <Col span={4} className={styles.effectForm__deleteSection}>
              <div className={styles.effectForm__deleteIcon} onClick={() => this.removeItem(item)}>
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
                    value={totalLeave}
                    // placeholder={date === 'days' ? 'days' : 'hours'}
                    // formatter={(value) => (date === 'days' ? `${value} days` : `${value} hours`)}
                    // parser={(value) =>
                    //   date === 'days' ? value.replace('days', '') : value.replace('hours', '')
                    // }
                    onChange={(value) => this._handleChangeTotalLeave(value, item)}
                  />
                </Col>
                <Col>
                  <Radio.Group
                    value={date}
                    buttonStyle="solid"
                    options={listDayHour}
                    optionType="button"
                    className={styles.radioGroup}
                    onChange={(e) => this._handleChangeRadio(e, item)}
                  />
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
              <DatePicker
                className={styles.date}
                format={dateFormat}
                value={moment(dateEffect, dateFormat)}
                onChange={(value) => this._handleChangeEffectiveDate(value, item)}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ItemTenure;
