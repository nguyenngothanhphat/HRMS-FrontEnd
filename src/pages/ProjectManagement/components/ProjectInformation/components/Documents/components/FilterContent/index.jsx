import { Form, Select, Row, Col, DatePicker } from 'antd';
import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    projectDetails: { documentTypeList = [], employeeList = [] } = {},
    onFilter = () => {},
    needResetFilterForm = false,
    setNeedResetFilterForm = () => {},
    setIsFiltering = () => {},
    setApplied = () => {}
  } = props;

  const fetchDocumentTypeList = () => {
    dispatch({
      type: 'projectDetails/fetchDocumentTypeListEffect',
    });
    dispatch({
      type: 'projectDetails/fetchEmployeeListEffect',
    });
  };

  const onFinish = (values) => {
    const newValues = { ...values };
    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const result = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );

    onFilter(result);
  };

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  useEffect(() => {
    fetchDocumentTypeList();
  }, []);

   // clear values
  useEffect(() => {
    if (needResetFilterForm) {
      form.resetFields();
      setNeedResetFilterForm(false);
      setIsFiltering(false);
      setApplied(0);
    }
  }, [needResetFilterForm]);

  return (
    <Form form={form} layout="vertical" name="filter" onValuesChange={onValuesChange} className={styles.FilterContent}>
      <Form.Item label="By document type" name="type">
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
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
        <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Please select">
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
