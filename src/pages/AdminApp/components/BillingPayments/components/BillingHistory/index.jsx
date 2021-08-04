import { DatePicker, Form, Table } from 'antd';
import moment from 'moment';
// import moment from 'moment';
import React, { PureComponent } from 'react';
import s from './index.less';

export default class BillingHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: '',
      toDate: '',
    };
  }

  // DISABLE DATE OF DATE PICKER
  disabledFromDate = (current) => {
    const { toDate } = this.state;
    return (current && current >= moment(toDate)) || current > moment();
  };

  disabledToDate = (current) => {
    const { fromDate } = this.state;
    return (current && current <= moment(fromDate)) || current > moment();
  };

  render() {
    const dateFormat = 'MM.DD.YYYY';

    const column = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      { title: 'Action', dataIndex: '', key: 'download', render: () => <a>Download</a> },
    ];

    const dataBillHistory = [
      { key: 1, date: 'August 21st, 2021', price: '$25.00' },
      { key: 2, date: 'August 21st, 2021', price: '$25.00' },
      { key: 3, date: 'August 21st, 2021', price: '$25.00' },
      { key: 4, date: 'August 21st, 2021', price: '$25.00' },
      { key: 5, date: 'August 21st, 2021', price: '$25.00' },
      { key: 6, date: 'August 21st, 2021', price: '$25.00' },
    ];

    return (
      <div className={s.root}>
        <div className={s.content}>
          <p className={s.title}>Billing & Payments</p>
          <Form
            className={s.content__formHeader}
            // initialValues={(from, to)}
            // onFinish={(values) => console.log(values)}
          >
            <Form.Item name="from" className={s.content__formHeader__item}>
              <span className={s.from}>From</span>
              <DatePicker
                onChange={(val) => this.setState({ fromDate: val })}
                format={dateFormat}
                disabledDate={this.disabledFromDate}
              />
            </Form.Item>
            <Form.Item name="to" className={s.content__formHeader__item}>
              <span className={s.to}>To</span>
              <DatePicker
                onChange={(val) => this.setState({ toDate: val })}
                disabledDate={this.disabledToDate}
                format={dateFormat}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={s.listHistory}>
          <Table
            rowClassName={() => 'rowClassName1'}
            dataSource={dataBillHistory}
            columns={column}
            showHeader={false}
            pagination={false}
            scroll={{
              x: '',
              y: 200,
            }}
          />
        </div>
      </div>
    );
  }
}
