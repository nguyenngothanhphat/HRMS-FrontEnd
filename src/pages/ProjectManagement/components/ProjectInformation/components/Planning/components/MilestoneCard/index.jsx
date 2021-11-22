import React, { useState } from 'react';
import { Card, Button, Row, Col, Form, Input, DatePicker } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import EditIcon from '@/assets/projectManagement/edit.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import styles from './index.less';
import { DATE_FORMAT_2 } from '@/utils/projectManagement';

const MilestoneCard = (props) => {
  const {
    data: { description = '', endDate = '', id = '', milestoneName = '', startDate = '' } = {},
    dispatch,
    projectId = '',
    loadingEditMilestone = false,
  } = props;

  const [isEditing, setIsEditing] = useState(false);

  // function
  const onFinish = async (values) => {
    const res = await dispatch({
      type: 'projectDetails/updateMilestoneEffect',
      payload: {
        ...values,
        milestoneId: id,
        projectId,
      },
    });
    if (res.statusCode === 200) {
      setIsEditing(false);
    }
  };

  // render UI
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
          name="milestoneForm"
          onFinish={onFinish}
          initialValues={{
            description,
            startDate: startDate ? moment(startDate) : null,
            endDate: endDate ? moment(endDate) : null,
          }}
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

          <Form.Item label="Description:" name="description">
            <Input.TextArea autoSize={{ minRows: 4 }} />
          </Form.Item>
        </Form>
        <div className={styles.btnForm}>
          <Button className={styles.btnClose} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button
            className={styles.btnApply}
            form="milestoneForm"
            htmlType="submit"
            key="submit"
            loading={loadingEditMilestone}
          >
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
            Start Date:{' '}
            <span className={styles.value}>
              {moment(startDate).locale('en').format(DATE_FORMAT_2)}
            </span>
          </span>
          <span className={styles.label}>
            End Date:{' '}
            <span className={styles.value}>
              {moment(endDate).locale('en').format(DATE_FORMAT_2)}
            </span>
          </span>
        </div>
        <div className={styles.description}>
          <span className={styles.label}>Description:</span>
          <br />
          <span className={styles.value}>
            {description
              ? description.split('\n').map((e) => <span style={{ display: 'block' }}>{e}</span>)
              : ''}
          </span>
          <br />
          <span className={styles.someNotes}>*Tentative End date</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.MilestoneCard}>
      <Card title={milestoneName} extra={renderOption()}>
        {isEditing ? _renderEditMode() : _renderViewMode()}
      </Card>
    </div>
  );
};
export default connect(({ loading }) => ({
  loadingEditMilestone: loading.effects['projectDetails/updateMilestoneEffect'],
}))(MilestoneCard);
