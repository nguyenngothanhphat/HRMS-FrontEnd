import React, { Component } from 'react';
import { Radio, Select, Button, InputNumber, Row, Col, DatePicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';
import moment from 'moment';

class ItemTenure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalLeave: '',
      date: 'days',
      yearOfEmployment: '',
      effectiveFrom: '',
    };
  }

  _handleChangeRadio = () => {};

  render() {
    const { date, totalLeave, yearOfEmployment, effectiveFrom, _id } = this.state;
    // const {
    //   item:  },
    // } = this.props;
    const listDayHour = [
      { label: 'Days', value: 'day' },
      { label: 'Hours', value: 'hour' },
    ];
    return (
      <div key={_id} className={styles.form}>
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
                    value={totalLeave}
                    // placeholder={date === 'days' ? 'days' : 'hours'}
                    // formatter={(value) => (date === 'days' ? `${value} days` : `${value} hours`)}
                    // parser={(value) =>
                    //   date === 'days' ? value.replace('days', '') : value.replace('hours', '')
                    // }
                    onChange={this.onChangeYear}
                  />
                </Col>
                <Col>
                  <Radio.Group
                    value={date}
                    buttonStyle="solid"
                    options={listDayHour}
                    optionType="button"
                    className={styles.radioGroup}
                    onChange={this.onChangeRadio}
                  ></Radio.Group>
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
                format="MM-DD-YYYY"
                //   value={moment(date, 'MM-DD-YYYY')}
                onChange={this._handleChangeDate}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ItemTenure;
