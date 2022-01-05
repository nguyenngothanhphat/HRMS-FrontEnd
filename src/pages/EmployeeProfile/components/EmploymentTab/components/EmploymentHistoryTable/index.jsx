import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Table } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

@connect(({ employeeProfile, loading }) => ({
  employeeProfile,
  loading:
    loading.effects['employeeProfile/addNewChangeHistory'] ||
    loading.effects['employeeProfile/fetchCompensation'] ||
    loading.effects['employeeProfile/fetchCompensationList'] ||
    loading.effects['employeeProfile/revokeHistory'],
}))
class EmploymentHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      expandData: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    const { employeeProfile: { originData: { changeHistories = [] } = {} } = {} } = this.props;
    const prevHistories = prevProps.employeeProfile.originData.changeHistories || [];
    if (JSON.stringify(prevHistories) !== JSON.stringify(changeHistories)) {
      this.getData();
    }
  }

  getData = () => {
    const { employeeProfile: { originData: { changeHistories = [] } = {} } = {} } = this.props;

    const newData = changeHistories.map((item, index) => ({
      key: `${index + 1}`,
      changedInfomation: {
        promotedPosition: item?.title?.name,
        location: item?.location?.name,
        department: item?.department?.name,
        employment: item?.employeeType?.name,
        compensation: item?.compensationType,
        manager: item?.manager?.generalInfo?.legalName || item?.manager?.generalInfo?.firstName,
      },
      effectiveDate: moment(item?.effectiveDate).locale('en').format('Do MMM YYYY'),
      changedBy: item?.changeBy?.generalInfo?.legalName || '',
      changedDate: moment(item?.changeDate).locale('en').format('Do MMM YYYY'),
      action: item?.takeEffect === 'WILL_UPDATE' ? 'Revoke' : '',
      id: item?._id,
    }));

    this.setState({
      expandData: newData,
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Change Type',
        dataIndex: 'changedInfomation',
        key: 'changedInfomation',
        render: (changedInfomation) => {
          const info = changedInfomation;
          const keys = Object.keys(info);
          for (let i = 0; i < keys.length; i += 1) {
            if (info[keys[i]] === undefined) delete info[keys[i]];
          }
          return (
            <div>
              {info.promotedPosition && (
                <div className={styles.changeType}>
                  <span className={styles.type}>Promoted</span>
                  <span className={styles.value}>{info.promotedPosition}</span>
                </div>
              )}

              {info.location && (
                <div className={styles.changeType}>
                  <span className={styles.type}>Changed location</span>
                  <span className={styles.value}>{info.location}</span>
                </div>
              )}
              {info.deparment && (
                <div className={styles.changeType}>
                  <span className={styles.type}>Switched department</span>
                  <span className={styles.value}>{info.department}</span>
                </div>
              )}
              {info.employment && (
                <div className={styles.changeType}>
                  <span className={styles.type}>New employment</span>
                  <span className={styles.value}>{info.employment}</span>
                </div>
              )}
              {info.compensation && (
                <div className={styles.changeType}>
                  <span className={styles.type}>New payment</span>
                  <span className={styles.value}>{info.compensation}</span>
                </div>
              )}
              {info.manager && (
                <div className={styles.changeType}>
                  <span className={styles.type}>Changed manager</span>
                  <span className={styles.value}>{info.manager}</span>
                </div>
              )}
              {Object.keys(info).length === 0 ? <b>Nothing changed</b> : null}
            </div>
          );
        },
        align: 'left',
        width: '25%',
      },
      {
        title: 'Effective Date',
        dataIndex: 'effectiveDate',
        key: 'effectiveDate',
        align: 'left',
      },
      {
        title: 'Initiated Date',
        key: 'changedDate',
        dataIndex: 'changedDate',
        align: 'left',
        render: (changedDate) => <span>{changedDate}</span>,
      },
      {
        title: 'Changed By',
        dataIndex: 'changedBy',
        key: 'changedBy',
        align: 'left',
      },
      {
        title: 'Changed Reason',
        dataIndex: 'reason',
        key: 'reason',
        align: 'left',
        width: '25%',
        render: (reason) => reason || '',
      },
      // {
      //   title: 'Action',
      //   dataIndex: 'action',
      //   key: 'action',
      //   align: 'left',
      //   render: (action, item) => (
      //     <span
      //       className={styles.EmploymentHistory_action}
      //       onClick={() => this.handleClick(item.id)}
      //     >
      //       {action}
      //     </span>
      //   ),
      // },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  handleClick = (id) => {
    const {
      dispatch,
      employeeProfile: { originData: { generalData: { employee: employeeId = '' } = {} } = {} },
    } = this.props;

    dispatch({
      type: 'employeeProfile/revokeHistory',
      payload: {
        employee: employeeId,
        id,
        tenantId: getCurrentTenant(),
      },
    });
  };

  handleExpand = () => {
    this.setState((prevState) => ({
      expand: !prevState.expand,
    }));
  };

  formatData = (expandData, pageSize) => {
    const { expand } = this.state;
    const data = [...expandData];

    if (expand) {
      return data;
    }
    if (expandData?.length > pageSize.min && expandData?.length <= pageSize.max && !expand) {
      return data.slice(0, 5);
    }

    return data;
  };

  render() {
    const { expand, expandData } = this.state;
    const { loading } = this.props;
    const pageSize = {
      max: 50,
      min: 5,
    };

    const footer = () => (
      <>
        {expandData.length > pageSize.min && expandData.length <= pageSize.max ? (
          <div
            className={`${styles.EmploymentHistory__icons} ${
              expand ? styles.collapse : styles.expand
            } `}
            onClick={this.handleExpand}
          >
            {expand ? (
              <MinusCircleOutlined className={styles.EmploymentHistory__icons_icon} />
            ) : (
              <PlusCircleOutlined className={styles.EmploymentHistory__icons_icon} />
            )}
            <div>{expand ? 'Collapse all' : `Expand all ${expandData.length} records`}</div>
          </div>
        ) : null}
      </>
    );

    const pagination = {
      position: ['bottomLeft'],
      total: expandData.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {expandData.length}
        </span>
      ),
      pageSize: 10,
      // current: pageSelected,
      // onChange: this.onChangePagination,
    };

    return (
      <div className={styles.EmploymentHistory}>
        <Table
          loading={loading}
          size="middle"
          columns={this.generateColumns()}
          dataSource={this.formatData(expandData, pageSize)}
          footer={expandData.length === 0 ? null : footer}
          pagination={
            expandData.length > pageSize.max ? { ...pagination, total: expandData.length } : false
          }
        />
      </div>
    );
  }
}

export default EmploymentHistory;
