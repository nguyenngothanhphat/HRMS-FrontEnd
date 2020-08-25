import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class AddNewExpense extends PureComponent {
  render() {
    return (
      <div>
        <div id="section1">
          <Demo
            text="The video demo shows step by step on how an employee can add a new expense in the Expenso Web Application."
            src="https://drive.google.com/file/d/1S2w3s5xGVWffTwChNpOHyZvgepZifvq7/preview"
          />
        </div>
        <div id="section2">
          <Demo
            text="The video demo shows step by step on how an employee can add a new expense in the Expenso Web Application."
            src="https://drive.google.com/file/d/1S2w3s5xGVWffTwChNpOHyZvgepZifvq7/preview"
          />
        </div>
      </div>
    );
  }
}

export default AddNewExpense;
