import React, { PureComponent } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import s from './index.less';

export default class TimeSheet extends PureComponent {
  disabledDate = (current) => {
    return current && current > moment().subtract(1, 'day').endOf('day');
  };

  dateFullCellRender = (value) => {
    const date = value.date();
    const dummy = {
      '04/12/2020': true,
      '05/12/2020': true,
      '06/12/2020': true,
      '15/12/2020': true,
      '20/12/2020': true,
    };
    const key = moment(value).format('DD/MM/YYYY');
    const check = dummy[key] || false;
    const className = check ? `${s.check}` : `${s.notCheck}`;
    return <div className={`${s.date} ${className}`}>{date}</div>;
  };

  render() {
    return (
      <div className={s.root}>
        <Calendar
          dateCellRender={this.dateCellRender}
          disabledDate={this.disabledDate}
          dateFullCellRender={this.dateFullCellRender}
        />
      </div>
    );
  }
}
