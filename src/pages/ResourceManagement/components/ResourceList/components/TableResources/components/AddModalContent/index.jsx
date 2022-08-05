/* eslint-disable compat/compat */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-promise-reject-errors */
import { Card, Col, DatePicker, Form, Input, notification, Row, Select } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { disabledEndDate } from '@/utils/resourceManagement';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

const AddModalContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    dataPassRow,
    refreshData,
    setSuccessVisible = () => {},
    projectList = [],
    visible,
    statusList = [],
    loadingFetchProjectList = false,
    setSelectedProject = () => {},
    selectedProject = {},
  } = props;

  const [startDateState, setStartDateState] = useState('');

  useEffect(() => {
    setSelectedProject({});
    if (visible && isEmpty(projectList)) {
      dispatch({
        type: 'resourceManagement/getProjectList',
      });
    }
  }, [visible]);

  const onChangeProject = (val) => {
    const projectObj = projectList.find((item) => item.id === val) || {};
    setSelectedProject(projectObj);
  };

  const handleSubmitAssign = async (values) => {
    const { project, status, utilization, startDate, endDate, comment, revisedEndDate } = values;

    if (
      new Date(endDate).getTime() <= new Date(startDate).getTime() ||
      new Date(revisedEndDate).getTime() <= new Date(startDate).getTime()
    ) {
      notification.error({
        message: 'End date or revised end date cannot less than start date',
      });
      return;
    }
    if (new Date(revisedEndDate).getTime() <= new Date(endDate).getTime()) {
      notification.error({
        message: 'Revised date cannot less than end date',
      });
      return;
    }
    await dispatch({
      type: 'resourceManagement/assignResourceToProject',
      payload: {
        employee: dataPassRow.employeeId,
        project,
        status,
        utilization,
        startDate: (startDate && moment(startDate).format(DATE_FORMAT_YMD)) || null,
        endDate: (endDate && moment(endDate).format(DATE_FORMAT_YMD)) || null,
        revisedEndDate: (revisedEndDate && moment(revisedEndDate).format(DATE_FORMAT_YMD)) || null,
        comment,
        milestone: '',
      },
    }).then((response) => {
      if (response.statusCode === 200) {
        setSuccessVisible();
      }
      refreshData();
    });

    setSuccessVisible();
  };

  const handleChangeStartDate = (value) => {
    setStartDateState(value);
    form.setFieldsValue({ endDate: null });
  };

  const projectDetails = [
    {
      label: 'Customer',
      value: selectedProject.customerName,
    },
    {
      label: 'Project',
      value: selectedProject.projectName,
    },
    {
      label: 'Engagement Type',
      value: selectedProject.engagementType,
    },
    {
      label: 'Start Date',
      value: selectedProject.startDate && moment(selectedProject.startDate).format(DATE_FORMAT_MDY),
    },
    {
      label: 'End Date',
      value: selectedProject.endDate && moment(selectedProject.endDate).format(DATE_FORMAT_MDY),
    },
  ];

  return (
    <div className={styles.AddModalContent}>
      <Form
        layout="vertical"
        className={styles.formAdd}
        method="POST"
        id="myForm"
        form={form}
        onFinish={(values) => handleSubmitAssign(values)}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label="Project"
              name="project"
              rules={[{ required: true, message: 'Please select the project!' }]}
            >
              <Select
                placeholder="Select the project"
                onChange={(value) => onChangeProject(value)}
                showSearch
                optionFilterProp="children"
                loading={loadingFetchProjectList}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {projectList.map((x) => (
                  <Option value={x.id}>{x.projectName}</Option>
                ))}
              </Select>
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
                placeholder="Enter Start Date"
                suffixIcon={<img src={datePickerIcon} alt="" />}
                format={DATE_FORMAT_MDY}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select the status!' }]}
            >
              <Select
                placeholder="Select the status"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {statusList.map((status) => (
                  <Option value={status}>{status}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'End date value could not be empty!' }]}
            >
              <DatePicker
                disabledDate={(current) => disabledEndDate(current, startDateState)}
                placeholder="Enter End Date"
                suffixIcon={<img src={datePickerIcon} alt="" />}
                format={DATE_FORMAT_MDY}
              />
            </Form.Item>
          </Col>
          <Col span={12} className={styles.utilization}>
            <Form.Item
              label="Bandwidth Allocation (%)"
              name="utilization"
              rules={[
                { required: true, message: 'Please enter the bandwidth allocation (%)!' },
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
            <Form.Item label="Revised End Date" name="revisedEndDate">
              <DatePicker
                disabledDate={(current) => disabledEndDate(current, startDateState)}
                placeholder="Enter Date"
                suffixIcon={<img src={datePickerIcon} alt="" />}
                format={DATE_FORMAT_MDY}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Comments (optional)" name="comment">
          <TextArea placeholder="Enter Comments" autoSize={{ minRows: 4, maxRows: 8 }} />
        </Form.Item>
        {!isEmpty(selectedProject) && (
          <Form.Item label={<span style={{ fontWeight: '700' }}>Project Details</span>}>
            <Card style={{ background: '#F6F7F9', fontSize: 13 }}>
              <Row>
                <Col span={12}>
                  {projectDetails.map((x) => (
                    <p>
                      {x.label}: <span style={{ color: '#2C6DF9' }}>{x.value}</span>
                    </p>
                  ))}
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={12}>Current resource allocation:</Col>
                    <Col span={12}>
                      {(selectedProject?.resourceTypes || []).length > 0 ? (
                        (selectedProject?.resourceTypes || []).map((item) => {
                          return (
                            <p>
                              <span style={{ color: '#2C6DF9' }}>{item?.number_of_applied}</span>
                              {`/${item?.number_of_resources} ${item?.type_detail?.name} (${item?.billing_status})`}
                            </p>
                          );
                        })
                      ) : (
                        <p>
                          <span style={{ color: '#2C6DF9' }}>No Data</span>
                        </p>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default connect(
  ({
    loading = {},
    resourceManagement: { projectList = [], resourceList = [], statusList = [] } = {},
  }) => ({
    loading: loading.effects['resourceManagement/assignResourceToProject'],
    loadingFetchProjectList: loading.effects['resourceManagement/getProjectList'],
    projectList,
    resourceList,
    statusList,
  }),
)(AddModalContent);
