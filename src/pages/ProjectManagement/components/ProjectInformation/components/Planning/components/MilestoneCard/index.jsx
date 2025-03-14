import { Button, Card, DatePicker, Form, Input, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect } from 'umi';
import EditIcon from '@/assets/projectManagement/edit2.svg';
import RemoveIcon from '@/assets/projectManagement/recycleBin.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import { DATE_FORMAT_2 } from '@/constants/projectManagement';
import styles from './index.less';

const MilestoneCard = (props) => {
  const {
    data: { description = '', endDate = '', id = '', milestoneName = '', startDate = '' } = {},
    dispatch,
    projectId = '',
    loadingEditMilestone = false,
  } = props;

  const [isEditing, setIsEditing] = useState(false);

  // permissions
  const { allowModify = false } = props;

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

  const onRemove = () => {
    dispatch({
      type: 'projectDetails/removeMilestoneEffect',
      payload: {
        id,
        projectId,
      },
    });
  };

  // render UI
  const renderOption = () => {
    if (isEditing || !allowModify) return null;
    return (
      <div className={styles.options}>
        <img onClick={() => setIsEditing(true)} src={EditIcon} alt="" />
        <Popconfirm title="Sure to remove?" onConfirm={onRemove}>
          <img src={RemoveIcon} alt="" />
        </Popconfirm>
      </div>
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
          <Form.Item
            label="Start Date:"
            name="startDate"
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <DatePicker
              suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
            />
          </Form.Item>

          <Form.Item
            label="End Date:"
            name="endDate"
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <DatePicker
              suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
            />
          </Form.Item>

          <Form.Item
            label="Description:"
            name="description"
            rules={[{ required: true, message: 'Required field!' }]}
          >
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
