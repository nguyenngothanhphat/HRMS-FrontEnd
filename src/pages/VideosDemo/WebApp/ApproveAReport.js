import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class ApproveAReport extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how a manager can review and approve submitted reports from his team members."
        src="https://drive.google.com/file/d/1uXMY5JXMP00-PcOiPn1QFvaI2VUakgV0/preview"
      />
    );
  }
}

export default ApproveAReport;
