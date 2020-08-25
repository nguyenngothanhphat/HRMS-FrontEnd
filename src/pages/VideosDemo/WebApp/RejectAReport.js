import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class RejectAReport extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how a manager can reject a submitted report of his team member."
        src="https://drive.google.com/file/d/1dIYSNPThmk_r5vXvYkovxqJeO1bosGC0/preview"
      />
    );
  }
}

export default RejectAReport;
