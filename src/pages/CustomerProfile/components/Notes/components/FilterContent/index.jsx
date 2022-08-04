import { Col, DatePicker, Form, Row, Select } from 'antd';
import React, { PureComponent } from 'react';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import style from './index.less';

class FilterContent extends PureComponent {
  render() {
    const { employeeList = [], onFilter = () => {} } = this.props;
    return (
      <div className={style.FilterContent}>
        <Form layout="vertical" name="filter" onValuesChange={(_, values) => onFilter(values)}>
          <Form.Item label="By Author" name="byAuthor">
            <Select allowClear style={{ width: '100%' }} placeholder="Please select">
              {employeeList.map((item) => {
                return (
                  <Select.Option value={item._id} key={item._id}>
                    {item.generalInfo?.legalName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="By Date">
            <Row gutter={24}>
              <Col span={11}>
                <Form.Item name="fromDate">
                  <DatePicker format={DATE_FORMAT_MDY} />
                </Form.Item>
              </Col>
              <Col span={2}>
                <span>to</span>
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
  }
}

export default FilterContent;
