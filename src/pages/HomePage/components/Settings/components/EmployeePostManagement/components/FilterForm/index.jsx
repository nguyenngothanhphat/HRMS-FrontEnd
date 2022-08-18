import { Col, DatePicker, Form, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { STATUS_POST } from '@/constants/homePage';
import styles from './index.less';
import { removeEmptyFields } from '@/utils/utils';

const FilterContent = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    listEmployeeName = [],
    loadingFetchListEmployeeCreated = false,
    setForm = () => {},
    setApplied = () => {},
    setFilterForm = () => {},
    setPage = () => {},
  } = props;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    dispatch({
      type: 'homePage/fetchListEmployeeCreated',
    });
    setForm(form);
  }, []);

  const disabledFromDate = (current) => {
    if (!toDate) return false;
    return current && current >= toDate;
  };

  const disabledToDate = (current) => {
    if (!fromDate) return false;
    return current && current <= fromDate;
  };

  const onFinish = (values) => {
    const filterTemp = removeEmptyFields(values);
    setFilterForm(filterTemp);
    setPage(1);
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    const filteredObj = Object.entries(values).filter(
      ([, value]) => (value !== undefined && value.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    onFinishDebounce(values);
  };

  return (
    <Form
      layout="vertical"
      name="filter"
      form={form}
      onValuesChange={onValuesChange}
      className={styles.FilterContent}
      onFinish={() => {}}
    >
      <Form.Item label="Employee" name="createdBy">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select by the user who created"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
          disabled={loadingFetchListEmployeeCreated}
          loading={loadingFetchListEmployeeCreated}
        >
          {listEmployeeName.map((x) => {
            const { generalInfoInfo: { legalName = '' } = {} } = x;
            return (
              <Select.Option key={x._id} value={x._id}>
                {legalName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Status" name="status">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by status"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
        >
          <Select.Option value={STATUS_POST.ACTIVE}>{STATUS_POST.ACTIVE}</Select.Option>
          <Select.Option value={STATUS_POST.HIDDEN}>{STATUS_POST.HIDDEN}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="By Duration">
        <Row>
          <Col span={11}>
            <Form.Item name="fromDate">
              <DatePicker
                format="MMM DD, YYYY"
                disabledDate={disabledFromDate}
                onChange={(date) => setFromDate(date)}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="toDate">
              <DatePicker
                format="MMM DD, YYYY"
                disabledDate={disabledToDate}
                onChange={(date) => setToDate(date)}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(({ homePage: { listEmployeeName } = {}, loading }) => ({
  listEmployeeName,
  loadingFetchListEmployeeCreated: loading.effects['homePage/fetchListEmployeeCreated'],
}))(FilterContent);
