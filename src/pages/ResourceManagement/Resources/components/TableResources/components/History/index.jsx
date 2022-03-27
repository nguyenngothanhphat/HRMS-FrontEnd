import React, { Component } from 'react';
import { Table, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';

import styles from './index.less';

@connect(({ resourceManagement: { resourceList } }) => ({ resourceList }))
class HistoryActionBTN extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // renderEmployeeName =(workEmail)=>{
  //   const employeeName
  //   const userName = workEmail.substring(0, workEmail.indexOf('@'));
  //   return employeeName = `${workMail.legalName} ${userName ? `(${userName})` : ''}`;
  // }

  render() {
    const { resourceList = [], dataPassRow = {}, visible, onClose = () => {} } = this.props;
    const getEmpInListResource = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
    const { projects = [] } = getEmpInListResource || {};
    const { managerInfo = {} } = getEmpInListResource || {};
    const dataSource = projects
      .map((x, index) => {
        return {
          key: index + 1,
          ProjectName: x.project.projectName || '-',
          StartDate: moment(x.startDate).format('MM-DD-YYYY') || '-',
          EndDate: moment(x.endDate).format('MM-DD-YYYY') || '-',
          Billing: x.status || '-',
          Description: x.project.projectDescription || '-',
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
            <div>
              <span className={styles.projectname}> {value}</span>
              <span className={styles.labelProject}>{active ? ' Current' : ''}</span>
            </div>
          );
        },
      },
      {
        title: (
          <div>
            <div>Start Date</div>
            <div className={styles.date}>(mm/dd/yyyy)</div>
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
            <div className={styles.date}>(mm/dd/yyyy)</div>
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
        render: (value) => {
          if (value.length < 35) {
            return <p>{value}</p>;
          }
          return (
            <p className={styles.rowHover}>
              {value && value.slice(0, 35)}
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
    return (
      <div className={styles.HistoryActionBTN}>
        <Modal
          className={styles.modalViewHistoryProject}
          title="Resource History"
          width="900px"
          visible={visible}
          footer={null}
          onOk={onClose}
          onCancel={onClose}
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
          <div className={styles.resourceInfo}>
            <p className={styles.showInfo}>
              Emp Id:<span className={styles.showInfoEmp}> {managerInfo.employeeId || '-'}</span>
            </p>
            <div className={styles.showInfoName}>
              Name: <span className={styles.showInfoEmp}> {dataPassRow.employeeName}</span>
              <div className={styles.avatar}>
                <img
                  src={dataPassRow.avatar || MockAvatar}
                  alt=""
                  onError={`this.src=${MockAvatar}`}
                />
              </div>
            </div>
            <p className={styles.showInfo}>
              Designation: <span className={styles.showInfoEmp}> {dataPassRow.designation}</span>
            </p>
            <p className={styles.showInfo}>
              Experience: <span className={styles.showInfoEmp}> {dataPassRow.experience} yrs</span>
            </p>
            <p className={styles.showInfo}>
              Total Projects: <span className={styles.showInfoEmp}>{projects.length}</span>
            </p>
          </div>

          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Modal>
      </div>
    );
  }
}

export default HistoryActionBTN;
