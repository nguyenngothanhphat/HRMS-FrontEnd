import React from 'react';
import CommonModal from '@/components/CommonModal';
import SetMeetingModalContent from './components/SetMeetingModalContent';

const SetMeetingModal = ({
  employee = {},
  partnerRole = 'Employee',
  title = '',
  onFinish = () => {},
  ...restProps
}) => {
  return (
    <CommonModal
      content={
        <SetMeetingModalContent employee={employee} partnerRole={partnerRole} onFinish={onFinish} />
      }
      title={title}
      width={500}
      firstText="Set"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    />
  );
};

export default SetMeetingModal;
