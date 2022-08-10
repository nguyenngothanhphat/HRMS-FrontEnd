import { Col, DatePicker, Form, Row, Select } from 'antd';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();

  const { employeeList = [], onFilter = () => {} } = props;

  const disableFromDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value > moment(t);
  };

  const disableToDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value < moment(t);
  };

  return (
    <div className={styles.FilterContent}>
      <Form
        layout="vertical"
        name="filter"
        form={form}
        onValuesChange={(_, values) => onFilter(values)}
      >
        <Form.Item label="By Author" name="byAuthor">
          <Select allowClear style={{ width: '100%' }} placeholder="Please select">
            {employeeList.map((item) => {
              return (
                <Select.Option value={item._id} key={item._id}>
                  {item.generalInfo?.legalName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="By Date">
          <Row gutter={24}>
            <Col span={11}>
              <Form.Item name="fromDate">
                <DatePicker
                  format={DATE_FORMAT_MDY}
                  disabledDate={(val) => disableFromDate(val, 'toDate')}
                />
              </Form.Item>
            </Col>
            <Col span={2} className={styles.separator}>
              <span>to</span>
            </Col>
            <Col span={11}>
              <Form.Item name="toDate">
                <DatePicker
                  format={DATE_FORMAT_MDY}
                  disabledDate={(val) => disableToDate(val, 'fromDate')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterContent;
