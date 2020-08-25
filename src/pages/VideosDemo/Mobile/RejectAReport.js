import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class RejectAReport extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how a manager can reject a submitted report of his team member."
        src="https://drive.google.com/file/d/14TJdxg9t_gTMUwKsFt38hAI_s2Mp4SfS/preview"
      />
    );
  }
}

export default RejectAReport;
