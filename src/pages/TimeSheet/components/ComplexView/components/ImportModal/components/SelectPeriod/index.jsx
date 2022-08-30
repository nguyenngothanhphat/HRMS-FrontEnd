/* eslint-disable react/no-array-index-key */
import { Col, DatePicker, Form, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatImport } from '@/constants/timeSheet';
import styles from './index.less';
import CustomTimePicker from '@/components/CustomTimePicker';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';

const { RangePicker } = DatePicker;

const TIME_FORMAT = 'hh:mm a';

const convertData = (array = []) => {
  const data = [];
  array.forEach((item) => {
    item.selectedIds.forEach((child) => data.push(child));
  });

  return data;
};

const checkTimeBetween = (time, startTime, endTime) => {
  return moment(time, TIME_FORMAT).isBetween(
    moment(startTime, TIME_FORMAT),
    moment(endTime, TIME_FORMAT),
    null,
    '()',
  );
};

const checkTimeSame = (time1, time2) => {
  return moment(time1, TIME_FORMAT).isSame(moment(time2, TIME_FORMAT));
};

const dataWithOverlap = (data = []) => {
  // Create new array with isOverlap
  const result = data.map((item, index) => {
    const { startTime = '', endTime = '' } = item;
    // Check overlap time and break
    const isOverlap = data.some((child, idx) => {
      const { startTime: startCheck = '', endTime: endCheck = '' } = child;
      if (index !== idx) {
        const check =
          checkTimeBetween(startTime, startCheck, endCheck) ||
          checkTimeBetween(endTime, startCheck, endCheck) ||
          checkTimeBetween(startCheck, startTime, endTime) ||
          checkTimeBetween(endCheck, startTime, endTime) ||
          (checkTimeSame(startTime, startCheck) && checkTimeSame(endTime, endCheck));
        return check;
      }
      return false;
    });
    return { ...item, isOverlap };
  });
  return result;
};

const overlapError = (data = []) => {
  const overlap = data.some((item) => item?.isOverlap);
  if (overlap) return '*You can not import the tasks that have the same time slot';
  return '';
};

const formatTime = (time) => moment(time, TIME_FORMAT).format(TIME_FORMAT);

const SelectPeriod = (props) => {
  const [form] = Form.useForm();
  const {
    importingIds = [],
    handleFinish = () => {},
    dates = '',
    setDates = () => {},
    setValid = () => {},
  } = props;

  const [data, setData] = useState([]);

  const handleChangeTime = (id, time, name) => {
    const itemIndex = data.findIndex((item) => item.id === id);
    if (itemIndex > -1) {
      const newData = [...data];
      newData[itemIndex][name] = time;
      setData(dataWithOverlap(newData));
    }
  };

  useEffect(() => {
    const dataFormat = convertData(importingIds);
    setData(dataWithOverlap(dataFormat));
  }, [importingIds]);

  useEffect(() => {
    if (overlapError(data)) setValid(false);
    else setValid(true);
  }, [overlapError, data]);

  useEffect(() => {
    if (dates) {
      form.setFieldsValue({
        dates,
      });
    }
  }, [dates]);

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const values = form.getFieldsValue();
    const { tasks = [] } = values;

    let tooLate = '';
    let tooEarly = '';
    // if tasks length > 1, only allow to select from date === to date
    if (tasks.length > 1) {
      tooLate = dates[0] && current.diff(dates[0], 'days') > 0;
      tooEarly = dates[1] && dates[1].diff(current, 'days') > 0;
    } else {
      tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
      tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;
    }

    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      form.setFieldsValue({
        dates: [null, null],
      });
      setDates([null, null]);
    }
  };

  const handleRemove = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const renderSelectedTask = () => {
    return (
      <>
        <div className={styles.container_selectedTask}>
          {data.map((obj) => {
            const {
              projectName = '',
              taskName = '',
              notes = '',
              startTime = '',
              endTime = '',
              id = '',
              isOverlap = false,
            } = obj || {};
            return (
              <Row gutter={[24, 24]} className={styles.contentRight} key={id}>
                <Col span={12} className={styles.contentRight__taskContainer}>
                  <div className={styles.contentRight__taskName}>
                    {projectName} - {taskName}
                  </div>
                  <div className={styles.contentRight__notes}>{notes}</div>
                </Col>
                <Col span={12} className={styles.selected__Date}>
                  <Form.Item
                    initialValue={formatTime(startTime)}
                    name={'startTime'.concat(id)}
                    rules={[{ required: true }, {}]}
                  >
                    <CustomTimePicker
                      placeholder="Select time"
                      showSearch
                      onChange={(val) => handleChangeTime(id, val, 'startTime')}
                      className={isOverlap ? styles.overlap : styles.timePicker}
                      disabledHourAfter={moment(endTime, TIME_FORMAT)}
                    />
                  </Form.Item>
                  <span style={{ marginLeft: 10, marginRight: 10 }}>to</span>
                  <Form.Item
                    initialValue={formatTime(endTime)}
                    name={'endTime'.concat(id)}
                    rules={[{ required: true }]}
                  >
                    <CustomTimePicker
                      placeholder="Select time"
                      showSearch
                      onChange={(val) => handleChangeTime(id, val, 'endTime')}
                      className={isOverlap ? styles.overlap : styles.timePicker}
                      disabledHourBefore={moment(startTime, TIME_FORMAT)}
                    />
                  </Form.Item>
                  <img
                    onClick={() => handleRemove(id)}
                    src={RemoveIcon}
                    alt=""
                    style={{ marginLeft: 10, cursor: 'pointer' }}
                  />
                </Col>
              </Row>
            );
          })}
        </div>
        <span className={styles.overlapError}>{overlapError(data)}</span>
      </>
    );
  };

  return (
    <div className={styles.SelectPeriod}>
      <Form name="basic" form={form} id="myForm" onFinish={(values) => handleFinish(values, data)}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={10}>Select Duration Day</Col>
          <Col span={14}>
            <Form.Item
              rules={[
                { required: true, message: 'Please Select Duration Day' },
                () => ({
                  // eslint-disable-next-line no-unused-vars
                  validator(_) {
                    if (Array.isArray(dates) && (dates[0] === null || dates[1] === null)) {
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject('Please Select Duration Day ');
                    }
                    // eslint-disable-next-line compat/compat
                    return Promise.resolve();
                  },
                }),
              ]}
              name="dates"
            >
              <RangePicker
                format={dateFormatImport}
                ranges={{
                  Today: [moment(), moment()],
                  'This Week': [moment().startOf('week'), moment().endOf('week')],
                }}
                disabledDate={disabledDate}
                onCalendarChange={(val) => setDates(val)}
                onOpenChange={onOpenChange}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className={styles.selectedTask}>
          <Col span={24}> Selected Tasks</Col>
          <Col span={24}>{renderSelectedTask()}</Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ timeSheet: { importingIds = [] } = {} }) => ({
  importingIds,
}))(SelectPeriod);
