import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class AddNewMileage extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how an employee can add a new mileage expense in the Expenso Web Application.
        "
        src="https://drive.google.com/file/d/10MUwLJpcXtqLo0PiAveXW95Hda5muuSb/preview"
      />
    );
  }
}

export default AddNewMileage;
