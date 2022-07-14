import { Col, DatePicker, Form, Row, Select, Skeleton, Space, Tag } from 'antd';
import { debounce } from 'lodash';
import React, { Suspense, useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import { removeEmptyFields } from '@/utils/utils';
import styles from './index.less';

const TimeOffFilter = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
    filter: { search, type = [], fromDate, toDate },
    filter = {},
    saveCurrentTypeTab = () => {},
    currentLeaveTypeTab = '',
    shortType = '',
  } = props;

  const typeList = [...commonLeaves, ...specialLeaves].filter((x) =>
    shortType ? x.type === shortType : true,
  );

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
    const filterTemp = removeEmptyFields(values);

    // dispatch action
    dispatch({
      type: 'timeOff/save',
      payload: { filter: { ...search, ...filterTemp } },
    });
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  useEffect(() => {
    form.setFieldsValue({ type, fromDate, toDate });
  }, [filter]);

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

  const FilterContent = () => {
    return (
      <Form
        layout="vertical"
        name="filter"
        form={form}
        initialValues={{ type, fromDate, toDate }}
        onValuesChange={onValuesChange}
        className={styles.FilterContent}
        onFinish={() => {}}
      >
        <Form.Item label="BY TIMEOFF TYPES" name="type">
          <Select
            allowClear
            showSearch
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Search by Timeoff Types"
            filterOption={
              (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              // eslint-disable-next-line react/jsx-curly-newline
            }
            showArrow
          >
            {typeList.map((x) => {
              return (
                <Select.Option value={x._id} key={x._id}>
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
    timeOff: { yourTimeOffTypes = {}, filter = {}, currentScopeTab, currentLeaveTypeTab },
  }) => ({
    dispatch,
    yourTimeOffTypes,
    filter,
    currentScopeTab,
    currentLeaveTypeTab,
  }),
)(TimeOffFilter);
