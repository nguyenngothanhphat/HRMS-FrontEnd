/* eslint-disable react/jsx-curly-newline */
import { Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';
import { getCurrentTenant } from '@/utils/authority';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    policiesRegulations: {
      listCategory = [],
      listCreator = [],
      originData: { selectedCountry = '' } = {},
    },
    loadingFetchCreatorList = false,
    loadingFetchCategoryList = false,
    setApplied,
    setForm,
  } = props;
  const [fromDate, setFromDate] = useState(moment());
  const [toDate, setToDate] = useState(moment());

  useEffect(() => {
    dispatch({
      type: 'policiesRegulations/fetchListCreator',
    });
    setForm(form);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'policiesRegulations/listCategory',
      payload: { country: selectedCountry },
    });
  }, [selectedCountry]);

  // FUNCTIONALITY
  const onFinish = (values) => {
    const newValues = { ...values };

    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const filterTemp = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0 || !v
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );
    filterTemp.fromDate = moment(filterTemp.fromDate).startOf('day');
    filterTemp.toDate = moment(filterTemp.toDate).endOf('day');
    dispatch({
      type: 'policiesRegulations/fetchListPolicy',
      payload: { country: [selectedCountry], tenantId: getCurrentTenant(), ...filterTemp },
    });
  };

  const disabledFromDate = (current) => {
    if (!toDate) return false;
    return current && current >= moment(toDate);
  };

  const disabledToDate = (current) => {
    if (!fromDate) return false;
    return current && current <= moment(fromDate);
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    const filteredObj = Object.entries(values).filter(
      ([, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    setApplied(Object.keys(newObj).length);
    onFinishDebounce(values);
  };

  return (
    <Form
      layout="vertical"
      name="filter"
      onValuesChange={onValuesChange}
      form={form}
      className={styles.FilterContent}
    >
      <Form.Item label="By Category Name" name="categories">
        <Select
          allowClear
          showSearch
          mode="multiple"
          loading={loadingFetchCategoryList}
          style={{ width: '100%' }}
          placeholder="Search by Category Name"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
        >
          {listCategory.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="By Add" name="employees">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Creater"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
          loading={loadingFetchCreatorList}
        >
          {listCreator.map((x) => (
            <Select.Option value={x._id} key={x._id}>
              {x?.employee?.legalName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="By Duration">
        <Row>
          <Col span={11}>
            <Form.Item name="fromDate">
              <DatePicker
                format="MMM DD, YYYY"
                disabledDate={disabledFromDate}
                allowClear
                onChange={setFromDate}
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
                allowClear
                onChange={setToDate}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(({ loading, policiesRegulations }) => ({
  policiesRegulations,
  loadingFetchCreatorList: loading.effects['policiesRegulations/fetchListCreator'],
  loadingFetchCategoryList: loading.effects['policiesRegulations/listCategory'],
}))(FilterContent);
