import { UpOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/customerManagement/delete.svg';
import EditIcon from '@/assets/customerManagement/edit2.svg';
import CloseIcon from '@/assets/ticketManagement-trashIcon.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import styles from './index.less';

function TicketsItem(props) {
  const {
    dispatch,
    employeeAssignee = {},
    employeeAssignee: {
      generalInfo: { userId: userIdProps = '', legalName: legalNameProps = '' } = {},
    } = {},
    renderMenuDropdown = () => {},
    viewProfile = () => {},
    handleClickSelect = () => {},
    row = {},
    refreshFetchTicketList = () => {},
    refreshFetchTotalList = () => {},
    setOldAssignName = () => {},
    selected = true,
  } = props;
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = (id, name) => {
    handleClickSelect(id);
    setIsEdit(true);
    setOldAssignName(name);
  };

  const handleDeleteOneTicket = (id) => {
    dispatch({
      type: 'ticketManagement/deleteTicketEffect',
      payload: {
        id,
      },
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        refreshFetchTicketList();
        refreshFetchTotalList();
      }
    });
  };

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
    <div className={styles.TicketsItem}>
      <UserProfilePopover placement="top" trigger="hover" data={dataHover(employeeAssignee)}>
        <span
          className={styles.userID}
          style={{ color: '#2c6df9', width: '200px' }}
          onClick={() => viewProfile(userIdProps || '')}
        >
          {legalNameProps.length > 15
            ? `${legalNameProps.substr(0, 4)}...${legalNameProps.substr(
                legalNameProps.length - 8,
                legalNameProps.length,
              )}`
            : legalNameProps}{' '}
          {/* {isEdit && <UpOutlined />} */}
        </span>
      </UserProfilePopover>
      <div style={{ display: 'flex' }}>
        <Popover
          trigger="click"
          overlayClassName={styles.dropdownPopover}
          content={renderMenuDropdown()}
          placement="bottomRight"
          visible={isEdit}
        >
          {!isEdit && (
            <Button
              type="link"
              shape="circle"
              onClick={() => {
                handleEdit(row.id, legalNameProps);
              }}
            >
              <img width={32} height={32} src={EditIcon} alt="edit" />
            </Button>
          )}
        </Popover>
        <div>
          {isEdit ? (
            <Button
              type="link"
              shape="circle"
              onClick={() => setIsEdit(false)}
              onBlur={() => setIsEdit(false)}
            >
              <img width={32} height={32} src={CloseIcon} alt="close" />
            </Button>
          ) : (
            <Button type="link" shape="circle" onClick={() => handleDeleteOneTicket(row.id)}>
              <img width={32} height={32} src={DeleteIcon} alt="delete" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default connect(({ loading }) => ({
  loadingUpdate: loading.effects['ticketManagement/updateTicket'],
  loadingFetchEmployee: loading.effects['ticketManagement/searchEmployee'],
}))(TicketsItem);
