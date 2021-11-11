import React, { useState } from 'react';
import { Card, Button, Row, Col, Form, Input, DatePicker } from 'antd';
import { connect } from 'umi';
import EditIcon from '@/assets/projectManagement/edit.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import styles from './index.less';

const Summary = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const renderOption = () => {
    if (isEditing) return null;
    return (
      <Button
        onClick={() => setIsEditing(true)}
        icon={<img src={EditIcon} alt="" />}
        className={styles.editButton}
      >
        Edit
      </Button>
    );
  };

  const _renderEditMode = () => {
    return (
      <div className={styles.editMode}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          name="myForm"
          // onFinish={this.onSubmit}
          initialValues={{}}
          className={styles.form}
        >
          <Form.Item label="Start Date:" name="startDate">
            <DatePicker
              suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
            />
          </Form.Item>

          <Form.Item label="End Date:" name="endDate">
            <DatePicker
              suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
            />
          </Form.Item>

          <Form.Item label="Project Description:" name="projectDescription">
            <Input.TextArea autoSize={{ minRows: 4 }} />
          </Form.Item>
        </Form>
        <div className={styles.btnForm}>
          <Button className={styles.btnClose} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button className={styles.btnApply} form="myForm" htmlType="submit" key="submit">
            Update
          </Button>
        </div>
      </div>
    );
  };

  const _renderViewMode = () => {
    const items = [
      {
        name: 'Start Date',
        value: '3rd July 2021',
      },
      {
        name: 'End Date',
        value: '10th September 2021',
      },
      {
        name: 'Project Description',
        value:
          'The client want’s a complete redesign of their website which needs to be a proper research driven process. Also, we would be handling the front and backend along.',
      },
    ];
    return (
      <div className={styles.viewMode}>
        <Row>
          {items.map((val) => {
            return (
              <>
                <Col span={8}>
                  <p className={styles.label}>{val.name}</p>
                </Col>
                <Col span={16}>
                  <p className={styles.value}>{val.value}</p>
                </Col>
              </>
            );
          })}
        </Row>
      </div>
    );
  };

  return (
    <div className={styles.Summary}>
      <Card title="Overview" extra={renderOption()}>
        {isEditing ? _renderEditMode() : _renderViewMode()}
      </Card>
    </div>
  );
};
export default connect(() => ({}))(Summary);
