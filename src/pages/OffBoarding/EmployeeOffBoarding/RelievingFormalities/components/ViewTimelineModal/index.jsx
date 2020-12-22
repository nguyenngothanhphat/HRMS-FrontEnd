import React, { PureComponent } from 'react';
import { Calendar, Select, Modal, Button } from 'antd';
import { CheckOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

moment.locale('en');

@connect(
  ({
    offboarding: {
      relievingDetails: {
        requestDate = '',
        lastWorkingDate = '',
        isSent,
        exitPackage: { waitList = [] } = {},
      } = {},
    } = {},
  }) => ({
    waitList,
    isSent,
    lastWorkingDate,
    requestDate,
  }),
)
class ViewTimelineModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: parseInt(moment().subtract(1, 'months').format('MM'), 10),
      selectedYear: parseInt(moment().format('YYYY'), 10),
    };
  }

  componentDidMount = () => {};

  onPanelChange = (value, mode) => {
    console.log(value, mode);
  };

  getStatusDay = (value) => {
    // const disable = moment() < moment(value).subtract(1, 'day').endOf('day');
    const isWeekend =
      moment(value).locale('en').format('ddd') === 'Sat' ||
      moment(value).locale('en').format('ddd') === 'Sun';
    const isCurrent = moment().format('DD/MM/YYYY') === moment(value).format('DD/MM/YYYY');

    if (isWeekend) {
      return 'weekend';
    }
    // if (disable) {
    //   return 'disable';
    // }
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
    return <div className={`${styles.date} ${styles[status]}`}>{date}</div>;
  };

  // GET LIST OF DAYS FROM DAY A TO DAY B
  getDateLists = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);

    const now = start;
    const dates = [];

    while (now.isBefore(end) || now.isSame(end)) {
      dates.push(now.format('DD/MM/YYYY'));
      now.add(1, 'days');
    }
    return dates;
  };

  handeCheckTimeSheet = (value, date) => {
    const { lastWorkingDate = '', requestDate = '' } = this.props;

    const beginDate = moment(requestDate).format('YYYY-MM-DD');
    const lastDate = moment(lastWorkingDate).format('YYYY-MM-DD');
    const currentDate = moment().format('YYYY-MM-DD');
    const key = moment(value).format('YYYY-MM-DD');

    let normalDate = '';
    let workedDate = '';
    let unworkDate = '';
    let lastWorkDate = '';

    if (beginDate > key || lastDate < key) {
      normalDate = styles.normalDate;
    } else if (beginDate <= key && currentDate >= key) {
      workedDate = styles.check;
    } else {
      unworkDate = styles.notCheck;
    }
    // last day
    if (key === lastDate) {
      lastWorkDate = styles.lastWorkDate;
    }

    if (workedDate !== '')
      return (
        <div className={`${styles.date} ${lastWorkDate} ${normalDate} ${workedDate} ${unworkDate}`}>
          <CheckOutlined className={styles.iconCheck} />
        </div>
      );
    return (
      <div className={`${styles.date} ${lastWorkDate} ${normalDate} ${workedDate} ${unworkDate}`}>
        {date}
      </div>
    );
  };

  render() {
    const { visible, onClose = () => {}, submitText = '' } = this.props;

    return (
      <Modal
        className={styles.ViewTimelineModal}
        onCancel={() => onClose()}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <p className={styles.title}>View timeline</p>
          <div className={styles.calendar}>
            <Calendar
              headerRender={({ value, type, onChange, onTypeChange }) => {
                const { selectedMonth, selectedYear } = this.state;

                const start = 0;
                const end = 12;
                const monthOptions = [];

                const current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i += 1) {
                  current.month(i);
                  months.push(localeData.months(current));
                }

                for (let index = start; index < end; index += 1) {
                  monthOptions.push(
                    <Select.Option className="month-item" key={`${index}`}>
                      {months[index]}
                    </Select.Option>,
                  );
                }
                const month = value.month();

                const year = value.year();

                const options = [];
                for (let i = year - 10; i < year + 10; i += 1) {
                  options.push(
                    <Select.Option key={i} value={i} className="year-item">
                      {i}
                    </Select.Option>,
                  );
                }
                return (
                  <div className={styles.customHeader}>
                    <div className={styles.monthYearControl}>
                      <div className={styles.leftPart}>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          value={String(selectedMonth)}
                          showArrow={false}
                          onChange={(selectedMonth1) => {
                            const newValue = value.clone();
                            newValue.month(parseInt(selectedMonth1, 10));
                            onChange(newValue);
                            this.setState({
                              selectedMonth: selectedMonth1,
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
                              selectedYear: newYear,
                            });
                          }}
                          value={String(selectedYear)}
                        >
                          {options}
                        </Select>
                      </div>
                      <div className={styles.rightPart}>
                        <CaretLeftOutlined
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
                        <CaretRightOutlined
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
              fullscreen
              onPanelChange={this.onPanelChange}
              mode="month"
              dateFullCellRender={this.dateFullCellRender}
            />
          </div>
          <div className={styles.footer}>
            <Button onClick={onClose}>{submitText}</Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ViewTimelineModal;
