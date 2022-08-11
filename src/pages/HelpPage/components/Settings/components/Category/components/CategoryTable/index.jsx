import React, { useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/policiesRegulations/delete.svg';
import EditIcon from '@/assets/policiesRegulations/edit.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import DeleteCategoryModalContent from './components/DeleteCategoryModalContent';
import EditCategoryModalContent from './components/EditCategoryModalContent';
import styles from './index.less';

const ACTION = {
  DELETE: 'DELETE',
  EDIT: 'EDIT',
};

const CategoryTable = (props) => {
  const {
    categoryList = [],
    loadingGetList = false,
    loadingDelete = false,
    loadingUpdate = false,
    fetchData = () => {},
  } = props;

  const [action, setAction] = useState(false);
  const [item, setItem] = useState({});

  const handleDeleteCategory = (record) => {
    setAction(ACTION.DELETE);
    setItem(record);
  };

  const handleUpdateCategory = (record) => {
    setAction(ACTION.EDIT);
    setItem(record);
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'No. of Questions',
      dataIndex: 'helpDatas',
      key: 'helpDatas',
      render: (helpDatas = []) => helpDatas.length,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <div className={styles.btnAction}>
            <img src={EditIcon} alt="Edit" onClick={() => handleUpdateCategory(record)} />
            <img src={DeleteIcon} alt="delete" onClick={() => handleDeleteCategory(record)} />
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.CategoryTable}>
      <CommonTable columns={columns} list={categoryList} loading={loadingGetList} />
      <CommonModal
        visible={action === ACTION.EDIT}
        onClose={() => setAction('')}
        title="Edit Category"
        firstText="Save Changes"
        formName="editForm"
        loading={loadingUpdate}
        width={500}
        content={
          <EditCategoryModalContent
            visible={action === ACTION.EDIT}
            onClose={() => setAction('')}
            mode="multiple"
            item={item}
            refreshData={fetchData}
          />
        }
      />

      <CommonModal
        visible={action === ACTION.DELETE}
        onClose={() => setAction('')}
        title="Delete Category"
        formName="deleteForm"
        firstText="Yes, delete"
        loading={loadingDelete}
        width={500}
        content={
          <DeleteCategoryModalContent
            visible={action === ACTION.DELETE}
            onClose={() => setAction('')}
            mode="multiple"
            item={item}
            refreshData={fetchData}
          />
        }
      />
    </div>
  );
};

export default connect(({ loading, helpPage: { categoryList = [] } = {} }) => ({
  loadingGetList: loading.effects['helpPage/fetchHelpCategoryList'],
  loadingUpdate: loading.effects['helpPage/updateHelpCategory'],
  loadingDelete: loading.effects['helpPage/deleteHelpCategory'],
  categoryList,
}))(CategoryTable);
