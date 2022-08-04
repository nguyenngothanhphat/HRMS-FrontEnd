import { Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import TeamIcon from '@/assets/assignTeam.svg';
import EditIcon from '@/assets/customerManagement/edit2.svg';
import CloseIcon from '@/assets/ticketManagement-trashIcon.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import { getEmployeeUrl } from '@/utils/directory';
import styles from './index.less';

const TicketItem = (props) => {
  const {
    // dispatch,
    employeeAssignee = {},
    employeeAssignee: {
      generalInfo: { userId: userIdProps = '', legalName: legalNameProps = '' } = {},
      _id = '',
    } = {},
    renderMenuDropdown = () => {},
    handleClickSelect = () => {},
    row = {},
    // refreshFetchTicketList = () => {},
    setOldAssignName = () => {},
    selected = true,
    setOldId = () => {},
    setModalVisible = () => {},
  } = props;
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = (id, name) => {
    handleClickSelect(id);
    setIsEdit(true);
    setOldAssignName(name);
    setOldId(_id);
  };

  const handleAssignTeam = (id) => {
    handleClickSelect(id);
    setModalVisible(true);
  };

  // const handleDeleteOneTicket = (id) => {
  //   dispatch({
  //     type: 'ticketManagement/deleteTicketEffect',
  //     payload: {
  //       id,
  //     },
  //   }).then((res) => {
  //     const { statusCode = '' } = res;
  //     if (statusCode === 200) {
  //       refreshFetchTicketList();
  //     }
  //   });
  // };

  const dataHover = (values) => {
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
    } = values;
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

  useEffect(() => {
    if (selected) {
      setIsEdit(false);
    }
  }, [selected]);

  return (
    <div className={styles.TicketItem}>
      <UserProfilePopover placement="top" trigger="hover" data={dataHover(employeeAssignee)}>
        <Link to={getEmployeeUrl(userIdProps)}>
          {legalNameProps.length > 15
            ? `${legalNameProps.substr(0, 4)}...${legalNameProps.substr(
                legalNameProps.length - 8,
                legalNameProps.length,
              )}`
            : legalNameProps}{' '}
        </Link>
      </UserProfilePopover>

      <Popover
        trigger="click"
        overlayClassName={styles.dropdownPopover}
        content={renderMenuDropdown()}
        placement="bottomRight"
        visible={isEdit}
      >
        {!isEdit ? (
          <img
            width={32}
            height={32}
            src={EditIcon}
            alt="edit"
            onClick={() => {
              handleEdit(row.id, legalNameProps);
            }}
          />
        ) : (
          <img
            width={32}
            height={32}
            src={CloseIcon}
            alt="close"
            onClick={() => setIsEdit(false)}
            onBlur={() => setIsEdit(false)}
          />
        )}
      </Popover>

      <img
        width={32}
        height={32}
        src={TeamIcon}
        alt="assign team icon"
        style={{
          cursor: 'pointer',
          pointerEvents: isEdit ? 'none' : 'auto',
          opacity: isEdit ? 0.5 : 1,
        }}
        onClick={() => handleAssignTeam(row.id)}
      />
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingUpdate: loading.effects['ticketManagement/updateTicket'],
  loadingFetchEmployee: loading.effects['ticketManagement/searchEmployee'],
}))(TicketItem);
