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
import addAction from '@/assets/resource-action-add1.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import editIcon from '@/assets/resource-management-edit-history.svg';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

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

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { sendData, dataPassRow } = this.props;
    const getEmpInListResource = sendData.find((obj) => obj._id === dataPassRow.employeeId);
    const listProjectsOfEmp = getEmpInListResource ? getEmpInListResource.projects : [];
    const managerInfoOfEmp = getEmpInListResource ? getEmpInListResource.managerInfo : [];
    const { employeeId } = managerInfoOfEmp;
    const dataSource = [];
    for (let i = 0; i < listProjectsOfEmp.length; i++) {
      dataSource.push({
        key: i + 1,
        ProjectName: listProjectsOfEmp[i].ProjectName || '-',
        StartDate: moment(listProjectsOfEmp[i].startDate).format('MM-DD-YYYY') || '-',
        EndDate: moment(listProjectsOfEmp[i].endDate).format('MM-DD-YYYY') || '-',
        Billing: listProjectsOfEmp[i].projectStatus || '-',
        Description: listProjectsOfEmp[i].projectDescription || '-',
      });
    }

    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        width: '25%',
        render: (value) => {
          if (value === 'Project 3') {
            return <p>{value}</p>;
          }
          return (
            <p>
              {value} <span className={styles.lableProject}>Current</span>
            </p>
          );
        },
      },
      {
        title: 'Start Date',
        dataIndex: 'StartDate',
        key: 'StartDate',
        width: '15%',
      },
      {
        title: 'End Date',
        dataIndex: 'EndDate',
        key: 'EndDate',
        width: '15%',
      },
      {
        title: 'Billing Status',
        dataIndex: 'Billing',
        key: 'Billing',
        width: '20%',
      },
      {
        title: 'Project Description',
        dataIndex: 'Description',
        key: 'Description',
        width: '25%',
        render: (value, row) => {
          if (value.length < 35) {
            return <p>{value}</p>;
          }
          return (
            <p className={styles.rowHover}>
              {value.slice(0, 35)}
              <span>
                ...{' '}
                <a href="#" className={styles.readMore}>
                  Read More
                </a>
                <img
                  src={editIcon}
                  onClick={() => this.showBTNEdit(row)}
                  alt=""
                  className={styles.iconEdit}
                />
              </span>
            </p>
          );
        },
      },
    ];
    return (
      <div className={styles.btnEdit}>
        <img
          src={historyIcon}
          alt="historyIcon"
          onClick={() => this.showModal()}
          className={styles.buttonEdit}
        />
        <Modal
          className={styles.modalAdd}
          title="Resource History"
          width="60%"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={{ style: { color: 'blue', with: '100px' } }}
          okText="Done"
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
          <p className={styles.showInfo}>
            Emp Id : PS-<span className={styles.showInfoEmp}> {employeeId}</span>
          </p>
          <p className={styles.showInfo}>
            Name : <span className={styles.showInfoEmp}> {dataPassRow.employeeName}</span>
          </p>
          <p className={styles.showInfo}>
            Designation : <span className={styles.showInfoEmp}> {dataPassRow.designation}</span>
          </p>
          <p className={styles.showInfo}>
            Experience : <span className={styles.showInfoEmp}> {dataPassRow.experience}</span>
          </p>
          <p className={styles.showInfo}>
            Total project : <span className={styles.showInfoEmp}>{listProjectsOfEmp.length}</span>
          </p>
          <br />
          <br />
          {/* <p>{JSON.stringify(listProjectsOfEmp)}</p> */}
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Modal>
      </div>
    );
  }
}

export default EditActionBTN;
