import {
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
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { dateFormatAPI, hourFormat, hourFormatAPI } from '@/utils/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';
import CustomTimePicker from '@/components/CustomTimePicker';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';
const countryIdUS = 'US';

const TASKS = [];

const EditTaskModal = (props) => {
  const [form] = Form.useForm();

  const [disabledHourAfter, setDisabledHourAfter] = useState([]); // for start time validation
  const [disabledHourBefore, setDisabledHourBefore] = useState([]); // for end time validation

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
      breakTime = 0,
      overTime = 0,
    } = {},
    task = {},
    timeSheet: { projectList = [] } = {},
  } = props;

  const {
    dispatch,
    loadingUpdateTask = false,
    loadingFetchProject = false,
    currentUser: {
      employee: { _id: employeeId = '' } = {} || {},
      employee = {},
      location = {},
    } = {},
  } = props;
  const { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = location;
  const viewUS = countryID === countryIdUS;

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
      setDisabledHourAfter(endTime);
      setDisabledHourBefore(startTime);
    }
  }, [visible]);

  useEffect(() => {
    form.setFieldsValue({
      date: date ? moment(date) : '',
      taskName,
      projectId,
      startTime: startTime ? moment(startTime, hourFormatAPI).format(hourFormat) : '',
      endTime: endTime ? moment(endTime, hourFormatAPI).format(hourFormat) : '',
      notes,
      clientLocation,
      breakTime,
      overTime,
    });
  }, [JSON.stringify(task)]);

  const handleCancel = () => {
    onClose();
  };

  const refreshData = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    const { startTime: startTimeForm = '', endTime: endTimeForm = '' } = allValues;
    setDisabledHourAfter(endTimeForm);
    setDisabledHourBefore(startTimeForm);
  };

  // main function
  const updateActivityEffect = (values) => {
    const findPrj = projectList.find((x) => x.id === values.projectId);
    if (!findPrj) {
      notification.error({
        message: 'Invalid project name',
      });
      return '';
    }
    const payload = {
      ...values,
      id,
      breakTime: values.breakTime || 0,
      overTime: values.overTime || 0,
      startTime: moment(values.startTime, hourFormat).format(hourFormatAPI),
      endTime: moment(values.endTime, hourFormat).format(hourFormatAPI),
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
      date: moment(values.date).format(dateFormatAPI),
      companyId: getCurrentCompany(),
      location,
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
          form={form}
          id="myForm"
          onFinish={handleFinish}
          onValuesChange={onValuesChange}
          preserve={false}
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
            <Col xs={24} md={12} />
          </Row>
          <Row gutter={[24, 0]} className={styles.belowPart}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Project"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select the project' }]}
                name="projectId"
              >
                <Select
                  showSearch
                  placeholder="Select the project"
                  loading={loadingFetchProject}
                  disabled={loadingFetchProject}
                  filterOption={
                    (input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // eslint-disable-next-line react/jsx-curly-newline
                  }
                >
                  {projectList.map((val) => (
                    <Option value={val.id}>{val.projectName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Task"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select the task' }]}
                name="taskName"
              >
                {TASKS.length !== 0 ? (
                  <Select showSearch placeholder="Select the task">
                    {TASKS.map((val) => (
                      <Option value={val}>{val}</Option>
                    ))}
                  </Select>
                ) : (
                  <Input placeholder="Enter the task name" maxLength={150} />
                )}
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Start time"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select the start time' }]}
                name="startTime"
              >
                <CustomTimePicker
                  placeholder="Select the start time"
                  showSearch
                  disabledHourAfter={disabledHourAfter}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="End time"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Select the end time' }]}
                name="endTime"
              >
                <CustomTimePicker
                  placeholder="Select the end time"
                  showSearch
                  disabledHourBefore={disabledHourBefore}
                />
              </Form.Item>
            </Col>

            {viewUS && (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Break time (In Mins)"
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      pattern: /^[\d]+$/,
                      message: 'Just only numbers',
                    },
                  ]}
                  name="breakTime"
                >
                  <Input placeholder="0" />
                </Form.Item>
              </Col>
            )}

            {viewUS && (
              <Col xs={24} md={12}>
                <Form.Item
                  label="Over time (In Mins)"
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      pattern: /^[\d]+$/,
                      message: 'Just only numbers',
                    },
                  ]}
                  name="overTime"
                >
                  <Input placeholder="0" />
                </Form.Item>
              </Col>
            )}

            <Col xs={24}>
              <Form.Item
                label="Description"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please enter the description' }]}
                name="notes"
              >
                <Input.TextArea autoSize={{ minRows: 4 }} placeholder="Enter the description" />
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
  );
};

export default connect(({ loading, timeSheet, user: { currentUser } }) => ({
  currentUser,
  timeSheet,
  loadingUpdateTask: loading.effects['timeSheet/updateActivityEffect'],
  loadingFetchProject: loading.effects['timeSheet/fetchProjectListEffect'],
}))(EditTaskModal);
