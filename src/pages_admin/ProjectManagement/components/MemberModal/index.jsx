import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ListTable from '../ListMemberTable';
import styles from './index.less';

const MemberModal = (props) => {
  const {
    projectInfo: { projectName = '', projectId = '', company = '' } = {},
    roleList: roleListProp = [],
    employeeList: employeeListProp = [],
    dispatch,
    closeModal,
    visible,
    projectMembers = [],
    loadingUpdateMembers = false,
    loadingGetProjectById = false,
    loadingListEmployees = false,
  } = props;
  const [roleList, setRoleList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    setEmployeeList(employeeListProp);
  }, [employeeListProp]);

  useEffect(() => {
    setRoleList(roleListProp);
  }, [roleListProp]);

  const renderHeaderModal = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{projectName} Members</p>
      </div>
    );
  };

  const onSubmit = async () => {
    const res = await dispatch({
      type: 'projectManagement/updateProject',
      payload: {
        company,
        id: projectId,
        resource: projectMembers,
      },
    });
    if (res.statusCode === 200) {
      closeModal('submit');
    }
  };

  return (
    <>
      <Modal
        className={styles.MemberModal}
        onCancel={() => {
          closeModal();
        }}
        destroyOnClose
        footer={[
          <Button
            onClick={() => {
              closeModal();
            }}
            className={styles.btnCancel}
          >
            Cancel
          </Button>,
          <Button
            className={styles.btnSubmit}
            type="primary"
            form="myForm"
            key="submit"
            htmlType="submit"
            // loading={loadingReassign}
            onClick={() => onSubmit()}
            loading={loadingUpdateMembers}
            disabled={
              loadingGetProjectById ||
              loadingUpdateMembers ||
              loadingListEmployees ||
              projectMembers.length === 0
            }
          >
            Submit
          </Button>,
        ]}
        title={renderHeaderModal()}
        centered
        visible={visible}
        width={700}
      >
        <ListTable projectId={projectId} employeeList={employeeList} roleList={roleList} />
      </Modal>
    </>
  );
};

export default connect(({ projectManagement: { projectMembers = [] } = {}, loading }) => ({
  projectMembers,
  loadingUpdateMembers: loading.effects['projectManagement/updateProject'],
  loadingGetProjectById: loading.effects['projectManagement/getProjectById'],
  loadingListEmployees: loading.effects['projectManagement/getEmployees'],
}))(MemberModal);
