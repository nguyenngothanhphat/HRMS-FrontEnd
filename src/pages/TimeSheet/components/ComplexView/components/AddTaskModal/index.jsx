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
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import RemoveIcon from '@/assets/timeSheet/recycleBin.svg';
import CustomTimePicker from '@/components/CustomTimePicker';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import {
  checkHolidayInWeek,
  dateFormatAPI,
  holidayFormatDate,
  hourFormat,
  hourFormatAPI,
  TIMESHEET_ADD_TASK_ALERT,
  TIME_DEFAULT,
  VIEW_TYPE,
} from '@/utils/timeSheet';
import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';
const countryIdUS = 'US';
const TASKS = [];
const { RangePicker } = DatePicker;

const AddTaskModal = (props) => {
  const [form] = Form.useForm();
  const {
    visible = false,
    title = 'Add Task',
    onClose = () => {},
    mode = 'single',
    timeSheet: {
      projectList = [],
      myTimesheetByDay = [],
      myTimesheetByWeek = [],
      myTimesheetByMonth = [],
    } = {},
    date = '',
    taskDetail: {
      projectId = '',
      endTime = '',
      clientLocation = false,
      breakTime = 0,
      overTime = 0,
      forDate = '',
    } = {},
    loadingTime = false,
  } = props;

  const {
    dispatch,
    loadingAddTask = false,
    loadingFetchProject = false,
    user: { currentUser: { employee = {}, location = {} } = {} } = {},
  } = props;

  const { _id: employeeId = '' } = employee;
  const { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = location;
  const viewUS = countryID === countryIdUS;

  // state
  const [disabledHourBefore, setDisabledHourBefore] = useState([]); // for end time validation
  const [dates, setDates] = useState(null);
  const myTimesheet = myTimesheetByDay[0]?.timesheet;
  const [notice, setNotice] = useState(TIMESHEET_ADD_TASK_ALERT.DEFAULT);
  const [holidays, setHolidays] = useState([]);

  // api
  const fetchProjectList = () => {
    dispatch({
      type: 'timeSheet/fetchProjectListEffect',
    });
  };

  const fetchHolidaysByDate = async (startDate, endDate) => {
    const holidaysResponse = await dispatch({
      type: 'timeSheet/fetchHolidaysByDate',
      payload: {
        companyId: getCurrentCompany(),
        fromDate: moment(startDate).format(dateFormatAPI),
        toDate: moment(endDate).format(dateFormatAPI),
      },
    });
    setHolidays(holidaysResponse);
  };

  const refreshData = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };

  // functions
  const getDisabledHourBefore = (et, minimum) => {
    return moment(et, hourFormat)
      .add(minimum - 15, 'minutes')
      .format(hourFormat);
  };

  const formatStartTimeShow = (timeFormat) => {
    return moment(timeFormat, hourFormatAPI).format(hourFormat);
  };

  const formatEndTimeShow = (timeFormat) => {
    return moment(timeFormat, hourFormat).add(30, 'minutes').format(hourFormat);
  };

  const getLastEndTimeElement = (lastEle) => {
    return lastEle[lastEle.length - 1]?.endTime;
  };

  // get value timesheet of date when changed date
  const getDetailValueStartTime = (val = []) => {
    if (val?.length && formatStartTimeShow(getLastEndTimeElement(val)) >= TIME_DEFAULT.END_TIME) {
      return TIME_DEFAULT.TIME_WORK_LATE;
    }
    if (val?.length && formatStartTimeShow(getLastEndTimeElement(val)) < TIME_DEFAULT.END_TIME) {
      return formatStartTimeShow(getLastEndTimeElement(val));
    }
    return TIME_DEFAULT.START_TIME;
  };

  const getDefaultValueStartTime = () => {
    if (
      myTimesheet?.length &&
      formatStartTimeShow(getLastEndTimeElement(myTimesheet)) < TIME_DEFAULT.END_TIME
    ) {
      return formatStartTimeShow(getLastEndTimeElement(myTimesheet));
    }
    if (
      myTimesheet?.length &&
      formatStartTimeShow(getLastEndTimeElement(myTimesheet)) >= TIME_DEFAULT.END_TIME
    ) {
      return TIME_DEFAULT.TIME_WORK_LATE;
    }
    return TIME_DEFAULT.START_TIME;
  };

  const getTimeSheetByDay = async (day) => {
    const res = await dispatch({
      type: 'timeSheet/fetchMyTimesheetByDay',
      payload: {
        companyId: getCurrentCompany(),
        employeeId,
        fromDate: moment(day[0]).format(dateFormatAPI),
        toDate: moment(day[0]).format(dateFormatAPI),
        viewType: VIEW_TYPE.D,
      },
    });
    if (res.code === 200) {
      form.setFieldsValue({
        tasks: [
          {
            startTime: getDetailValueStartTime(res.data[0].timesheet || []),
            endTime: formatEndTimeShow(getDetailValueStartTime(res.data[0].timesheet || [])),
          },
        ],
      });
    }
  };

  const handleChangeDate = async (val) => {
    await setDates(val);
    if (val && val.length > 1 && val[0] && val[1]) {
      getTimeSheetByDay(val);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const onStartTimeChange = (index) => {
    const { tasks = [] } = form.getFieldsValue();

    form.setFieldsValue({
      tasks: tasks.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            endTime: moment(x.startTime, hourFormat).add(30, 'minutes').format(hourFormat),
          };
        }
        return x;
      }),
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    const { tasks = [] } = allValues;
    const disabledHourBeforeTemp = tasks.map((x = {}) => {
      // minimum 30 minutes per task
      const temp = getDisabledHourBefore(x.startTime, 30);
      return temp;
    });
    setDisabledHourBefore(disabledHourBeforeTemp);
  };

  const disabledDate = (current) => {
    if (!dates) {
      return false;
    }
    const values = form.getFieldsValue();
    const { tasks = [] } = values;

    let tooLate = '';
    let tooEarly = '';
    // if tasks length > 1, only allow to select from date === to date
    if (tasks.length > 1) {
      tooLate = dates[0] && current.diff(dates[0], 'days') > 0;
      tooEarly = dates[1] && dates[1].diff(current, 'days') > 0;
    } else {
      tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
      tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;
    }

    return !!tooEarly || !!tooLate;
  };

  const onOpenChange = (open) => {
    const values = form.getFieldsValue();
    const { tasks = [] } = values;
    if (tasks.length > 1) {
      setNotice(TIMESHEET_ADD_TASK_ALERT.WARNING);
    } else {
      setNotice(TIMESHEET_ADD_TASK_ALERT.DEFAULT);
    }
    if (open) {
      form.setFieldsValue({
        dates: [null, null],
      });
      setDates([null, null]);
    }
  };

  const checkHolidayBetweenDates = () => {
    if (dates && dates.length > 1) return checkHolidayInWeek(dates[0], dates[1], holidays);
    return false;
  };

  // main function
  const addMultipleActivityEffect = (submitDates, tasks) => {
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
        breakTime: item.breakTime || 0,
        overTime: item.overTime || 0,
        clientLocation: item.clientLocation || false,
        project: {
          projectName: findPrj?.projectName,
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

    if (data.some((x) => !x.project?.projectName)) {
      notification.error({
        message: 'Invalid project name',
      });
      return {};
    }
    return dispatch({
      type: 'timeSheet/addMultipleActivityEffect',
      payload: {
        employeeId,
        companyId: getCurrentCompany(),
        data,
        fromDate: moment(submitDates[0], hourFormat).format(dateFormatAPI),
        toDate: moment(submitDates[1], hourFormat).format(dateFormatAPI),
      },
    });
  };

  const handleFinish = async (values) => {
    const { dates: submitDates = [], tasks = [] } = values;
    const res = await addMultipleActivityEffect(submitDates, tasks);
    if (res.code === 200) {
      onClose();
      form.resetFields();
      refreshData();
    }
  };

  // use effect
  useEffect(() => {
    if (dates && dates.length > 1 && dates[0] && dates[1]) {
      fetchHolidaysByDate(dates[0], dates[1]);
    }
  }, [dates]);

  useEffect(() => {
    if (visible) {
      if (projectList.length === 0) {
        fetchProjectList();
      }

      const datesTemp = forDate ? [moment(forDate), moment(forDate)] : [moment(date), moment(date)];
      setDates(datesTemp);
      form.setFieldsValue({
        dates: datesTemp,
        tasks: [
          {
            projectId: projectId || null,
            startTime: endTime
              ? moment(endTime, hourFormatAPI).format(hourFormat)
              : getDefaultValueStartTime(),
            endTime: endTime
              ? moment(endTime, hourFormatAPI).add(30, 'minutes').format(hourFormat)
              : formatEndTimeShow(getDefaultValueStartTime()),
            clientLocation,
            breakTime,
            overTime,
          },
        ],
      });
    }
  }, [visible, JSON.stringify(myTimesheetByMonth), JSON.stringify(myTimesheetByWeek)]);

  useEffect(() => {
    const temp = endTime
      ? getDisabledHourBefore(endTime, 30)
      : getDisabledHourBefore(getDefaultValueStartTime(), 30);

    setDisabledHourBefore([temp]);
  }, [visible, endTime]);

  // render ui
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const renderAddButton = (fields, add) => {
    let check = false;
    if (mode === 'multiple') {
      check = true;
      if (dates) {
        if (dates.length < 2) {
          check = false;
        } else if (moment(dates[0]).format(dateFormat) !== moment(dates[1]).format(dateFormat)) {
          check = false;
        }
      }
    }

    return (
      <div
        className={styles.addButton}
        onClick={
          check
            ? () => {
                const values = form.getFieldsValue();
                const { tasks = [] } = values;
                const { endTime: endTimeTemp = '' } = values.tasks[tasks.length - 1];
                add({
                  projectId: values.tasks[fields.length - 1].projectId,
                  startTime: endTimeTemp
                    ? moment(endTimeTemp, hourFormat).format(hourFormat)
                    : null,
                  endTime: endTimeTemp
                    ? moment(endTimeTemp, hourFormat).add(30, 'minutes').format(hourFormat)
                    : null,
                });
              }
            : () => {}
        }
        style={{
          cursor: check ? 'pointer' : 'not-allowed',
          opacity: check ? 1 : 0.5,
        }}
      >
        <img src={AddIcon} alt="" />
        <span>Add another task</span>
      </div>
    );
  };

  const renderFormList = () => {
    return (
      <Form.List name="tasks">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey }, index) => (
              <div key={key}>
                {key !== 0 && <div className={styles.divider} />}
                <Row gutter={[24, 0]} className={styles.belowPart}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Project"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select the project' }]}
                      name={[name, 'projectId']}
                      fieldKey={[fieldKey, 'projectId']}
                    >
                      <Select
                        showSearch
                        placeholder="Select the project"
                        loading={loadingFetchProject}
                        disabled={loadingFetchProject}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {projectList.map((val) => (
                          <Option key={val.id} value={val.id}>
                            {`${val.projectName} - ${val.customerName}`}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Task"
                      labelCol={{ span: 24 }}
                      rules={[
                        {
                          required: true,
                          message: TASKS.length !== 0 ? 'Select a task' : 'Enter the task name',
                        },
                      ]}
                      name={[name, 'taskName']}
                      fieldKey={[fieldKey, 'taskName']}
                    >
                      {TASKS.length !== 0 ? (
                        <Select showSearch placeholder="Select the task">
                          {TASKS.map((val) => (
                            <Option key={val} value={val}>
                              {val}
                            </Option>
                          ))}
                        </Select>
                      ) : (
                        <Input placeholder="Enter the task name" maxLength={100} />
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Start time"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select the start time' }]}
                      name={[name, 'startTime']}
                      fieldKey={[fieldKey, 'startTime']}
                    >
                      <CustomTimePicker
                        placeholder="Select the start time"
                        showSearch
                        loading={loadingTime}
                        disabled={loadingTime}
                        onChange={() => onStartTimeChange(index)}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="End time"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Select the end time' }]}
                      name={[name, 'endTime']}
                      fieldKey={[fieldKey, 'endTime']}
                    >
                      <CustomTimePicker
                        placeholder="Select the end time"
                        showSearch
                        disabledHourBefore={disabledHourBefore[index]}
                        loading={loadingTime}
                        disabled={loadingTime}
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
                        name={[name, 'breakTime']}
                        fieldKey={[fieldKey, 'breakTime']}
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
                        name={[name, 'overTime']}
                        fieldKey={[fieldKey, 'overTime']}
                      >
                        <Input placeholder="0" />
                      </Form.Item>
                    </Col>
                  )}

                  <Col xs={24}>
                    <Form.Item
                      label="Description"
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: 'Enter the description' }]}
                      name={[name, 'notes']}
                      fieldKey={[fieldKey, 'notes']}
                    >
                      <Input.TextArea
                        autoSize={{ minRows: 4 }}
                        placeholder="Enter the description"
                      />
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
              </div>
            ))}
            {renderAddButton(fields, add)}
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
          onValuesChange={onValuesChange}
        >
          <Row gutter={[24, 0]} className={styles.abovePart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select Timesheet Period' }]}
                label="Select Timesheet Period"
                name="dates"
                fieldKey="dates"
                labelCol={{ span: 24 }}
              >
                <RangePicker
                  format={dateFormat}
                  ranges={{
                    Today: [moment(), moment()],
                    'This Week': [moment().startOf('week'), moment().endOf('week')],
                  }}
                  disabledDate={disabledDate}
                  onCalendarChange={(val) => handleChangeDate(val)}
                  onOpenChange={onOpenChange}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} className={styles.alertContainer}>
              {checkHolidayBetweenDates() ? (
                <Alert
                  message={
                    holidays.length > 1
                      ? holidays
                          .map((holiday) => holidayFormatDate(holiday.date))
                          .join(', ')
                          .concat(' are Holidays')
                      : `${holidayFormatDate(holidays[0].date)} is ${holidays[0].holiday}`
                  }
                  showIcon
                  type="warning"
                  description={`Did you work on ${holidays.length > 1 ? 'these' : 'this'} day?`}
                  closable
                />
              ) : (
                <Alert message="Info" showIcon type={notice.type} description={notice.content} />
              )}
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
        width={700}
        maskClosable={false}
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

export default connect(({ loading, timeSheet, location, user }) => ({
  user,
  timeSheet,
  location,
  loadingAddTask: loading.effects['timeSheet/addMultipleActivityEffect'],
  loadingFetchProject: loading.effects['timeSheet/fetchProjectListEffect'],
  loadingTime: loading.effects['timeSheet/fetchMyTimesheetByDay'],
}))(AddTaskModal);
