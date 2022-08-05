import { Popover, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import EditCommentIcon from '@/assets/resource-management-edit-history.svg';
import ViewCommentIcon from '@/assets/resourceManagement/list-edit-comment.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import UserProfilePopover from '@/components/UserProfilePopover';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { RESOURCE } from '@/constants/resourceManagement';
import AddCommentModalContent from './components/AddCommentModalContent';
import PopupCustomer from './components/PopupCustomer';
import PopupProjectName from './components/PopupProjectName';
import styles from './index.less';

const {
  MODAL_TYPE: { ADD_COMMENT, EDIT_COMMENT, VIEW_COMMENT },
} = RESOURCE;

const TableProject = (props) => {
  const {
    data = [],
    loading = false,
    allowModify = false,
    fetchProjectList = () => {},
    loadingUpdateComment = false,
  } = props;

  const [visible, setVisible] = useState(false);
  const [handlingRow, setHandlingRow] = useState({});

  const formatDate = (date, typeFormat) => {
    if (!date) {
      return '-';
    }
    return moment(date).format(typeFormat);
  };

  const viewProfile = (_id) => {
    return `/directory/employee-profile/${_id}`;
  };

  const viewCustomer = (customerId) => {
    return `/customer-management/list/customer-profile/${customerId}`;
  };

  const viewProject = (projectId) => {
    return `/project-management/list/${projectId}/summary`;
  };

  const dataSource = data.map((obj, x) => {
    return {
      key: x + 1,
      id: obj.id,
      projectId: obj.projectId,
      projectName: obj.projectName || '-',
      customer: obj.customerName || '-',
      customerId: obj.customerId || '-',
      projectType: obj.engagementType || '-',
      projectManager: obj.projectManager || '-',
      startDate: formatDate(obj.startDate, DATE_FORMAT_MDY),
      endDate: formatDate(obj.endDate, DATE_FORMAT_MDY),
      revisedEndDate: formatDate(obj.newEndDate, DATE_FORMAT_MDY),
      status: obj.projectStatus || '-',
      resourcePlan: obj.resourcesPlanned || '-',
      resourceAssigned: obj.resourcesAssigned || '-',
      billableResource: obj.billableResources || '-',
      bufferResource: obj.bufferResources || '-',
      billEfficiency: `${obj.billingEfficiency ? obj.billingEfficiency : 0}%` || '-',
      billableEffort: obj.billableEffort || '-',
      spentEffort: obj.spentEffort || '-',
      variance: obj.variance || '-',
      comment: obj.comments,
      accountOwner: obj.accountOwner || '-',
      engineeringOwner: obj.engineeringOwner || '-',
      customerOwner: obj.customer || '-',
    };
  });

  const dataHover = (value) => {
    const {
      generalInfo: {
        legalName = '',
        avatar: avatar1 = '',
        userId = '',
        workEmail = '',
        workNumber = '',
        skills = [],
      } = {},
      generalInfo = {},
      department = {},
      location: locationInfo = {},
      manager: managerInfo = {},
      title = {},
    } = value;
    return {
      legalName,
      userId,
      department,
      workEmail,
      workNumber,
      locationInfo,
      generalInfo,
      managerInfo,
      title,
      avatar1,
      skills,
    };
  };

  const onShowModal = (row, type) => {
    setVisible(type);
    setHandlingRow(row);
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (value, row) => {
        return (
          <Popover
            content={<PopupProjectName dataProjectName={row} />}
            trigger="hover"
            placement="bottomRight"
            overlayClassName={styles.popupContentProjectManager}
          >
            <Link className={styles.projectName} to={viewProject(row?.projectId)}>
              {value || '-'}
            </Link>
          </Popover>
        );
      },
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (value, row) => (
        <Popover
          content={<PopupCustomer dataCustomer={row} />}
          trigger="hover"
          placement="bottomRight"
          overlayClassName={styles.popupContentProjectManager}
        >
          <Link className={styles.projectName} to={viewCustomer(row?.customerId)}>
            {value || '-'}
          </Link>
        </Popover>
      ),
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Project Type',
      dataIndex: 'projectType',
      key: 'projectType',
      sorter: (a, b) => a.projectType.localeCompare(b.projectType),
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
      render: (value) => (
        <UserProfilePopover data={dataHover(value)}>
          <Link className={styles.projectName} to={viewProfile(value?.generalInfo?.userId)}>
            {value?.generalInfo?.legalName || '-'}
          </Link>
        </UserProfilePopover>
      ),
      sorter: (a, b) =>
        a.projectManager?.generalInfo?.legalName.localeCompare(
          b.projectManager?.generalInfo?.legalName,
        ),
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
      sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
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
      sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
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
      sorter: (a, b) => moment(a.revisedEndDate).unix() - moment(b.revisedEndDate).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Resource Planned',
      dataIndex: 'resourcePlan',
      key: 'resourcePlan',
      sorter: (a, b) => a.resourcePlan - b.resourcePlan,
    },
    {
      title: 'Resource Assigned',
      dataIndex: 'resourceAssigned',
      key: 'resourceAssigned',
      sorter: (a, b) => a.resourceAssigned - b.resourceAssigned,
    },
    {
      title: 'Billable Resource',
      dataIndex: 'billableResource',
      key: 'billableResource',
      sorter: (a, b) => a.billableResource - b.billableResource,
    },
    {
      title: 'Buffer Resource',
      dataIndex: 'bufferResource',
      key: 'bufferResource',
      sorter: (a, b) => a.bufferResource - b.resourceAssigned,
    },
    {
      title: 'Billing Efficiency (%)',
      dataIndex: 'billEfficiency',
      key: 'billEfficiency',
      sorter: (a, b) => a.billEfficiency.localeCompare(b.billEfficiency),
    },
    {
      title: 'Billable Effort (days)',
      dataIndex: 'billableEffort',
      key: 'billableEffort',
      sorter: (a, b) => a.billableEffort - b.billableEffort,
    },
    {
      title: 'Spent Effort (days)',
      dataIndex: 'spentEffort',
      key: 'spentEffort',
      sorter: (a, b) => a.spentEffort - b.spentEffort,
    },
    {
      title: 'Variance',
      dataIndex: 'variance',
      key: 'variance',
      sorter: (a, b) => a.variance - b.variance,
    },
    {
      title: 'Comments',
      dataIndex: 'comment',
      key: 'comment',
      width: '10%',
      render: (value, row) => {
        let displayValue;
        if (value) {
          displayValue = (
            <div className={styles.commentOverlay}>
              <div className={styles.comment}>
                {row.comment && row.comment.length > 50
                  ? `${row.comment.slice(0, 60)} ...`
                  : row.comment}
              </div>
              <div className={styles.mask}>
                <div className={styles.buttonContainer}>
                  <Tooltip title="Edit Comment">
                    <img
                      src={EditCommentIcon}
                      alt=""
                      onClick={() => onShowModal(row, EDIT_COMMENT)}
                    />
                  </Tooltip>
                  <Tooltip title="View Comment">
                    <img
                      src={ViewCommentIcon}
                      alt=""
                      onClick={() => onShowModal(row, VIEW_COMMENT)}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          );
        } else {
          displayValue = (
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
        return displayValue;
      },
      sorter: (a, b) => {
        if (a.comment && b.comment) {
          return a.comment.localeCompare(b.comment);
        }
        return null;
      },
    },
  ];

  const onClose = () => {
    setVisible(false);
    setHandlingRow({});
  };

  return (
    <div className={styles.TableProject}>
      <CommonTable
        list={dataSource}
        columns={columns}
        loading={loading}
        rowKey="id"
        scrollable
        width="140vw"
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
            refreshData={fetchProjectList}
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
    </div>
  );
};

export default connect(({ location: { companyLocationList = [] }, loading }) => ({
  companyLocationList,
  loadingUpdateComment: loading.effects['resourceManagement/addAndUpdateCommentsProject'],
}))(TableProject);
