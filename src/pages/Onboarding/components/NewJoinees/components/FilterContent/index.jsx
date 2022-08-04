import { Col, DatePicker, Form, InputNumber, Row, Select, Tag } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_YMD } from '@/constants/dateFormat';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

const Filter = (props) => {
  const { hrList, hrManagerList, jobTitleList, onApply = () => {} } = props;
  const dateFormat = 'MMM DD, YYYY';
  const [durationFrom, setDurationFrom] = useState(''); // validate date
  const [durationTo, setDurationTo] = useState(''); // validate date

  const [form] = Form.useForm();

  const disabledDate = (currentDate, type) => {
    if (type === 'fromDate') {
      return (
        (currentDate && currentDate > moment(durationTo)) ||
        moment(currentDate).day() === 0 ||
        moment(currentDate).day() === 6
      );
    }

    return (
      (currentDate && currentDate < moment(durationFrom)) ||
      moment(currentDate).day() === 0 ||
      moment(currentDate).day() === 6
    );
  };

  const onChangeDate = (currentDate, type) => {
    switch (type) {
      case 'fromDate':
        if (currentDate === null) {
          setDurationFrom('');
        } else {
          setDurationFrom(currentDate);
        }
        break;

      case 'toDate':
        if (currentDate === null) {
          setDurationTo('');
        } else {
          setDurationTo(currentDate);
        }
        break;

      default:
        break;
    }
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
              disabledDate={(currentDate) => disabledDate(currentDate, 'fromDate')}
              format={dateFormat}
              placeholder="From Date"
              onChange={(value) => {
                onChangeDate(value, 'fromDate');
              }}
              suffixIcon={
                <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
              }
            />
          </Form.Item>

          <Form.Item
            name="toDate"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '8px' }}
          >
            <DatePicker
              disabledDate={(currentDate) => disabledDate(currentDate, 'toDate')}
              format={dateFormat}
              placeholder="To Date"
              onChange={(value) => {
                onChangeDate(value, 'toDate');
              }}
              suffixIcon={
                <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
              }
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
                  <span>{option.name}</span>
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item key="hiringManager" label="By hiring manager" name="hiringManager">
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
            placeholder="Select HR Manager"
            dropdownClassName={styles.dropdown}
          >
            {hrManagerList.map((option) => {
              const { generalInfo: { legalName = '' } = '' } = option;
              return (
                <Option key={option._id} value={option._id}>
                  <span>{legalName}</span>
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item key="hrEmployee" label="By HR POC" name="hrEmployee">
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
            placeholder="Select HR"
            dropdownClassName={styles.dropdown}
          >
            {hrList.map((option) => {
              const { _id, generalInfo: { legalName = '' } = '' } = option;
              return (
                <Option key={option._id} value={_id}>
                  <span>{legalName}</span>
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="By yrs of experience" name="yearOfExp" style={{ marginBottom: '0' }}>
          <Form.Item
            name="fromYearOfExp"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="toYearOfExp"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: '8px' }}
          >
            <InputNumber min={0} />
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
