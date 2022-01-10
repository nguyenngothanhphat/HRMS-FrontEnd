import {
  Button,
  Col,
  Modal,
  Row,
  Form,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Upload,
  Spin,
  message,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'umi';
import moment from 'moment';
import HelpIcon from '@/assets/dashboard/help.svg';
import BlueAddIcon from '@/assets/dashboard/blueAdd.svg';
import { SUPPORT_TEAM, PRIORITY } from '@/utils/dashboard';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';

import styles from './index.less';

const { Option } = Select;
const dateFormat = 'MM/DD/YYYY';

const RaiseTicketModal = (props) => {
  const [form] = Form.useForm();
  const formRef = React.createRef();
  const {
    visible = false,
    title = '',
    onClose = () => {},
    currentUser: { employee: { _id: myEmployeeID = '' } = {} || {} } = {} || {},
    loadingFetchListEmployee = false,
  } = props;

  const { maxFileSize = 2, dispatch } = props;
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [queryTypeList, setQueryTypeList] = useState([]);
  const [attachment, setAttachment] = useState('');
  const [supportTeam, setSupportTeam] = useState('');

  const { listEmployee, loadingUploadAttachment = false } = props;
  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };
  const handleCancel = () => {
    onClose();
  };
  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'ticketManagement/fetchListEmployee',
        payload: {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        },
      });
      // dispatch({
      //   type: 'ticketManagement/fetchDepartments',
      //   payload: {
      //     tenantId: getCurrentTenant(),
      //     company: getCurrentCompany(),
      //   },
      // });
    }
  }, [visible]);

  const handleReset = () => {
    form.resetFields();
    setUploadedAttachments([]);
    setAttachment('');
  };
  const beforeUpload = (file) => {
    const checkType =
      file.type === 'application/pdf' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'application/pdf';

    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLtMaxFileSize = file.size / 1024 / 1024 < maxFileSize;
    if (!isLtMaxFileSize) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        message.error(`Image must smaller than ${maxFileSize}MB!`);
      }
      if (file.type === 'application/pdf') {
        message.error(`File must smaller than ${maxFileSize}MB!`);
      }
    }
    return checkType && isLtMaxFileSize;
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
      const idUpload = data[0].id;
      setAttachment(idUpload);
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
    setSupportTeam(value);
    const queryTypeListTemp = SUPPORT_TEAM.find((val) => val._id === value);
    setQueryTypeList(queryTypeListTemp.queryType || []);
  };

  const handleFinish = (value) => {
    const documents = uploadedAttachments?.map((item) => {
      const { id = '', url = '', name = '' } = item;
      return {
        attachment: id,
        attachmentName: name,
        attachmentUrl: url,
      };
    });

    dispatch({
      type: 'ticketManagement/addTicket',
      payload: {
        employeeRaise: myEmployeeID,
        employeeAssignee: '',
        status: value.status,
        queryType: value.queryType,
        subject: value.subject,
        description: value.description,
        priority: value.priority,
        ccList: value.interestList,
        attachments: documents,
        departmentAssign: supportTeam,
        location: getCurrentLocation(),
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
        form.resetFields();
        setUploadedAttachments([]);
        setAttachment('');
      }
    });
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          form={form}
          name="basic"
          ref={formRef}
          id="myForm"
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
                label="Support Team*"
                name="supportTeam"
                labelCol={{ span: 24 }}
              >
                <Select
                  showSearch
                  onChange={onSupportTeamChange}
                  placeholder="Select the support team"
                >
                  {SUPPORT_TEAM.map((val) => (
                    <Option value={val._id}>{val.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Request Date" name="requestDate" labelCol={{ span: 24 }}>
                <DatePicker disabled format={dateFormat} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Query Type*"
                name="queryType"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select the query type' }]}
              >
                <Select showSearch placeholder="Select the query type">
                  {queryTypeList.map((val) => (
                    <Option value={val}>{val}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Status*"
                name="status"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select the status' }]}
              >
                <Select disabled>
                  <Option value="New">New</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Priority*"
                name="priority"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please select the priority' }]}
              >
                <Select showSearch placeholder="Select the priority">
                  {PRIORITY.map((val) => (
                    <Option value={val}>{val}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} />

            <Col xs={24}>
              <Form.Item
                label="Subject*"
                name="subject"
                labelCol={{ span: 24 }}
                rules={[{ required: true, message: 'Please enter the subject' }]}
              >
                <Input placeholder="Enter the subject" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Description*"
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
                <Select
                  showSearch
                  mode="multiple"
                  placeholder="Select the interest list"
                  allowClear
                  loading={loadingFetchListEmployee}
                  disabled={loadingFetchListEmployee}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {listEmployee
                    ? listEmployee.map((val) => {
                        return <Option value={val?._id}>{val?.generalInfo?.legalName}</Option>;
                      })
                    : ''}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Upload
                maxCount={2}
                action={(file) => handleUpload(file)}
                beforeUpload={beforeUpload}
                onRemove={(file) => handleRemove(file)}
                openFileDialogOnClick={!(uploadedAttachments.length === 2)}
                showUploadList={uploadedAttachments.length > 0}
                // multiple
              >
                {isEmpty(uploadedAttachments) ? (
                  <>
                    {loadingUploadAttachment ? (
                      <Spin />
                    ) : (
                      <div
                        className={`${styles.addAttachments} ${
                          uploadedAttachments.length === 2 ? styles.disableUpload : {}
                        }`}
                      >
                        <div className={styles.btn}>
                          <img src={BlueAddIcon} alt="blueAddIcon" />
                          <span className={styles.text}>Add attachments</span>
                        </div>
                        <span className={styles.description}>
                          (You can upload upto 2 documents of 2MB each)
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className={`${styles.addAttachments} ${
                      uploadedAttachments.length === 2 ? styles.disableUpload : {}
                    }`}
                  >
                    <div className={styles.btn}>
                      <img src={BlueAddIcon} alt="blueAddIcon" />
                      <span className={styles.text}>Add attachments</span>
                    </div>
                    <span className={styles.description}>
                      (You can upload upto 2 documents of 2MB each)
                    </span>
                  </div>
                )}

                {/* <div
                  className={`${styles.addAttachments} ${
                    uploadedAttachments.length === 2 ? styles.disableUpload : {}
                  }`}
                >
                  <div className={styles.btn}>
                    <img src={BlueAddIcon} alt="blueAddIcon" />
                    <span className={styles.text}>Add attachments</span>
                  </div>
                  <span className={styles.description}>
                    (You can upload upto 2 documents of 2MB each)
                  </span>
                </div> */}
              </Upload>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.RaiseTicketModal} ${styles.withPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={650}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleReset}>
              Reset
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
            >
              Submit
            </Button>
          </>
        }
        title={renderModalHeader()}
        centered
        visible={visible}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default connect(
  ({ loading, ticketManagement: { listEmployee = [] } = {}, user: { currentUser = {} } = {} }) => ({
    listEmployee,
    currentUser,
    loadingUploadAttachment: loading.effects['ticketManagement/uploadFileAttachments'],
    loadingFetchListEmployee: loading.effects['ticketManagement/fetchListEmployee'],
  }),
)(RaiseTicketModal);
