import { Col, DatePicker, Form, Row, Select, Skeleton, Space, Tag } from 'antd';
import { debounce } from 'lodash';
import React, { Suspense, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import { splitArrayItem } from '@/utils/utils';
import styles from './index.less';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

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
      payload: { filter: { ...search, type: newType } },
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

  const getFilterActive = type.length > 0 || fromDate || toDate;

  const onClearFilter = () => {
    saveCurrentTypeTab(currentLeaveTypeTab);
    // dispatch action
    dispatch({
      type: 'timeOff/save',
      payload: { filter: {} },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'timeOffManagement/getTimeOffTypeListEffect',
      payload: {
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      },
    });
  }, []);

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
                <DatePicker format="MMM DD, YYYY" disabledDate={disabledFromDate} allowClear />
              </Form.Item>
            </Col>
            <Col span={2} className={styles.separator}>
              <span>to</span>
            </Col>
            <Col span={11}>
              <Form.Item name="toDate">
                <DatePicker format="MMM DD, YYYY" disabledDate={disabledToDate} allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Space direction="horizontal" className={styles.TimeOffFilter}>
      <Tag className={styles.appliedTag} closable onClose={onClearFilter} visible={getFilterActive}>
        {countFilter()} filters applied
      </Tag>

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
          <FilterButton fontSize={14} showDot={getFilterActive} />
        </FilterPopover>

        <CustomSearchBox onSearch={onSearch} placeholder="Search by Employee ID, name..." />
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
