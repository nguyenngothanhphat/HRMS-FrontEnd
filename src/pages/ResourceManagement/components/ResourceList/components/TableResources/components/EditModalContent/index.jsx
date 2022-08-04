/* eslint-disable no-restricted-globals */
/* eslint-disable compat/compat */
/* eslint-disable prefer-promise-reject-errors */
import { Col, DatePicker, Form, Input, notification, Row, Select } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import styles from './index.less';

const { Option } = Select;

const EditModalContent = (props) => {
  const {
    projectList = [],
    resourceList = [],
    statusList = [],
    onClose = () => {},
    dispatch,
    dataPassRow = {},
    refreshData,
  } = props;

  const parseDate = (date, formatDate) => {
    if (!date || date === '') {
      return '';
    }
    return moment(date, formatDate);
  };

  const handleSubmitAssign = async (values) => {
    const { project, status, utilization, startDate, endDate, revisedEndDate } = values;
    if (
      new Date(endDate).getTime() <= new Date(startDate).getTime() ||
      (revisedEndDate && new Date(revisedEndDate).getTime() <= new Date(startDate).getTime())
    ) {
      notification.error({
        message: 'End date or revised end date cannot less than start date',
      });
      return;
    }
    if (revisedEndDate && new Date(revisedEndDate).getTime() <= new Date(endDate).getTime()) {
      notification.error({
        message: 'Revised date cannot less than end date',
      });
      return;
    }
    dispatch({
      type: 'resourceManagement/updateProject',
      payload: {
        id: dataPassRow.resourceId,
        employee: dataPassRow.employeeId,
        project,
        status,
        utilization,
        startDate: startDate && moment(startDate).format(DATE_FORMAT_YMD),
        endDate: endDate && moment(endDate).format(DATE_FORMAT_YMD),
        revisedEndDate: (revisedEndDate && moment(revisedEndDate).format(DATE_FORMAT_YMD)) || null,
      },
    }).then(() => {
      refreshData();
    });
    onClose();
  };

  const startDate = parseDate(dataPassRow?.startDate || '');
  const endDate = parseDate(dataPassRow?.endDate || '');
  const revisedEndDate = parseDate(dataPassRow?.revisedEndDate || '');
  const projectId = dataPassRow?.projectId || '';
  const utilization = dataPassRow?.utilization || '';
  const billStatus = dataPassRow?.billStatus || '';

  const getUtilizationOfEmp = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
  const listProjectsOfEmp = getUtilizationOfEmp ? getUtilizationOfEmp.projects : [];
  const sumUtilization = listProjectsOfEmp.reduce(
    (prevValue, currentValue) => prevValue + currentValue.utilization,
    0,
  );
  const maxEnterUtilization = 100 - sumUtilization + dataPassRow.utilization;

  return (
    <div className={styles.EditModalContent}>
      <Form
        layout="vertical"
        className={styles.formAdd}
        method="POST"
        name="editForm"
        id="editForm"
        onFinish={(values) => handleSubmitAssign(values)}
        initialValues={{
          startDate,
          endDate,
          revisedEndDate,
          project: projectId,
          utilization,
          status: billStatus,
        }}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="Project"
              name="project"
              rules={[{ required: true, message: 'Please select the project!' }]}
            >
              <Select>
                {projectList.map((project) => (
                  <Option value={project.id}>{project.projectName}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                { required: true, message: 'Please select the status!' },
                () => ({
                  validator(_, value) {
                    if (value && value === '-') {
                      return Promise.reject(`Please select the status!`);
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select>
                {statusList.map((status) => (
                  <Option value={status}>{status}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Bandwith Allocation (%)"
              name="utilization"
              rules={[
                { required: true, message: 'Please enter the bandwith allocation (%)!' },
                () => ({
                  validator(_, value) {
                    if (value && isNaN(value)) {
                      return Promise.reject(`Value enter has to be a number!`);
                    }
                    if (value > maxEnterUtilization) {
                      return Promise.reject(
                        `Your cannot enter a value that is more than ${maxEnterUtilization}!`,
                      );
                    }
                    if (value < 0) {
                      return Promise.reject(`Your cannot enter a value that is less than 0!`);
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              validateTrigger="onBlur"
            >
              <Input addonAfter="%" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Start date value could not be empty!' }]}
            >
              <DatePicker
                placeholder="Start Date"
                format={DATE_FORMAT_MDY}
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'End date value could not be empty!' }]}
            >
              <DatePicker
                placeholder="Enter End Date"
                format={DATE_FORMAT_MDY}
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
            <Form.Item label="Revised End Date" name="revisedEndDate">
              <DatePicker
                placeholder="Enter Date"
                format={DATE_FORMAT_MDY}
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(
  ({
    loading = {},
    resourceManagement: { resourceList = [], projectList = [], statusList = [] },
  }) => ({
    loading: loading.effects['resourceManagement/updateProject'],
    resourceList,
    projectList,
    statusList,
  }),
)(EditModalContent);
