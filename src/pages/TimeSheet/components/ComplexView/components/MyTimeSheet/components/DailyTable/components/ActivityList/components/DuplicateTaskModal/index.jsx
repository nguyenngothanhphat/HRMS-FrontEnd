import { Button, Col, DatePicker, Form, Input, Modal, Row } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, dateFormatImport, hourFormat, hourFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import CustomTimePicker from '@/components/CustomTimePicker';
import styles from './index.less';

const { RangePicker } = DatePicker;

const DuplicateTaskModal = (props) => {
  const [form] = Form.useForm();

  const {
    visible = false,
    onClose = () => {},
    refreshTable = () => {},
    task: { projectName = '', taskName = '' } = {},
    label = 'Duplicate Task',
    id = '',
    dispatch,
  } = props;

  const { employee: { _id: employeeId = '' } = {}, loadingDuplicate = false } = props;

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

    const arr = datelist.map((item) => {
      return {
        day: moment(item).locale('en').format('dddd'),
        date: item,
        startTime: null,
        endTime: null,
      };
    });
    return arr;
  };

  useEffect(() => {
    if (dates) {
      form.setFieldsValue({
        datesTime: getDateLists(
          moment(dates[0], hourFormat).format(dateFormatAPI),
          moment(dates[1], hourFormat).format(dateFormatAPI),
        ),
      });
    }
  }, [dates]);

  // FUNCTION
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

  const onStartTimeChange = (index) => {
    const { datesTime = [] } = form.getFieldsValue();
    form.setFieldsValue({
      datesTime: datesTime.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            endTime: null,
          };
        }
        return x;
      }),
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    const { datesTime = [] } = allValues;
    const disabledHourBeforeTemp = datesTime.map((x = {}) => {
      // minimum 30 minutes per task
      const temp = moment(x.startTime, hourFormat).add(15, 'minutes');
      return temp.format(hourFormat);
    });
    setDisabledHourBefore(disabledHourBeforeTemp);
  };

  const handleFinish = (value) => {
    const { datesTime = [] } = value;
    const arr = datesTime.map((x) => {
      return {
        startTime: moment(x?.startTime, hourFormat).format(hourFormatAPI),
        endTime: moment(x?.endTime, hourFormat).format(hourFormatAPI),
        date: moment(x?.date, dateFormatImport).format(dateFormatAPI),
      };
    });

    dispatch({
      type: 'timeSheet/duplicateTimesheet',
      payload: {
        dateTimes: arr,
        id,
        employeeId,
        companyId: getCurrentCompany(),
      },
    }).then((res) => {
      const { code = '' } = res;
      if (code === 200) {
        onClose();
        refreshTable();
      }
    });
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

  const renderFormList = () => {
    return (
      <Form.List name="datesTime">
        {(fields) => (
          <>
            {fields.map(({ key, name, fieldKey }, index) => (
              <>
                {key !== 0 && <div className={styles.divider} />}
                <Row gutter={[10, 10]} className={styles.selectDetail} align="center">
                  <Col span={6}>
                    <div>
                      <Form.Item
                        name={[name, 'day']}
                        fieldKey={[fieldKey, 'day']}
                        className={styles.dayInput}
                      >
                        <Input disabled />
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        name={[name, 'date']}
                        fieldKey={[fieldKey, 'date']}
                        className={styles.dateInput}
                      >
                        <Input disabled />
                      </Form.Item>
                    </div>
                  </Col>
                  <Col span={9}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select the start time' }]}
                      name={[name, 'startTime']}
                      fieldKey={[fieldKey, 'startTime']}
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
                      name={[name, 'endTime']}
                      fieldKey={[fieldKey, 'endTime']}
                    >
                      <CustomTimePicker
                        placeholder="Select the end time"
                        showSearch
                        disabledHourBefore={disabledHourBefore[index]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ))}
          </>
        )}
      </Form.List>
    );
  };

  const renderContent = () => {
    return (
      <Form
        name="basic"
        form={form}
        id="myForm"
        className={styles.formModal}
        onValuesChange={onValuesChange}
        onFinish={handleFinish}
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

        <div
          className={
            dates && Array.isArray(dates) && dates[0] !== null && dates[1] !== null
              ? styles.timeInput
              : ''
          }
        >
          {dates && Array.isArray(dates) && dates[0] !== null && dates[1] !== null
            ? renderFormList()
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
        <Button
          className={styles.btnSubmit}
          form="myForm"
          key="submit"
          type="primary"
          htmlType="submit"
          disabled={
            dates === null || (Array.isArray(dates) && (dates[0] === null || dates[1] === null))
          }
          loading={loadingDuplicate}
        >
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
        width={600}
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

export default connect(({ user: { currentUser: { employee = {} } = {} }, loading }) => ({
  employee,
  loadingDuplicate: loading.effects['timeSheet/duplicateTimesheet'],
}))(DuplicateTaskModal);
