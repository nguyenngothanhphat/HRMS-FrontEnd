import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class AddNewMileage extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how an employee can add a new mileage expense in the Expenso Mobile Application."
        src="https://drive.google.com/file/d/1DgzYkV7bKGnH9CZ9xHJ5g_XZjpqGDyyI/preview"
      />
    );
  }
}

export default AddNewMileage;
