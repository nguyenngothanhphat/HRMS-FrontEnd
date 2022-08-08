import { Tag, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, history, Link } from 'umi';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import EditCommentIcon from '@/assets/resource-management-edit-history.svg';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import currentToNewManager from '@/assets/resourceManagement/currentToNewManager.svg';
import AssignIcon from '@/assets/resourceManagement/ic_assign.svg';
import DeleteIcon from '@/assets/resourceManagement/ic_delete.svg';
import EditIcon from '@/assets/resourceManagement/ic_edit.svg';
import HistoryIcon from '@/assets/resourceManagement/ic_history.svg';
import SwapIcon from '@/assets/resourceManagement/ic_swap.svg';
import ViewCommentIcon from '@/assets/resourceManagement/list-edit-comment.svg';
import MockAvatar from '@/assets/timeSheet/mockAvatar.jpg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import EmptyComponent from '@/components/Empty';
import UserProfilePopover from '@/components/UserProfilePopover';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { RESOURCE } from '@/constants/resourceManagement';
import { projectDateFormat } from '@/utils/resourceManagement';
import AddCommentModalContent from './components/AddCommentModalContent';
import AssignModalContent from './components/AssignModalContent';
import ChangeManagerModalContent from './components/ChangeManagerModalContent';
import DeleteCommentModalContent from './components/DeleteCommentModalContent';
import EditModalContent from './components/EditModalContent';
import HistoryModalContent from './components/HistoryModalContent';
import ProjectLayout from './components/ProjectLayout';
import ProjectProfile from './components/ProjectProfile';
import ProjectRow from './components/ProjectRow';
import WarningModalContent from './components/WarningModalContent';
import styles from './index.less';

const {
  MODAL_TYPE: {
    EDIT,
    ASSIGN,
    MANAGER_CHANGE,
    WARN,
    HISTORY,
    ASSIGN_SUCCESS,
    ADD_COMMENT,
    EDIT_COMMENT,
    DELETE_COMMENT,
    VIEW_COMMENT,
  },
} = RESOURCE;

const TableResources = (props) => {
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
    loadingUpdateComment = false,
    loadingUpdateProject = false,
    loadingUpdateManager = false,
  } = props;

  const [visible, setVisible] = useState(false);
  const [handlingRow, setHandlingRow] = useState({});
  const [selectedProject, setSelectedProject] = useState({});

  const onShowModal = (row, type) => {
    setHandlingRow(row);
    if (type === MANAGER_CHANGE) {
      if (row.projects && row.projects.length > 1) {
        setVisible(WARN);
      } else {
        setVisible(MANAGER_CHANGE);
      }
    } else {
      setVisible(type);
    }
  };

  const formatListSkill = (skills, colors) => {
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
    const { resourceList = [] } = props;
    const obj = resourceList.find((x) => x._id === employeeId) || {};
    return { ...obj, ...obj?.generalInfo };
  };

  const renderEmpty = () => <div className={styles.emptyItem}>-</div>;

  const columns = () => {
    return [
      {
        title: 'Name',
        dataIndex: 'employeeName',
        width: '12%',
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
              <UserProfilePopover data={dataHover(row.employeeId)}>
                <div className={styles.userProfile}>
                  <div className={styles.avatar}>
                    <img
                      src={row.avatar || MockAvatar}
                      alt="avatar"
                      onError={(e) => {
                        e.target.src = MockAvatar;
                      }}
                    />
                  </div>
                  <div className={styles.employeeName}>{value}</div>
                </div>
              </UserProfilePopover>
            </div>
          );
          return getRowSpan(div, row, index);
        },
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
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
        render: (value, row, index) => {
          const children = <span className={styles.basicCellField}>{value}</span>;
          return getRowSpan(children, row, index);
        },
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
              <Link
                style={{
                  fontWeight: 500,
                }}
              >
                {value}
              </Link>
              {row.managerChanged && managerChanged !== value ? (
                <div className={styles.newManager}>
                  <p>
                    <img src={currentToNewManager} alt="" />{' '}
                    <a href="#">
                      {managerChanged}
                    </a>
                  </p>
                  <span>{dateEffective}</span>
                </div>
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
      },
      {
        title: 'Current Project(s)',
        dataIndex: 'projects',
        width: '10%',
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
        align: 'left',
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
                                  src={EditIcon}
                                  alt=""
                                  onClick={() => onShowModal(dataRow, EDIT)}
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
        width: '10%',
        render: (value, row, index) => {
          const employeeRowCount = data.filter((x) => x.employeeId === row.employeeId).length;
          let text;
          if (value) {
            const line =
              employeeRowCount === 0 || employeeRowCount === 1 ? 3 : employeeRowCount * 3;
            text = (
              <div className={styles.commentOverlay}>
                <span className={styles.comment} style={{ WebkitLineClamp: line }}>
                  {row.comment}
                </span>
                <div className={styles.mask}>
                  <div className={styles.buttonContainer}>
                    {allowModify && (
                      <img
                        src={EditCommentIcon}
                        alt=""
                        onClick={() => onShowModal(row, EDIT_COMMENT)}
                      />
                    )}
                    <img
                      src={ViewCommentIcon}
                      alt=""
                      onClick={() => onShowModal(row, VIEW_COMMENT)}
                    />
                    <img
                      src={DeleteIcon}
                      className={styles.iconDelete}
                      alt=""
                      onClick={() => onShowModal(row, DELETE_COMMENT)}
                    />
                  </div>
                </div>
              </div>
            );
          } else {
            text = (
              <span>
                {allowModify && (
                  <CustomOrangeButton
                    icon={OrangeAddIcon}
                    onClick={() => onShowModal(row, ADD_COMMENT)}
                    fontSize={13}
                    marginInline={0}
                  >
                    Add Comment
                  </CustomOrangeButton>
                )}
              </span>
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
          const skillList = formatListSkill(employeeSkills, listColors) || [];
          const div = (
            <>
              {skillList.length > 0
                ? skillList.map((item) => (
                  <Tag
                    style={{
                        color: `${item.color.colorText}`,
                        fontWeight: 500,
                        marginBlock: '2px',
                      }}
                    key={item.id}
                    color={item.color.bg}
                  >
                    {item.name}
                  </Tag>
                  ))
                : '-'}
            </>
          );
          return getRowSpan(div, row, index);
        },
      },
      {
        title: 'Actions',
        width: '7%',
        // dataIndex: 'subject',
        key: 'action',
        render: (value, row, index) => {
          const action = (
            <div className={styles.actionParent}>
              <div className={styles.buttonGroup}>
                {allowModify && (
                  <Tooltip title="Assign to project">
                    <img
                      src={AssignIcon}
                      alt=""
                      className={styles.buttonAdd}
                      onClick={() => onShowModal(row, ASSIGN)}
                      style={{ cursor: 'pointer' }}
                    />
                  </Tooltip>
                )}
                <Tooltip title="Change manager">
                  <img
                    src={SwapIcon}
                    alt=""
                    onClick={() => onShowModal(row, MANAGER_CHANGE)}
                    className={styles.buttonAdd}
                  />
                </Tooltip>
                <Tooltip title="Resource history">
                  <img
                    src={HistoryIcon}
                    alt=""
                    onClick={() => onShowModal(row, HISTORY)}
                    className={styles.buttonEdit}
                  />
                </Tooltip>
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

  const onClose = () => {
    setVisible(false);
    setHandlingRow({});
  };

  return (
    <div className={styles.TableResources}>
      <CommonTable
        loading={loading}
        columns={columns()}
        list={data}
        locale={{
          emptyText: <EmptyComponent description="No Results Found" />,
        }}
        rowKey="id"
        scrollable
        width="140vw"
        height="fit-content"
        isBackendPaging
        total={total}
        page={pageSelected}
        limit={size}
        onChangePage={getPageAndSize}
      />
      <CommonModal
        title="Edit Project Details"
        visible={visible === EDIT}
        onClose={onClose}
        formName="editForm"
        loading={loadingUpdateProject}
        content={
          <EditModalContent
            visible={visible === EDIT}
            refreshData={refreshData}
            dataPassRow={handlingRow}
            onClose={onClose}
            mode="multiple"
          />
        }
      />

      <CommonModal
        visible={visible === ASSIGN}
        onClose={onClose}
        title="Assign to project"
        content={
          <AssignModalContent
            visible={visible === ASSIGN}
            refreshData={refreshData}
            dataPassRow={handlingRow}
            setSuccessVisible={() => setVisible(ASSIGN_SUCCESS)}
            mode="multiple"
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        }
      />
      <CommonModal
        visible={visible === HISTORY}
        onClose={onClose}
        title="Resource History"
        firstText="Done"
        hasCancelButton={false}
        onFinish={onClose}
        width={800}
        content={
          <HistoryModalContent
            visible={visible === HISTORY}
            dataPassRow={handlingRow}
            onClose={onClose}
            mode="multiple"
          />
        }
      />
      <CommonModal
        visible={visible === MANAGER_CHANGE}
        onClose={onClose}
        title="Change Manager"
        secondTitle="Would you like to change the reporting manager?"
        cancelButtonType={2}
        cancelText="Skip"
        width={440}
        firstText="Update"
        loading={loadingUpdateManager}
        content={
          <ChangeManagerModalContent
            visible={visible === MANAGER_CHANGE}
            refreshData={refreshData}
            dataPassRow={handlingRow}
            onClose={onClose}
          />
        }
      />

      <CommonModal
        visible={visible === WARN}
        onClose={onClose}
        hasHeader={false}
        hasCancelButton={false}
        formName="warningForm"
        width={440}
        content={<WarningModalContent setManagerChange={() => setVisible(MANAGER_CHANGE)} />}
      />

      <CommonModal
        visible={visible === ASSIGN_SUCCESS}
        onClose={onClose}
        firstText="View Project"
        cancelText="Close"
        width={400}
        onFinish={() => {
          history.push(`/project-management/list/${selectedProject?.projectId}/summary`);
        }}
        hasHeader={false}
        content={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 24,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <img src={imageAddSuccess} alt="add success" />
            </div>
            <br />
            <br />
            <h3 style={{ textAlign: 'center' }}>Resource assigned!</h3>
            <p style={{ textAlign: 'center', color: '#707177' }}>
              The resource has been successfully assigned to the project
            </p>
          </div>
        }
      />

      <CommonModal
        visible={visible === ADD_COMMENT || visible === EDIT_COMMENT}
        onClose={onClose}
        title={visible === ADD_COMMENT ? 'Add Comment' : 'Edit Comment'}
        formName="commentForm"
        loading={loadingUpdateComment}
        firstText={visible === ADD_COMMENT ? 'Add' : 'Update'}
        width={550}
        content={
          <AddCommentModalContent
            refreshData={refreshData}
            onClose={onClose}
            handlingRow={handlingRow}
          />
        }
      />

      <CommonModal
        visible={visible === VIEW_COMMENT}
        onClose={onClose}
        title="View Comment"
        hasFooter={false}
        width={550}
        content={<div style={{ padding: 24 }}>{handlingRow?.comment}</div>}
      />

      <CommonModal
        visible={visible === DELETE_COMMENT}
        onClose={onClose}
        title="Delete comment"
        firstText="Delete"
        formName="deleteForm"
        width={550}
        loading={loadingUpdateComment}
        content={
          <DeleteCommentModalContent
            refreshData={refreshData}
            onClose={onClose}
            handlingRow={handlingRow}
          />
        }
      />
    </div>
  );
};
export default connect(
  ({
    loading,
    user: { permissions = {} },
    location: { companyLocationList = [] },
    resourceManagement: { resourceList = [] },
  }) => ({
    loadingTerminateReason: loading.effects['offboarding/terminateReason'],
    loadingUpdateComment: loading.effects['resourceManagement/updateComment'],
    loadingUpdateProject: loading.effects['resourceManagement/updateProject'],
    loadingUpdateManager: loading.effects['resourceManagement/updateManagerResource'],
    permissions,
    companyLocationList,
    resourceList,
  }),
)(TableResources);
