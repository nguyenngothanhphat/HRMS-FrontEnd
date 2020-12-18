import React, { PureComponent } from 'react';
import { Calendar, Select, Col, Row, Modal, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

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
    this.state = {};
  }

  componentDidMount = () => {};

  onPanelChange = (value, mode) => {
    console.log(value, mode);
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
    console.log('value', value, date);
    const { lastWorkingDate = '', requestDate = '' } = this.props;
    // const dateLists = this.getDateLists(requestDate, lastWorkingDate);
    const beginDate = moment(requestDate).format('DD/MM/YYYY');
    const lastDate = moment(lastWorkingDate).format('DD/MM/YYYY');
    const key = moment(value).format('DD/MM/YYYY');

    console.log('beginDate', beginDate);
    console.log('key', key);

    let normalDate = '';
    let workedDate = '';
    let unworkedDate = '';
    if (moment(beginDate).isBefore(moment(key)) || moment(lastDate).isAfter(moment(key))) {
      console.log('a');
      normalDate = styles.normalDate;
    } else {
      console.log('d');
      if (moment(beginDate).isAfter(moment(key))) {
        workedDate = styles.check;
        console.log('b');
      }
      if (moment(lastDate).isBefore(moment(key))) {
        unworkedDate = styles.notCheck;
        console.log('c');
      }
    }

    return (
      <div className={`${styles.date} ${normalDate} ${workedDate} ${unworkedDate}`}>{date}</div>
    );

    // return check ? (
    //   <div className={`${styles.date} ${styles.check}`}>
    //     <CheckOutlined className={styles.iconCheck} />
    //   </div>
    // ) : (
    //   <div className={`${styles.date} ${styles.notCheck}`}>{date}</div>
    // );
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
                const start = 0;
                const end = 12;
                const monthOptions = [];

                const current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i += 1) {
                  current.month(i);
                  months.push(localeData.monthsShort(current));
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
                  <div>
                    <Row gutter={8}>
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          className="my-year-select"
                          onChange={(newYear) => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}
                          value={String(year)}
                        >
                          {options}
                        </Select>
                      </Col>
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          value={String(month)}
                          onChange={(selectedMonth) => {
                            const newValue = value.clone();
                            newValue.month(parseInt(selectedMonth, 10));
                            onChange(newValue);
                          }}
                        >
                          {monthOptions}
                        </Select>
                      </Col>
                    </Row>
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
