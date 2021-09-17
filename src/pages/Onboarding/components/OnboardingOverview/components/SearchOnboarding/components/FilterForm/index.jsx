import React, { Component } from 'react';
import { Form, Select } from 'antd';
import styles from './index.less';

const { Option } = Select;
class FilterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.filterForm}>
        <Form layout="horizontal" className={styles.form}>
          <Form.Item label="BY STATUS">
            <Select>
              <Option>All</Option>
            </Select>
          </Form.Item>
          <Form.Item label="BY POSITION">
            <Select mode="multiple">
              <Option>All</Option>
            </Select>
          </Form.Item>
          <Form.Item label="BY LOCATION">
            <Select mode="multiple">
              <Option>All</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default FilterForm;
