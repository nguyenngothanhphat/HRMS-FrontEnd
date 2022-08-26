import { DatePicker, Form, InputNumber, Select, Tag } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_STR, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import DebounceSelect from '@/components/DebounceSelect';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import styles from './index.less';

const { Option } = Select;

const Filter = (props) => {
  const { dispatch, jobTitleList, onApply = () => {} } = props;

  const [form] = Form.useForm();

  const onEmployeeSearch = (val) => {
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'globalData/fetchEmployeeListEffect',
      payload: {
        name: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfoInfo?.legalName,
        value: user._id,
      }));
    });
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

  const tagRender = (prop) => {
    const { label, closable, onClose } = prop;

    return (
      <Tag
        className={styles.tags}
        closable={closable}
        onClose={onClose}
        closeIcon={<img alt="close-tag" src={CloseTagIcon} />}
      >
        {label}
      </Tag>
    );
  };

  const onValuesChange = (changedValues, allValues) => {
    const { fromDate, toDate, fromYearOfExp, toYearOfExp, hrEmployee, hiringManager, title } =
      allValues;
    const payload = {
      fromDate: fromDate && moment(fromDate).format(DATE_FORMAT_YMD),
      toDate: toDate && moment(toDate).format(DATE_FORMAT_YMD),
      fromYearOfExp,
      toYearOfExp,
      hrEmployee,
      hiringManager,
      title,
      isSearch: true,
    };

    onApply(payload);
  };

  return (
    <div className={styles.FilterContent}>
      <Form layout="vertical" onValuesChange={onValuesChange} form={form} name="filter">
        <Form.Item label="By joining date" name="yearOfExp" style={{ marginBottom: '0' }}>
          <Form.Item name="fromDate" style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}>
            <DatePicker
              disabledDate={(currentDate) => disableFromDate(currentDate, 'toDate')}
              format={DATE_FORMAT_STR}
              placeholder="From Date"
            />
          </Form.Item>

          <Form.Item
            name="toDate"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '8px' }}
          >
            <DatePicker
              disabledDate={(currentDate) => disableToDate(currentDate, 'fromDate')}
              format={DATE_FORMAT_STR}
              placeholder="To Date"
            />
          </Form.Item>
        </Form.Item>

        <Form.Item key="title" label="By job title" name="title">
          <Select
            allowClear
            showArrow
            showSearch
            filterOption={(input, option) => {
              const arrChild = option.props.children[1];
              return arrChild.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
            mode="multiple"
            tagRender={tagRender}
            placeholder="Select title"
            dropdownClassName={styles.dropdown}
          >
            {jobTitleList.map((option) => {
              return (
                <Option key={option._id} value={option._id}>
                  {option.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item key="hiringManager" label="By hiring manager" name="hiringManager">
          <DebounceSelect
            allowClear
            showArrow
            placeholder="Select an employee"
            fetchOptions={onEmployeeSearch}
            showSearch
            mode="multiple"
          />
        </Form.Item>
        <Form.Item key="hrEmployee" label="By HR POC" name="hrEmployee">
          <DebounceSelect
            allowClear
            showArrow
            placeholder="Select an employee"
            fetchOptions={onEmployeeSearch}
            showSearch
            mode="multiple"
          />
        </Form.Item>
        <Form.Item label="By yrs of experience" name="yearOfExp" style={{ marginBottom: '0' }}>
          <Form.Item
            name="fromYearOfExp"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} placeholder="From" />
          </Form.Item>
          <Form.Item
            name="toYearOfExp"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '8px' }}
          >
            <InputNumber min={0} placeholder="To" />
          </Form.Item>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(
  ({
    onboarding: { hrList = [], hrManagerList = [], jobTitleList = [], filterJoining = {} } = {},
  }) => ({
    hrList,
    hrManagerList,
    jobTitleList,
    filterJoining,
  }),
)(Filter);
