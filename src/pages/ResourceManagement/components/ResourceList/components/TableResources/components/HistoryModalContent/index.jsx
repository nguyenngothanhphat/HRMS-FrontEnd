import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import CommonTable from '@/components/CommonTable';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import styles from './index.less';

@connect(({ resourceManagement: { resourceList } }) => ({ resourceList }))
class HistoryModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { resourceList = [], dataPassRow = {} } = this.props;
    const getEmpInListResource = resourceList.find((obj) => obj._id === dataPassRow.employeeId);
    const { projects = [] } = getEmpInListResource || {};
    const { managerInfo = {} } = getEmpInListResource || {};

    const dateFormat = (date) => (date ? moment(date).format(DATE_FORMAT_MDY) : '-');

    const dataSource = projects
      .map((projectInfo, index) => {
        const {
          revisedEndDate,
          project: { projectName = '-', projectDescription = '' } = {},
          startDate = '',
          endDate = '',
          status = '-',
        } = projectInfo;

        return {
          key: index + 1,
          projectName: projectName || '-',
          startDate: dateFormat(startDate),
          endDate: revisedEndDate ? dateFormat(revisedEndDate) : dateFormat(endDate),
          status: status || '',
          projectDescription: projectDescription || '-',
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
        dataIndex: 'projectName',
        key: 'projectName',
        width: '25%',
        render: (value) => {
          const active = true;
          return (
            <div className={styles.project}>
              <span className={styles.projectName}> {value}</span>
              {active && <Tag color="#ffe9c5">Current</Tag>}
            </div>
          );
        },
      },
      {
        title: (
          <div>
            <div>Start Date</div>
            <div className={styles.date}>({DATE_FORMAT_MDY.toLowerCase()})</div>
          </div>
        ),
        dataIndex: 'startDate',
        key: 'startDate',
        width: '15%',
      },
      {
        title: (
          <div>
            <div>End Date</div>
            <div className={styles.date}>({DATE_FORMAT_MDY.toLowerCase()})</div>
          </div>
        ),
        dataIndex: 'endDate',
        key: 'endDate',
        width: '15%',
      },
      {
        title: 'Billing Status',
        dataIndex: 'status',
        key: 'status',
        width: '20%',
      },
      {
        title: 'Project Description',
        dataIndex: 'projectDescription',
        key: 'projectDescription',
        width: '25%',
        render: (value) => {
          if (value.length < 35) {
            return <span>{value}</span>;
          }
          return (
            <span className={styles.rowHover}>
              {value && value.slice(0, 35)}
              <span>
                ...{' '}
                <a href="#" className={styles.readMore}>
                  Read More
                </a>
              </span>
            </span>
          );
        },
      },
    ];
    return (
      <div className={styles.HistoryModalContent}>
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
                onError={(e) => {
                  e.target.src = MockAvatar;
                }}
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

        <CommonTable list={dataSource} columns={columns} showPagination={false} />
      </div>
    );
  }
}

export default HistoryModalContent;
