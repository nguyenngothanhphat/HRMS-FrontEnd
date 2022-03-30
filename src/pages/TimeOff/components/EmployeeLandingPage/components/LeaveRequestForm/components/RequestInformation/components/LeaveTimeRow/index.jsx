import { Col, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ClockIcon from '@/assets/timeSheet/clock.svg';
import {
  MINUTE_STEP,
  TIMEOFF_COL_SPAN_1,
  TIMEOFF_COL_SPAN_2,
  TIMEOFF_DATE_FORMAT,
  TIMEOFF_MAX_LEAVE_HOUR,
  TIMEOFF_MIN_LEAVE_HOUR,
  TIMEOFF_PERIOD,
} from '@/utils/timeOff';
import CustomTimePicker from '@/components/CustomTimePicker';
import styles from './index.less';

const { Option } = Select;
const { WHOLE_DAY, AFTERNOON, MORNING } = TIMEOFF_PERIOD;

const LeaveTimeRow = (props) => {
  const {
    eachDate = '',
    index = 0,
    needValidate,
    findInvalidHalfOfDay = () => {},
    BY_HOUR = false,
    BY_WHOLE_DAY = false,
    form,
  } = props;

  const formValues = form.getFieldsValue();

  const [disableMorning, setDisableMorning] = useState(false);
  const [disableAfternoon, setDisableAfternoon] = useState(false);
  const [disabledHourAfter, setDisabledHourAfter] = useState([]); // for start time validation
  const [disabledHourBefore, setDisabledHourBefore] = useState([]); // for end time validation

  useEffect(() => {
    if (findInvalidHalfOfDay(eachDate).includes(MORNING)) {
      setDisableMorning(true);
    }
    if (findInvalidHalfOfDay(eachDate).includes(AFTERNOON)) {
      setDisableAfternoon(true);
    }
  }, [eachDate]);

  useEffect(() => {
    if (formValues.leaveTimeLists) {
      const currentValues = formValues.leaveTimeLists[index] || {};
      const { startTime: startTimeForm = '', endTime: endTimeForm = '' } = currentValues;
      setDisabledHourAfter(endTimeForm);
      setDisabledHourBefore(startTimeForm);
    }
  }, [JSON.stringify(form.getFieldsValue())]);

  if (BY_HOUR) {
    return (
      <>
        {moment(eachDate).weekday() !== 6 && moment(eachDate).weekday() !== 0 && (
          <Row
            className={styles.LeaveTimeRow}
            key={`${index + 1}`}
            justify="center"
            align="center"
            gutter={[8, 8]}
          >
            <Col span={TIMEOFF_COL_SPAN_2.DATE}>
              {moment(eachDate).locale('en').format(TIMEOFF_DATE_FORMAT)}
            </Col>
            <Col span={TIMEOFF_COL_SPAN_2.DAY}>{moment(eachDate).locale('en').format('dddd')}</Col>
            <Col span={TIMEOFF_COL_SPAN_2.START_TIME}>
              <Form.Item
                name={[index, 'startTime']}
                rules={[
                  {
                    required: needValidate,
                    message: 'Please select!',
                  },
                ]}
              >
                <CustomTimePicker
                  placeholder="Start"
                  disabledHourAfter={disabledHourAfter}
                  minimum={TIMEOFF_MIN_LEAVE_HOUR}
                  maximum={TIMEOFF_MAX_LEAVE_HOUR}
                  minuteStep={MINUTE_STEP}
                  suffixIcon={<img src={ClockIcon} alt="" />}
                  showSearch
                  allowClear
                  minDisabledTooltip="Minimum timeoff needs to be 2 hours"
                  maxDisabledTooltip="Maximum timeoff can only be 8 hours"
                />
              </Form.Item>
            </Col>
            <Col span={TIMEOFF_COL_SPAN_2.END_TIME}>
              <Form.Item
                name={[index, 'endTime']}
                rules={[
                  {
                    required: needValidate,
                    message: 'Please select!',
                  },
                ]}
              >
                <CustomTimePicker
                  placeholder="End"
                  disabledHourBefore={disabledHourBefore}
                  minimum={TIMEOFF_MIN_LEAVE_HOUR}
                  maximum={TIMEOFF_MAX_LEAVE_HOUR}
                  minuteStep={MINUTE_STEP}
                  suffixIcon={<img src={ClockIcon} alt="" />}
                  showSearch
                  allowClear
                  minDisabledTooltip="Minimum timeoff needs to be 2 hours"
                  maxDisabledTooltip="Maximum timeoff can only be 8 hours"
                />
              </Form.Item>
            </Col>
            <Col span={TIMEOFF_COL_SPAN_2.HOUR}>
              <Form.Item name={[index, 'hours']}>
                <Input disabled defaultValue={0} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </>
    );
  }
  return (
    <>
      {moment(eachDate).weekday() !== 6 && moment(eachDate).weekday() !== 0 && (
        <Row
          className={styles.LeaveTimeRow}
          key={`${index + 1}`}
          justify="center"
          align="center"
          gutter={[8, 8]}
        >
          <Col span={TIMEOFF_COL_SPAN_1.DATE}>
            {moment(eachDate).locale('en').format(TIMEOFF_DATE_FORMAT)}
          </Col>
          <Col span={TIMEOFF_COL_SPAN_1.DAY}>{moment(eachDate).locale('en').format('dddd')}</Col>
          <Col span={TIMEOFF_COL_SPAN_1.COUNT}>
            <Form.Item
              name={[index, 'period']}
              rules={[
                {
                  required: needValidate,
                  message: 'Please select!',
                },
              ]}
            >
              <Select>
                <Option value={WHOLE_DAY} disabled={disableAfternoon || disableMorning}>
                  <span style={{ fontSize: 13 }}>Whole day</span>
                </Option>

                {!BY_WHOLE_DAY && (
                  <>
                    <Option value={MORNING} disabled={disableMorning}>
                      <span style={{ fontSize: 13 }}>Morning</span>
                    </Option>
                    <Option value={AFTERNOON} disabled={disableAfternoon}>
                      <span style={{ fontSize: 13 }}>Afternoon</span>
                    </Option>
                  </>
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  );
};

export default LeaveTimeRow;
