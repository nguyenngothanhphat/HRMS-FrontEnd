import { Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import EditIcon from '@/assets/adminSetting/edit.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomBlueButton from '@/components/CustomBlueButton';
import EditModalContent from './components/EditModalContent';
import styles from './index.less';

const Grade = (props) => {
  const {
    dispatch,
    listGrades = [],
    loadingFetchGradeList = false,
    loadingAddGrade = false,
    loadingUpdateGrade = false,
  } = props;

  const [visible, setVisible] = useState(false);
  const [selectedGradeID, setSelectedGradeID] = useState('');

  const fetchGradeList = () => {
    dispatch({
      type: 'adminSetting/fetchGradeList',
    });
  };

  useEffect(() => {
    fetchGradeList();
  }, []);

  const onEditGrade = (row) => {
    setVisible(true);
    setSelectedGradeID(row._id);
  };

  const onRemoveGrade = async (row) => {
    const res = await dispatch({
      type: 'adminSetting/removeGrade',
      payload: {
        id: row._id,
      },
    });
    if (res.statusCode === 200) {
      fetchGradeList();
    }
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '80%',
        // render: (id) => {
        //   return <span className={styles.roleName}>{id}</span>;
        // },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <Popconfirm title="Sure to remove?" onConfirm={() => onRemoveGrade(row)}>
                <img src={DeleteIcon} alt="" />
              </Popconfirm>
              <img src={EditIcon} onClick={() => onEditGrade(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const onCloseModal = () => {
    setVisible(false);
    setSelectedGradeID('');
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingGrade: {},
      },
    });
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <CustomBlueButton onClick={() => setVisible(true)}>Add Grade</CustomBlueButton>
      </div>
    );
  };

  return (
    <div className={styles.Grade}>
      {renderHeader()}
      <CommonTable loading={loadingFetchGradeList} columns={generateColumns()} list={listGrades} />

      <CommonModal
        visible={visible}
        title={`${selectedGradeID ? 'Edit' : 'Add New'} Grade`}
        onClose={onCloseModal}
        width={550}
        loading={loadingAddGrade || loadingUpdateGrade}
        content={
          <EditModalContent
            visible={visible}
            onClose={onCloseModal}
            onRefresh={fetchGradeList}
            action={selectedGradeID ? 'edit' : 'add'}
            selectedGradeID={selectedGradeID}
          />
        }
      />
    </div>
  );
};
export default connect(
  ({ loading, adminSetting: { tempData: { listGrades = [] } = {} } = {} }) => ({
    listGrades,
    loadingFetchGradeList: loading.effects['adminSetting/fetchGradeList'],
    loadingAddGrade: loading.effects['adminSetting/addGrade'],
    loadingUpdateGrade: loading.effects['adminSetting/updateGrade'],
  }),
)(Grade);
