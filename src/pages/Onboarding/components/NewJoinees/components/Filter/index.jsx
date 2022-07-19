import React, { useState } from 'react';
import { Button, Checkbox, DatePicker, Divider, Form, Select, Tag, InputNumber } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import CloseTagIcon from '@/assets/closeTagIcon.svg';
import CalendarIcon from '@/assets/calendar_icon.svg';
import styles from './index.less';

const { Option } = Select;

const Filter = (props) => {
  const { hrList, hrManagerList, jobTitleList, onApply = () => {} } = props;
  const dateFormat = 'MMM DD, YYYY';
  const [durationFrom, setDurationFrom] = useState(''); // validate date
  const [durationTo, setDurationTo] = useState(''); // validate date
  const [filter, setFilter] = useState({
    hiringManager: [],
    title: [],
    hrEmployee: [],
    fromDate: undefined,
    toDate: undefined,
    fromYearOfExp: undefined,
    toYearOfExp: undefined,
  });

  const [form] = Form.useForm();
  const clearFilter = () => {
    // press Clear button
    setFilter({
      hiringManager: [],
      title: [],
      hrEmployee: [],
      fromDate: undefined,
      toDate: undefined,
      fromYearOfExp: undefined,
      toYearOfExp: undefined,
    });
    setDurationFrom('');
    setDurationTo('');

    form.resetFields();
  };

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

  const checkBoxStatusChecked = (id, field) => {
    let check = false;

    if (isEmpty(filter[field])) return check;

    filter[field].forEach((itemId) => {
      if (itemId === id) {
        check = true;
      }
    });

    return check;
  };

  const onValuesChange = (value) => {
    setFilter({
      ...filter,
      ...value,
    });
  };

  const onFinish = (value) => {
    const { fromDate, toDate, fromYearOfExp, toYearOfExp, hrEmployee, hiringManager, title } =
      value;
    const payload = {
      fromDate: fromDate && moment(fromDate).format('YYYY-MM-DD'),
      toDate: toDate && moment(toDate).format('YYYY-MM-DD'),
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
    <div className={styles.filterForm}>
      <Form
        layout="horizontal"
        className={styles.form}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        form={form}
        name="formFilter"
      >
        <div className={styles.form__top}>
          <div className={styles.doj}>
            <div className={styles.doj__label}>
              <div className={styles.labelText}>Joining Date</div>
            </div>
            <div className={styles.doj__date}>
              <Form.Item name="fromDate">
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
              <div className={`${styles.labelText} ${styles.labelTo}`}>-</div>
              <Form.Item name="toDate">
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
            </div>
          </div>
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
                    <Checkbox
                      value={option._id}
                      checked={checkBoxStatusChecked(option._id, 'title')}
                    />
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
                const { _id, generalInfo: { legalName = '' } = '' } = option;
                return (
                  <Option key={option._id} value={option._id}>
                    <Checkbox
                      value={option._id}
                      checked={checkBoxStatusChecked(_id, 'hiringManager')}
                    />
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
                    <Checkbox
                      value={option._id}
                      checked={checkBoxStatusChecked(option._id, 'hrEmployee')}
                    />
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
        </div>

        <Divider className={styles.divider} />
        <div className={styles.footer}>
          <Button onClick={clearFilter} className={styles.footer__clear}>
            Clear
          </Button>
          <Button className={styles.footer__apply} htmlType="submit">
            Apply
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({
    onboard: { hrList = [], hrManagerList = [], jobTitleList = [], filterJoining = {} } = {},
  }) => ({
    hrList,
    hrManagerList,
    jobTitleList,
    filterJoining,
  }),
)(Filter);
