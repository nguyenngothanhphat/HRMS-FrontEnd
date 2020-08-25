import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class CommentAReport extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how a manager can comment to ask for more information on submitted reports of his team members."
        src="https://drive.google.com/file/d/1dmiIrRUR6FdVp5gILkPXsJHgPLea8jw0/preview"
      />
    );
  }
}

export default CommentAReport;
