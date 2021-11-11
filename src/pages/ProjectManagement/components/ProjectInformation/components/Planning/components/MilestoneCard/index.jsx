import React, { useState } from 'react';
import { Card, Button, Row, Col, Form, Input, DatePicker } from 'antd';
import { connect } from 'umi';
import EditIcon from '@/assets/projectManagement/edit.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import styles from './index.less';

const MilestoneCard = (props) => {
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
    return (
      <div className={styles.viewMode}>
        <div className={styles.dates}>
          <span className={styles.label}>
            Start Date: <span className={styles.value}>3rd July 2021</span>
          </span>
          <span className={styles.label}>
            End Date: <span className={styles.value}>10th September 2021</span>
          </span>
        </div>
        <div className={styles.description}>
          <span className={styles.label}>Description:</span>
          <br />
          <span className={styles.value}>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet
            minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
            consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
          </span>
          <br />
          <span className={styles.someNotes}>*Tentative End date </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.MilestoneCard}>
      <Card title="Overview" extra={renderOption()}>
        {isEditing ? _renderEditMode() : _renderViewMode()}
      </Card>
    </div>
  );
};
export default connect(() => ({}))(MilestoneCard);
