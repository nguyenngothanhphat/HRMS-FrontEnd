import React, { PureComponent } from 'react';
import { Calendar, Button, Select } from 'antd';
import { CheckOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import nextArrowIcon from './assets/next-arrow.svg';
import previousArrowIcon from './assets/previous-arrow.svg';
import s from './index.less';

moment.locale('en');

export default class TimeSheet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: parseInt(moment().subtract(1, 'months').format('MM'), 10),
      selectedYear: parseInt(moment().format('YYYY'), 10),
      getDate: parseInt(moment().format('DD'), 10),
    };
  }

  componentDidMount = () => {
    const currentMonth = parseInt(moment().format('MM'), 10);
    const currentDate = parseInt(moment().format('DD'), 10);
    const currentYear = parseInt(moment().format('YYYY'), 10);
    this.setState({
      selectedMonth: currentMonth - 1,
      getDate: currentDate,
    });
  };

  onPanelChange = (value) => {
    const selectedMonth = parseInt(moment(value).format('MM'), 10);
    const selectedYear = parseInt(moment(value).format('YYYY'), 10);
    this.setState({
      selectedMonth: selectedMonth - 1,
      selectedYear,
    });
  };

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
    return (
      <div className={`${s.date} ${s[status]}`}>
        <div style={status === 'current' ? { display: 'block' } : { display: 'none' }}>{date}</div>
      </div>
    );
  };

  handeCheckTimeSheet = (value, date) => {
    const dummy = {
      '04/12/2020': true,
      '08/12/2020': true,
      '09/12/2020': true,
      '15/12/2020': true,
      '01/01/2021': true,
      '04/01/2021': true,
    };
    const key = moment(value).format('DD/MM/YYYY');
    const check = dummy[key] || false;
    return check ? (
      <div className={`${s.date} ${s.check}`}>
        <CheckOutlined className={s.iconCheck} />
      </div>
    ) : (
      <div className={`${s.date} ${s.notCheck}`}>
        <div style={{ display: 'none' }}>{date}</div>
      </div>
    );
  };

  render() {
    return (
      <div className={s.root}>
        <Calendar
          mode="month"
          dateFullCellRender={this.dateFullCellRender}
          onPanelChange={this.onPanelChange}
          headerRender={({ value, onChange }) => {
            const { selectedMonth, selectedYear, getDate } = this.state;

            // const start = 0;
            // const end = 12;
            // const monthOptions = [];

            // const current = value.clone();
            // const localeData = value.localeData();
            // const months = [];
            // for (let i = 0; i < 12; i += 1) {
            //   current.month(i);

            //   months.push(localeData.months(current));
            // }

            // for (let index = start; index < end; index += 1) {
            //   monthOptions.push(
            //     <Select.Option className="month-item" key={`${index}`}>
            //       {months[index]}
            //     </Select.Option>,
            //   );
            // }

            // const year = value.year();

            // const options = [];
            // for (let i = year - 10; i < year + 10; i += 1) {
            //   options.push(
            //     <Select.Option key={i} value={i} className="year-item">
            //       {i}
            //     </Select.Option>,
            //   );
            // }

            // get current month string
            const current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = 0; i < 12; i += 1) {
              current.month(i);

              months.push(localeData.months(current));
            }

            let _month = '';
            months.forEach((item, index) => {
              if (selectedMonth === index) {
                _month = item;
              }
            });
            return (
              <div className={s.customHeader}>
                <div className={s.monthYearControl}>
                  <div className={s.leftPart}>
                    <p className={s.headerText}>
                      {getDate}, {_month} {selectedYear}
                    </p>
                    {/* <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      value={String(selectedMonth)}
                      showArrow={false}
                      onChange={(_selectedMonth) => {
                        const newValue = value.clone();
                        newValue.month(parseInt(_selectedMonth, 10));
                        onChange(newValue);
                        this.setState({
                          selectedMonth: parseInt(_selectedMonth, 10),
                        });
                      }}
                    >
                      {monthOptions}
                    </Select>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      className="my-year-select"
                      showArrow={false}
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                        this.setState({
                          selectedYear: parseInt(newYear, 10),
                        });
                      }}
                      value={String(selectedYear)}
                    >
                      {options}
                    </Select> */}
                  </div>
                  <div className={s.rightPart}>
                    <img
                      src="./assets/images/previous-arrow.svg"
                      alt="previous-arrow"
                      className={`${s.arrowBtn} `}
                      onClick={() => {
                        if (selectedMonth > 0) {
                          const newMonth = value.clone();
                          newMonth.month(parseInt(selectedMonth - 1, 10));
                          onChange(newMonth);

                          this.setState({
                            selectedMonth: selectedMonth - 1,
                          });
                        } else {
                          const newMonth = value.clone();
                          newMonth.month(11);
                          onChange(newMonth);

                          const newYear = newMonth.year(selectedYear - 1);
                          onChange(newYear);

                          this.setState({
                            selectedMonth: 11,
                            selectedYear: selectedYear - 1,
                          });
                        }
                      }}
                    />
                    <img
                      src="./assets/images/next-arrow.svg"
                      alt="next-arrow"
                      className={`${s.arrowBtn} ${s.nextArrowBtn}`}
                      onClick={() => {
                        if (selectedMonth < 11) {
                          const newMonth = value.clone();
                          newMonth.month(parseInt(selectedMonth + 1, 10));
                          onChange(newMonth);

                          this.setState({
                            selectedMonth: selectedMonth + 1,
                          });
                        } else {
                          const newMonth = value.clone();
                          newMonth.month(0);
                          onChange(newMonth);

                          const newYear = newMonth.year(selectedYear + 1);
                          onChange(newYear);

                          this.setState({
                            selectedMonth: 0,
                            selectedYear: selectedYear + 1,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          }}
        />
        <p className={s.text}>Do not forget to fill in your timesheet before you end the day.</p>
        <Button type="primary" onClick={() => {}} className={s.btnFillTimeSheet}>
          Fill timesheet
        </Button>
      </div>
    );
  }
}
