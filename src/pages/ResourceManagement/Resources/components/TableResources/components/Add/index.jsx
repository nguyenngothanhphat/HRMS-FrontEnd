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
} from 'antd';
import moment from 'moment';
import { InfoCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import addAction from '@/assets/resource-action-add1.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading = {} }) => ({
  loading: loading.effects['resourceManagement/fetchAssignToProject'],
}))
class AddActionBTN extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      utilization: '',
      Comment: '',
      startDate: '',
      endDate: '',
      reservedEndDate: '',
      project: '',
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

  handleSubmitAssign = (e) => {
    e.preventDefault();
    console.log('ddd', this.state);
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/fetchAssignToProject',
      payload: {
        employee: '61552f6d1b293f2508f61d02',
        project: this.state.project,
        status: this.state.status,
        utilization: this.state.utilization,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        comment: this.state.Comment,
        milestone: '',
      },
    });
  };

  render() {
    const { dataPassRow } = this.props;
    const { optionsProject } = this.state;
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
          onOk={this.handleSubmitAssign}
          onCancel={() => this.handleCancel()}
          okText="Assign to project"
          cancelButtonProps={{ style: { color: 'red', border: '1px solid white' } }}
          okButtonProps={{
            style: {
              background: '#FFA100',
              border: '1px solid #FFA100',
              color: 'white',
              borderRadius: '25px',
            },
          }}
        >
          <Form
            layout="vertical"
            className={styles.formAdd}
            method="POST"
            action={this.handleSubmitAssign}
          >
            <Row>
              <Col span={12}>
                <Form.Item label="Project">
                  <Select
                    defaultValue={dataPassRow.projectName}
                    name="project"
                    onChange={(event) => {
                      this.setState({ project: event });
                    }}
                    style={{ width: '95%', borderRadius: '2px' }}
                  >
                    <Option value="project 1">project 1</Option>
                    <Option value="project 2">project 2</Option>
                    <Option value="project 3">project 3</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Status">
                  <Select
                    defaultValue={dataPassRow.billStatus}
                    name="status"
                    onChange={(event) => {
                      this.setState({ status: event });
                    }}
                    style={{ width: '95%', borderRadius: '2px' }}
                  >
                    <Option value="billStatus">billStatus</Option>
                    <Option value="billStatus 1">billStatus 1</Option>
                    <Option value="billStatus 2">billStatus 2</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Bandwith Allocation (%)">
                  <Input
                    placeholder={dataPassRow.utilization}
                    style={{ width: '95%', color: 'black' }}
                    addonAfter="%"
                    name="utilization"
                    value={this.state.utilization}
                    onChange={(event) => {
                      this.setState({ utilization: event.target.value });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Start Date">
                  <DatePicker
                    placeholder="Enter Start Date"
                    name="startDate"
                    onChange={(event) => {
                      this.setState({ startDate: moment(event).format('YYYY-MM-DD') });
                    }}
                    style={{ width: '95%', borderRadius: '2px', color: 'blue' }}
                    suffixIcon={<img src={datePickerIcon} />}
                  />
                </Form.Item>
                <Form.Item label="End Date">
                  <DatePicker
                    placeholder="Enter End Date"
                    name="endDate"
                    onChange={(event) => {
                      this.setState({ endDate: moment(event).format('YYYY-MM-DD') });
                    }}
                    style={{ width: '95%', borderRadius: '2px', color: 'blue' }}
                    suffixIcon={<img src={datePickerIcon} />}
                  />
                </Form.Item>
                <Form.Item label="Reserved End Date">
                  <DatePicker
                    placeholder="Enter Date"
                    name="reservedEndDate"
                    onChange={(event) => {
                      this.setState({ reservedEndDate: moment(event).format('YYYY-MM-DD') });
                    }}
                    style={{
                      width: '95%',
                      borderRadius: '2px',
                      color: 'blue',
                      background: '#F4F6F7',
                    }}
                    suffixIcon={<img src={datePickerIcon} />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Comments (optional)">
              <TextArea
                placeholder="Enter Comments"
                name="Comment"
                value={this.state.Comment}
                onChange={(event) => {
                  this.setState({ Comment: event.target.value });
                }}
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </Form.Item>
            <p style={{ color: 'lightgray' }}>*Tentative End Date</p>
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
          </Form>
        </Modal>
      </div>
    );
  }
}

export default AddActionBTN;
