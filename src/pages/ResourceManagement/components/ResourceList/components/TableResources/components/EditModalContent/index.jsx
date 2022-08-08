/* eslint-disable no-restricted-globals */
/* eslint-disable compat/compat */
/* eslint-disable prefer-promise-reject-errors */
import { Col, DatePicker, Form, Input, notification, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { disabledEndDate } from '@/utils/resourceManagement';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import styles from './index.less';

const { Option } = Select;

const EditModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    projectList = [],
    statusList = [],
    onClose = () => {},
    dispatch,
    dataPassRow = {},
    refreshData = () => {},
    visible = false,
    loadingFetchProjectList = false,
  } = props;

  useEffect(() => {
    if (visible && isEmpty(projectList)) {
      dispatch({
        type: 'resourceManagement/getProjectList',
      });
    }
  }, [visible]);

  const parseDate = (date, formatDate) => {
    if (!date || date === '') {
      return '';
    }
    return moment(date, formatDate);
  };

  const [startDateState, setStartDateState] = useState('');

  const handleChangeStartDate = (value) => {
    setStartDateState(value);
    form.setFieldsValue({
      endDate: null,
    });
  };

  const handleSubmitAssign = async (values) => {
    const { project, status, utilization, startDate, endDate, revisedEndDate } = values;
   
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
    }).then((res) => {
      if (res.statusCode === 200) {
        onClose();
        refreshData();
      }
    });
  };

  const startDateProp = parseDate(dataPassRow?.startDate || '');
  const endDateProp = parseDate(dataPassRow?.endDate || '');
  const revisedEndDateProp = parseDate(dataPassRow?.revisedEndDate || '');
  const projectIdProp = dataPassRow?.projectId || '';
  const utilizationProp = dataPassRow?.utilization || '';
  const billStatus = dataPassRow?.billStatus || '';

  return (
    <div className={styles.EditModalContent}>
      <Form
        layout="vertical"
        className={styles.formAdd}
        method="POST"
        form={form}
        name="editForm"
        id="editForm"
        onFinish={(values) => handleSubmitAssign(values)}
        initialValues={{
          startDate: startDateProp,
          endDate: endDateProp,
          revisedEndDate: revisedEndDateProp,
          project: projectIdProp,
          utilization: utilizationProp,
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
              <Select loading={loadingFetchProjectList}>
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
              label="Bandwidth Allocation (%)"
              name="utilization"
              rules={[
                { required: true, message: 'Please enter the bandwith allocation (%)!' },
                () => ({
                  validator(_, value) {
                    if (value && isNaN(value)) {
                      return Promise.reject(`Value enter has to be a number!`);
                    }
                    if (value && value > 100) {
                      return Promise.reject(
                        `The bandwidth allocation (%) can't be greater than 100%!`,
                      );
                    }
                    if (value < 1 && value) {
                      return Promise.reject(`Your cannot enter a value that is less than 0!`);
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
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
                onChange={(val) => handleChangeStartDate(val)}
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
                disabledDate={(current) =>
                  disabledEndDate(current, !startDateState ? startDateProp : startDateState)}
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
    loadingFetchProjectList: loading.effects['resourceManagement/getProjectList'],
    resourceList,
    projectList,
    statusList,
  }),
)(EditModalContent);
