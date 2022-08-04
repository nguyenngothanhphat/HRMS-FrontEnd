import { Table, Tag } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import addAction from '@/assets/resource-action-add1.svg';
import editIcon from '@/assets/resource-management-edit-history.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import changeManagerIcon from '@/assets/resourceManagement/changeManagerIcon.svg';
import currentToNewManager from '@/assets/resourceManagement/currentToNewManager.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import EmptyComponent from '@/components/Empty';
import UserProfilePopover from '@/components/UserProfilePopover';
import ProjectRow from './components/ProjectRow';
import ProjectLayout from './components/ProjectLayout';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { projectDateFormat } from '@/utils/resourceManagement';
import CommentOverlay from '../ComplexView/components/Overlay';
import ProjectProfile from '../ComplexView/components/PopoverProfiles/components/ProjectProfile';
import AddModal from './components/Add';
import ChangeManagerModal from './components/ChangeManager';
import CommentModal from './components/Comment';
import EditModal from './components/Edit';
import HistoryModal from './components/History';
import WarnningModal from './components/Warnning';
import styles from './index.less';

@connect(
  ({
    loading,
    offboarding: { approvalflow = [] } = {},
    user: { permissions = {} },
    location: { companyLocationList = [] },
    resourceManagement: { resourceList = [] },
  }) => ({
    loadingTerminateReason: loading.effects['offboarding/terminateReason'],
    approvalflow,
    permissions,
    companyLocationList,
    resourceList,
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
      visibleManagerChange: false,
      visibleModalWarn: false,
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

  showModalManagerChange = (row) => {
    if (row.projects && row.projects.length > 1) {
      this.setState({
        visibleModalWarn: true,
        dataPassRow: row,
      });
    } else {
      this.setState({
        visibleManagerChange: true,
        dataPassRow: row,
      });
    }
  };

  handleCancelChangeManager = () => {
    this.setState({
      visibleManagerChange: false,
    });
  };

  handleCancelWarnning = () => {
    this.setState({
      visibleModalWarn: false,
    });
  };

  isShowModalManagerChange = (row) => {
    this.setState({
      visibleManagerChange: true,
      dataPassRow: row,
    });
    this.setState({
      visibleModalWarn: false,
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

  formatListSkill = (skills, colors) => {
    let temp = 0;
    const listFormat = skills.map((item) => {
      if (temp >= 5) {
        temp -= 5;
      }
      temp += 1;
      return {
        color: colors[temp - 1],
        name: item.name,
        id: item._id,
      };
    });
    return [...listFormat];
  };

  render() {
    const {
      data = [],
      // textEmpty = 'No Results Found',
      loading,
      total,
      pageSelected,
      size,
      getPageAndSize,
      refreshData,
      allowModify = true,
    } = this.props;

    const {
      visible,
      dataPassRow,
      visibleHistory,
      visibleAdd,
      visibleManagerChange,
      visibleModalWarn,
    } = this.state;

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

    const listColors = [
      {
        bg: '#E0F4F0',
        colorText: '#00c598',
      },
      {
        bg: '#ffefef',
        colorText: '#fd4546',
      },
      {
        bg: '#f1edff',
        colorText: '#6236ff',
      },
      {
        bg: '#f1f8ff',
        colorText: '#006bec',
      },
      {
        bg: '#fff7fa',
        colorText: '#ff6ca1',
      },
    ];

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

    const formatDataForm = (row, project) => {
      return {
        ...row,
        resourceId: project?.id,
        projectId: project?.project?.id,
        utilization: project?.utilization,
        startDate: project?.startDate,
        endDate: project?.endDate,
        projectName: project?.project?.projectName,
        revisedEndDate: project?.revisedEndDate,
        billStatus: project?.status,
      };
    };

    const dataHover = (employeeId) => {
      const { resourceList = [] } = this.props;
      const obj = resourceList.find((x) => x._id === employeeId) || {};
      return { ...obj, ...obj?.generalInfo };
    };

    const renderEmpty = () => <div className={styles.emptyItem}>-</div>;

    const columns = () => {
      return [
        {
          title: 'Name',
          dataIndex: 'employeeName',
          key: 'employeeName',
          render: (value, row, index) => {
            const availableStatus = row?.availableStatus;
            const statusClass = resourceStatusClass(availableStatus);
            const div = (
              <div>
                {availableStatus && (
                  <div>
                    <div className={styles.resourceStatus}>
                      <span className={styles[statusClass]}>{availableStatus}</span>
                    </div>
                  </div>
                )}
                <UserProfilePopover data={dataHover(row.employeeId)} placement="topLeft">
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
                </UserProfilePopover>
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
          title: 'Current Manager',
          dataIndex: 'managerName',
          key: 'managerName',
          render: (value, row, index) => {
            const managerChanged = row.managerChanged
              ? row.managerChanged?.managerInfo?.generalInfo.legalName
              : '';
            const dateEffective =
              row.managerChanged && row.managerChanged.effectiveDate
                ? moment(row.managerChanged.effectiveDate).locale('en').format('Do MMMM YYYY')
                : '';
            const children = (
              <span className={styles.basicCellField}>
                {value}
                {row.managerChanged && managerChanged !== value ? (
                  <p>
                    <img src={currentToNewManager} alt="" />{' '}
                    <a href="#" className={styles.currentToNewManager}>
                      {managerChanged} <p>{dateEffective}</p>
                    </a>
                  </p>
                ) : null}
              </span>
            );
            return getRowSpan(children, row, index);
          },
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
          dataIndex: 'projects',
          render: (projects) => {
            const projectLength = projects.length;
            const display = (
              <ProjectLayout>
                {projectLength
                  ? projects.map((project, index) => (
                    <ProjectProfile placement="leftTop" project={project}>
                      <div>
                        <ProjectRow
                          key={project.id}
                          value={project?.project?.projectName || '-'}
                          length={projectLength}
                          index={index}
                          className={styles.employeeName}
                        />
                      </div>
                    </ProjectProfile>
                    ))
                  : renderEmpty()}
              </ProjectLayout>
            );
            const obj = {
              children: display,
              props: {
                rowSpan: 1,
                className: 'left-border',
              },
            };
            return obj;
          },
        },
        {
          title: 'Billing Status',
          dataIndex: 'billStatus',
          key: 'billStatus',
          align: 'center',
          render: (projects) => {
            const projectLength = projects.length;
            return (
              <ProjectLayout>
                {projectLength
                  ? projects.map((project, index) => (
                    <ProjectRow
                      key={project.id}
                      value={project?.status || '-'}
                      length={projectLength}
                      index={index}
                    />
                    ))
                  : renderEmpty()}
              </ProjectLayout>
            );
          },
        },
        {
          title: 'Utilization',
          dataIndex: 'utilization',
          key: 'utilization',
          render: (projects) => {
            const projectLength = projects.length;
            return (
              <ProjectLayout>
                {projectLength
                  ? projects.map((project, index) => (
                    <ProjectRow
                      key={project.id}
                      value={`${project?.utilization || 0}%`}
                      length={projectLength}
                      index={index}
                    />
                    ))
                  : renderEmpty()}
              </ProjectLayout>
            );
          },
        },
        {
          title: (
            <div className={styles.dateHeaderContainer}>
              <div>Start Date</div>
              <div className={styles.dateFormat}>({DATE_FORMAT_MDY.toLowerCase()})</div>
            </div>
          ),
          dataIndex: 'startDate',
          key: 'startDate',
          render: (projects) => {
            const projectLength = projects.length;
            return (
              <ProjectLayout>
                {projectLength
                  ? projects.map((project, index) => (
                    <ProjectRow
                      key={project.id}
                      value={projectDateFormat(project?.startDate)}
                      length={projectLength}
                      index={index}
                    />
                    ))
                  : renderEmpty()}
              </ProjectLayout>
            );
          },
        },
        {
          title: (
            <div className={styles.dateHeaderContainer}>
              <div>End Date</div>
              <div className={styles.dateFormat}>({DATE_FORMAT_MDY.toLowerCase()})</div>
            </div>
          ),
          dataIndex: 'endDate',
          key: 'endDate',
          render: (projects) => {
            const projectLength = projects.length;
            return (
              <ProjectLayout>
                {projectLength
                  ? projects.map((project, index) => (
                    <ProjectRow
                      key={project.id}
                      value={projectDateFormat(project?.endDate)}
                      length={projectLength}
                      index={index}
                    />
                    ))
                  : renderEmpty()}
              </ProjectLayout>
            );
          },
        },
        {
          title: (
            <div className={styles.dateHeaderContainer}>
              <div>Revised End Date</div>
              <div className={styles.dateFormat}>({DATE_FORMAT_MDY.toLowerCase()})</div>
            </div>
          ),
          dataIndex: 'revisedEndDate',
          key: 'revisedEndDate',
          render: (projects, row) => {
            const projectLength = projects.length;
            const display = (
              <>
                <ProjectLayout length={projectLength}>
                  {projectLength
                    ? projects.map((project, index) => {
                        const dataRow = formatDataForm(row, project);
                        return (
                          <div key={project.id} className={styles.editRow}>
                            <ProjectRow
                              value={projectDateFormat(project?.revisedEndDate)}
                              length={projectLength}
                              index={index}
                            />
                            <div className={styles.resourceManagementEdit}>
                              {allowModify && (
                                <div className={styles.buttonContainer}>
                                  <img
                                    src={editIcon}
                                    alt="historyIcon"
                                    onClick={() => this.showModal(dataRow)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    : renderEmpty()}
                </ProjectLayout>
              </>
            );

            const obj = {
              children: display,
              props: {
                rowSpan: 1,
                className: `${styles.basicCellFieldShowEdit} right-border`,
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
          title: `Employee's Skills`,
          dataIndex: 'employeeSkills',
          key: 'employeeSkills',
          width: '15%',
          render: (employeeSkills = [], row, index) => {
            const formatListSkill = this.formatListSkill(employeeSkills, listColors) || [];
            const div = (
              <>
                {formatListSkill.map((item) => (
                  <Tag
                    style={{
                      color: `${item.color.colorText}`,
                      fontWeight: 500,
                    }}
                    key={item.id}
                    color={item.color.bg}
                  >
                    {item.name}
                  </Tag>
                ))}
              </>
            );
            return getRowSpan(div, row, index);
          },
        },
        {
          title: 'Actions',
          width: '6%',
          // dataIndex: 'subject',
          key: 'action',
          render: (value, row, index) => {
            // const checkAction = checkUtilization(row?.projects);
            const action = (
              <div className={styles.actionParent}>
                <div className={styles.buttonGroup}>
                  {allowModify && (
                    <img
                      src={addAction}
                      alt="attachIcon"
                      onClick={() => this.showModalAdd(row)}
                      style={{ cursor: 'pointer' }}
                      className={styles.buttonAdd}
                    />
                  )}

                  <img
                    src={changeManagerIcon}
                    alt="changemangerIcon"
                    onClick={() => this.showModalManagerChange(row)}
                    className={styles.buttonAdd}
                  />

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
          loading={loading}
          columns={columns()}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          onChange={this.onTableChange}
          locale={{
            emptyText: <EmptyComponent description="No Results Found" />,
          }}
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
        <ChangeManagerModal
          visible={visibleManagerChange}
          refreshData={refreshData}
          dataPassRow={dataPassRow}
          onClose={() => this.handleCancelChangeManager(false)}
          mode="multiple"
        />
        <WarnningModal
          visible={visibleModalWarn}
          refreshData={refreshData}
          dataPassRow={dataPassRow}
          onClose={() => this.handleCancelWarnning(false)}
          onClick={() => this.isShowModalManagerChange(dataPassRow)}
          mode="multiple"
        />
      </div>
    );
  }
}
export default TableResources;
