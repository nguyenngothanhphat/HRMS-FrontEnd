import React, { PureComponent } from 'react';
import { Calendar } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import s from './index.less';

export default class TimeSheet extends PureComponent {
  getStatusDay = (value) => {
    const disable = moment() > moment().subtract(1, 'day').endOf('day');
    const isWeekend =
      moment(value).locale('en').format('ddd') === 'Sat' ||
      moment(value).locale('en').format('ddd') === 'Sun';
    const status = 'normal';
    return status;
  };

  dateFullCellRender = (value) => {
    this.getStatusDay(value);
    const date = value.date();
    const dummy = {
      '04/12/2020': true,
      '05/12/2020': true,
      '06/12/2020': true,
      '15/12/2020': true,
    };
    const key = moment(value).format('DD/MM/YYYY');
    const check = dummy[key] || false;
    const className = check ? `${s.check}` : `${s.notCheck}`;
    const content = check ? <CheckOutlined className={s.iconCheck} /> : date;
    return <div className={`${s.date} ${className}`}>{content}</div>;
  };

  render() {
    return (
      <div className={s.root}>
        <Calendar dateFullCellRender={this.dateFullCellRender} />
      </div>
    );
  }
}
