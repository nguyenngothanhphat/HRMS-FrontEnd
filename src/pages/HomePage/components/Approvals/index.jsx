import React from 'react';
import { history } from 'umi';
import ApprovalIcon from '@/assets/homePage/noteIcon.svg';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';

export default function Approvals() {
  return (
    <div style={{ width: '100%' }}>
      <CustomPrimaryButton
        icon={<img src={ApprovalIcon} alt="approval-icon" />}
        onClick={() => history.push('/dashboard/approvals')}
        width="100%"
      >
        Approval Page
      </CustomPrimaryButton>
    </div>
  );
}
