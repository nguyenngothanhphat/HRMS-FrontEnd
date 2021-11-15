import React, { useState } from 'react';
import { Card, Button, Row, Col, Form, Input, DatePicker } from 'antd';
import { connect } from 'umi';
import EditIcon from '@/assets/projectManagement/edit.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import CommonTable from '../CommonTable';
import CommonModal from '../CommonModal';
import EditEndDateContent from './components/EditEndDateContent';
import EditBillableHeadCountContent from './components/EditBillableHeadCountContent';
import styles from './index.less';

const Summary = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editEndDateModalVisible, setEditEndDateModalVisible] = useState(false);
  const [editBillableModalVisible, setEditBillableModalVisible] = useState(false);

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
              onClick={() => setEditEndDateModalVisible(true)}
              suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
              disabled
            />
          </Form.Item>

          <Form.Item label="Project Description:" name="projectDescription">
            <Input.TextArea autoSize={{ minRows: 4 }} />
          </Form.Item>

          <Form.Item
            onClick={() => setEditBillableModalVisible(true)}
            label="Billable Head Count:"
            name="billableHeadCount"
          >
            <Input disabled defaultValue="ABC" />
          </Form.Item>

          <Form.Item label="Buffer Head Count:" name="bufferHeadCount">
            <Input />
          </Form.Item>
          <Form.Item label="Estimation (Man Months):" name="estimation">
            <Input />
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
      {
        name: 'Billable Head Count',
        value: '04',
      },
      {
        name: 'Buffer Head Count',
        value: '01',
      },
      {
        name: 'Estimation (Man Months)',
        value: '1 Month',
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

  const getProjectHistoryColumns = () => {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
      },
      {
        title: 'Updated By',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
      },
    ];
    return columns;
  };

  return (
    <div className={styles.Summary}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Overview" extra={renderOption()}>
            {isEditing ? _renderEditMode() : _renderViewMode()}
          </Card>
          <CommonModal
            visible={editEndDateModalVisible}
            onClose={() => setEditEndDateModalVisible(false)}
            firstText="Save Changes"
            secondText="Cancel"
            title="Reason for Editing the End Date"
            content={<EditEndDateContent />}
            width={600}
          />
          <CommonModal
            visible={editBillableModalVisible}
            onClose={() => setEditBillableModalVisible(false)}
            firstText="Save Changes"
            secondText="Cancel"
            title="Reason for Editing Billable Head Count"
            content={<EditBillableHeadCountContent />}
            width={600}
          />
        </Col>
        <Col span={24}>
          <Card title="Project History">
            <div className={styles.tableContainer}>
              <CommonTable list={[]} columns={getProjectHistoryColumns()} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default connect(() => ({}))(Summary);
