import { Col, DatePicker, Form, Row, Select, Skeleton, Space, Tag } from 'antd';
import { debounce } from 'lodash';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import { removeEmptyFields } from '@/utils/utils';
import styles from './index.less';

const TimeOffFilter = (props) => {
  const [form] = Form.useForm();
  const [count, setCount] = useState(3);

  const {
    dispatch,
    yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {},
    filter: { search, type, fromDate, toDate },
    filter = {},
    isVisible,
    onOpenAppliedTag = () => {},
    onClosedAppliedTag = () => {},
    saveCurrentTypeTab = () => {},
  } = props;

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

  const onValuesChange = () => {
    const values = form.getFieldsValue();

    // applied count

    let typeCount = 0;
    if (values.type.length > 0) {
      typeCount = 1;
    } else {
      typeCount = 0;
    }

    let typeDate = 0;
    if (values.fromDate || values.toDate) {
      typeDate = 1;
    } else {
      typeDate = 0;
    }

    if (count > 0) {
      onOpenAppliedTag();
    }

    setCount(typeCount + typeDate);

    onFinishDebounce(values);
  };

  const closedAppliedTag = () => {
    saveCurrentTypeTab('1');
    onClosedAppliedTag();
  };

  useEffect(() => {
    form.setFieldsValue({ type, fromDate, toDate });
  }, [filter]);

  const FilterContent = () => {
    return (
      <Form
        layout="vertical"
        name="filter"
        form={form}
        initialValues={{ type, fromDate, toDate }}
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
            filterOption={
              (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              // eslint-disable-next-line react/jsx-curly-newline
            }
            showArrow
          >
            {[...commonLeaves, ...specialLeaves].map((x) => {
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
                <DatePicker format="MMM DD, YYYY" />
              </Form.Item>
            </Col>
            <Col span={2} className={styles.separator}>
              <span>to</span>
            </Col>
            <Col span={11}>
              <Form.Item name="toDate">
                <DatePicker format="MMM DD, YYYY" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Space direction="horizontal" className={styles.TimeOffFilter}>
      <Tag className={styles.appliedTag} closable onClose={closedAppliedTag} visible={isVisible}>
        {count} applied
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
          <FilterButton fontSize={14} showDot={Object.keys(filter).length > 0} />
        </FilterPopover>

        <CustomSearchBox onSearch={onSearch} placeholder="Search by Employee ID, name..." />
      </div>
    </Space>
  );
};
export default connect(({ dispatch, timeOff: { yourTimeOffTypes = {}, filter = {} } }) => ({
  dispatch,
  yourTimeOffTypes,
  filter,
}))(TimeOffFilter);
