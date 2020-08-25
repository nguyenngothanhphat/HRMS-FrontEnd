import React, { PureComponent } from 'react';
import Demo from '@/components/VideosDemo';

class DeleteUpdateExpense extends PureComponent {
  render() {
    return (
      <Demo
        text="The video demo shows step by step on how an employee can update/edit an expense’s data, and he can also delete an unused expense.
        "
        src="https://drive.google.com/file/d/1WQIycEMJUqSgNQn0HsoXR_MkT4Tvzv_g/preview"
      />
    );
  }
}

export default DeleteUpdateExpense;
