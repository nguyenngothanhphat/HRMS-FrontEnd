import {
  Alert,
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
import React from 'react';
import { connect } from 'umi';
import { dateFormatAPI, hourFormat, hourFormatAPI, TASKS } from '@/utils/timeSheet';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import AddIcon from '@/assets/timeSheet/add.svg';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';
const projects = ['Syscloud', 'HRMS', 'Udaan', 'Ramco'];

const AddTaskModal = (props) => {
  const formRef = React.createRef();
  const {
    visible = false,
    title = 'Add Task',
    onClose = () => {},
    date = '',
    projectName = '',
    mode = 'single',
  } = props;

  const {
    dispatch,
    loadingAddTask = false,
    employee: {
      _id: employeeId = '',
      generalInfo: {
        legalName: empName = '',
        workEmail: empWorkEmail = '',
        userId: empUserId = '',
      } = {} || {},
      departmentInfo: { name: empDepartmentName = '', _id: empDepartmentId = '' } = {} || {},
      managerInfo: {
        _id: managerId = '',
        generalInfo: {
          legalName: managerName = '',
          workEmail: managerWorkEmail = '',
          userId: managerUserId = '',
        } = {} || {},
        department: { name: managerDepartmentName = '', _id: managerDepartmentId = '' } = {} || {},
      } = {} || {},
    } = {} || {},
  } = props;

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
    const data = tasks.map((item) => {
      return {
        tenantId: getCurrentTenant(),
        taskName: item.taskName,
        startTime: moment(item.startTime).format(hourFormatAPI),
        endTime: moment(item.endTime).format(hourFormatAPI),
        date: moment(submitDate).locale('en').format(dateFormatAPI),
        clientLocation: item.clientLocation,
        projectName: item.projectName,
        notes: item.notes,
        employeeId,
        companyId: getCurrentCompany(),
        location: getCurrentLocation(),
        nightShift: item.nightShift,
        employee: {
          employeeName: empName,
          employeeCode: empUserId,
          workEmail: empWorkEmail,
          department: {
            name: empDepartmentName,
            id: empDepartmentId,
          },
        },
        managerInfo: {
          employeeName: managerName,
          employeeId: managerId,
          employeeCode: managerUserId,
          workEmail: managerWorkEmail,
          department: {
            name: managerDepartmentName,
            id: managerDepartmentId,
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
                      name={[name, 'projectName']}
                      fieldKey={[fieldKey, 'projectName']}
                    >
                      <Select showSearch placeholder="Select a project">
                        {projects.map((val) => (
                          <Option value={val}>{val}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Task*"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select a task' }]}
                      name={[name, 'taskName']}
                      fieldKey={[fieldKey, 'taskName']}
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
                      name={[name, 'startTime']}
                      fieldKey={[fieldKey, 'startTime']}
                    >
                      <TimePicker
                        minuteStep={30}
                        format={hourFormat}
                        placeholder="Select start time"
                      />
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
                      <TimePicker
                        minuteStep={30}
                        format={hourFormat}
                        placeholder="Select end time"
                      />
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
                      <Input.TextArea autoSize={{ minRows: 3 }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      labelCol={{ span: 24 }}
                      name={[name, 'clientLocation']}
                      fieldKey={[fieldKey, 'clientLocation']}
                      valuePropName="checked"
                    >
                      <Checkbox>Client Location</Checkbox>
                    </Form.Item>
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
          ref={formRef}
          id="myForm"
          onFinish={handleFinish}
          initialValues={{
            tasks: [{ projectName: projectName || null }],
            date: date ? moment(date) : '',
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

export default connect(({ loading, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  loadingAddTask: loading.effects['timeSheet/addMultipleActivityEffect'],
}))(AddTaskModal);
