import {
  Alert,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  // TimePicker,
} from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, hourFormat, hourFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import AddIcon from '@/assets/timeSheet/add.svg';
import RemoveIcon from '@/assets/timeSheet/recycleBin.svg';
import styles from './index.less';
import CustomTimePicker from '@/components/CustomTimePicker';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';
const TASKS = [];

const AddTaskModal = (props) => {
  const [form] = Form.useForm();
  const {
    visible = false,
    title = 'Add Task',
    onClose = () => {},
    date = '',
    projectName = '',
    mode = 'single',
    timeSheet: { projectList = [] } = {},
  } = props;

  const {
    dispatch,
    loadingAddTask = false,
    loadingFetchProject = false,
    user: { currentUser: { employee = {}, location = {} } = {} } = {},
  } = props;

  const { _id: employeeId = '' } = employee;

  const fetchProjectList = () => {
    dispatch({
      type: 'timeSheet/fetchProjectListEffect',
    });
  };

  useEffect(() => {
    if (visible) {
      fetchProjectList();
      if (date) {
        form.setFieldsValue({
          date: moment(date),
        });
      }
    }
  }, [visible]);

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

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
  const addMultipleActivityEffect = (submitDate, tasks) => {
    if (!employee?.managerInfo) {
      notification.error({ message: 'User does not have manager' });
      return {};
    }

    const data = tasks.map((item) => {
      const findPrj = projectList.find((x) => x.id === item.projectId);
      return {
        tenantId: getCurrentTenant(),
        taskName: item.taskName,
        startTime: moment(item.startTime, hourFormat).format(hourFormatAPI),
        endTime: moment(item.endTime, hourFormat).format(hourFormatAPI),
        date: moment(submitDate).locale('en').format(dateFormatAPI),
        clientLocation: item.clientLocation || false,
        project: {
          projectName: findPrj.projectName,
          projectId: item.projectId,
        },
        type: 'TASK',
        notes: item.notes,
        employeeId,
        companyId: getCurrentCompany(),
        location,
        nightShift: item.nightShift || false,
        employee: {
          _id: employee._id,
          department: employee.departmentInfo,
          generalInfo: employee.generalInfo,
          manager: {
            _id: employee.managerInfo._id,
            generalInfo: employee.managerInfo.generalInfo,
          },
        },
      };
    });

    return dispatch({
      type: 'timeSheet/addMultipleActivityEffect',
      payload: {
        employeeId,
        companyId: getCurrentCompany(),
        data,
      },
    });
  };

  const handleFinish = async (values) => {
    const { date: submitDate, tasks = [] } = values;
    const res = await addMultipleActivityEffect(submitDate, tasks);
    if (res.code === 200) {
      onClose();
      form.resetFields();
      refreshData();
    }
  };

  const renderFormList = () => {
    return (
      <Form.List name="tasks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey }) => (
              <>
                {key !== 0 && <div className={styles.divider} />}
                <Row gutter={[24, 0]} className={styles.belowPart}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Project*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select a project' }]}
                      name={[name, 'projectId']}
                      fieldKey={[fieldKey, 'projectId']}
                    >
                      <Select
                        showSearch
                        placeholder="Select a project"
                        loading={loadingFetchProject}
                        disabled={loadingFetchProject}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
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
                      rules={[
                        {
                          required: true,
                          message: TASKS.length !== 0 ? 'Select a task' : 'Enter task name',
                        },
                      ]}
                      name={[name, 'taskName']}
                      fieldKey={[fieldKey, 'taskName']}
                    >
                      {TASKS.length !== 0 ? (
                        <Select showSearch placeholder="Select a task">
                          {TASKS.map((val) => (
                            <Option value={val}>{val}</Option>
                          ))}
                        </Select>
                      ) : (
                        <Input placeholder="Enter task name" maxLength={150} />
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Start time*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select start time' }]}
                      name={[name, 'startTime']}
                      fieldKey={[fieldKey, 'startTime']}
                    >
                      <CustomTimePicker placeholder="Select start time" showSearch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="End time*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select end time' }]}
                      name={[name, 'endTime']}
                      fieldKey={[fieldKey, 'endTime']}
                    >
                      <CustomTimePicker placeholder="Select end time" showSearch />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label="Description*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Please enter Description' }]}
                      name={[name, 'notes']}
                      fieldKey={[fieldKey, 'notes']}
                    >
                      <Input.TextArea autoSize={{ minRows: 4 }} placeholder="Enter description" />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      name={[name, 'clientLocation']}
                      fieldKey={[fieldKey, 'clientLocation']}
                      valuePropName="checked"
                    >
                      <Checkbox>Client Location</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={12} className={styles.removeBtn}>
                    {fields.length > 1 && (
                      <div className={styles.btn} onClick={() => remove(name)}>
                        <img src={RemoveIcon} alt="" />
                        <span>Delete</span>
                      </div>
                    )}
                  </Col>
                </Row>
              </>
            ))}
            {mode === 'multiple' && (
              <div className={styles.addButton} onClick={() => add()}>
                <img src={AddIcon} alt="" />
                <span>Add another task</span>
              </div>
            )}
          </>
        )}
      </Form.List>
    );
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          name="basic"
          form={form}
          id="myForm"
          onFinish={handleFinish}
          initialValues={{
            tasks: [{ projectName: projectName || null }],
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
                <DatePicker format={dateFormat} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Alert
                message="Info"
                showIcon
                type="info"
                description="The same tasks will be updated for the selected date range"
                closable
              />
            </Col>
          </Row>
          {renderFormList()}
        </Form>
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.AddTaskModal} ${styles.noPadding}`}
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
              loading={loadingAddTask}
            >
              Submit
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

export default connect(({ loading, timeSheet, locationSelection, user }) => ({
  user,
  timeSheet,
  locationSelection,
  loadingAddTask: loading.effects['timeSheet/addMultipleActivityEffect'],
  loadingFetchProject: loading.effects['timeSheet/fetchProjectListEffect'],
}))(AddTaskModal);
