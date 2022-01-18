import { Form, Input } from 'antd';
import React from 'react';

const AnnouncementContent = () => {
  return (
    <>
      <Form.Item label="Description" name="description">
        <Input.TextArea
          placeholder="Enter the description"
          autoSize={{
            minRows: 3,
          }}
        />
      </Form.Item>
    </>
  );
};

export default AnnouncementContent;
