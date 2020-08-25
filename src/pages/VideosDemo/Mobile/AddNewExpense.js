import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class AddNewExpense extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how an employee can add a new expense in the Expenso Mobile Application."
        src="https://drive.google.com/file/d/14bfu6h8IrY4of6P7SnsGwWx-R_SVMwr8/preview"
      />
    );
  }
}

export default AddNewExpense;
