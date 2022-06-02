import { Button, Checkbox, Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import exportToCsv from '@/utils/exportToCsv';
import styles from './index.less';

const { Option } = Select;
const OptionsHeader = (props) => {
  const [form] = Form.useForm();
  const {
    setPayload = () => {},
    listTimeOff = [],
    listEmployee = [],
    disabled = false,
    loadingEmployeeList = false,
    toDate = '',
    fromDate = '',
    setFromDate = () => {},
    setToDate = () => {},
  } = props;

  // DISABLE DATE OF DATE PICKER
  const disabledFromDate = (current) => {
    return current && current >= moment(toDate);
  };

  const disabledToDate = (current) => {
    return current && current <= moment(fromDate);
  };

  const onValuesChange = (changedValues, allValues) => {
    setPayload(allValues);
  };

  const processData = (array) => {
    let capsPopulations = [];
    capsPopulations = array.map((item, key) => {
      return {
        'S.No': key + 1,
        'Ticket ID': item.ticketID || '-',
        'Employee ID': item.employee?.generalInfo?.employeeId || '-',
        'User ID': item.employee?.generalInfo?.userId || '-',
        'First Name': item.employee?.generalInfo?.firstName || '-',
        'Middle Name': item.employee?.generalInfo?.middleName || '-',
        'Last Name': item.employee?.generalInfo?.lastName || '-',
        'From Date': item.fromDate ? moment(item.fromDate).format('MM/DD/YYYY') : '-',
        'To Date': item.toDate ? moment(item.toDate).format('MM/DD/YYYY') : '-',
        'Count/Q.ty': item.duration || '-',
        'Leave Type': item.type?.typeName || '-',
        Subject: item.subject || '-',
        Description: item.description || '-',
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
  const downloadCSVFile = () => {
    exportToCsv(`TimeOff-Report-${Date.now()}.csv`, processData(listTimeOff));
  };

  const dateFormat = 'MM/DD/YYYY';
  const options = [
    { value: TIMEOFF_STATUS.ACCEPTED, label: 'Approved' },
    { value: TIMEOFF_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: TIMEOFF_STATUS.REJECTED, label: 'Rejected' },
    { value: TIMEOFF_STATUS.ON_HOLD, label: 'On-hold' },
    { value: TIMEOFF_STATUS.DRAFTS, label: 'Draft' },
    { value: TIMEOFF_STATUS.DELETED, label: 'Deleted' },
    { value: TIMEOFF_STATUS.WITHDRAWN, label: 'Withdrawn' },
  ];

  return (
    <div className={styles.OptionsHeader}>
      <div className={styles.container}>
        <Form
          name="uploadForm"
          form={form}
          onValuesChange={onValuesChange}
          initialValues={{
            durationFrom: fromDate,
            durationTo: toDate,
          }}
        >
          <Row gutter={[24, 12]}>
            <Col xs={7}>
              <span className={styles.itemLabel}>User ID - Name</span>
              <Form.Item name="user">
                <Select
                  allowClear
                  placeholder="Select an user"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  showSearch
                  disabled={disabled || loadingEmployeeList}
                  loading={loadingEmployeeList}
                >
                  {listEmployee.map((item = {}) => {
                    return (
                      <Option key={item._id} value={item._id}>
                        {`${item?.generalInfo?.employeeId} - ${item?.generalInfo?.legalName}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={9}>
              <span className={styles.itemLabel}>Duration</span>
              <div>
                <Row gutter={[24, 24]}>
                  <Col xs={12}>
                    <Form.Item name="durationFrom">
                      <DatePicker
                        placeholder="From Date"
                        format={dateFormat}
                        disabledDate={disabledFromDate}
                        disabled={disabled}
                        onChange={(val) => setFromDate(val)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <span />
                    <Form.Item name="durationTo">
                      <DatePicker
                        placeholder="To Date"
                        format={dateFormat}
                        disabledDate={disabledToDate}
                        disabled={disabled}
                        onChange={(val) => setToDate(val)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col className={styles.buttons} xs={8}>
              {/* <Button className={styles.submitBtn} htmlType="submit">
                Get data
              </Button> */}
              <Button
                className={styles.downloadCSVBtn}
                disabled={disabled}
                onClick={downloadCSVFile}
              >
                Download as CSV
              </Button>
            </Col>

            <Col xs={1}>
              <span className={styles.itemStatusLabel}>Status</span>
            </Col>
            <Col xs={22} className={styles.statusFilter}>
              <Form.Item name="status" className={styles.statusRow}>
                <Checkbox.Group options={options} disabled={disabled} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ loading, timeOffManagement }) => ({
  loadingEmployeeList: loading.effects['timeOffManagement/fetchEmployeeList'],
  timeOffManagement,
}))(OptionsHeader);
