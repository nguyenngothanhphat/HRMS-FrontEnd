import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, InputNumber, Radio, Row, Spin, TimePicker } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { TIMEOFF_WORK_DAYS } from '@/utils/timeOff';
import { getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import WorkInProgress from '@/components/WorkInProgress';
import s from './index.less';

const WorkSchedule = (props) => {
  const [form] = Form.useForm();

  const {
    employeeSchedule = {},
    dispatch,
    idLocation,
    loadingFetch = false,
    loadingUpdate = false,
  } = props;
  const {
    endWorkDay: { end: endTimeProp, amPM: endAmPMProp } = {},
    startWorkDay: { start: startTimeProp, amPM: startAmPMProp } = {},
    workDay: workDayProp = [],
    totalHour: totalHourProp,
    _id = '',
  } = employeeSchedule;

  const [workDays, setWorkDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const generateWorkDays = () => {
    let formatArray = [...TIMEOFF_WORK_DAYS];

    workDayProp.forEach((workDayItem) => {
      formatArray = formatArray.map((x) => ({
        ...x,
        checked: x.text === workDayItem.date ? workDayItem.checked : x.checked,
      }));
    });

    setWorkDays(formatArray);
  };

  const setInitialValues = () => {
    form.setFieldsValue({
      startAmPM: startAmPMProp,
      endAmPM: endAmPMProp,
      totalHour: totalHourProp,
      startAt: moment(startTimeProp, 'HH:mm'),
      endAt: moment(endTimeProp, 'HH:mm'),
    });
  };

  const fetchData = () => {
    dispatch({
      type: 'timeOff/getEmployeeScheduleByLocation',
      payload: { location: getCurrentLocation(), tenantId: getCurrentTenant() },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setInitialValues();
    generateWorkDays();
  }, [JSON.stringify(workDayProp)]);

  const handleClick = (id) => {
    const result = workDays.map((item) => ({
      ...item,
      checked: item.id === id ? !item.checked : item.checked,
    }));
    setWorkDays(result);
  };

  const renderItem = (item = {}) => {
    return (
      <Button
        // className={s.padding}
        disabled={!isEditing || loadingUpdate}
        className={item.checked ? s.circleActive : s.circle}
        onClick={() => handleClick(item.id)}
      >
        {item.name}
      </Button>
    );
  };

  const selectStartTime = (timeString) => {
    setStartTime(timeString);
  };

  const selectEndTime = (timeString) => {
    setEndTime(timeString);
  };

  const onChangeEdit = () => {
    setIsEditing(true);
  };

  const onFinish = (values) => {
    const arrayActive = workDays.filter((item) => item.checked === true);
    const arrayFilter = arrayActive.map((item) => ({ checked: item.checked, date: item.text }));
    const { endAmPM, startAmPM, totalHour, endAt, startAt } = values;

    const payload = {
      startWorkDay: { start: startAt.format('HH:mm'), amPM: startAmPM },
      endWorkDay: { end: endAt.format('HH:mm'), amPM: endAmPM },
      totalHour,
      workDay: arrayFilter,
      _id,
      location: idLocation,
      tenantId: getCurrentTenant(),
    };

    setIsEditing(!isEditing);
    dispatch({
      type: 'timeOff/updateEmployeeSchedule',
      payload,
    }).then((res) => {
      if (res.statusCode === 200) {
        fetchData();
      }
    });
  };

  const renderIcons = () => (
    <div className={s.listIcons}>
      <UpOutlined className={s.itemIcon} />
      <DownOutlined className={s.itemIcon} />
    </div>
  );

  const renderEditBtn = () => {
    if (isEditing) return '';
    return (
      <div className={s.editIcon} onClick={onChangeEdit}>
        <img src="/assets/images/edit.svg" alt="edit" className={s.editImg} />
        <span className={s.editText}>Edit</span>
      </div>
    );
  };

  const handleCancel = () => {
    setIsEditing(!isEditing);

    const format = 'HH:mm';

    form.setFieldsValue({
      startAmPM: startAmPMProp,
      endAmPM: endAmPMProp,
      totalHour: totalHourProp,
      startAt: moment(startTimeProp, format),
      endAt: moment(endTimeProp, format),
    });

    dispatch({
      type: 'timeOff/save',
      payload: { employeeSchedule },
    });
    generateWorkDays();
  };

  const format = 'HH:mm';

  return (
    <div className={s.WorkSchedule}>
      <div style={{ marginBottom: 24 }}>
        <WorkInProgress />
      </div>
      <div className={s.header}>
        <div className={s.title}>Setup the standard company Holiday Calendar</div>
        <div className={s.description}>
          Below is a list of holidays celebrated in your region/country. Select the ones for which
          your company provides holidays. You may add holidays to the list as well.
        </div>
      </div>

      <Spin spinning={loadingFetch}>
        <Card title="Standard work schedule policy" className={s.formCard} extra={renderEditBtn()}>
          <Form form={form} name="myForm" onFinish={onFinish} className={s.form}>
            <div className={s.workHour}>Work hour</div>
            <div className={`${s.description} ${s.pb17}`}>
              For each day the employee takes off, the number of hours as per the standard work
              schedule will be deducted from the total leave balance.
            </div>
            <Row>
              <Col span={7} className={s.formInput}>
                <div>
                  <div className={s.content}>Total hours in a workday</div>
                  <Form.Item name="totalHour">
                    <InputNumber
                      min={0}
                      max={24}
                      disabled={!isEditing || loadingUpdate}
                      placeholder="hours/day"
                      formatter={(value) => `${value} hours/day`}
                      parser={(value) => value.replace('days', '')}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col span={8} className={s.formInput}>
                <div>
                  <div className={s.content}>Workday starts at</div>
                  <Row gutter={[16, 0]}>
                    <Col>
                      <Form.Item name="startAt">
                        <TimePicker
                          format={format}
                          onChange={selectStartTime}
                          value={moment(startTime, format)}
                          disabled={!isEditing || loadingUpdate}
                          suffixIcon={renderIcons()}
                          allowClear={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ padding: '2px' }} className={s.radioSection}>
                      <Form.Item name="startAmPM">
                        <Radio.Group
                          optionType="button"
                          buttonStyle="solid"
                          disabled={!isEditing || loadingUpdate}
                          className={s.radioGroup}
                        >
                          <Radio.Button value="AM">AM</Radio.Button>
                          <Radio.Button value="PM">PM</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={8} className={s.formInput}>
                <div>
                  <div className={s.content}>Workday ends at</div>
                  <Row gutter={[16, 0]}>
                    <Col>
                      <Form.Item name="endAt">
                        <TimePicker
                          format={format}
                          disabled={!isEditing || loadingUpdate}
                          onChange={selectEndTime}
                          value={moment(endTime, format)}
                          suffixIcon={renderIcons()}
                          allowClear={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ padding: '2px' }} className={s.radioSection}>
                      <Form.Item name="endAmPM">
                        <Radio.Group
                          optionType="button"
                          disabled={!isEditing || loadingUpdate}
                          buttonStyle="solid"
                          className={s.radioGroup}
                        >
                          <Radio.Button value="AM">AM</Radio.Button>
                          <Radio.Button value="PM">PM</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <div className={s.bottom}>
              <p className={s.workHour}>Work days</p>
              <p className={`${s.description} ${s.pb17}`}>
                Only for the days selected below, timeoff hours will be deducted from the total
                leave balance.
              </p>
              <div className={s.checkboxWrap}>{workDays.map((item) => renderItem(item))}</div>
            </div>
          </Form>
          {isEditing && (
            <div className={s.bottomBar}>
              <Button onClick={() => handleCancel()} className={s.cancelBtn}>
                Cancel
              </Button>
              <Button
                className={s.saveBtn}
                htmlType="submit"
                form="myForm"
                type="submit"
                loading={loadingUpdate}
              >
                Save
              </Button>
            </div>
          )}
        </Card>
      </Spin>
    </div>
  );
};

export default connect(
  ({
    loading,
    timeOff: { employeeSchedule = {} } = {},
    user: { currentUser: { location: { _id: idLocation = '' } = {} } = {} } = {},
  }) => ({
    idLocation,
    loadingFetch: loading.effects['timeOff/getEmployeeScheduleByLocation'],
    loadingUpdate: loading.effects['timeOff/updateEmployeeSchedule'],
    employeeSchedule,
  }),
)(WorkSchedule);
