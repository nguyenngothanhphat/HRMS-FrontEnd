import { Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getAuthority, getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import CommonModal from '@/components/CommonModal';
import styles from './index.less';

const AssignTeamModal = (props) => {
  const {
    dispatch,
    visible = false,
    onClose = () => {},
    loadingAssign = false,
    currentUser: {
      employee: {
        _id: employeeId = '',
        location: { headQuarterAddress: { country = '' } = {} } = {},
      } = {} || {},
    } = {} || {},
    listEmployee = [],
    supportTeamList = [],
    loadingFetchListEmployee = false,
    loadingFetchSupportTeam = false,
    oldId = '',
    ticketDetail = {},
    role = '',
    refreshFetchTicketList = () => {},
    ticket = {},
  } = props;
  const [form] = Form.useForm();
  const [queryTypeList, setQueryTypeList] = useState([]);

  useEffect(() => {
    if (visible) {
      const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));
      dispatch({
        type: 'ticketManagement/fetchSupportTeamList',
        payload: {
          permissions,
          country,
        },
      });
      dispatch({
        type: 'ticketManagement/fetchListEmployee',
        payload: {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        },
      });
    }

    return () => {
      form.setFieldsValue({ newTeam: null, ccList: [], queryType: null });
      setQueryTypeList([]);
    };
  }, [visible]);

  const handleFinish = (value) => {
    const { newTeam = '', ccList = [], queryType = '' } = value;
    const newTeamObj = supportTeamList.find((x) => x.name === newTeam);
    const newTeamId = newTeamObj?._id;
    const queryTypeId = newTeamObj.queryType.find((y) => y.name === queryType)?._id;
    const tempData = Object.keys(ticket).length ? ticket : ticketDetail;

    const {
      id = '',
      employee_raise: employeeRaise = '',
      employee_assignee: employeeAssignee = '',
      priority = '',
      subject = '',
      description = '',
      attachments = [],
      department_assign: oldTeamId = '',
    } = tempData;
    const oldTeam = supportTeamList.find((x) => x._id === oldTeamId)?.name;

    dispatch({
      type: 'ticketManagement/updateTicket',
      payload: {
        id,
        employeeRaise,
        employeeAssignee,
        action: 'ASSIGN_TEAM',
        oldEmployeeAssignee: oldId || '',
        status: 'New',
        queryTypeId,
        supportTeam: newTeam,
        oldTeam,
        queryType,
        subject,
        description,
        priority,
        ccList,
        attachments,
        departmentAssign: newTeamId,
        employee: employeeId,
        role,
        permissions: ['M_ADMIN_VIEW_TICKETS'],
      },
    }).then((res) => {
      const { statusCode = '' } = res;
      if (statusCode === 200) {
        if (Object.keys(ticket).length) {
          refreshFetchTicketList();
        } else {
          dispatch({
            type: 'ticketManagement/fetchTicketByID',
            payload: {
              id,
            },
          });
        }
        onClose();
      }
    });
  };

  const onNewTeamChange = (value) => {
    const find = supportTeamList.find((x) => x.name === value);
    if (find) {
      setQueryTypeList(find?.queryType || []);
    }
  };

  const content = (
    <Form
      layout="vertical"
      id="myForm"
      className={styles.AssignTeamModal}
      form={form}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Move to another team"
        rules={[{ required: true, message: 'Please select a team' }]}
        name="newTeam"
      >
        <Select
          placeholder="Search by Team's name"
          showArrow={false}
          showSearch
          loading={loadingFetchSupportTeam}
          disabled={loadingFetchSupportTeam}
          onChange={onNewTeamChange}
          allowClear
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {supportTeamList.map((val) => (
            <Select.Option value={val.name} key={val._id}>
              {val.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Query Type"
        rules={[{ required: true, message: 'Please select the query type' }]}
        name="queryType"
      >
        <Select
          placeholder="Search by query type"
          showArrow={false}
          showSearch
          disabled={!queryTypeList.length}
          allowClear
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {queryTypeList.map((val) => (
            <Select.Option value={val.name} key={val._id}>
              {val.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="CC to" name="ccList">
        <Select
          placeholder="Search a person you want to loop"
          mode="multiple"
          allowClear
          showSearch
          loading={loadingFetchListEmployee}
          disabled={loadingFetchListEmployee}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {listEmployee.map((val) => (
            <Select.Option value={val._id} key={val._id}>
              {val.generalInfo.legalName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
  return (
    <CommonModal
      width={480}
      visible={visible}
      onClose={onClose}
      hasCancelButton={false}
      firstText="Re-Assign"
      loading={loadingAssign}
      withPadding
      title="Move To Another Team"
      content={content}
    />
  );
};

export default connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], supportTeamList = [], ticketDetail = {} } = {},
    user: { currentUser = {} } = {},
  }) => ({
    listEmployee,
    supportTeamList,
    ticketDetail,
    currentUser,
    loadingFetchListEmployee: loading.effects['ticketManagement/fetchListEmployee'],
    loadingFetchSupportTeam: loading.effects['ticketManagement/fetchSupportTeamList'],
    loadingAssign: loading.effects['ticketManagement/updateTicket'],
  }),
)(AssignTeamModal);
