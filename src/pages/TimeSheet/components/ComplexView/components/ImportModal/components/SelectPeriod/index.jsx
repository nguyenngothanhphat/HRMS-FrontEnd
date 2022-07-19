import { Col, DatePicker, Form, Row } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { dateFormatImport } from '@/constants/timeSheet';
import styles from './index.less';

const { RangePicker } = DatePicker;

const SelectPeriod = (props) => {
  const [form] = Form.useForm();

  const { importingIds = [], handleFinish = () => {}, dates = '', setDates = () => {} } = props;

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

  const renderSelectedTask = () => {
    return (
      <div className={styles.container_selectedTask}>
        {importingIds.map((item) => {
          const { date = '', selectedIds = [] } = item;
          return (
            <Row gutter={[24, 24]} className={styles.selectedRow}>
              <Col span={6} className={styles.selected__Date}>
                <span> {moment(date).locale('en').format('dddd')}</span>
                <span> {moment(date).locale('en').format('DD MMM YYYY')}</span>
              </Col>
              <Col span={18}>
                {selectedIds.map((obj) => {
                  return (
                    <div className={styles.contentRight}>
                      <div className={styles.contentRight__taskName}>
                        {obj?.projectName} - {obj?.taskName}
                      </div>
                      <div className={styles.contentRight__notes}>{obj?.notes}</div>
                    </div>
                  );
                })}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.SelectPeriod}>
      <Form name="basic" form={form} id="myForm" onFinish={(value) => handleFinish(value)}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={10}>Select Timesheet Period</Col>
          <Col span={14}>
            <Form.Item
              rules={[
                { required: true, message: 'Please select Timesheet Period' },
                () => ({
                  // eslint-disable-next-line no-unused-vars
                  validator(_) {
                    if (Array.isArray(dates) && (dates[0] === null || dates[1] === null)) {
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject('Please select Timesheet Period ');
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
