import { Col, DatePicker, Form, Row, Select, Skeleton, Space } from 'antd';
import { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { DATE_FORMAT_STR } from '@/constants/dateFormat';
import { splitArrayItem } from '@/utils/utils';
import styles from './index.less';

const TimeOffFilter = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    filter: { search, type = [], fromDate, toDate },
    filter = {},
    saveCurrentTypeTab = () => {},
    currentLeaveTypeTab = '',
    shortType = '',
    typeList: typeListData = [],
  } = props;
  const typeList = [...typeListData].filter((x) => (shortType ? x.type === shortType : true));

  const [searchTerm, setSearchTerm] = useState('');

  const onSearchDebounce = debounce((value) => {
    dispatch({
      type: 'timeOff/save',
      payload: { filter: { ...filter, search: value } },
    });
    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: 1,
      },
    });
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    setSearchTerm(value);
    onSearchDebounce(value);
  };

  // FUNCTIONALITY
  const disabledFromDate = (current) => {
    if (!toDate) return false;
    return current && current >= moment(toDate);
  };

  const disabledToDate = (current) => {
    if (!fromDate) return false;
    return current && current <= moment(fromDate);
  };

  const onFinish = (values) => {
    const { type: typeData = [] } = values;
    const listIdType = splitArrayItem(typeList.map((item) => item.ids));
    const newType = typeData.length ? splitArrayItem([...typeData]) : listIdType;
    dispatch({
      type: 'timeOff/save',
      payload: {
        filter: { ...filter, type: newType, fromDate: values.fromDate, toDate: values.toDate },
      },
    });
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  const countFilter = () => {
    let count = 0;
    if (type.length > 0) {
      count += 1;
    }
    if (fromDate || toDate) {
      count += 1;
    }
    return count;
  };

  const onClearFilter = () => {
    saveCurrentTypeTab(currentLeaveTypeTab);
    // dispatch action
    dispatch({
      type: 'timeOff/save',
      payload: { filter: { search } },
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
      setSearchTerm('');
    }
  }, [filter]);

  const FilterContent = () => {
    return (
      <Form
        layout="vertical"
        name="filter"
        form={form}
        onValuesChange={onValuesChange}
        className={styles.FilterContent}
      >
        <Form.Item label="BY TIMEOFF TYPES" name="type">
          <Select
            allowClear
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Search by Timeoff Types"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            showArrow
          >
            {typeList.map((x) => {
              const id = x.ids.join(',');
              return (
                <Select.Option value={id} key={id}>
                  {x.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="By Duration">
          <Row>
            <Col span={11}>
              <Form.Item name="fromDate">
                <DatePicker format={DATE_FORMAT_STR} disabledDate={disabledFromDate} allowClear />
              </Form.Item>
            </Col>
            <Col span={2} className={styles.separator}>
              <span>to</span>
            </Col>
            <Col span={11}>
              <Form.Item name="toDate">
                <DatePicker format={DATE_FORMAT_STR} disabledDate={disabledToDate} allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  };

  const applied = countFilter();

  return (
    <Space direction="horizontal" className={styles.TimeOffFilter}>
      <FilterCountTag count={applied} onClearFilter={onClearFilter} />

      <div className={styles.rightContentHeader}>
        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent />
            </Suspense>
          }
          realTime
        >
          <CustomOrangeButton fontSize={14} showDot={applied > 0} />
        </FilterPopover>

        <CustomSearchBox
          value={searchTerm}
          onSearch={onSearch}
          placeholder="Search by Employee ID, name..."
        />
      </div>
    </Space>
  );
};
export default connect(
  ({
    dispatch,
    timeOffManagement: { typeList = [] },
    timeOff: { yourTimeOffTypes = {}, filter = {}, currentScopeTab, currentLeaveTypeTab },
  }) => ({
    dispatch,
    yourTimeOffTypes,
    typeList,
    filter,
    currentScopeTab,
    currentLeaveTypeTab,
  }),
)(TimeOffFilter);
