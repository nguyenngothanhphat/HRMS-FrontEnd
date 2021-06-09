import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Table } from 'antd';
import { getCurrentTenant } from '@/utils/authority';
import PlusIcon from '@/assets/plusIcon1.svg';
import MinusIcon from '@/assets/minusIcon1.svg';
import styles from './index.less';

@connect(({ employeeProfile, loading }) => ({
  employeeProfile,
  loading:
    loading.effects['employeeProfile/addNewChangeHistory'] ||
    loading.effects['employeeProfile/fetchCompensation'] ||
    loading.effects['employeeProfile/fetchCompensationList'] ||
    loading.effects['employeeProfile/revokeHistory'],
}))
class ChangeHistoryTable extends PureComponent {
  constructor(props) {
    super(props);
    const { employeeProfile } = this.props;
    this.state = {
      employee:
        employeeProfile?.originData?.generalData?.legalName ||
        employeeProfile?.originData?.generalData?.firstName,
      expand: false,
      expandData: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    const { employeeProfile: { originData: { changeHistories = [] } = {} } = {} } = this.props;

    // console.log('prev', prevProps.employeeProfile.originData.changeHistories);
    // console.log('props', changeHistories);
    const prevHistories = prevProps.employeeProfile.originData.changeHistories || [];
    if (JSON.stringify(prevHistories) !== JSON.stringify(changeHistories)) {
      // (!prevHistories || prevHistories.length === 0)
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
      effectiveDate: moment(item?.effectiveDate).locale('en').format('MM.DD.YY'),
      changedBy: 'HR Admin',
      changedDate: moment(item?.changeDate).locale('en').format('MM.DD.YY'),
      action: item?.takeEffect === 'WILL_UPDATE' ? 'Revoke' : '',
      id: item?._id,
    }));
    console.log(newData);

    this.setState({
      expandData: newData,
    });
  };

  generateColumns = () => {
    const { employee } = this.state;
    const columns = [
      {
        title: 'Changed Information',
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
              {info.promotedPosition ? (
                <div>
                  {employee} is promoted to {info.promotedPosition} postion
                </div>
              ) : null}

              {info.location ? <div>Location: {info.location}</div> : null}
              {info.deparment ? (
                <div>
                  {employee} switched to department: {info.deparment}
                </div>
              ) : null}
              {info.employment ? (
                <div>
                  New employment: <b>{info.employment}</b>
                </div>
              ) : null}
              {info.compensation ? (
                <div>
                  New payment: <b>{info.compensation}</b>
                </div>
              ) : null}
              {info.manager ? (
                <div>
                  {employee} is now reporting to: <b>{info.manager}</b>
                </div>
              ) : null}
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
        title: 'Changed By',
        dataIndex: 'changedBy',
        key: 'changedBy',
        align: 'left',
      },
      {
        title: 'Changed Date',
        key: 'changedDate',
        dataIndex: 'changedDate',
        align: 'left',
        render: (changedDate) => <span>{changedDate}</span>,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'left',
        render: (action, item) => (
          <span
            className={styles.changeHistoryTable_action}
            onClick={() => this.handleClick(item.id)}
          >
            {action}
          </span>
        ),
      },
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

    console.log(employeeId);

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

  formatData = (expandData) => {
    const { expand } = this.state;
    const data = [...expandData];

    if (expand) {
      return data;
    }
    if (expandData?.length > 5 && !expand) {
      return data.slice(0, 5);
    }

    return data;
  };

  render() {
    const { expand, expandData } = this.state;
    const { loading } = this.props;
    const footer = () => (
      <>
        {expandData.length > 5 ? (
          <div className={styles.changeHistoryTable__icon} onClick={this.handleExpand}>
            <img alt="collapse" src={expand ? MinusIcon : PlusIcon} />
            <div>{expand ? 'Collapse' : 'Expand All'}</div>
          </div>
        ) : null}
      </>
    );

    return (
      <div className={styles.changeHistoryTable}>
        <Table
          loading={loading}
          size="small"
          columns={this.generateColumns()}
          dataSource={this.formatData(expandData)}
          pagination={false}
          footer={expandData.length === 0 ? null : footer}
        />
      </div>
    );
  }
}

export default ChangeHistoryTable;
