import React, { PureComponent } from 'react';
import { Calendar, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import s from './index.less';

export default class TimeSheet extends PureComponent {
  getStatusDay = (value) => {
    const disable = moment() < moment(value).subtract(1, 'day').endOf('day');
    const isWeekend =
      moment(value).locale('en').format('ddd') === 'Sat' ||
      moment(value).locale('en').format('ddd') === 'Sun';
    const isCurrent = moment().format('DD/MM/YYYY') === moment(value).format('DD/MM/YYYY');

    if (isWeekend) {
      return 'weekend';
    }
    if (disable) {
      return 'disable';
    }
    if (isCurrent) {
      return 'current';
    }
    return 'normal';
  };

  dateFullCellRender = (value) => {
    const date = value.date();
    const status = this.getStatusDay(value);
    return status === 'normal'
      ? this.handeCheckTimeSheet(value, date)
      : this.renderItemDay(status, date);
  };

  renderItemDay = (status, date) => {
    return <div className={`${s.date} ${s[status]}`}>{date}</div>;
  };

  handeCheckTimeSheet = (value, date) => {
    const dummy = {
      '04/12/2020': true,
      '08/12/2020': true,
      '09/12/2020': true,
      '15/12/2020': true,
    };
    const key = moment(value).format('DD/MM/YYYY');
    const check = dummy[key] || false;
    return check ? (
      <div className={`${s.date} ${s.check}`}>
        <CheckOutlined className={s.iconCheck} />
      </div>
    ) : (
      <div className={`${s.date} ${s.notCheck}`}>{date}</div>
    );
  };

  render() {
    return (
      <div className={s.root}>
        <Calendar mode="month" dateFullCellRender={this.dateFullCellRender} />
        <p className={s.text}>Do not forget to fill in your timesheet before you end the day.</p>
        <Button type="primary" onClick={() => {}} className={s.btnFillTimeSheet}>
          Fill timesheet
        </Button>
      </div>
    );
  }
}
