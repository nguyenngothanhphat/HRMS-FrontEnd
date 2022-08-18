/* eslint-disable react/jsx-curly-newline */
import { Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { HELP_TYPE } from '@/constants/helpPage';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    loadingFetchCreatorList = false,
    loadingFetchCategoryList = false,
    selectedCountry = '',
    listCreator = [],
    categoryList = [],
    filter = {},
    setFilter = () => {},
    helpType = '',
  } = props;
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  useEffect(() => {
    dispatch({
      type: 'helpPage/fetchListCreator',
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'helpPage/fetchHelpCategoryList',
      payload: { country: selectedCountry, type: helpType },
    });
  }, [selectedCountry, helpType]);

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
    setFilter(filterTemp);
  };

  const disabledFromDate = (current) => {
    if (!toDate) return false;
    return current && current >= toDate;
  };

  const disabledToDate = (current) => {
    if (!fromDate) return false;
    return current && current <= fromDate;
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  useEffect(() => {
    if (Object.keys(filter).length === 0) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

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
          {categoryList.map((x) => {
            return (
              <Select.Option value={x._id} key={x._id}>
                {x.category}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="Added By" name="employees">
        <Select
          allowClear
          showSearch
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Search by Creator"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showArrow
          loading={loadingFetchCreatorList}
        >
          {listCreator.map((x) => (
            <Select.Option value={x._id} key={x._id}>
              {x?.generalInfoInfo?.legalName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="By Created Date">
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

export default connect(
  ({
    loading,
    helpPage: { selectedCountry = '', listCreator = [], categoryList = [], helpType = '' } = {},
  }) => ({
    selectedCountry,
    helpType,
    listCreator,
    categoryList,
    loadingFetchCreatorList: loading.effects['helpPage/fetchListCreator'],
    loadingFetchCategoryList: loading.effects['helpPage/fetchHelpCategoryList'],
  }),
)(FilterContent);
