import React, { useState, useEffect } from 'react';
import { Select, Tooltip } from 'antd';
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
    minimum = 0,
    maximum = 0,
    minDisabledTooltip = '',
    maxDisabledTooltip = '',
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
      let hourAfter = moment(disabledHourAfter, hourFormat);
      let hourBefore = '';

      if (minimum !== 0) {
        hourAfter = moment(disabledHourAfter, hourFormat).add(-minimum + minuteStep / 60, 'hours');
      }
      if (maximum !== 0) {
        hourBefore = moment(disabledHourAfter, hourFormat).add(-maximum - minuteStep / 60, 'hours');
      }
      if (hourTemp.isSameOrAfter(hourAfter)) {
        return {
          disabled: true,
          type: 'after',
        };
      }
      if (hourTemp.isSameOrBefore(hourBefore)) {
        return {
          disabled: true,
          type: 'before',
        };
      }
    }
    if (disabledHourBefore) {
      let hourBefore = moment(disabledHourBefore, hourFormat);
      let hourAfter = '';
      if (minimum !== 0) {
        hourBefore = moment(disabledHourBefore, hourFormat).add(minimum - minuteStep / 60, 'hours');
      }
      if (maximum !== 0) {
        hourAfter = moment(disabledHourBefore, hourFormat).add(maximum + minuteStep / 60, 'hours');
      }
      if (hourTemp.isSameOrBefore(hourBefore)) {
        return {
          disabled: true,
          type: 'before',
        };
      }
      if (hourTemp.isSameOrAfter(hourAfter)) {
        return {
          disabled: true,
          type: 'after',
        };
      }
    }

    return {
      disabled: false,
    };
  };

  const renderOption = (x) => {
    const isDisabledObj = getDisabled(x);
    if (!isDisabledObj.disabled) return <Option value={x}>{x}</Option>;

    if (isDisabledObj.disabled && isDisabledObj.type === 'before') {
      return (
        <Option value={x} disabled={isDisabledObj.disabled}>
          <Tooltip title={minDisabledTooltip}>{x}</Tooltip>
        </Option>
      );
    }
    if (isDisabledObj.disabled && isDisabledObj.type === 'after') {
      return (
        <Option value={x} disabled={isDisabledObj.disabled}>
          <Tooltip title={maxDisabledTooltip}>{x}</Tooltip>
        </Option>
      );
    }
    return (
      <Option value={x} disabled={isDisabledObj.disabled}>
        {x}
      </Option>
    );
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Select {...props}>
      {list.map((x) => {
        return renderOption(x);
      })}
    </Select>
  );
};

export default CustomTimePicker;
