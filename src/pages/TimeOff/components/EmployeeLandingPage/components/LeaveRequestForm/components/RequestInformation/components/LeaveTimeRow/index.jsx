import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  TIMEOFF_INPUT_TYPE,
  TIMEOFF_INPUT_TYPE_BY_LOCATION,
  TIMEOFF_DATE_FORMAT,
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
    name = 'leaveTime',
    needValidate,
    findInvalidHalfOfDay = () => {},
    currentLocationID = '',
  } = props;

  const [disableMorning, setDisableMorning] = useState(false);
  const [disableAfternoon, setDisableAfternoon] = useState(false);

  useEffect(() => {
    if (findInvalidHalfOfDay(eachDate).includes(MORNING)) {
      setDisableMorning(true);
    }
    if (findInvalidHalfOfDay(eachDate).includes(AFTERNOON)) {
      setDisableAfternoon(true);
    }
  }, [eachDate]);

  const renderInput = () => {
    switch (TIMEOFF_INPUT_TYPE_BY_LOCATION[currentLocationID]) {
      case TIMEOFF_INPUT_TYPE.HOUR:
        return <InputNumber min={2} max={8} defaultValue={8} />;

      case TIMEOFF_INPUT_TYPE.WHOLE_DAY:
        return (
          <Select>
            <Option value={WHOLE_DAY} disabled={disableAfternoon || disableMorning}>
              <span style={{ fontSize: 13 }}>Whole day</span>
            </Option>
          </Select>
        );

      default:
        return (
          <Select>
            <Option value={WHOLE_DAY} disabled={disableAfternoon || disableMorning}>
              <span style={{ fontSize: 13 }}>Whole day</span>
            </Option>
            <Option value={MORNING} disabled={disableMorning}>
              <span style={{ fontSize: 13 }}>Morning</span>
            </Option>
            <Option value={AFTERNOON} disabled={disableAfternoon}>
              <span style={{ fontSize: 13 }}>Afternoon</span>
            </Option>
          </Select>
        );
    }
  };

  if (TIMEOFF_INPUT_TYPE_BY_LOCATION[currentLocationID] === TIMEOFF_INPUT_TYPE.HOUR) {
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
            <Col span={4}>{moment(eachDate).locale('en').format(TIMEOFF_DATE_FORMAT)}</Col>
            <Col span={5}>{moment(eachDate).locale('en').format('dddd')}</Col>
            <Col span={5}>
              <Form.Item
                // name={[index]}
                name={[index, 'startTime']}
                rules={[
                  {
                    required: needValidate,
                    message: 'Please select!',
                  },
                ]}
              >
                <CustomTimePicker placeholder="Start" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                // name={[index]}
                name={[index, 'endTime']}
                rules={[
                  {
                    required: needValidate,
                    message: 'Please select!',
                  },
                ]}
              >
                <CustomTimePicker placeholder="End" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                // name={[index]}
                name={[index, 'hour']}
                rules={[
                  {
                    required: needValidate,
                    message: 'Please select!',
                  },
                ]}
              >
                {/* <InputNumber min={2} max={8} defaultValue={8} /> */}
                <Input disabled placeholder="Hour" />
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
          <Col span={7}>{moment(eachDate).locale('en').format(TIMEOFF_DATE_FORMAT)}</Col>
          <Col span={7}>{moment(eachDate).locale('en').format('dddd')}</Col>
          <Col span={10}>
            <Form.Item
              name={[index, 'period']}
              rules={[
                {
                  required: needValidate,
                  message: 'Please select!',
                },
              ]}
            >
              {renderInput()}
            </Form.Item>
          </Col>
        </Row>
      )}
    </>
  );
};

export default LeaveTimeRow;
