import { Form, Select, Row, Col, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const {
    dispatch,
    projectDetails: { documentTypeList = [], employeeList = [] } = {},
    onFilter = () => {},
  } = props;
  
  const fetchDocumentTypeList = () => {
    dispatch({
      type: 'projectDetails/fetchDocumentTypeListEffect',
    });
    dispatch({
      type: 'projectDetails/fetchEmployeeListEffect',
    });
  };

  useEffect(() => {
    fetchDocumentTypeList();
  }, []);

  return (
    <Form layout="vertical" name="filter" onFinish={onFilter} className={styles.FilterContent}>
      <Form.Item label="By document type" name="type">
        <Select allowClear style={{ width: '100%' }} placeholder="Please select">
          {documentTypeList.map((item) => {
            return (
              <Select.Option value={item.id} key={item}>
                {item.type_name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By employee" name="uploadedBy">
        <Select allowClear style={{ width: '100%' }} placeholder="Please select">
          {employeeList.map((item) => {
            return (
              <Select.Option value={item._id} key={item}>
                {item.generalInfo?.legalName}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item label="By Uploaded Date">
        <Row>
          <Col span={11}>
            <Form.Item name="fromDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="toDate">
              <DatePicker format="MMM DD, YYYY" />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(({ projectDetails, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  projectDetails,
}))(FilterContent);
