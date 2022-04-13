import React, { PureComponent } from 'react';
import { Table, Popover } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import AddModal from './components/Add';
import EditModal from './components/Edit';
import HistoryModal from './components/History';
import editIcon from '@/assets/resource-management-edit-history.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import addAction from '@/assets/resource-action-add1.svg';
import styles from './index.less';
import ProjectProfile from '../ComplexView/components/PopoverProfiles/components/ProjectProfile';
import PopoverInfo from '../ComplexView/components/PopoverProfiles/components/UserProfile';
import CommentModal from './components/Comment';
import CommentOverlay from '../ComplexView/components/Overlay';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';

@connect(
  ({
    loading,
    offboarding: { approvalflow = [] } = {},
    user: { permissions = {} },
    location: { companyLocationList = [] },
  }) => ({
    loadingTerminateReason: loading.effects['offboarding/terminateReason'],
    approvalflow,
    permissions,
    companyLocationList,
  }),
)
class TableResources extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // pageNavigation: '1',
      currentTime: moment(),
      visible: false,
      dataPassRow: {},
      visibleAdd: false,
      visibleHistory: false,
    };
  }

  componentDidMount = () => {
    this.setCurrentTime();
  };

  showModal = (row) => {
    this.setState({
      visible: true,
      dataPassRow: row,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showModalAdd = (row) => {
    this.setState({
      visibleAdd: true,
      dataPassRow: row,
    });
  };

  handleCancelAdd = () => {
    this.setState({
      visibleAdd: false,
    });
  };

  showModalHistory = (row) => {
    this.setState({
      visibleHistory: true,
      dataPassRow: row,
    });
  };

  handleCancelHistory = () => {
    this.setState({
      visibleHistory: false,
    });
  };

  setCurrentTime = () => {
    // compare two time by hour & minute. If minute changes, get new time
    const timeFormat = 'HH:mm';
    const { currentTime } = this.state;
    const parseTime = (timeString) => moment(timeString, timeFormat);
    const check = parseTime(moment().format(timeFormat)).isAfter(
      parseTime(moment(currentTime).format(timeFormat)),
    );

    if (check) {
      this.setState({
        currentTime: moment(),
      });
    }
  };

  handleSelect = (e) => {
    e.preventDefault();
  };

  onTableChange = (sorter) => {
    const { onSort } = this.props;
    if (sorter) {
      const { order } = sorter;
      const sort = {};
      if (order) {
        // const sortField =
        sort.sortBy = this.sortFieldByKey(sorter.columnKey);
        sort.sortType = order === 'ascend' ? 1 : -1;
      }
      onSort(sort);
    }
  };

  /**
   * sort obj { sortBy: 'column', sortType: 'ascend' ? 1 : -1}
   * @param {*} key columnKey
   * @returns match key define to sort from server
   */
  sortFieldByKey = (key) => {
    switch (key) {
      case 'employeeName':
        return 'legalName';
      case 'designation':
        return 'title';
      case 'experience':
        return 'totalExp';
      default:
        return key;
    }
  };

  render() {
    const {
      data = [],
      textEmpty = 'No Data',
      loading,
      total,
      pageSelected,
      size,
      getPageAndSize,
      refreshData,
      allowModify = true,
    } = this.props;

    const { visible, dataPassRow, visibleHistory, visibleAdd } = this.state;
    const pagination = {
      position: ['bottomLeft'],
      total, // totalAll,
      showTotal: () => (
        <span>
          Showing{' '}
          <b>
            {(pageSelected - 1) * size + 1} - {pageSelected * size}
          </b>{' '}
          of {total}
        </span>
      ),
      defaultPageSize: size,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        return getPageAndSize(page, pageSize);
      },
    };

    const localCompare = (a, b) => {
      if (!a && !b) {
        return 0;
      }
      if (!a && b) {
        return -1;
      }
      if (a && !b) {
        return 1;
      }
      return a.localeCompare(b);
    };
    const resourceStatusClass = (resourceStatus) => {
      try {
        if (resourceStatus && resourceStatus.includes('Now')) {
          return 'now';
        }
        if (resourceStatus && resourceStatus.includes('Soon')) {
          return 'soon';
        }
        return 'available';
      } catch (ex) {
        return 'available';
      }
    };

    const getRowSpan = (children, row, index) => {
      const obj = {
        children,
        props: {},
      };

      const rowLength = data.filter((x) => x.employeeId === row.employeeId).length;
      const firstIndex = data.findIndex((x) => x.employeeId === row.employeeId);

      if (rowLength < 2) {
        obj.props.rowSpan = rowLength;
      } else if (firstIndex === index) {
        obj.props.rowSpan = rowLength;
      } else {
        obj.props.rowSpan = 0;
      }
      return obj;
    };

    const columns = () => {
      return [
        {
          title: 'Name',
          dataIndex: 'employeeName',
          key: 'employeeName',
          render: (value, row, index) => {
            const statusClass = resourceStatusClass(row.availableStatus);
            const div = (
              <div>
                <div>
                  <div className={styles.resourceStatus}>
                    <span className={styles[statusClass]}>{row.availableStatus}</span>
                  </div>
                </div>

                <Popover
                  placement="leftTop"
                  overlayClassName={styles.UserProfilePopover}
                  content={<PopoverInfo employeeId={row.employeeId} />}
                  trigger="hover"
                >
                  <div className={styles.userProfile}>
                    <div className={styles.avatar}>
                      <img
                        src={row.avatar || MockAvatar}
                        alt="avatar"
                        onError={`this.src=${MockAvatar}`}
                      />
                    </div>
                    <div className={styles.employeeName}>{value}</div>
                  </div>
                </Popover>
              </div>
            );
            return getRowSpan(div, row, index);
          },
          // sorter: (a, b) => {
          //   return a.employeeName.localeCompare(b.employeeName);
          // },
          fixed: 'left',
          className: 'firstColumn',
          sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Division',
          dataIndex: 'division',
          key: 'division',
          render: (value, row, index) => {
            return getRowSpan(<span className={styles.division}>{value}</span>, row, index);
          },
          // sorter: (a, b) => {
          //   return localCompare(a.division, b.division);
          // },
          // sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Designation',
          dataIndex: 'designation',
          key: 'designation',
          render: (value, row, index) => {
            const children = <span className={styles.basicCellField}>{value}</span>;
            return getRowSpan(children, row, index);
          },
          // sorter: (a, b) => {
          //   return localCompare(a.designation, b.designation);
          // },
          // sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Experience (in yrs)',
          dataIndex: 'experience',
          render: (value, row, index) => {
            return getRowSpan(
              <span className={styles.basicCellField}>{value}</span>,
              row,

              index,
            );
          },
          // sorter: (a, b) => {
          //   return a.experience - b.experience;
          // },
          // sortDirections: ['ascend', 'descend'],
        },
        {
          title: 'Current Project(s)',
          dataIndex: 'projectName',
          render: (value, row) => {
            const employeeRowCount = data.filter((x) => x.employeeId === row.employeeId).length;
            const display = (
              <ProjectProfile placement="leftTop" projectId={row.project}>
                <span className={styles.employeeName}>{value || '-'}</span>
              </ProjectProfile>
            );
            const obj = {
              children: display,
              props: {
                rowSpan: 1,
                className: employeeRowCount > 1 ? 'left-border' : '',
              },
            };
            return obj;
          },
        },
        {
          title: 'Status',
          dataIndex: 'billStatus',
          key: 'billStatus',
          align: 'center',
          render: (billStatus) => {
            return <span className={styles.basicCellField}> {billStatus}</span>;
          },
        },
        {
          title: 'Utilization',
          dataIndex: 'utilization',
          key: 'utilization',
          render: (value) => {
            return <span>{value} %</span>;
          },
        },
        {
          title: (
            <div className={styles.dateHeaderContainer}>
              <div>Start Date</div>
              <div className={styles.dateFormat}>(mm/dd/yyyy)</div>
            </div>
          ),
          dataIndex: 'startDate',
          key: 'startDate',
          render: (value) => {
            return <span className={styles.basicCellField}>{value}</span>;
          },
        },
        {
          title: (
            <div className={styles.dateHeaderContainer}>
              <div>End Date</div>
              <div className={styles.dateFormat}>(mm/dd/yyyy)</div>
            </div>
          ),
          dataIndex: 'endDate',
          key: 'endDate',
          render: (value) => {
            return <span className={styles.basicCellField}>{value}</span>;
          },
        },
        {
          title: (
            <div className={styles.dateHeaderContainer}>
              <div>Revised End Date</div>
              <div className={styles.dateFormat}>(mm/dd/yyyy)</div>
            </div>
          ),
          dataIndex: 'revisedEndDate',
          key: 'revisedEndDate',
          render: (value, row) => {
            let display = '-';
            const employeeRowCount = data.filter((x) => x.employeeId === row.employeeId).length;
            if (row.projectName === '' && row.startDate === '-') {
              display = <div className={styles.reservedField}>{value}</div>;
            } else {
              display = (
                <div className={styles.reservedField}>
                  {value}
                  <div className={styles.resourceManagementEdit}>
                    {allowModify && (
                      <div className={styles.buttonContainer}>
                        <img src={editIcon} alt="historyIcon" onClick={() => this.showModal(row)} />
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            const obj = {
              children: display,
              props: {
                rowSpan: 1,
                className: `${styles.basicCellFieldShowEdit} ${
                  employeeRowCount > 1 ? 'right-border' : ''
                }`,
              },
            };
            return obj;
          },
        },
        {
          title: 'Comments',
          dataIndex: 'comment',
          key: 'comment',
          render: (value, row, index) => {
            const employeeRowCount = data.filter((x) => x.employeeId === row.employeeId).length;
            let text;
            if (value) {
              const line =
                employeeRowCount === 0 || employeeRowCount === 1 ? 3 : employeeRowCount * 3;
              text = (
                <CommentOverlay
                  row={row}
                  line={line}
                  refreshData={refreshData}
                  allowModify={allowModify}
                />
              );
            } else {
              text = (
                <span>{allowModify && <CommentModal data={row} refreshData={refreshData} />}</span>
              );
            }
            return getRowSpan(text, row, index);
          },
        },
        {
          title: 'Actions',
          width: '6%',
          // dataIndex: 'subject',
          key: 'action',
          render: (value, row, index) => {
            const action = (
              <div className={styles.actionParent}>
                <div className={styles.buttonGroup}>
                  {allowModify && (
                    <img
                      src={addAction}
                      alt="attachIcon"
                      onClick={() => this.showModalAdd(row)}
                      className={styles.buttonAdd}
                    />
                  )}

                  <img
                    src={historyIcon}
                    alt="historyIcon"
                    onClick={() => this.showModalHistory(row)}
                    className={styles.buttonEdit}
                  />
                </div>
              </div>
            );
            return getRowSpan(action, row, index);
          },
          className: 'right-left-border',
          fixed: 'right',
        },
      ];
    };

    return (
      <div className={styles.TableResources}>
        <Table
          // width="100%"
          locale={{
            emptyText: (
              <div className={styles.viewEmpty}>
                <img src={empty} alt="" />
                <p className={styles.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
          columns={columns()}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          onChange={this.onTableChange}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
        <EditModal
          visible={visible}
          refreshData={refreshData}
          dataPassRow={dataPassRow}
          onClose={() => this.handleCancel(false)}
          mode="multiple"
        />
        <AddModal
          visible={visibleAdd}
          refreshData={refreshData}
          dataPassRow={dataPassRow}
          onClose={() => this.handleCancelAdd(false)}
          mode="multiple"
        />
        <HistoryModal
          visible={visibleHistory}
          dataPassRow={dataPassRow}
          onClose={() => this.handleCancelHistory(false)}
          mode="multiple"
        />
      </div>
    );
  }
}
export default TableResources;
