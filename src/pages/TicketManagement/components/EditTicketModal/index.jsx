import { Col, DatePicker, Form, Input, Row, Select, Spin, Tooltip, Upload } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import HelpIcon from '@/assets/dashboard/help.svg';
import DebounceSelect from '@/components/DebounceSelect';
import { PRIORITY } from '@/constants/dashboard';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { FILE_TYPE } from '@/constants/upload';
import { getAuthority, getCurrentLocation } from '@/utils/authority';
import { beforeUpload } from '@/utils/upload';
import styles from './index.less';
import CustomAddButton from '@/components/CustomAddButton';
import CommonModal from '@/components/CommonModal';

const { Option } = Select;

const EditTicketModal = (props) => {
  const [form] = Form.useForm();
  const formRef = React.createRef();
  const {
    visible = false,
    onClose = () => {},
    currentUser: {
      employee: {
        _id: myEmployeeID = '',
        location: { headQuarterAddress: { country = '' } = {} } = {},
      } = {} || {},
    } = {} || {},
    loadingFetchSupportTeam = false,
    loadingUpdateTicket = false,
    supportTeamList = [],
    dispatch,
    loadingUploadAttachment = false,
    role = '',
    ticket = {},
    refreshFetchTicketList = () => {},
  } = props;
  console.log('🚀 ~ ticket', ticket);

  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [queryTypeList, setQueryTypeList] = useState([]);
  const listCC = [];
  const support = supportTeamList.find((x) => x.name === ticket.support_team);
  const reqDate = new Date(ticket.created_at)
    .toLocaleDateString()
    .split(/\D/)
    .slice(0, 3)
    .map((num) => num.padStart(2, '0'))
    .join('/');

  const formatData = (values) => {
    const {
      description = '',
      interestList = [],
      cc_list: ccList = [],
      priority = '',
      query_type_id: queryTypeId = '',
      queryType = '',
      subject = '',
    } = values;
    return {
      description,
      ccList: ccList || interestList,
      priority,
      queryTypeId: queryType || queryTypeId,
      subject,
    };
  };

  const handleCancel = () => {
    onClose();
  };

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'ticketManagement/fetchListEmployee',
      payload: {
        name: value,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data
        .filter((x) => x._id !== myEmployeeID)
        .map((user) => ({
          label: user.generalInfo?.legalName,
          value: user._id,
        }));
    });
  };

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
    }
    return setQueryTypeList([]);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        supportTeam: ticket?.department_assign,
        queryType: ticket.query_type_id,
        interestList: ticket.cc_list,
        description: ticket.description,
        priority: ticket.priority,
        subject: ticket.subject,
        requestDate: moment(reqDate),
        status: ticket.status,
      });
      setQueryTypeList(support?.queryType || []);
    }
  }, [visible, JSON.stringify(support)]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('uri', file);
    const res = await dispatch({
      type: 'ticketManagement/uploadFileAttachments',
      payload: formData,
    });
    if (res.statusCode === 200) {
      const { data = [] } = res;
      if (data.length > 0) {
        const uploadedAttachmentsTemp = JSON.parse(JSON.stringify(uploadedAttachments));
        uploadedAttachmentsTemp.push(data[0]);
        setUploadedAttachments(uploadedAttachmentsTemp);
      }
    }
  };

  const handleRemove = async (file) => {
    let uploadedAttachmentsTemp = JSON.parse(JSON.stringify(uploadedAttachments));
    uploadedAttachmentsTemp = uploadedAttachmentsTemp.filter(
      (att) => att.name !== file.name && att.size !== file.size,
    );
    setUploadedAttachments(uploadedAttachmentsTemp);
  };

  // const onSupportTeamChange = (value) => {
  //   const find = supportTeamList.find((x) => x._id === value);
  //   if (find) {
  //     setQueryTypeList(find?.queryType || []);
  //     formRef.current.setFieldsValue({
  //       queryType: null,
  //     });
  //   }
  // };

  const refreshData = () => {
    refreshFetchTicketList();

    dispatch({
      type: 'ticketManagement/fetchTicketByID',
      payload: {
        id: ticket.id,
      },
    });
  };

  const handleFinish = (value = {}) => {
    console.log('🚀 ~ value', value);
    const documents = uploadedAttachments?.map((item) => {
      const { id = '', url = '', name = '' } = item;
      return {
        attachment: id,
        attachmentName: name,
        attachmentUrl: url,
      };
    });

    // const supportTeam = supportTeamList.find((val) => val._id === value.supportTeam).name;
    let queryType;
    supportTeamList.find((val) => {
      return (queryType = val.queryType.find((y) => y._id === value.queryType));
    });

    let payload = Object.keys(formatData(value)).reduce((diff, key) => {
      if (formatData(ticket)[key] === formatData(value)[key]) return diff;
      return {
        ...diff,
        [key]: formatData(value)[key],
      };
    }, {});
    if (payload.queryTypeId) payload = { ...payload, queryType: queryType.name };
    console.log('🚀 ~ diff', payload);

    dispatch({
      type: 'ticketManagement/updateTicket',
      payload: {
        id: ticket.id,
        employeeRaise: ticket.employee_raise,
        employeeAssignee: ticket.employee_assignee || '',
        action: 'EDIT_TICKET',
        status: ticket.status,
        //     oldEmployeeAssignee,
        //     queryTypeId: value.queryType,
        //     subject: value.subject,
        //     description: value.description,
        //     priority: value.priority,
        //     ccList: value.interestList,
        attachments: documents || undefined,
        //     queryType: queryType.name,
        employee: myEmployeeID,
        role,
        ...payload,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
        form.resetFields();
        setUploadedAttachments([]);
        refreshData();
      }
    });
  };

  const renderModalContent = () => {
    return (
      <div className={styles.EditTicketModal}>
        <Form
          form={form}
          name="editTicketForm"
          ref={formRef}
          id="editTicketForm"
          onFinish={handleFinish}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Please select the support team' }]}
                label="Support Team"
                name="supportTeam"
                labelCol={{ span: 24 }}
              >
                <Select
                  loading={loadingFetchSupportTeam}
                  disabled
                  showSearch
                  // onChange={onSupportTeamChange}
                  placeholder="Select the support team"
                >
                  {supportTeamList.map((val) => (
                    <Option value={val._id} key={val._id}>
                      {val.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Request Date" name="requestDate" labelCol={{ span: 24 }}>
                <DatePicker disabled format={DATE_FORMAT_MDY} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Query Type"
                name="queryType"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select the query type' }]}
              >
                <Select showSearch placeholder="Select the query type">
                  {queryTypeList.map((val) => (
                    <Option value={val._id} key={val._id}>
                      {val.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Status" name="status" labelCol={{ span: 24 }}>
                <Select disabled>
                  <Option value="New">New</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Priority"
                name="priority"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select the priority' }]}
              >
                <Select showSearch placeholder="Select the priority">
                  {PRIORITY.map((val) => (
                    <Option value={val} key={val}>
                      {val}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} />

            <Col xs={24}>
              <Form.Item
                label="Subject"
                name="subject"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please enter the subject' }]}
              >
                <Input placeholder="Enter the subject" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Description"
                name="description"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please enter the description' }]}
              >
                <Input.TextArea autoSize={{ minRows: 3 }} placeholder="Enter the description" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label={
                  <span>
                    Interest List{' '}
                    <Tooltip
                      placement="rightBottom"
                      title="Add any user you want copied to this ticket"
                    >
                      <img src={HelpIcon} alt="" />
                    </Tooltip>
                  </span>
                }
                name="interestList"
                labelCol={{ span: 24 }}
              >
                <DebounceSelect
                  placeholder="Search to assign"
                  fetchOptions={onEmployeeSearch}
                  showSearch
                  mode="multiple"
                  allowClear
                  defaultValue={ticket.cc_list?.length ? 'hihi' : null}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Upload
                maxCount={2}
                action={(file) => handleUpload(file)}
                beforeUpload={(file) => beforeUpload(file, [FILE_TYPE.IMAGE, FILE_TYPE.PDF], 2)}
                onRemove={(file) => handleRemove(file)}
                openFileDialogOnClick={!(uploadedAttachments.length === 2)}
                showUploadList={uploadedAttachments.length > 0}
                listType="picture"
                // multiple
              >
                {isEmpty(uploadedAttachments) ? (
                  <>
                    {loadingUploadAttachment ? (
                      <Spin />
                    ) : (
                      <div className={styles.addAttachments}>
                        <CustomAddButton
                          onClick={(e) => e.preventDefault()}
                          disabled={uploadedAttachments.length === 2}
                        >
                          Add attachments
                        </CustomAddButton>
                        <span className={styles.description}>
                          (You can upload upto 2 documents of 2MB each)
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.addAttachments}>
                    <CustomAddButton
                      onClick={(e) => e.preventDefault()}
                      disabled={uploadedAttachments.length === 2}
                    >
                      Add attachments
                    </CustomAddButton>
                    <span className={styles.description}>
                      (You can upload upto 2 documents of 2MB each)
                    </span>
                  </div>
                )}
              </Upload>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <CommonModal
      onClose={handleCancel}
      width={650}
      loading={loadingUpdateTicket}
      hasCancelButton={false}
      content={renderModalContent()}
      visible={visible}
      firstText="Update"
      title={`Edit Ticket ${ticket.id}`}
      formName="editTicketForm"
    />
  );
};

export default connect(
  ({
    loading,
    ticketManagement: { listEmployee = [], supportTeamList = [] } = {},
    user: { currentUser = {} } = {},
  }) => ({
    listEmployee,
    supportTeamList,
    currentUser,
    loadingUploadAttachment: loading.effects['ticketManagement/uploadFileAttachments'],
    loadingFetchListEmployee: loading.effects['ticketManagement/fetchListEmployee'],
    loadingFetchSupportTeam: loading.effects['ticketManagement/fetchSupportTeamList'],
    loadingUpdateTicket: loading.effects['ticketManagement/updateTicket'],
  }),
)(EditTicketModal);
