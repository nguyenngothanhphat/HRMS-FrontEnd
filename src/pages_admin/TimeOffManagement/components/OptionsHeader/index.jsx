import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, DatePicker, Button, Checkbox } from 'antd';
import moment from 'moment';
import exportToCsv from '@/utils/exportToCsv';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import { setFilter, getFilter } from '@/utils/timeoffManagement';
import styles from './index.less';

const { Option } = Select;
export default class OptionsHeader extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = { fromDate: '', toDate: '' };
  }

  componentDidMount = () => {
    const preState = getFilter();
    if (preState) {
      this.formRef.current.setFieldsValue({
        userIdName: preState.userIdName,
        durationFrom: preState.durationFrom ? moment(preState.durationFrom) : '',
        durationTo: preState.durationTo ? moment(preState.durationTo) : '',
        status: preState.status,
      });
    }
  };

  // DISABLE DATE OF DATE PICKER
  disabledFromDate = (current) => {
    const { toDate } = this.state;
    return current && current >= moment(toDate);
  };

  disabledToDate = (current) => {
    const { fromDate } = this.state;
    return current && current <= moment(fromDate);
  };

  onFinish = (values) => {
    const { reloadData } = this.props;
    setFilter(values);
    reloadData(values);
  };

  downloadCSVFile = () => {
    const { listTimeOff } = this.props;

    exportToCsv(`TimeOff-Report-${Date.now()}.csv`, this.processData(listTimeOff));
  };

  processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item, key) => {
      return {
        N0: key + 1,
        'Employee Id': item.employeeId,
        'Full Name': item.name,
        'From Date': item.fromDate,
        'To Date': item.toDate,
        'Count/Q.ty': item.country,
        'Leave type': item.type,
        Status: item.status,
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });
    return dataExport;
  };

  // onFromChange = (value) => {
  //   const newMoment = moment(value).format('MM.DD.YY');
  //   this.setState({
  //     from: newMoment,
  //   });
  // };

  // onChange = (value) => {
  //   console.log(value);
  // };

  render() {
    const { listEmployee } = this.props;
    const dateFormat = 'MM.DD.YY';
    const options = [
      { value: TIMEOFF_STATUS.ACCEPTED, label: 'Approved' },
      { value: TIMEOFF_STATUS.IN_PROGRESS, label: 'In Progress' },
      { value: TIMEOFF_STATUS.REJECTED, label: 'Rejected' },
      { value: TIMEOFF_STATUS.ON_HOLD, label: 'On-hold' },
      { value: TIMEOFF_STATUS.DRAFTS, label: 'Draft' },
      { value: TIMEOFF_STATUS.DELETED, label: 'Deleted' },
    ];
    const nameOpt = options.map((op) => op.value);
    return (
      <div className={styles.OptionsHeader}>
        <div className={styles.container}>
          <Form name="uploadForm" ref={this.formRef} onFinish={this.onFinish}>
            <Row gutter={['20', '20']}>
              <Col xs={7}>
                <span className={styles.itemLabel}>User ID - Name</span>
                <Form.Item name="userIdName">
                  <Select
                    allowClear
                    placeholder="Select an user"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    showSearch
                  >
                    {listEmployee.map((item = {}) => {
                      return (
                        <Option key={item._id} value={item._id}>
                          {`${item.name}`}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={9}>
                <span className={styles.itemLabel}>Duration</span>
                <div>
                  <Row gutter={['20', '20']}>
                    <Col xs={12}>
                      <Form.Item name="durationFrom">
                        <DatePicker
                          placeholder="From Date"
                          format={dateFormat}
                          disabledDate={this.disabledFromDate}
                          onChange={(val) => this.setState({ fromDate: val })}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <span />
                      <Form.Item name="durationTo">
                        <DatePicker
                          placeholder="To Date"
                          format={dateFormat}
                          disabledDate={this.disabledToDate}
                          onChange={(val) => this.setState({ toDate: val })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col className={styles.buttons} xs={8}>
                <Button className={styles.submitBtn} htmlType="submit">
                  Get data
                </Button>
                <Button className={styles.downloadCSVBtn} onClick={this.downloadCSVFile}>
                  Download as CSV
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={1}>
                <span className={styles.itemStatusLabel}>Status</span>
              </Col>
              <Col xs={22} className={styles.statusFilter}>
                <Form.Item name="status" className={styles.statusRow}>
                  <Checkbox.Group options={options} onChange={this.onChange} name={nameOpt}>
                    {/* <Checkbox value="Approved">Approved</Checkbox>
                    <Checkbox value="New">New</Checkbox>
                    <Checkbox value="Rejected">Rejected</Checkbox>
                    <Checkbox value="Waiting for approve">Waiting for approve</Checkbox> */}
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
