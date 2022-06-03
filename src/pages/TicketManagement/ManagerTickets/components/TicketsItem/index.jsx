import { UpOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/customerManagement/delete.svg';
import EditIcon from '@/assets/customerManagement/edit2.svg';
import CloseIcon from '@/assets/ticketManagement-trashIcon.svg';
import UserProfilePopover from '@/pages/TicketManagement/components/UserProfilePopover';
import styles from './index.less';

function TicketsItem(props) {
  const {
    dispatch,
    employeeAssignee = {},
    renderMenuDropdown = () => {},
    viewProfile = () => {},
    handleClickSelect = () => {},
    row = {},
    refreshFetchTicketList = () => {},
    refreshFetchTotalList = () => {},
    setOldAssignName = () => {},
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
  return (
    <div className={styles.TicketsItem}>
      <UserProfilePopover
        placement="top"
        trigger="hover"
        data={{ ...employeeAssignee, ...employeeAssignee?.generalInfo }}
      >
        <span
          className={styles.userID}
          style={{ color: '#2c6df9' }}
          onClick={() => viewProfile(employeeAssignee?.generalInfo?.userId || '')}
        >
          {employeeAssignee?.generalInfo?.legalName} {isEdit && <UpOutlined />}
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
                handleEdit(row.id, employeeAssignee?.generalInfo?.legalName);
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
