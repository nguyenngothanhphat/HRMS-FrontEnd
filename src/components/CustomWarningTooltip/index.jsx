import { Tooltip } from 'antd';
import React from 'react';
import IconWarning from '@/assets/timeSheet/ic_warning.svg';

const CustomWarningTooltip = ({ children, title = '', icon = IconWarning, placement = 'left' }) => {
  return (
    <Tooltip
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <img src={icon} alt="" />
          <span
            style={{
              display: 'inline-block',
              color: '#F98E2C',
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            {title}
          </span>
        </div>
      }
      placement={placement}
      color="#FFFAF2"
    >
      {children}
    </Tooltip>
  );
};
export default CustomWarningTooltip;
