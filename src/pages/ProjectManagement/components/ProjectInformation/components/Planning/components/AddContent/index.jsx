import { Col, DatePicker, Form, Input, Row } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';
import { disabledEndDate } from '@/utils/projectManagement';
import CustomTag from '../../../CustomTag';
import styles from './index.less';

const colors = ['#006BEC', '#FF6CA1', '#6236FF', '#FE5D27'];

const AddContent = (props) => {
  const {
    dispatch,
    projectDetail = {},
    refreshData = () => {},
    onClose = () => {},
    employee: { generalInfo: { legalName: ownerName = '' } = {} } = {} || {},
  } = props;
  const { projectId = '', projectName = '', engagementType = '', tags = [] } = projectDetail;
  const [startDate, setStartDate] = useState('');

  const getColor = (index) => {
    return colors[index % colors.length];
  };

  const handleFinish = async (values) => {
    const res = await dispatch({
      type: 'projectDetails/addMilestoneEffect',
      payload: {
        ...values,
        projectId,
        ownerName,
      },
    });
    if (res.statusCode === 200) {
      refreshData();
      onClose();
    }
  };

  return (
    <div className={styles.AddContent}>
      <Form name="basic" id="myForm" onFinish={handleFinish} initialValues={{}}>
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col xs={24} md={12}>
            <Row gutter={[24, 10]}>
              <Col xs={24}>
                <div className={styles.item}>
                  <span className={styles.label}>Project Name:</span>
                  <span className={styles.value}>{projectName}</span>
                </div>
              </Col>
              <Col xs={24}>
                <div className={styles.item}>
                  <span className={styles.label}>Engagement Type:</span>
                  <span className={styles.value}>{engagementType}</span>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <div className={styles.item}>
              <span className={styles.label}>Tags:</span>
              <div className={styles.tags}>
                {typeof tags === 'object'
                  ? tags.map((t, i) => <CustomTag color={getColor(i)}>{t.tag_name}</CustomTag>)
                  : tags.map((t, i) => <CustomTag color={getColor(i)}>{t}</CustomTag>)}
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={[24, 0]} className={styles.belowPart}>
          <Col xs={24}>
            <Form.Item
              label="Milestone Name"
              name="milestoneName"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input placeholder="Enter Milestone Name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <DatePicker onChange={(val) => setStartDate(val)} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="End Date*"
              name="endDate"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <DatePicker disabledDate={(currentDate) => disabledEndDate(currentDate, startDate)} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Description"
              name="description"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Input.TextArea autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item>
              <span className={styles.someNotes}>*Tentative End Date</span>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(
  ({
    projectDetails: { projectDetail = {} } = {},
    user: { currentUser: { employee = {} } = {} },
  }) => ({
    employee,
    projectDetail,
  }),
)(AddContent);
