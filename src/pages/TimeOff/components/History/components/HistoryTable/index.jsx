import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { DATE_FORMAT_STR } from '@/constants/dateFormat';
import { TIMEOFF_HISTORY_OPERATIONS } from '@/constants/timeOff';
import { Col, DatePicker, Form, Row, Select, Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { Suspense, useState } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const initialFilter = {
  operation: [],
  leaveType: [],
  fromDate: '',
  toDate: '',
  page: 1,
  limit: 10,
};

const HistoryTable = ({
  data = [],
  typeList = [],
  onFilter = () => {},
  total = 0,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [currentFilter, setCurrentFilter] = useState(initialFilter);

  const onChangeFilter = (values) => {
    const { fromDate: fromDateChange } = values;

    const newValues = { ...currentFilter, ...values };
    if (fromDateChange) {
      newValues.toDate = '';
      form.setFieldsValue({ toDate: '' });
    }
    setCurrentFilter(newValues);
    onFilter(newValues);
  };

  const onValuesChange = (values) => {
    // Clear page and limit after filter
    const newValues = { ...values, page: 1, limit: 10 };
    onChangeFilter(newValues);
  };

  const handleChangePage = (p, l) => {
    onChangeFilter({ page: p, limit: l });
  };

  const handleClearFilter = () => {
    setCurrentFilter(initialFilter);
    onChangeFilter(initialFilter);
    form.resetFields();
  };

  const disabledDate = (current) => {
    if (!currentFilter.fromDate) return false;
    return current && current < moment(currentFilter.fromDate);
  };

  const checkFilter = () => {
    let sum = 0;
    Object.values(form.getFieldValue()).forEach((item) => {
      if (!isEmpty(item)) sum += 1;
    });
    return sum;
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => {
        return <span className={styles.tb_title}>{date}</span>;
      },
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      render: (operation) => <span>{operation}</span>,
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (leaveType) => {
        return <span>{leaveType}</span>;
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      editable: true,
      render: (startDate) => {
        return <span>{startDate}</span>;
      },
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      editable: true,
      render: (endDate) => {
        return <span>{endDate}</span>;
      },
    },
    {
      title: 'Changed By',
      dataIndex: 'changedBy',
      key: 'changedBy',
      editable: true,
      render: (changedBy) => {
        return <span>{changedBy}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      editable: true,
      render: (status) => {
        return <span>{status}</span>;
      },
    },
    {
      title: 'Number of Days',
      dataIndex: 'numberOfDays',
      key: 'numberOfDays',
      editable: true,
      render: (numberOfDays) => {
        if (!numberOfDays) return <span>-</span>;
        return (
          <span style={{ color: +numberOfDays <= 0 ? '#F04438' : '#12B76A' }}>
            {+numberOfDays > 0 ? `+${numberOfDays}` : numberOfDays}
          </span>
        );
      },
    },
    {
      title: 'Current Balance',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
      editable: true,
      render: (currentBalance) => {
        return <span className={styles.currentBalance}>{currentBalance}</span>;
      },
    },
  ];

  return (
    <Row className={styles.HistoryTable}>
      <Col span={24}>
        <Row>
          <Col span={12}>
            <h3 className={styles.title}>History of Timeoff</h3>
          </Col>
          <Col className={styles.filter} span={12}>
            <FilterCountTag count={checkFilter()} onClearFilter={handleClearFilter} />
            <FilterPopover
              placement="bottomRight"
              content={
                <Suspense fallback={<Skeleton active />}>
                  <Form
                    layout="vertical"
                    name="filter"
                    form={form}
                    onValuesChange={onValuesChange}
                    className={styles.FilterContent}
                  >
                    <Form.Item label="Operation" name="operation">
                      <Select
                        allowClear
                        showSearch
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select operation"
                        filterOption={(input, option) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                        showArrow
                      >
                        {TIMEOFF_HISTORY_OPERATIONS.map((operation) => {
                          return (
                            <Select.Option value={operation.name} key={operation.id}>
                              {operation.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Leave Type" name="leaveType">
                      <Select
                        allowClear
                        showSearch
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select leave type"
                        filterOption={(input, option) => {
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                        }}
                        showArrow
                      >
                        {typeList.map((type) => {
                          const { timeOffType: { _id: id = '', name = '' } = {} } = type;
                          return (
                            <Select.Option value={id} key={id}>
                              {name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Date Range">
                      <Row>
                        <Col span={11}>
                          <Form.Item name="fromDate">
                            <DatePicker format={DATE_FORMAT_STR} allowClear />
                          </Form.Item>
                        </Col>
                        <Col span={2} className={styles.separator}>
                          <span>to</span>
                        </Col>
                        <Col span={11}>
                          <Form.Item name="toDate">
                            <DatePicker
                              format={DATE_FORMAT_STR}
                              disabledDate={disabledDate}
                              allowClear
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>
                </Suspense>
              }
              realTime
            >
              <CustomOrangeButton fontSize={14} />
            </FilterPopover>
          </Col>
        </Row>
        <CommonTable
          loading={loading}
          list={data}
          columns={columns}
          page={currentFilter.page}
          limit={currentFilter.limit}
          total={total}
          isBackendPaging
          onChangePage={handleChangePage}
        />
      </Col>
    </Row>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['timeOff/fetchHistoryTimeoffByEmployee'],
}))(HistoryTable);
