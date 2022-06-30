import { Col, DatePicker, Form, Row } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { dateFormat } from '@/utils/offboarding';
import styles from './index.less';

const FilterContent = ({ onFinish = () => {}, setFilterForm = () => {} }) => {
  const [form] = Form.useForm();

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  useEffect(() => {
    setFilterForm(form);
  }, []);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

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
              <DatePicker placeholder="From" format={dateFormat} />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="toDate">
              <DatePicker placeholder="To" format={dateFormat} />
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
