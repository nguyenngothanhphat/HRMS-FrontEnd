import { Col, Form, InputNumber, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { TIMEOFF_INPUT_TYPE, TIMEOFF_INPUT_TYPE_BY_LOCATION } from '@/utils/timeOff';
import styles from './index.less';

const { Option } = Select;

const LeaveTimeRow = (props) => {
  const {
    eachDate = '',
    index = 0,
    needValidate,
    findInvalidHalfOfDay = () => {},
    currentLocationID = '',
  } = props;

  const [disableMorning, setDisableMorning] = useState(false);
  const [disableAfternoon, setDisableAfternoon] = useState(false);

  useEffect(() => {
    if (findInvalidHalfOfDay(eachDate).includes('MORNING')) {
      setDisableMorning(true);
    }
    if (findInvalidHalfOfDay(eachDate).includes('AFTERNOON')) {
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
            <Option value="WHOLE-DAY" disabled={disableAfternoon || disableMorning}>
              <span style={{ fontSize: 13 }}>Whole day</span>
            </Option>
          </Select>
        );

      default:
        return (
          <Select>
            <Option value="WHOLE-DAY" disabled={disableAfternoon || disableMorning}>
              <span style={{ fontSize: 13 }}>Whole day</span>
            </Option>
            <Option value="MORNING" disabled={disableMorning}>
              <span style={{ fontSize: 13 }}>Morning</span>
            </Option>
            <Option value="AFTERNOON" disabled={disableAfternoon}>
              <span style={{ fontSize: 13 }}>Afternoon</span>
            </Option>
          </Select>
        );
    }
  };

  return (
    <>
      {moment.utc(eachDate).weekday() !== 6 && moment.utc(eachDate).weekday() !== 0 && (
        <Row className={styles.LeaveTimeRow} key={`${index + 1}`} justify="center" align="center">
          <Col span={7}>{moment.utc(eachDate).locale('en').format('MM/DD/YYYY')}</Col>
          <Col span={7}>{moment.utc(eachDate).locale('en').format('dddd')}</Col>
          <Col span={10}>
            <Form.Item
              name={[index]}
              fieldKey={[index]}
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
