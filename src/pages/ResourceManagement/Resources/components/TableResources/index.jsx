import React, { PureComponent } from 'react';
import { Table, Popover } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import AddModal from './components/Add';
import EditMoal from './components/Edit';
import HistoryModal from './components/History';
import editIcon from '@/assets/resource-management-edit-history.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import addAction from '@/assets/resource-action-add1.svg';
import styles from './index.less';
import ProjectProfile from '../ComplexView/components/PopoverProfiles/components/ProjectProfile';
import PopoverInfo from '../ComplexView/components/PopoverProfiles/components/UserProfile';
import CommentModal from './components/Comment';
import CommentOverlay from '../ComplexView/components/Overlay';

@connect(
  ({
    loading,
    offboarding: { approvalflow = [] } = {},
    user: { permissions = {} },
    locationSelection: { listLocationsByCompany = [] },
  }) => ({
    loadingTerminateReason: loading.effects['offboarding/terminateReason'],
    approvalflow,
    permissions,
    listLocationsByCompany,
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

    const mapping = new Set();

    const getRowSpans = (arr, key) => {
      let sameValueLength = 0;
      const rowSpans = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        if (i === 0) {
          rowSpans[i] = sameValueLength + 1;
          continue;
        }
        if (arr[i][key] === arr[i - 1][key]) {
          rowSpans[i] = 0;
          sameValueLength++;
        } else {
          rowSpans[i] = sameValueLength + 1;
          sameValueLength = 0;
        }
      }
      return rowSpans;
    };

    // const rowSpans = getRowSpans(data, 'employeeName');
    // const rowDivison = getRowSpans(data, 'division');
    // const rowDesignation = getRowSpans(data, 'designation');
    // const rowExperience = getRowSpans(data, 'experience');
    // const rowComments = (data, 'comment');

    const getRowSpansDa = (type, index) => {
      return getRowSpans(data, type)[index];
    };

    // const renderCell = (value, row, display) => {
    //   const obj = {
    //     children: display,
    //     props: {
    //       rowSpan: 0,
    //       className: styles.disableHover,
    //     },
    //   };
    //   const template = `${row.employeeId}_${value}`;
    //   if (!mapping.has(template)) {
    //     const count = data.filter((x) => {
    //       return x.employeeId === row.employeeId;
    //     }).length;
    //     obj.props.rowSpan = count;
    //     mapping.add(template);
    //   }
    //   return obj;
    // };

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
    const columns = [
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
                <div className={styles.employeeName}>{value}</div>
              </Popover>
            </div>
          );
          const obj = {
            children: div,
            props: {},
          };

          obj.props.rowSpan = getRowSpansDa('employeeName', index);
          return obj;
          // const div= (
          //   <div>
          //     <div>
          //       <div className={styles.resourceStatus}>
          //         <span className={styles[statusClass]}>{row.availableStatus}</span>
          //       </div>
          //     </div>

          //     <Popover
          //       placement="leftTop"
          //       overlayClassName={styles.UserProfilePopover}
          //       content={<PopoverInfo employeeId={row.employeeId} />}
          //       trigger="hover"
          //     >
          //       <div className={styles.employeeName}>{value}</div>
          //     </Popover>
          //   </div>
          // );
          // return renderCell(value, row, div);
        },
        sorter: (a, b) => {
          return a.employeeName.localeCompare(b.employeeName);
        },
        fixed: 'left',
        className: 'firstColumn',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        render: (value, _, index) => {
          const display = <span className={styles.division}>{value}</span>;
          const obj = {
            children: display,
            props: {},
          };

          obj.props.rowDivision = getRowSpansDa('division', index);
          return obj;
        },
        sorter: (a, b) => {
          return localCompare(a.division, b.division);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
        render: (value, _, index) => {
          const display = <span className={styles.basicCellField}>{value}</span>;
          const obj = {
            children: display,
            props: {},
          };

          obj.props.rowDesignation = getRowSpansDa('designation', index);
          return obj;
        },
        sorter: (a, b) => {
          return localCompare(a.designation, b.designation);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Experience (in yrs)',
        dataIndex: 'experience',
        render: (value, _, index) => {
          const display = <span className={styles.basicCellField}>{value}</span>;
          const obj = {
            children: display,
            props: {},
          };

          obj.props.rowExperience = getRowSpansDa('experience', index);
          return obj;
        },
        sorter: (a, b) => {
          return a.experience - b.experience;
        },
        sortDirections: ['ascend', 'descend'],
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
          // return <span className={styles.basicCellField}>{value}</span>;
          // const display = <span className={styles.basicCellField}>{value}</span>;
          // const obj = renderCell(value, row, display);
          // obj.props.className = styles.basicCellFieldShowEdit;
          // return obj
          let display = '-';
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
              className: styles.basicCellFieldShowEdit,
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
          // return text;
          // const obj = renderCell('comment', row, text);
          // obj.props.className = employeeRowCount > 1 ? 'commentCellLeftBorder' : 'commentCell';
          // return obj;
          const obj = {
            children: text,
            props: {},
          };

          obj.props.rowComments = getRowSpansDa('comment', index);
          return obj;
        },
      },
      {
        title: 'Actions',
        width: '6%',
        // dataIndex: 'subject',
        key: 'action',
        render: (value, row) => {
          return (
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
          // const obj = renderCell('add', row, buttonGroup);
          // if (col === data.length - 1) {
          //   mapping.clear();
          // }
          // return obj;
        },
        className: 'right-left-border',
        fixed: 'right',
      },
    ];

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
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          onChange={this.onTableChange}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
        <EditMoal
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
