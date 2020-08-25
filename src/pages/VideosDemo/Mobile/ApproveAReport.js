import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class ApproveAReport extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how a manager can review and approve submitted reports from his team members."
        src="https://drive.google.com/file/d/1A8j7Hu9_TUjKo20oy9_FTtB3h5V5rCGP/preview"
      />
    );
  }
}

export default ApproveAReport;
