/* eslint-disable compat/compat */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-promise-reject-errors */
import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import imageAddSuccess from '@/assets/resource-management-success.svg';
import CommonModal from '@/components/CommonModal';
import { disabledEndDate } from '@/utils/resourceManagement';
import { DATE_FORMAT_YMD } from '@/constants/dateFormat';
import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

const AddActionBTN = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    dataPassRow,
    refreshData,
    onClose = () => {},
    projectList = [],
    statusList = [],
    visible,
    loading = false,
  } = props;

  const [visibleModalSuccess, setVisibleModalSuccess] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectAssignedId, setProjectAssignedId] = useState('');
  const [startDateState, setStartDate] = useState('');

  const clearState = () => {
    setProjectId('');
  };

  const handleCancelModelSuccess = () => {
    setVisibleModalSuccess(false);
    clearState();
  };

  const handleViewProject = () => {
    history.push(`/project-management/list/${projectAssignedId}/summary`);
  };

  const handleOnchange = (event) => {
    setProjectId({ projectId: event });
  };

  const handleSubmitAssign = async (values) => {
    const { project, status, utilization, startDate, endDate, comment, revisedEndDate } = values;

    await dispatch({
      type: 'resourceManagement/assignResourceToProject',
      payload: {
        employee: dataPassRow.employeeId,
        project,
        status,
        utilization,
        startDate: (startDate && moment(startDate).format(DATE_FORMAT_YMD)) || null,
        endDate: (endDate && moment(endDate).format(DATE_FORMAT_YMD)) || null,
        revisedEndDate: (revisedEndDate && moment(revisedEndDate).format(DATE_FORMAT_YMD)) || null,
        comment,
        milestone: '',
      },
    }).then((response) => {
      if (response.statusCode === 200) {
        setVisibleModalSuccess(true);
        setProjectAssignedId(projectList.find((item) => item.id === project).projectId);
        onClose();
      }
      refreshData();
    });
  };

  const handleChangeStartDate = (value) => {
    setStartDate(value);
    form.setFieldsValue({ endDate: null });
  };

  const modalContent = () => {
    const projectId1 = projectId !== -1 ? projectId : 0;
    const projectDetail = projectList.find((obj) => obj.id === projectId1) || {};
    return (
      <Form
        layout="vertical"
        className={styles.formAdd}
        method="POST"
        id="myForm"
        form={form}
        onFinish={(values) => handleSubmitAssign(values)}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Form.Item
              label="Project"
              name="project"
              rules={[{ required: true, message: 'Please select the project!' }]}
            >
              <Select
                placeholder="Select the project"
                onChange={(event) => handleOnchange(event)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {projectList.map((project) => (
                  <Option value={project.id}>{project.projectName}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select the status!' }]}
            >
              <Select
                placeholder="Select the status"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {statusList.map((status) => (
                  <Option value={status}>{status}</Option>
                ))}
              </Select>
            </Form.Item>
            <div className={styles.utilization}>
              <Form.Item
                label="Bandwith Allocation (%)"
                name="utilization"
                rules={[
                  { required: true, message: 'Please enter the bandwith allocation (%)!' },
                  () => ({
                    validator(_, value) {
                      if (value && isNaN(value)) {
                        return Promise.reject(`Value enter has to be a number!`);
                      }
                      if (value && value > 100) {
                        return Promise.reject(
                          `The bandwith allocation (%) can't be greater than 100%!`,
                        );
                      }
                      if (value < 1 && value) {
                        return Promise.reject(`Your cannot enter a value that is less than 0!`);
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input addonAfter="%" />
              </Form.Item>
            </div>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Start date value could not be empty!' }]}
            >
              <DatePicker
                onChange={(val) => handleChangeStartDate(val)}
                placeholder="Enter Start Date"
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'End date value could not be empty!' }]}
            >
              <DatePicker
                disabledDate={(current) => disabledEndDate(current, startDateState)}
                placeholder="Enter End Date"
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
            <Form.Item label="Revised End Date" name="revisedEndDate">
              <DatePicker
                disabledDate={(current) => disabledEndDate(current, startDateState)}
                placeholder="Enter Date"
                suffixIcon={<img src={datePickerIcon} alt="" />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Comments (optional)" name="comment">
          <TextArea placeholder="Enter Comments" autoSize={{ minRows: 4, maxRows: 8 }} />
        </Form.Item>
        {projectId && (
          <Form.Item label={<span style={{ fontWeight: '700' }}>Project Details</span>}>
            <Card style={{ background: '#F6F7F9' }}>
              <Row>
                <Col span={12}>
                  <p>
                    Customer:
                    <span style={{ color: '#2C6DF9' }}> {projectDetail.customerName || ''}</span>
                  </p>
                  <p>
                    Project:{' '}
                    <span style={{ color: '#2C6DF9' }}> {projectDetail.projectName || ''}</span>
                  </p>
                  <p>
                    Engagement Type:
                    <span style={{ color: '#2C6DF9' }}>{projectDetail.engagementType || ''}</span>
                  </p>
                  <p>
                    Start Date:{' '}
                    <span style={{ color: '#2C6DF9' }}>
                      {moment(projectDetail.startDate).format('DD MM YYYY')}
                    </span>
                  </p>
                  <p>
                    End Date:{' '}
                    <span style={{ color: '#2C6DF9' }}>
                      {moment(projectDetail.endDate).format('DD MM YYYY')}
                    </span>
                  </p>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={12}>Current resource allocation :</Col>
                    <Col span={12}>
                      {projectDetail?.resourceTypes?.length > 0 ? (
                        projectDetail?.resourceTypes.map((item) => {
                          return (
                            <p>
                              <span style={{ color: '#2C6DF9' }}>{item?.number_of_applied}</span>
                              {`/${item?.number_of_resources} ${item?.type_detail?.name} (${item?.billing_status})`}
                            </p>
                          );
                        })
                      ) : (
                        <p>
                          <span style={{ color: '#2C6DF9' }}>No Data</span>
                        </p>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Form.Item>
        )}
      </Form>
    );
  };

  useEffect(() => {
    clearState();
  }, [visible]);

  return (
    <div className={styles.Add}>
      <CommonModal
        title="Assign to project"
        visible={visible}
        footer={null}
        onClose={onClose}
        width={600}
        content={modalContent()}
        firstText="Assign to project"
        disabledButton={loading}
      />

      <Modal
        visible={visibleModalSuccess}
        className={styles.modalAdd}
        footer={null}
        width="396px"
        onCancel={handleCancelModelSuccess}
      >
        <div style={{ textAlign: 'center' }}>
          <img src={imageAddSuccess} alt="add success" />
        </div>
        <br />
        <br />
        <h3 style={{ textAlign: 'center' }}>Resource assigned!</h3>
        <p style={{ textAlign: 'center', color: '#707177' }}>
          The resource has been successfully assigned to the project
        </p>
        <div className={styles.spaceFooterModalSuccess}>
          <div className={styles.btnCancel} onClick={handleViewProject}>
            View Project
          </div>
          <Button onClick={handleCancelModelSuccess} className={styles.btnSubmit}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default connect(
  ({
    loading = {},
    resourceManagement: { projectList = [], resourceList = [], statusList = [] } = {},
  }) => ({
    loading: loading.effects['resourceManagement/assignResourceToProject'],
    projectList,
    resourceList,
    statusList,
  }),
)(AddActionBTN);
