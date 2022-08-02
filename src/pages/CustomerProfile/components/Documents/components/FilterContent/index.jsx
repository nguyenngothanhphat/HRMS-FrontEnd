import { Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import style from './index.less';

const FilterContent = (props) => {
  const {
    onFilter = () => {},
    handleFilterCounts = () => {},
    documentType,
    uploadByList = [],
    filter = {},
  } = props;

  const [form] = Form.useForm();

  const onFinishDebounce = debounce((values) => {
    handleFilterCounts(values);
    onFilter(values);
  }, 800);

  const onValuesChange = (changedValues, allValues) => {
    onFinishDebounce(allValues);
  };

  useEffect(() => {
    if (isEmpty(filter)) {
      form.resetFields();
    }
  }, [JSON.stringify(filter)]);

  return (
    <div className={style.FilterContent}>
      <Form layout="vertical" name="filter" form={form} onValuesChange={onValuesChange}>
        <Form.Item label="By Type" name="byType">
          <Select
            // mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select"
          >
            {documentType.map((item) => (
              <Select.Option key={item.id}>{item.type_name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="By uploaded by" name="byUpload">
          <Select mode="multiple" allowClear style={{ width: '100%' }} placeholder="Please select">
            {uploadByList.map((item) => {
              return <Select.Option key={item}>{item}</Select.Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item label="By Uploaded On">
          <Row gutter={24}>
            <Col span={11}>
              <Form.Item name="fromDate">
                <DatePicker format={DATE_FORMAT_MDY} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <p
                style={{
                  fontSize: 13,
                  marginTop: 10,
                }}
              >
                to
              </p>
            </Col>
            <Col span={11}>
              <Form.Item name="toDate">
                <DatePicker format={DATE_FORMAT_MDY} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterContent;
