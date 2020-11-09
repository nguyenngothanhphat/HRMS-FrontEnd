import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, Button } from 'antd';
import { formatMessage } from 'umi';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
class EditCurrentInfo extends PureComponent {
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 9 },
      },
    };

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        <Form
          className={styles.form}
          {...formItemLayout}
          onValuesChange={(changedValues) => this.handleChange(changedValues)}
          onFinish={this.handleSave}
        >
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            Location
          </Form.Item>
          <Form.Item label="Joining Date" name="Title" rules={[{ required: true }]}>
            Joining Date
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'addEmployee.department' })}
            name="department"
            rules={[{ required: true }]}
          >
            <Select
              placeholder={formatMessage({ id: 'addEmployee.placeholder.department' })}
              showArrow
              showSearch
              getPopupContainer={() => document.getElementById('addEmployee__form')}
              onChange={(value) => this.onChangeSelect('department', value)}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {/* {departmentList.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))} */}
            </Select>
          </Form.Item>
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            Title
          </Form.Item>
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            Title
          </Form.Item>
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            Title
          </Form.Item>
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            Title
          </Form.Item>
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            Title
          </Form.Item>
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            Title
          </Form.Item>
          <div className={styles.spaceFooter}>
            <div className={styles.cancelFooter}>Cancel</div>
            <Button type="primary" htmlType="submit" className={styles.buttonFooter}>
              Save
            </Button>
          </div>
        </Form>
      </Row>
    );
  }
}

export default EditCurrentInfo;
