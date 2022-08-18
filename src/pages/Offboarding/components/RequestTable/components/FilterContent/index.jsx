import { Col, DatePicker, Form, Row } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { DATE_FORMAT } from '@/constants/offboarding';
import styles from './index.less';

const FilterContent = ({ onFinish = () => {}, filter = {} }) => {
  const [form] = Form.useForm();

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

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

  // clear values
  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  return (
    <Form
      layout="vertical"
      name="filter"
      // onFinish={onFinish}
      onValuesChange={onValuesChange}
      form={form}
      className={styles.FilterContent}
    >
      <Form.Item label="By date">
        <Row>
          <Col span={11}>
            <Form.Item name="fromDate">
              <DatePicker
                placeholder="From"
                format={DATE_FORMAT}
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
                placeholder="To"
                format={DATE_FORMAT}
                disabledDate={(val) => disableToDate(val, 'fromDate')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(({ location: { companyLocationList = [] } = {} }) => ({
  companyLocationList,
}))(FilterContent);
