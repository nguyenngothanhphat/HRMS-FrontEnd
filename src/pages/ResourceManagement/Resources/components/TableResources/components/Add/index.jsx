/* eslint-disable compat/compat */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-promise-reject-errors */
import React, { Component } from 'react';
import { Row, Col, Button, Modal, Form, Input, Select, DatePicker, Card, notification } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import styles from './index.less';
import CommonModal from '@/components/CommonModal';

const { TextArea } = Input;
const { Option } = Select;

@connect(
  ({
    loading = {},
    resourceManagement: { projectList = [], resourceList = [], statusList = [] } = {},
  }) => ({
    loading: loading.effects['resourceManagement/assignResourceToProject'],
    projectList,
    resourceList,
    statusList,
  }),
)
class AddActionBTN extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModalSuccess: false,
      projectId: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible) {
      this.clearState();
    }
  }

  clearState = () => {
    this.setState({
      projectId: '',
    });
  };

  handleCancelModelSuccess = () => {
    this.setState({
      visibleModalSuccess: false,
    });
    this.setState({
      projectId: '',
    });
  };

  handleOnchange = (event) => {
    this.setState({ projectId: event });
  };

  handleSubmitAssign = async (values) => {
    const { dispatch, dataPassRow, refreshData, onClose = () => {} } = this.props;
    const { project, status, utilization, startDate, endDate, comment, revisedEndDate } = values;
    if (
      new Date(endDate).getTime() <= new Date(startDate).getTime() ||
      new Date(revisedEndDate).getTime() <= new Date(startDate).getTime()
    ) {
      notification.error({
        message: 'End date or resived end date cannot less than start date',
      });
      return;
    }
    if (
      new Date(revisedEndDate).getTime() <= new Date(endDate).getTime()
    ) {
      notification.error({
        message: 'Resived date cannot less than end date',
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
        startDate: startDate && moment(startDate).format('YYYY-MM-DD') || null,
        endDate: endDate && moment(endDate).format('YYYY-MM-DD') || null,
        revisedEndDate: revisedEndDate && moment(revisedEndDate).format('YYYY-MM-DD') || null,
        comment,
        milestone: '',
      },
    }).then((response) => {
      if (response.statusCode === 200) {
        this.setState({
          visibleModalSuccess: true,
        });
        onClose();
      }
      refreshData();
    });
  };

  modalContent = () => {
    const { dataPassRow = {}, projectList = [], resourceList = [], statusList = [] } = this.props;
    const getUtilizationOfEmp = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
    const listProjectsOfEmp = getUtilizationOfEmp ? getUtilizationOfEmp.projects : [];
    const sumUtilization = listProjectsOfEmp.reduce(
      (prevValue, currentValue) => prevValue + currentValue.utilization,
      0,
    );
    const { projectId } = this.state;
    // const projectFist = projectList.length > 0 ? projectList[0] : {};
    // const statusBill = statusList.length > 0 ? statusList[0] : 'Billable';
    const maxEnterUtilization = 100 - sumUtilization;
    const projectId1 = projectId !== -1 ? projectId : 0;

    const projectDetail = projectList.find((obj) => obj.id === projectId1) || {};

    return (
      <Form
        layout="vertical"
        className={styles.formAdd}
        method="POST"
        id="myForm"
        onFinish={(values) => this.handleSubmitAssign(values)}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item 
              label="Project" 
              name="project"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('Project value could not be empty');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                placeholder="Select the project"
                onChange={(event) => this.handleOnchange(event)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projectList.map((project) => (
                  <Option value={project.id}>{project.projectName}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item 
              label="Status" 
              name="status"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('Status value could not be empty');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                placeholder="Select the status"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList.map((status) => (
                  <Option value={status}>{status}</Option>
                ))}
              </Select>
            </Form.Item>
            <div className={styles.utilization}>
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
            </div>
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
                placeholder="Enter Start Date"
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
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
            <Form.Item label="Revised End Date" name="revisedEndDate">
              <DatePicker
                placeholder="Enter Date"
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Comments (optional)" name="comment">
          <TextArea placeholder="Enter Comments" autoSize={{ minRows: 4, maxRows: 8 }} />
        </Form.Item>
        {projectId && (
          <Form.Item label={<span style={{ fontWeight: '700' }}>Project Details</span>}>
            <Card style={{ background: '#F6F7F9' }}>
              <Row>
                <Col span={12}>
                  <p>
                    Customer:
                    <span style={{ color: '#2C6DF9' }}> {projectDetail.customerName || ''}</span>
                  </p>
                  <p>
                    Project:{' '}
                    <span style={{ color: '#2C6DF9' }}> {projectDetail.projectName || ''}</span>
                  </p>
                  <p>
                    Engagement Type:
                    <span style={{ color: '#2C6DF9' }}>{projectDetail.engagementType || ''}</span>
                  </p>
                  <p>
                    Start Date:{' '}
                    <span style={{ color: '#2C6DF9' }}>
                      {moment(projectDetail.startDate).format('DD MM YYYY')}
                    </span>
                  </p>
                  <p>
                    End Date:{' '}
                    <span style={{ color: '#2C6DF9' }}>
                      {moment(projectDetail.endDate).format('DD MM YYYY')}
                    </span>
                  </p>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={12}>Current resource allocation :</Col>
                    <Col span={12}>
                      <p>
                        <span style={{ color: '#2C6DF9' }}>2</span>/3 UX Designers (Billable)
                      </p>
                      <p>
                        <span style={{ color: '#2C6DF9' }}>1</span>/2 UI Designer (Billable)
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Form.Item>
        )}
      </Form>
    );
  };

  render() {
    const { onClose = () => {}, visible } = this.props;

    const { visibleModalSuccess } = this.state;
    // const projectFist = projectList.length > 0 ? projectList[0] : {};
    // const statusBill = statusList.length > 0 ? statusList[0] : 'Billable';

    return (
      <div className={styles.Add}>
        <CommonModal
          title="Assign to project"
          visible={visible}
          footer={null}
          onClose={onClose}
          width={600}
          content={this.modalContent()}
          firstText="Assign to project"
        />

        <Modal
          visible={visibleModalSuccess}
          className={styles.modalAdd}
          footer={null}
          width="396px"
          onCancel={this.handleCancelModelSuccess}
        >
          <div style={{ textAlign: 'center' }}>
            <img src={imageAddSuccess} alt="add success" />
          </div>
          <br />
          <br />
          <h3 style={{ textAlign: 'center' }}>Resource assigned!</h3>
          <p style={{ textAlign: 'center', color: '#707177' }}>
            The resource has been successfully assigned to the project
          </p>
          <div className={styles.spaceFooterModalSuccess}>
            <div className={styles.btnCancel} onClick={this.handleCancelModelSuccess}>
              View Project
            </div>
            <Button onClick={this.handleCancelModelSuccess} className={styles.btnSubmit}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddActionBTN;
