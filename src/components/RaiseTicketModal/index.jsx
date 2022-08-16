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
import CommonModal from '../CommonModal';
import CustomAddButton from '../CustomAddButton';
import styles from './index.less';

const { Option } = Select;

const RaiseTicketModal = (props) => {
  const [form] = Form.useForm();
  const formRef = React.createRef();
  const {
    visible = false,
    onClose = () => {},
    currentUser: {
      employee: {
        _id: myEmployeeID = '',
        location: { headQuarterAddress: { country = {} } = {} } = {},
      } = {} || {},
    } = {} || {},
    loadingFetchSupportTeam = false,
    loadingAddTicket = false,
    supportTeamList = [],
    isFeedback = false,
    dispatch,
    loadingUploadAttachment = false,
  } = props;

  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [queryTypeList, setQueryTypeList] = useState([]);
  const support = supportTeamList.find((x) => x.name === 'H.R.M.S Support');

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (visible) {
      const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));
      dispatch({
        type: 'ticketManagement/fetchSupportTeamList',
        payload: {
          permissions,
          country: country?._id,
        },
      });
    }
  }, [visible]);

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
    if (isFeedback && visible) {
      form.setFieldsValue({
        supportTeam: support?._id,
      });
      setQueryTypeList(support?.queryType || []);
    }
  }, [visible, JSON.stringify(support)]);

  const handleReset = () => {
    form.resetFields();
    setUploadedAttachments([]);
  };

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

  const onSupportTeamChange = (value) => {
    const find = supportTeamList.find((x) => x._id === value);
    if (find) {
      setQueryTypeList(find?.queryType || []);
      formRef.current.setFieldsValue({
        queryType: null,
      });
    }
  };

  const refreshData = () => {
    const permissions = getAuthority().filter((x) => x.toLowerCase().includes('ticket'));
    let payload = {
      status: ['New'],
    };
    if (permissions && permissions.length > 0) {
      payload = {
        ...payload,
        country,
        permissions,
      };
    }
    dispatch({
      type: 'ticketManagement/fetchListAllTicket',
      payload,
    });
    dispatch({
      type: 'ticketManagement/fetchToTalList',
      payload,
    });
  };

  const handleFinish = (value = {}) => {
    const documents = uploadedAttachments?.map((item) => {
      const { id = '', url = '', name = '' } = item;
      return {
        attachment: id,
        attachmentName: name,
        attachmentUrl: url,
      };
    });

    const supportTeam = supportTeamList.find((val) => val._id === value.supportTeam).name;
    let queryType;
    supportTeamList.find((val) => {
      return (queryType = val.queryType.find((y) => y._id === value.queryType));
    });

    dispatch({
      type: 'ticketManagement/addTicket',
      payload: {
        employeeRaise: myEmployeeID,
        employeeAssignee: '',
        status: value.status,
        queryTypeId: value.queryType,
        subject: value.subject,
        description: value.description,
        priority: value.priority,
        ccList: value.interestList,
        attachments: documents,
        departmentAssign: value.supportTeam,
        location: getCurrentLocation(),
        supportTeam,
        queryType: queryType.name,
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
      <div className={styles.RaiseTicketModal}>
        <Form
          form={form}
          name="raiseTicketForm"
          ref={formRef}
          id="raiseTicketForm"
          onFinish={handleFinish}
          initialValues={{
            status: 'New',
            requestDate: moment(),
          }}
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
                  disabled={loadingFetchSupportTeam}
                  showSearch
                  onChange={onSupportTeamChange}
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
                <Input.TextArea
                  autoSize={{ minRows: 5, maxRows: 9 }}
                  maxLength={1000}
                  placeholder="Enter the description"
                />
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
                  placeholder="Select the interest list"
                  fetchOptions={onEmployeeSearch}
                  showSearch
                  mode="multiple"
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
    <>
      <CommonModal
        onClose={handleCancel}
        width={650}
        loading={loadingAddTicket}
        hasCancelButton={false}
        hasSecondButton
        secondText="Reset"
        onSecondButtonClick={handleReset}
        content={renderModalContent()}
        visible={visible}
        title="Raise Ticket"
        formName="raiseTicketForm"
      />
    </>
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
    loadingAddTicket: loading.effects['ticketManagement/addTicket'],
  }),
)(RaiseTicketModal);
