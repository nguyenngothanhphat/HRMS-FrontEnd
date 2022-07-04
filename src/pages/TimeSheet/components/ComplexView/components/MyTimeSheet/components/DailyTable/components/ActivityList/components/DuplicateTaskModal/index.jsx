import { Button, Form, Modal, Row, DatePicker, Col } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { dateFormatAPI, dateFormatImport, hourFormat } from '@/utils/timeSheet';

import styles from './index.less';
import CustomTimePicker from '@/components/CustomTimePicker';

const { RangePicker } = DatePicker;

const DuplicateTaskModal = (props) => {
  const [form] = Form.useForm();

  const {
    visible = false,
    onClose = () => {},
    label = 'Duplicate Task',
    task: { projectName = '', taskName = '' } = {},
    // date = '',
  } = props;

  const [dates, setDates] = useState(null);
  const [disabledHourBefore, setDisabledHourBefore] = useState([]);

  const getDateLists = (startDate, endDate) => {
    let datelist = [];
    const endDateTemp = moment(endDate).clone();

    if (startDate && endDate) {
      const now = moment(startDate);
      while (now.isSameOrBefore(moment(endDateTemp), 'day')) {
        datelist = [...datelist, moment(now).format(dateFormatImport)];
        now.add(1, 'days');
      }
    }

    return datelist;
  };

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

  // FUNCTION
  const onStartTimeChange = (index) => {
    const value = form.getFieldsValue();
    console.log('~ value', value);

    // form.setFieldsValue({
    //   tasks: tasks.map((x, i) => {
    //     if (i === index) {
    //       return {
    //         ...x,
    //         endTime: null,
    //       };
    //     }
    //     return x;
    //   }),
    // });
  };

  const onValuesChange = (changedValues, allValues) => {
    const { tasks = [] } = allValues;
    const disabledHourBeforeTemp = tasks.map((x = {}) => {
      // minimum 30 minutes per task
      const temp = moment(x.startTime, hourFormat).add(15, 'minutes');
      return temp.format(hourFormat);
    });
    setDisabledHourBefore(disabledHourBeforeTemp);
  };
  // RENDER UI
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.header__label}>{label}</div>
        <div className={styles.header__title}>
          {projectName} - {taskName}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <Form
        name="tasks"
        form={form}
        id="myForm"
        className={styles.formModal}
        onValuesChange={onValuesChange}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            <Form.Item
              rules={[{ required: true, message: 'Please select Timesheet Period' }]}
              label="Select Timesheet Period"
              name="dates"
              fieldKey="dates"
              labelCol={{ span: 24 }}
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
                allowClear={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className={dates ? styles.timeInput : ''}>
          {dates
            ? getDateLists(
                moment(dates[0], hourFormat).format(dateFormatAPI),
                moment(dates[1], hourFormat).format(dateFormatAPI),
              ).map((item, index) => {
                return (
                  <Row gutter={[10, 10]} className={styles.selectDetail} align="center">
                    <Col span={6}>{item}</Col>
                    <Col span={9}>
                      <Form.Item
                        labelCol={{ span: 24 }}
                        rules={[{ required: true, message: 'Select the start time' }]}
                        name={`${'startTime'}${index}`}
                      >
                        <CustomTimePicker
                          placeholder="Select the start time"
                          showSearch
                          onChange={() => onStartTimeChange(index)}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item
                        labelCol={{ span: 24 }}
                        rules={[{ required: true, message: 'Select the end time' }]}
                        name="endTime"
                      >
                        <CustomTimePicker
                          placeholder="Select the end time"
                          showSearch
                          disabledHourBefore={disabledHourBefore[index]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              })
            : null}
        </div>
      </Form>
    );
  };

  const renderModalFooter = () => {
    return (
      <div className={styles.mainButtons}>
        <Button className={styles.btnCancel} onClick={() => onClose()}>
          Cancel
        </Button>
        <Button className={styles.btnSubmit} type="primary">
          Duplicate
        </Button>
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.DuplicateTaskModal} ${styles.noPadding}`}
        onCancel={() => onClose()}
        destroyOnClose
        width={700}
        footer={renderModalFooter()}
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderContent()}
      </Modal>
    </>
  );
};

export default DuplicateTaskModal;
