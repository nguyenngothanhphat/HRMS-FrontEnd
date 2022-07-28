import { Popconfirm } from 'antd';
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

const Position = (props) => {
  const {
    dispatch,
    listTitles = [],
    loadingFetchPositionList = false,
    totalTitle = 0,
    loadingAddPosition = false,
    loadingUpdatePosition = false,
  } = props;

  const [visible, setVisible] = useState(false);
  const [selectedPositionID, setSelectedPositionID] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchPositionList = () => {
    dispatch({
      type: 'adminSetting/fetchListTitle',
      payload: { name: searchValue, page, limit },
    });
  };

  useEffect(() => {
    fetchPositionList();
  }, [page, limit, searchValue]);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l);
  };

  const onEditPosition = (row) => {
    setVisible(true);
    setSelectedPositionID(row._id);
  };

  const onRemovePosition = async (row) => {
    const res = await dispatch({
      type: 'adminSetting/removePosition',
      payload: {
        id: row._id,
      },
    });
    if (res.statusCode === 200) {
      fetchPositionList();
    }
  };
  const generateColumns = () => {
    const columns = [
      {
        title: 'Position Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        // render: (id) => {
        //   return <span className={styles.roleName}>{id}</span>;
        // },
      },
      {
        title: 'Department Name',
        dataIndex: 'department',
        key: 'department',
        render: (department = {}) => department?.name || '',
        width: '20%',
      },
      {
        title: 'Role',
        dataIndex: 'roles',
        key: 'roles',
        width: '15%',
        render: (roles = []) => {
          return (
            <div>
              {roles.map((id) => (
                <span className={styles.roleTag}>{id}</span>
              ))}
            </div>
          );
        },
      },
      {
        title: 'Grade Level',
        dataIndex: 'gradeObj',
        key: 'gradeObj',
        width: '15%',
        render: (gradeObj = {}) => {
          return <span>{gradeObj?.name || ''}</span>;
        },
      },
      {
        title: 'Timesheet Required',
        dataIndex: 'timeSheetRequired',
        key: 'timeSheetRequired',
        width: '15%',
        render: (value) => (value ? <span>Yes</span> : <span>No</span>),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <Popconfirm title="Sure to remove?" onConfirm={() => onRemovePosition(row)}>
                <img src={DeleteIcon} alt="" />
              </Popconfirm>
              <img src={EditIcon} onClick={() => onEditPosition(row)} alt="" />
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
        <CustomSearchBox onSearch={onSearch} placeholder="Search Position" />
        <CustomBlueButton onClick={() => setVisible(true)}>Add Position</CustomBlueButton>
      </div>
    );
  };

  const onCloseModal = () => {
    setVisible(false);
    setSelectedPositionID('');
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingPosition: {},
      },
    });
  };

  return (
    <div className={styles.Position}>
      {renderHeader()}
      <CommonTable
        columns={generateColumns()}
        list={listTitles}
        isBackendPaging
        page={page}
        limit={limit}
        total={totalTitle}
        onChangePage={onChangePage}
        loading={loadingFetchPositionList}
      />
      <CommonModal
        visible={visible}
        title={`${selectedPositionID ? 'Edit' : 'Add New'} Position`}
        onClose={onCloseModal}
        width={550}
        loading={loadingAddPosition || loadingUpdatePosition}
        content={
          <EditModalContent
            visible={visible}
            onClose={onCloseModal}
            onRefresh={fetchPositionList}
            selectedPositionID={selectedPositionID}
            action={selectedPositionID ? 'edit' : 'add'}
          />
        }
      />
    </div>
  );
};
export default connect(
  ({ loading, adminSetting: { tempData: { listTitles = [], totalTitle = 0 } = {} } = {} }) => ({
    listTitles,
    totalTitle,
    loadingFetchPositionList: loading.effects['adminSetting/fetchListTitle'],
    loadingAddPosition: loading.effects['adminSetting/addPosition'],
    loadingUpdatePosition: loading.effects['adminSetting/updatePosition'],
  }),
)(Position);
