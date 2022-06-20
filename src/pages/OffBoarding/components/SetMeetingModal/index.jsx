import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import CommonModal from '@/components/CommonModal';
import SetMeetingModalContent from './components/SetMeetingModalContent';

const SetMeetingModal = ({
  employee = {},
  partnerRole = 'Employee',
  title = '',
  onFinish = () => {},
  selectedDate = '',
  loadingSetMeeting = false,
  ...restProps
}) => {
  return (
    <CommonModal
      content={
        <SetMeetingModalContent
          employee={employee}
          partnerRole={partnerRole}
          onFinish={onFinish}
          selectedDate={selectedDate}
        />
      }
      title={title}
      width={500}
      loading={loadingSetMeeting}
      firstText="Set"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    />
  );
};

export default connect(({ offboarding, loading }) => ({
  offboarding,
  loadingSetMeeting: loading.effects['offboarding/updateRequestEffect'],
}))(SetMeetingModal);
