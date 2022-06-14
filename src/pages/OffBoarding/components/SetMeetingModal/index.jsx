import React from 'react';
import CommonModal from '@/components/CommonModal';
import SetMeetingModalContent from './components/SetMeetingModalContent';

const SetMeetingModal = ({
  employee = {},
  partnerRole = 'Employee',
  visible = false,
  onClose = () => {},
  title = '',
}) => {
  return (
    <CommonModal
      visible={visible}
      onClose={onClose}
      content={<SetMeetingModalContent employee={employee} partnerRole={partnerRole} />}
      title={title}
      width={500}
      firstText="Set"
    />
  );
};

export default SetMeetingModal;
