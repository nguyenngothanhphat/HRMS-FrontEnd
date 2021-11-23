import React, { Component } from 'react';
import { Row, Col, Button, Modal, Form, Input, Select, DatePicker, notification } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import editIcon from '@/assets/resource-management-edit-history.svg';
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
    this.state = {
      visible: false,
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

  parseDate = (date, formatDate) => {
    if(!date || date === ''){
      return ''
    }
    return moment(date, formatDate);
  }

  handleSubmitAssign = async (values) => {
    const { dispatch, dataPassRow = {} } = this.props;
    const { project, status, utilization, startDate, endDate, revisedEndDate } = values;
    if (new Date(endDate).getTime() < new Date(startDate).getTime() || new Date(revisedEndDate).getTime() < new Date(startDate).getTime()) {
      notification.error({
        message: 'End date or resived end date cannot less than start date',
      });
      return
    }
    dispatch({
      type: 'resourceManagement/updateProject',
      payload: {
        id: dataPassRow.resourceId,
        project,
        status,
        utilization,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        revisedEndDate: moment(revisedEndDate).format('YYYY-MM-DD'),
      },
    });
    this.setState({
      visible: false,
    });
  };

  render() {
    const { dataPassRow = {}, projectList = [], resourceList = [], statusList = [] } = this.props;
    const getUtilizationOfEmp = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
    const listProjectsOfEmp = getUtilizationOfEmp ? getUtilizationOfEmp.projects : [];
    const sumUtilization = listProjectsOfEmp.reduce( (prevValue, currentValue) => prevValue + currentValue.utilization,0);
    const maxEnterUtilization = 100 - sumUtilization + dataPassRow.utilization;
    const { visible } = this.state;
    return (
      <div className={styles.btnEdit}>
        <img src={editIcon} alt="historyIcon" onClick={() => this.showModal()} />
        <Modal
          className={styles.modalAdd}
          title="Edit Project Details"
          width="60%"
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form
            layout="vertical"
            className={styles.formAdd}
            method="POST"
            onFinish={(values) => this.handleSubmitAssign(values)}
            initialValues={{ 
              startDate: this.parseDate(dataPassRow.startDate, 'MM/DD/YYYY'),
              endDate: this.parseDate(dataPassRow.endDate, 'MM/DD/YYYY'),
              revisedEndDate: this.parseDate(dataPassRow.endDate, 'MM/DD/YYYY'),
              projectName: dataPassRow.projectName,
              utilization: dataPassRow.utilization,
              billStatus: dataPassRow.billStatus
            }}
          >
            <Row>
              <Col span={12}>
                <Form.Item label="Project" name="project">
                  <Select
                    defaultValue={dataPassRow.projectName}
                    style={{ width: '95%', borderRadius: '2px' }}
                  >
                    {projectList.map((project) => (
                      <Option value={project.id}>{project.projectName}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Status" name="status">
                  <Select
                    defaultValue={dataPassRow.billStatus}
                    style={{ width: '95%', borderRadius: '2px' }}
                  >
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
                  <Input
                    defaultValue={dataPassRow.utilization}
                    style={{ width: '95%', color: 'black' }}
                    addonAfter="%"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Start Date" name="startDate">
                  <DatePicker
                    placeholder='Start Date'
                    defaultValue={this.parseDate(dataPassRow.startDate, 'MM/DD/YYYY')}
                    format='MM/DD/YYYY'
                    style={{ width: '100%', borderRadius: '2px', color: 'blue' }}
                    suffixIcon={<img src={datePickerIcon} alt="" />}
                  />
                </Form.Item>
                <Form.Item label="End Date" name="endDate">
                  <DatePicker
                    placeholder='Enter End Date'
                    defaultValue={this.parseDate(dataPassRow.endDate, 'MM/DD/YYYY')}
                    format='MM/DD/YYYY'
                    style={{ width: '100%', borderRadius: '2px', color: 'blue' }}
                    suffixIcon={<img src={datePickerIcon} alt="" />}
                  />
                </Form.Item>
                <Form.Item label="Revised End Date" name="revisedEndDate">
                  <DatePicker
                    placeholder='Enter Date'
                    defaultValue={this.parseDate(dataPassRow.revisedEndDate, 'MM/DD/YYYY')}
                    format='MM/DD/YYYY'
                    style={{
                      width: '100%',
                      borderRadius: '2px',
                      color: 'blue',
                      background: '#F4F6F7',
                    }}
                    suffixIcon={<img src={datePickerIcon} alt="" />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <br />
            <br />
            <div className={styles.spaceFooter}>
              <div className={styles.btnCancel} onClick={this.handleCancel}>
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
