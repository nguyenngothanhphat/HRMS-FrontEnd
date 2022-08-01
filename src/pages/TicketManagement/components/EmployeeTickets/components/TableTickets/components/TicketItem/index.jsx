import { Col, Popover, Row } from 'antd';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import EditIcon from '@/assets/customerManagement/edit2.svg';
import CloseIcon from '@/assets/ticketManagement-trashIcon.svg';
import UserProfilePopover from '@/components/UserProfilePopover';
import { getEmployeeUrl } from '@/utils/directory';
import styles from './index.less';

function TicketItem(props) {
  const {
    dispatch,
    employeeAssignee = {},
    handleClickSelect = () => {},
    row = {},
    refreshFetchData = () => {},
    refreshFetchTotalList = () => {},
    ticket = {},
    role = '',
    _id = '',
  } = props;
  const [isEdit, setIsEdit] = useState(false);

  const handleSelectChange = () => {
    const {
      id = '',
      employee_raise: employeeRaise = '',
      query_type: queryType = '',
      subject = '',
      description = '',
      priority = '',
      cc_list: ccList = [],
      attachments = [],
      department_assign: departmentAssign = '',
    } = ticket;
    dispatch({
      type: 'ticketManagement/updateTicket',
      payload: {
        id,
        employeeRaise,
        employeeAssignee: '',
        status: 'New',
        queryType,
        subject,
        description,
        priority,
        ccList,
        attachments,
        departmentAssign,
        employee: _id,
        role,
      },
    }).then((res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        refreshFetchData();
        refreshFetchTotalList();
      }
    });
  };

  const renderMenuDropdown = () => {
    return (
      <Row>
        <Col span={24}>
          <div className={styles.employee} onClick={handleSelectChange}>
            <span>Return to Queue</span>
          </div>
        </Col>
      </Row>
    );
  };

  const handleEdit = (id) => {
    handleClickSelect(id);
    setIsEdit(true);
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

  return (
    <div className={styles.TicketItem}>
      <UserProfilePopover data={dataHover(employeeAssignee)}>
        <Link to={getEmployeeUrl(employeeAssignee?.generalInfo?.userId || '')}>
          {employeeAssignee?.generalInfo?.legalName}
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
              handleEdit(row.id);
            }}
          />
        ) : (
          <img
            width={32}
            height={32}
            src={CloseIcon}
            alt="close"
            onBlur={() => setIsEdit(false)}
            onClick={() => setIsEdit(false)}
          />
        )}
      </Popover>
    </div>
  );
}

export default connect(({ loading }) => ({
  loadingUpdate: loading.effects['ticketManagement/updateTicket'],
  loadingFetchEmployee: loading.effects['ticketManagement/searchEmployee'],
}))(TicketItem);
