import React, { Component } from 'react';
import { Row, Col, Button, Modal, Form, Input, Select, DatePicker, notification } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading = {},
    resourceManagement: { resourceList = [], projectList = [], statusList = [] },
  }) => ({
    loading: loading.effects['resourceManagement/updateProject'],
    resourceList,
    projectList,
    statusList,
  }),
)
class EditActionBTN extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  parseDate = (date, formatDate) => {
    if (!date || date === '') {
      return '';
    }
    return moment(date, formatDate);
  };

  handleSubmitAssign = async (values) => {
    const { dispatch, dataPassRow = {}, refreshData, onClose = () => {} } = this.props;
    const { project, status, utilization, startDate, endDate, revisedEndDate } = values;
    if (
      new Date(endDate).getTime() <= new Date(startDate).getTime() ||
      (revisedEndDate && new Date(revisedEndDate).getTime() <= new Date(startDate).getTime())
    ) {
      notification.error({
        message: 'End date or resived end date cannot less than start date',
      });
      return;
    }
    if (revisedEndDate && new Date(revisedEndDate).getTime() <= new Date(endDate).getTime()) {
      notification.error({
        message: 'Resived date cannot less than end date',
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
        startDate: startDate && moment(startDate).format('YYYY-MM-DD'),
        endDate: endDate && moment(endDate).format('YYYY-MM-DD'),
        revisedEndDate: revisedEndDate && moment(revisedEndDate).format('YYYY-MM-DD') || null,
      },
    }).then(() => {
      refreshData();
    });
    onClose();
  };

  render() {
    const {
      dataPassRow = {},
      projectList = [],
      resourceList = [],
      statusList = [],
      visible,
      onClose = () => {},
    } = this.props;
    const getUtilizationOfEmp = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
    const listProjectsOfEmp = getUtilizationOfEmp ? getUtilizationOfEmp.projects : [];
    const sumUtilization = listProjectsOfEmp.reduce(
      (prevValue, currentValue) => prevValue + currentValue.utilization,
      0,
    );
    const maxEnterUtilization = 100 - sumUtilization + dataPassRow.utilization;
    return (
      <div className={styles.EditActionBTN}>
        <Modal
          className={styles.modalEditProjectDetail}
          title="Edit Project Details"
          width="60%"
          visible={visible}
          footer={null}
          onCancel={onClose}
          destroyOnClose
        >
          <Form
            layout="vertical"
            className={styles.formAdd}
            method="POST"
            onFinish={(values) => this.handleSubmitAssign(values)}
            initialValues={{
              startDate: this.parseDate(dataPassRow.startDate, 'MM/DD/YYYY'),
              endDate: this.parseDate(dataPassRow.endDate, 'MM/DD/YYYY'),
              revisedEndDate:
                dataPassRow.revisedEndDate !== '-' &&
                this.parseDate(dataPassRow.revisedEndDate, 'MM/DD/YYYY'),
              // project: dataPassRow.id,
              utilization: dataPassRow.utilization,
              status: dataPassRow.billStatus,
            }}
          >
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item label="Project" name="project">
                  <Select defaultValue={dataPassRow.projectName}>
                    {projectList.map((project) => (
                      <Option value={project.id}>{project.projectName}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Status" name="status">
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
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Utilization value could not be empty');
                        }

                        if (isNaN(value)) {
                          return Promise.reject(`Value enter has to be a number.`);
                        }
                        if (value > maxEnterUtilization) {
                          return Promise.reject(
                            `Your cannot enter a value that is more than ${maxEnterUtilization}.`,
                          );
                        }
                        if (value < 0) {
                          return Promise.reject(`Your cannot enter a value that is less than 0`);
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
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('Start date value could not be empty');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Start Date"
                    format="MM/DD/YYYY"
                    suffixIcon={<img src={datePickerIcon} alt="" />}
                  />
                </Form.Item>
                <Form.Item 
                  label="End Date" 
                  name="endDate"
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject('End date value could not be empty');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Enter End Date"
                    format="MM/DD/YYYY"
                    suffixIcon={<img src={datePickerIcon} alt="" />}
                  />
                </Form.Item>
                <Form.Item label="Revised End Date" name="revisedEndDate">
                  <DatePicker
                    placeholder="Enter Date"
                    format="MM/DD/YYYY"
                    suffixIcon={<img src={datePickerIcon} alt="" />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <br />
            <div className={styles.spaceFooter}>
              <div className={styles.btnCancel} onClick={onClose}>
                Cancel
              </div>
              <Button type="primary" htmlType="submit" className={styles.btnSubmit}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default EditActionBTN;
