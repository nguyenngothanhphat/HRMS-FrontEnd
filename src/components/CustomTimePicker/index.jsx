import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import moment from 'moment';
import { hourFormat, WORKING_HOURS } from '@/utils/timeSheet';

const { Option } = Select;

const CustomTimePicker = (props) => {
  const {
    startHour = WORKING_HOURS.START,
    endHour = WORKING_HOURS.END,
    minuteStep = 15,
    disabledHourAfter = '', // for start time validation
    disabledHourBefore = '', // for end time validation
  } = props;
  const [list, setList] = useState([]);

  const generateMinuteStepList = () => {
    const stepList = [];
    for (let i = 0; i < 60; i += minuteStep) {
      stepList.push(i);
    }
    return stepList;
  };

  const generateList = () => {
    const hours = [];
    const stepList = generateMinuteStepList();

    for (let hour = startHour; hour < endHour; hour += 1) {
      stepList.map((x) => {
        return hours.push(
          moment({
            hour,
            minute: x,
          }).format(hourFormat),
        );
      });
    }
    setList(hours);
  };

  useEffect(() => {
    generateList();
  }, []);

  const getDisabled = (hour) => {
    const hourTemp = moment(hour, hourFormat);
    if (disabledHourAfter) {
      const hourAfter = moment(disabledHourAfter, hourFormat);
      if (hourTemp.isSameOrAfter(hourAfter)) {
        return true;
      }
    }
    if (disabledHourBefore) {
      const hourBefore = moment(disabledHourBefore, hourFormat);
      if (hourTemp.isSameOrBefore(hourBefore)) {
        return true;
      }
    }
    return false;
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Select {...props}>
      {list.map((x) => {
        return (
          <Option value={x} disabled={getDisabled(x)}>
            {x}
          </Option>
        );
      })}
    </Select>
  );
};

export default CustomTimePicker;
