import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class AddNewReport extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how an employee can create an expense report that includes a list of expenses, and he can submit the report for the direct manager’s review in the Expenso Mobile Application."
        src="https://drive.google.com/file/d/1DUNIHOJC_IuWunJWfujAD7SeMumkKLHx/preview"
      />
    );
  }
}

export default AddNewReport;
