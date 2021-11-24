import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Input, DatePicker } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import EditIcon from '@/assets/projectManagement/edit.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import CommonTable from '../CommonTable';
import CommonModal from '../CommonModal';
import EditEndDateContent from './components/EditEndDateContent';
import EditBillableHeadCountContent from './components/EditBillableHeadCountContent';
import EditBufferHeadCountContent from './components/EditBufferHeadCountContent';
import { DATE_FORMAT_2 } from '@/utils/projectManagement';
import styles from './index.less';

const Summary = (props) => {
  const [overviewForm] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [editEndDateModalVisible, setEditEndDateModalVisible] = useState(false);
  const [editBillableModalVisible, setEditBillableModalVisible] = useState(false);
  const [editBufferModalVisible, setEditBufferModalVisible] = useState(false);

  const [newEndDate, setNewEndDate] = useState({});
  const [newBufferHeadCount, setNewBufferHeadCount] = useState({});
  const [newBillableHeadCount, setNewBillableHeadCount] = useState({});

  const {
    projectDetails: {
      projectId = '',
      projectDetail: {
        startDate = '',
        tentativeEndDate: originEndDate = '',
        projectDescription = '',
        billableHeadCount: originBillableHeadCount = '',
        bufferHeadCount: originBufferHeadCount = '',
        estimation = '',
        newEndDate: newEndDateProp = '',
        newBillableHeadCount: newBillableHeadCountProp = '',
        newBufferHeadCount: newBufferHeadCountProp = '',
      } = {},
      projectHistoryList = [],
    } = {},
    dispatch,
    loadingUpdateProjectOverview = false,
    loadingFetchProjectHistory = false,
  } = props;

  // new data than old data
  const tentativeEndDate = newEndDateProp || originEndDate;
  const billableHeadCount = newBillableHeadCountProp || originBillableHeadCount;
  const bufferHeadCount = newBufferHeadCountProp || originBufferHeadCount;

  // FUNCTION
  const clearState = () => {
    setNewEndDate({});
    setNewBufferHeadCount({});
    setNewBillableHeadCount({});
  };

  const viewProfile = (id) => {
    const url = `/directory/employee-profile/${id}`;
    window.open(url, '_blank');
  };

  const fetchProjectHistory = () => {
    return dispatch({
      type: 'projectDetails/fetchProjectHistoryListEffect',
      payload: {
        projectId,
      },
    });
  };

  const onSubmitHardField = (payload, type) => {
    const { value = '' } = payload;

    if (type === 'endDate') {
      setNewEndDate(payload);
      overviewForm.setFieldsValue({
        tentativeEndDate: value ? moment(value) : null,
      });
    }
    if (type === 'buffer') {
      setNewBufferHeadCount(payload);
      overviewForm.setFieldsValue({
        bufferHeadCount: value,
      });
    }
    if (type === 'billable') {
      setNewBillableHeadCount(payload);
      overviewForm.setFieldsValue({
        billableHeadCount: value,
      });
    }

    // refresh project history list after editing
    fetchProjectHistory();
  };

  const addProjectHistory = (payload) => {
    return dispatch({
      type: 'projectDetails/addProjectHistoryEffect',
      payload,
    });
  };

  // USE EFFECT
  useEffect(() => {
    fetchProjectHistory();
  }, []);

  // ON FINISH
  const refreshData = () => {
    dispatch({
      type: 'projectDetails/fetchProjectByIdEffect',
      payload: {
        projectId,
      },
    });
  };

  const onFinish = async (values) => {
    let newPayload = {
      ...values,
      projectId,
      tentativeEndDate, // origin
      billableHeadCount, // origin
      bufferHeadCount, // origin
    };
    if (newEndDate.value) {
      newPayload = {
        ...newPayload,
        newEndDate: values.tentativeEndDate, // new end date
        reasonChangeEndDate: newEndDate.reason,
      };
    }
    if (newBillableHeadCount.value) {
      newPayload = {
        ...newPayload,
        newBillableHeadCount: values.billableHeadCount, // new value
        reasonChangeBillableHeadCount: newBillableHeadCount.reason,
      };
    }
    if (newBufferHeadCount.value) {
      newPayload = {
        ...newPayload,
        newBufferHeadCount: values.bufferHeadCount,
        reasonChangeBufferHeadCount: newBufferHeadCount.reason,
      };
    }
    const res = await dispatch({
      type: 'projectDetails/updateProjectOverviewEffect',
      payload: newPayload,
    });
    if (res.statusCode === 200) {
      refreshData();
      setIsEditing(false);
      clearState();
    }
  };

  // RENDER UI
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
          name="overviewForm"
          // onFinish={this.onSubmit}
          initialValues={{
            startDate: startDate ? moment(startDate) : null,
            tentativeEndDate: tentativeEndDate ? moment(tentativeEndDate) : null,
            projectDescription,
            billableHeadCount,
            bufferHeadCount,
            estimation,
          }}
          form={overviewForm}
          className={styles.form}
          onFinish={onFinish}
        >
          <Form.Item
            label="Start Date:"
            name="startDate"
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <DatePicker
              suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
              placeholder="Select Start Date"
            />
          </Form.Item>

          <Form.Item
            label="End Date:"
            name="tentativeEndDate"
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <DatePicker
              onClick={() => setEditEndDateModalVisible(true)}
              suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
              disabled
              placeholder="Select End Date"
            />
          </Form.Item>

          <Form.Item
            label="Project Description:"
            name="projectDescription"
            rules={[{ required: true, message: 'Required field!' }]}
          >
            <Input.TextArea autoSize={{ minRows: 5 }} />
          </Form.Item>

          <Form.Item
            onClick={() => setEditBillableModalVisible(true)}
            label="Billable Head Count:"
            name="billableHeadCount"
          >
            <Input disabled placeholder="Enter Billable Head Count" />
          </Form.Item>

          <Form.Item
            onClick={() => setEditBufferModalVisible(true)}
            label="Buffer Head Count:"
            name="bufferHeadCount"
          >
            <Input disabled placeholder="Enter Buffer Head Count" />
          </Form.Item>
          <Form.Item label="Estimation (Man Months):" name="estimation">
            <Input placeholder="Enter Estimation" />
          </Form.Item>
        </Form>
        <div className={styles.btnForm}>
          <Button className={styles.btnClose} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button
            className={styles.btnApply}
            form="overviewForm"
            htmlType="submit"
            key="submit"
            loading={loadingUpdateProjectOverview}
          >
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
        value: startDate ? moment(startDate).locale('en').format(DATE_FORMAT_2) : '-',
      },
      {
        name: 'End Date',
        value: tentativeEndDate ? moment(tentativeEndDate).locale('en').format(DATE_FORMAT_2) : '-',
      },
      {
        name: 'Project Description',
        value: projectDescription
          ? projectDescription.split('\n').map((e) => <span style={{ display: 'block' }}>{e}</span>)
          : '-',
      },
      {
        name: 'Billable Head Count',
        value: billableHeadCount || '-',
      },
      {
        name: 'Buffer Head Count',
        value: bufferHeadCount || '-',
      },
      {
        name: 'Estimation (Man Months)',
        value: estimation || '-',
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
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => {
          return (
            <span>
              {createdAt ? moment(createdAt).locale('en').format('MM-DD-YYYY HH:mm:ss') : '-'}
            </span>
          );
        },
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
        dataIndex: 'updatedByInfo',
        key: 'updatedByInfo',
        render: (updatedByInfo = {}) => {
          const { generalInfo: { legalName = '', userId = '' } = {} || {} } = updatedByInfo;
          return (
            <span className={styles.clickableTag} onClick={() => viewProfile(userId)}>
              {legalName}
            </span>
          );
        },
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
            content={
              <EditEndDateContent
                initialValue={originEndDate}
                newValues={newEndDate}
                onClose={() => setEditEndDateModalVisible(false)}
                onSubmit={onSubmitHardField}
                addProjectHistory={addProjectHistory}
                fetchProjectHistory={fetchProjectHistory}
                projectId={projectId}
              />
            }
            width={600}
          />
          <CommonModal
            visible={editBillableModalVisible}
            onClose={() => setEditBillableModalVisible(false)}
            firstText="Save Changes"
            secondText="Cancel"
            title="Reason for Editing Billable Head Count"
            content={
              <EditBillableHeadCountContent
                initialValue={originBillableHeadCount}
                newValues={newBillableHeadCount}
                onClose={() => setEditBillableModalVisible(false)}
                onSubmit={onSubmitHardField}
                addProjectHistory={addProjectHistory}
                fetchProjectHistory={fetchProjectHistory}
                projectId={projectId}
              />
            }
            width={600}
          />
          <CommonModal
            visible={editBufferModalVisible}
            onClose={() => setEditBufferModalVisible(false)}
            firstText="Save Changes"
            secondText="Cancel"
            title="Reason for Editing Buffer Head Count"
            content={
              <EditBufferHeadCountContent
                initialValue={originBufferHeadCount}
                newValues={newBufferHeadCount}
                onClose={() => setEditBufferModalVisible(false)}
                onSubmit={onSubmitHardField}
                addProjectHistory={addProjectHistory}
                fetchProjectHistory={fetchProjectHistory}
                projectId={projectId}
              />
            }
            width={600}
          />
        </Col>
        <Col span={24}>
          <Card title="Project History">
            <div className={styles.tableContainer}>
              <CommonTable
                list={projectHistoryList.reverse()}
                columns={getProjectHistoryColumns()}
                loading={loadingFetchProjectHistory}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ projectDetails, loading }) => ({
  projectDetails,
  loadingUpdateProjectOverview: loading.effects['projectDetails/updateProjectOverviewEffect'],
  loadingFetchProjectHistory: loading.effects['projectDetails/fetchProjectHistoryListEffect'],
}))(Summary);
