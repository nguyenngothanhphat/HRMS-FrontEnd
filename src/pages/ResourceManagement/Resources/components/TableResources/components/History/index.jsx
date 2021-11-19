import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import historyIcon from '@/assets/resource-management-edit1.svg';
import editIcon from '@/assets/resource-management-edit-history.svg';
import styles from './index.less';

@connect(({ resourceManagement: { resourceList } }) => ({ resourceList }))
class HistoryActionBTN extends Component {
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
    const { resourceList = [], dataPassRow = {} } = this.props;
    const getEmpInListResource = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
    const { projects = [] } = getEmpInListResource || {};
    const { managerInfo = {} } = getEmpInListResource || {};
    const dataSource = projects
      .map((x, index) => {
        return {
          key: index + 1,
          ProjectName: x.ProjectName || '-',
          StartDate: moment(x.startDate).format('MM-DD-YYYY') || '-',
          EndDate: moment(x.endDate).format('MM-DD-YYYY') || '-',
          Billing: x.status || '-',
          Description: x.projectDescription || '-',
        };
      })
      .sort((a, b) => {
        if (!a.endDate || !b.endDate) {
          return 0;
        }
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      });

    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'ProjectName',
        key: 'ProjectName',
        width: '25%',
        render: (value) => {
          const active = true;
          return (
            <p>
              {value}{' '}
              <span className={styles.labelProject}>
                {value}
                {active ? 'Current' : ''}
              </span>
            </p>
          );
        },
      },
      {
        title: (
          <div>
            <div>Start Date</div>
            <div>(mm/dd/yyyy)</div>
          </div>
        ),
        dataIndex: 'StartDate',
        key: 'StartDate',
        width: '15%',
      },
      {
        title: (
          <div>
            <div>End Date</div>
            <div>(mm/dd/yyyy)</div>
          </div>
        ),
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
              </span>
            </p>
          );
        },
      },
    ];
    const { visible } = this.state;
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
          visible={visible}
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
            Emp Id:<span className={styles.showInfoEmp}> {managerInfo.employeeId || '-'}</span>
          </p>
          <p className={styles.showInfo}>
            Name: <span className={styles.showInfoEmp}> {dataPassRow.employeeName}</span>
          </p>
          <p className={styles.showInfo}>
            Designation: <span className={styles.showInfoEmp}> {dataPassRow.designation}</span>
          </p>
          <p className={styles.showInfo}>
            Experience: <span className={styles.showInfoEmp}> {dataPassRow.experience}</span>
          </p>
          <p className={styles.showInfo}>
            Total project: <span className={styles.showInfoEmp}>{projects.length}</span>
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

export default HistoryActionBTN;
