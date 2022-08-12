import { Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { DATE_FORMAT_STR } from '@/constants/dateFormat';
import DebounceSelect from '@/components/DebounceSelect';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    dispatch,
    projectDetails: { documentTypeList = [] } = {},
    onFilter = () => {},
    filter = {},
  } = props;

  const disableFromDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value > moment(t);
  };

  const disableToDate = (value, compareVar) => {
    const t = form.getFieldValue(compareVar);
    if (!t) return false;
    return value < moment(t);
  };

  const onEmployeeSearch = (val) => {
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'projectDetails/fetchEmployeeListEffect',
      payload: {
        name: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfo?.legalName,
        value: user.generalInfo?.userId,
      }));
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

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  // clear values
  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  return (
    <Form
      form={form}
      layout="vertical"
      name="filter"
      onValuesChange={onValuesChange}
      className={styles.FilterContent}
    >
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
        <DebounceSelect
          placeholder="Search by Employee Name or ID"
          mode="multiple"
          fetchOptions={onEmployeeSearch}
          allowClear
        />
      </Form.Item>

      <Form.Item label="By Uploaded Date">
        <Row>
          <Col span={11}>
            <Form.Item name="fromDate">
              <DatePicker
                format={DATE_FORMAT_STR}
                disabledDate={(val) => disableFromDate(val, 'toDate')}
              />
            </Form.Item>
          </Col>
          <Col span={2} className={styles.separator}>
            <span>to</span>
          </Col>
          <Col span={11}>
            <Form.Item name="toDate">
              <DatePicker
                format={DATE_FORMAT_STR}
                disabledDate={(val) => disableToDate(val, 'fromDate')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({ projectDetails, loading, user: { currentUser: { employee = {} } = {} } }) => ({
    employee,
    projectDetails,
    loadingFetchEmployeeList: loading.effects['projectDetails/fetchEmployeeListEffect'],
  }),
)(FilterContent);
