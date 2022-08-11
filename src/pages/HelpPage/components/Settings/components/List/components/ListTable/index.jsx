import { Divider, Dropdown, Menu } from 'antd';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import MoreIcon from '@/assets/policiesRegulations/more.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import { getEmployeeUrl } from '@/utils/utils';
import DeleteQuestionModalContent from './components/DeleteQuestionModalContent';
import EditQuestionModalContent from './components/EditQuestionModalContent';
import ViewQuestionModalContent from './components/ViewQuestionModalContent';
import styles from './index.less';

const ACTION = {
  DELETE: 'DELETE',
  EDIT: 'EDIT',
  VIEW: 'VIEW',
};

const ListTable = (props) => {
  const {
    loadingGetList,
    loadingSearch,
    pageSelected,
    size,
    getPageAndSize = () => {},
    helpData = [],
    totalHelpData = 0,
    selectedCountry = '',
    loadingUpdate = false,
    loadingUpload = false,
    loadingDelete = false,
    fetchData = () => {},
  } = props;

  const [action, setAction] = useState(false);
  const [item, setItem] = useState({});

  const handleDeleteQuestion = (record) => {
    setAction(ACTION.DELETE);
    setItem(record);
  };

  const handleUpdateQuestion = (record) => {
    setAction(ACTION.EDIT);
    setItem(record);
  };

  const handleViewQuestion = (record) => {
    setAction(ACTION.VIEW);
    setItem(record);
  };

  const actionMenu = (record) => {
    return (
      <Menu>
        <Menu.Item onClick={() => handleViewQuestion(record)}>
          <span>View Question</span>
        </Menu.Item>
        <Divider />
        <Menu.Item onClick={() => handleUpdateQuestion(record)}>
          <span>Update Question</span>
        </Menu.Item>
        <Divider />
        <Menu.Item onClick={() => handleDeleteQuestion(record)}>
          <span>Delete</span>
        </Menu.Item>
      </Menu>
    );
  };

  const fileListTemp = (att) => {
    return att.map((x, i) => {
      return {
        ...x,
        uid: i,
        name: x.name,
        status: 'done',
        url: x.url,
        thumbUrl: x.url,
        id: x.id || x._id,
      };
    });
  };

  const listQuestion = helpData
    ? helpData.map((obj) => {
        return {
          ...obj,
          id: obj._id,
          question: obj.question || '-',
          answer: obj.answer || '-',
          addOn: obj.createdAt ? obj.createdAt.substring(0, 10) : '-',
          addBy: obj.employeeId ? obj.employeeId?.generalInfoInfo?.legalName : '-',
          categoryName: obj.categoryId ? obj.categoryId?.category : '-',
          categoryId: obj.categoryId ? obj.categoryId?._id : '-',
          attachment: obj?.attachment && fileListTemp([obj.attachment]),
        };
      })
    : [];

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      sorter: {
        compare: (a, b) => a.categoryName.localeCompare(b.categoryName),
      },
    },
    {
      title: 'Question',
      dataIndex: 'question',
      sorter: {
        compare: (a, b) => a.question.localeCompare(b.question),
      },
    },
    {
      title: 'Added By',
      dataIndex: 'employeeId',
      render: (employeeId) => {
        return (
          <Link to={getEmployeeUrl(employeeId?.generalInfoInfo?.userId)}>
            {employeeId?.generalInfoInfo?.legalName}
          </Link>
        );
      },
      sorter: {
        compare: (a, b) => a.addBy.localeCompare(b.addBy),
      },
    },
    {
      title: 'Added On',
      dataIndex: 'addOn',
      sorter: {
        compare: (a, b) => new Date(a.addOn).getTime() - new Date(b.addOn).getTime(),
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <div className={styles.MoreIcon}>
            <Dropdown
              overlayClassName="dropdownQuestion"
              overlay={() => actionMenu(record)}
              placement="bottomRight"
              arrow
            >
              <img src={MoreIcon} alt="MoreIcon" />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.ListTable}>
      <CommonTable
        columns={columns}
        list={listQuestion}
        isBackendPaging
        limit={size}
        page={pageSelected}
        total={totalHelpData}
        onChangePage={getPageAndSize}
        loading={loadingGetList || loadingSearch}
      />
      <CommonModal
        title="Edit Question"
        visible={action === ACTION.EDIT}
        onClose={() => setAction('')}
        loading={loadingUpdate || loadingUpload}
        firstText="Save Changes"
        formName="editForm"
        content={
          <EditQuestionModalContent
            visible={action === ACTION.EDIT}
            onClose={() => setAction('')}
            mode="multiple"
            item={item}
            refreshData={fetchData}
            selectedCountry={selectedCountry}
          />
        }
      />
      <CommonModal
        title="Delete Question"
        visible={action === ACTION.DELETE}
        onClose={() => setAction('')}
        loading={loadingDelete || loadingUpload}
        firstText="Yes, delete"
        width={500}
        formName="deleteForm"
        content={
          <DeleteQuestionModalContent
            visible={action === ACTION.DELETE}
            onClose={() => setAction('')}
            mode="multiple"
            item={item}
            refreshData={fetchData}
          />
        }
      />
      <CommonModal
        title="View Question"
        visible={action === ACTION.VIEW}
        onClose={() => setAction('')}
        firstText="Close"
        onFinish={() => setAction('')}
        hasCancelButton={false}
        content={
          <ViewQuestionModalContent
            visible={action === ACTION.VIEW}
            onClose={() => setAction('')}
            mode="multiple"
            item={item}
          />
        }
      />
    </div>
  );
};

export default connect(({ loading, helpPage }) => ({
  helpPage,
  loadingUpdate: loading.effects['helpPage/updateQuestion'],
  loadingUpload: loading.effects['upload/addAttachment'],
  loadingDelete: loading.effects['helpPage/deleteQuestion'],
}))(ListTable);
