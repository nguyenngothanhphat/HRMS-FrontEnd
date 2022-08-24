import { notification, Popconfirm } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import EditIcon from '@/assets/adminSetting/edit.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomBlueButton from '@/components/CustomBlueButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import EditModalContent from './components/EditModalContent';
import styles from './index.less';

const Department = (props) => {
  const {
    dispatch,
    listDepartments = [],
    loadingFetchDepartmentList = false,
    totalDepartmentList = 0,
    loadingAddDepartment = false,
    loadingUpdateDepartment = false,
  } = props;

  const [visible, setVisible] = useState(false);
  const [selectedDepartmentID, setSelectedDepartmentID] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchDepartmentList = () => {
    dispatch({
      type: 'adminSetting/fetchDepartmentList',
      payload: {
        name: searchValue,
        limit,
        page,
      },
    });
  };

  useEffect(() => {
    fetchDepartmentList();
  }, [page, limit, searchValue]);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l);
  };

  const onEditDepartment = (row) => {
    setVisible(true);
    setSelectedDepartmentID(row._id);
  };

  const onRemoveDepartment = async (row) => {
    let hasChildDept = false;
    listDepartments.forEach((item) => {
      if (item?.departmentParentName === row.name) {
        hasChildDept = true;
      }
    });

    if (hasChildDept) {
      notification.error('This department cannot be deleted');
    } else {
      const res = await dispatch({
        type: 'adminSetting/removeDepartment',
        payload: {
          id: row._id,
        },
      });
      if (res.statusCode === 200) {
        fetchDepartmentList();
      }
    }
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Department ID',
        dataIndex: 'departmentId',
        key: 'departmentId',
        width: '15%',
        // render: (id) => {
        //   return <span className={styles.roleName}>{id}</span>;
        // },
      },
      {
        title: 'Department Name',
        dataIndex: 'name',
        key: 'name',
        // width: '15%',
      },
      {
        title: 'Parent Department',
        dataIndex: 'departmentParentInfo',
        key: 'departmentParentInfo',
        width: '20%',
        render: (departmentParentInfo = {}) => {
          return <span>{departmentParentInfo.name || ''}</span>;
        },
      },
      {
        title: 'HR POC',
        dataIndex: 'hrPOC',
        key: 'hrPOC',
        width: '17%',
        render: (hrPOC = {}) => {
          return <span>{hrPOC.generalInfoInfo?.legalName}</span>;
        },
      },
      {
        title: 'Finance POC',
        dataIndex: 'financePOC',
        key: 'financePOC',
        width: '17%',
        render: (financePOC = {}) => {
          return <span>{financePOC.generalInfoInfo?.legalName}</span>;
        },
      },

      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          const disabled =
            row.name === 'Engineering' ||
            row.name === 'Finance' ||
            row.name === 'Legal' ||
            row.name === 'HR' ||
            row.name === 'Sales' ||
            row.name === 'Marketing' ||
            row.name === 'Operations & Facility management';

          return (
            <div className={styles.actions}>
              {disabled ? (
                <img style={{ opacity: 0.5, cursor: 'not-allowed' }} src={DeleteIcon} alt="" />
              ) : (
                <Popconfirm title="Sure to remove?" onConfirm={() => onRemoveDepartment(row)}>
                  <img src={DeleteIcon} alt="" />
                </Popconfirm>
              )}

              <img src={EditIcon} onClick={() => onEditDepartment(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    setPage(1);
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <CustomSearchBox onSearch={onSearch} placeholder="Search Department" />
        <CustomBlueButton onClick={() => setVisible(true)}>Add Department</CustomBlueButton>
      </div>
    );
  };

  const onCloseModal = () => {
    setVisible(false);
    setSelectedDepartmentID('');
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingDepartment: {},
      },
    });
  };

  return (
    <div className={styles.Department}>
      {renderHeader()}
      <CommonTable
        columns={generateColumns()}
        list={listDepartments}
        loading={loadingFetchDepartmentList}
        total={totalDepartmentList}
        isBackendPaging
        page={page}
        limit={limit}
        onChangePage={onChangePage}
      />
      <CommonModal
        visible={visible}
        title={`${selectedDepartmentID ? 'Edit' : 'Add New'} Department`}
        onClose={onCloseModal}
        width={550}
        loading={loadingAddDepartment || loadingUpdateDepartment}
        content={
          <EditModalContent
            visible={visible}
            onClose={onCloseModal}
            onRefresh={fetchDepartmentList}
            selectedDepartmentID={selectedDepartmentID}
            action={selectedDepartmentID ? 'edit' : 'add'}
            listDepartments={listDepartments}
          />
        }
      />
    </div>
  );
};
export default connect(
  ({
    loading,
    adminSetting: { tempData: { listDepartments = [], totalDepartmentList = 0 } = {} } = {},
  }) => ({
    listDepartments,
    totalDepartmentList,
    loadingFetchDepartmentList: loading.effects['adminSetting/fetchDepartmentList'],
    loadingAddDepartment: loading.effects['adminSetting/addDepartment'],
    loadingUpdateDepartment: loading.effects['adminSetting/updateDepartment'],
  }),
)(Department);
