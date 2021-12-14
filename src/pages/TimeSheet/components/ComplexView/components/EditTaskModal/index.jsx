import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
} from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, hourFormat, hourFormatAPI, TASKS } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';

const EditTaskModal = (props) => {
  const formRef = React.createRef();
  const {
    visible = false,
    title = 'Edit Task',
    onClose = () => {},
    date = '',
    task: {
      id = '',
      projectId = '',
      notes = '',
      startTime = '',
      endTime = '',
      taskName = '',
      clientLocation = false,
    } = {},
    timeSheet: { projectList = [] } = {},
  } = props;

  const {
    dispatch,
    loadingUpdateTask = false,
    employee: { _id: employeeId = '' } = {} || {},
    employee = {},
  } = props;

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const fetchProjectList = () => {
    dispatch({
      type: 'timeSheet/fetchProjectListEffect',
    });
  };

  useEffect(() => {
    if (visible) {
      fetchProjectList();
    }
  }, [visible]);

  const handleCancel = () => {
    onClose();
  };

  const refreshData = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };

  // main function
  const updateActivityEffect = (values) => {
    const findPrj = projectList.find((x) => x.id === values.projectId);
    const payload = {
      ...values,
      id,
      startTime: moment(values.startTime).format(hourFormatAPI),
      endTime: moment(values.endTime).format(hourFormatAPI),
      employeeId,
      type: 'TASK',
      project: {
        projectName: findPrj.projectName,
        projectId: values.projectId,
      },
      employee: {
        _id: employee._id,
        department: employee.departmentInfo,
        generalInfo: employee.generalInfo,
        manager: {
          _id: employee.managerInfo._id,
          generalInfo: employee.managerInfo.generalInfo,
        },
      },
      date: moment(date).format(dateFormatAPI),
      companyId: getCurrentCompany(),
    };

    return dispatch({
      type: 'timeSheet/updateActivityEffect',
      payload,
    });
  };

  const handleFinish = async (values) => {
    const res = await updateActivityEffect(values);
    if (res.code === 200) {
      onClose();
      refreshData();
    }
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          name="basic"
          ref={formRef}
          id="myForm"
          onFinish={handleFinish}
          initialValues={{
            date: date ? moment(date) : '',
            taskName,
            projectId,
            startTime: startTime ? moment(startTime, hourFormatAPI) : '',
            endTime: endTime ? moment(endTime, hourFormatAPI) : '',
            notes,
            clientLocation,
          }}
        >
          <Row gutter={[24, 0]} className={styles.abovePart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select Timesheet Period' }]}
                label="Select Timesheet Period"
                name="date"
                fieldKey="date"
                labelCol={{ span: 24 }}
              >
                <DatePicker format={dateFormat} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} />
          </Row>
          <Row gutter={[24, 0]} className={styles.belowPart}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Project*"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select a project' }]}
                name="projectId"
              >
                <Select showSearch placeholder="Select a project">
                  {projectList.map((val) => (
                    <Option value={val.id}>{val.projectName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Task*"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select a task' }]}
                name="taskName"
              >
                <Select showSearch placeholder="Select a task">
                  {TASKS.map((val) => (
                    <Option value={val}>{val}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Start time*"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select start time' }]}
                name="startTime"
              >
                <TimePicker format={hourFormat} placeholder="Select start time" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="End time*"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select end time' }]}
                name="endTime"
              >
                <TimePicker format={hourFormat} placeholder="Select end time" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Description*"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please enter Description' }]}
                name="notes"
              >
                <Input.TextArea autoSize={{ minRows: 3 }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item labelCol={{ span: 24 }} name="clientLocation" valuePropName="checked">
                <Checkbox>Client Location</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.EditTaskModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={650}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              loading={loadingUpdateTask}
            >
              Update
            </Button>
          </>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(({ loading, timeSheet, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  timeSheet,
  loadingUpdateTask: loading.effects['timeSheet/updateActivityEffect'],
}))(EditTaskModal);
