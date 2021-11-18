import React, { PureComponent, useState, Component } from 'react';
import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Card,
  notification,
  message,
} from 'antd';
import moment from 'moment';
import { InfoCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import addAction from '@/assets/resource-action-add1.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading = {}, resourceManagement: { projectList = [], resourceList = [] } = {} }) => ({
  loading: loading.effects['resourceManagement/fetchAssignToProject'],
  projectList,
  resourceList,
}))
class AddActionBTN extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibleSuccess: false,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancelModelSuccess = () => {
    this.setState({
      visibleSuccess: false,
    });
    window.location.reload(false);
  };

  handleSubmitAssign = (values) => {
    const { dispatch, dataPassRow } = this.props;
    const { project, status, utilization, startDate, endDate, comment } = values;
    dispatch({
      type: 'resourceManagement/fetchAssignToProject',
      payload: {
        employee: dataPassRow.employeeId,
        project,
        status,
        utilization,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        comment,
        milestone: '',
      },
    });
    this.setState({
      visible: false,
    });
    this.setState({
      visibleSuccess: true,
    });
  };

  render() {
    const { dataPassRow, projectList, resourceList } = this.props;
    const getUtilizationOfEmp = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
    const listProjectsOfEmp = getUtilizationOfEmp ? getUtilizationOfEmp.projects : [];
    let sumUtilization = 0;
    for (const obj of listProjectsOfEmp) {
      sumUtilization += obj.utilization;
    }
    const maxEnterUtilization = 100 - sumUtilization;
    return (
      <div>
        <img
          src={addAction}
          alt="attachIcon"
          onClick={() => this.showModal()}
          className={styles.buttonAdd}
        />
        <Modal
          className={styles.modalAdd}
          title="Assign to project"
          width="60%"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form
            layout="vertical"
            className={styles.formAdd}
            method="POST"
            onFinish={(values) => this.handleSubmitAssign(values)}
          >
            <Row>
              <Col span={12}>
                <Form.Item label="Project" name="project">
                  <Select
                    defaultValue={dataPassRow.projectName}
                    style={{ width: '95%', borderRadius: '2px' }}
                  >
                    {projectList.map((project) => (
                      <Option value={project.projectId}>{project.projectName}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Status" name="status">
                  <Select
                    defaultValue={dataPassRow.billStatus}
                    style={{ width: '95%', borderRadius: '2px' }}
                  >
                    <Option value="Billable">Billable</Option>
                    <Option value="Buffer">Buffer</Option>
                    <Option value="Bench">Bench</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Bandwith Allocation (%)"
                  name="utilization"
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject();
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
                  <Input
                    placeholder={sumUtilization}
                    style={{ width: '95%', color: 'black' }}
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Start Date" name="startDate">
                  <DatePicker
                    placeholder="Enter Start Date"
                    style={{ width: '100%', borderRadius: '2px', color: 'blue' }}
                    suffixIcon={<img src={datePickerIcon} />}
                  />
                </Form.Item>
                <Form.Item label="End Date" name="endDate">
                  <DatePicker
                    placeholder="Enter End Date"
                    style={{ width: '100%', borderRadius: '2px', color: 'blue' }}
                    suffixIcon={<img src={datePickerIcon} />}
                  />
                </Form.Item>
                <Form.Item label="Reserved End Date" name="reservedEndDate">
                  <DatePicker
                    placeholder="Enter Date"
                    style={{
                      width: '100%',
                      borderRadius: '2px',
                      color: 'blue',
                      background: '#F4F6F7',
                    }}
                    suffixIcon={<img src={datePickerIcon} />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Comments (optional)" name="comment">
              <TextArea placeholder="Enter Comments" autoSize={{ minRows: 4, maxRows: 8 }} />
            </Form.Item>
            <Form.Item label="Project Detail">
              <Card style={{ background: '#F6F7F9' }}>
                <Row>
                  <Col span={12}>
                    <p>
                      Customer:{' '}
                      <span style={{ color: '#2C6DF9' }}> {dataPassRow.employeeName}</span>
                    </p>
                    <p>
                      Project: <span style={{ color: '#2C6DF9' }}> {dataPassRow.projectName}</span>
                    </p>
                    <p>
                      Engagement Type:{' '}
                      <span style={{ color: '#2C6DF9' }}> {dataPassRow.billStatus}</span>
                    </p>
                    <p>
                      Start Date: <span style={{ color: '#2C6DF9' }}> {dataPassRow.startDate}</span>
                    </p>
                    <p>
                      End Date: <span style={{ color: '#2C6DF9' }}> {dataPassRow.endDate}</span>
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
            <div className={styles.spaceFooter}>
              <div className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </div>
              <Button type="primary" htmlType="submit" className={styles.btnSubmit}>
                Assign To Project
              </Button>
            </div>
          </Form>
        </Modal>

        <Modal
          visible={this.state.visibleSuccess}
          className={styles.modalAdd}
          footer={null}
          width="30%"
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
