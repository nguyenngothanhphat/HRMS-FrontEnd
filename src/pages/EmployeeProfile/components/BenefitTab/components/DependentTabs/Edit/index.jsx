import React, { PureComponent } from 'react';
import { Form, Button, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import moment from 'moment';
import RemoveIcon from './assets/removeIcon.svg';
import s from './index.less';

const { Option } = Select;

@connect(({ employeeProfile }) => ({
  employeeProfile,
}))
class Edit extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSave = (values) => {
    // eslint-disable-next-line no-console
    console.log('Success: ', values);
  };

  formatData = (data) => {
    return data.map((value) => {
      const { legalName = '', gender = '', relationship = '', dob = '' } = value;
      return {
        legalName,
        gender,
        relationship,
        dob: moment(dob).locale('en'),
      };
    });
  };

  _renderEditForm = () => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 9 },
        sm: { span: 12 },
      },
    };
    const { data = [] } = this.props;

    const formatData = this.formatData(data);

    return (
      <Form
        className={s.Form}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...formItemLayout}
        ref={this.formRef}
        id="myForm"
        onFinish={this.handleSave}
        initialValues={{ dependents: formatData }}
      >
        <Form.List name="dependents">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <>
                  {index > 0 && <div className={s.line} />}
                  <div className={s.title}>
                    <span className={s.text}>Dependent {index + 1}</span>
                    <img src={RemoveIcon} alt="remove" onClick={() => remove(field.name)} />
                  </div>

                  <Form.Item
                    label="Legal Name"
                    name={[field.name, 'legalName']}
                    // name={[field.name, 'first']}
                    fieldKey={[field.fieldKey, 'legalName']}
                    rules={[
                      {
                        required: true,
                        message: 'Please type name!',
                      },
                    ]}
                    // initialValue={item.visaType}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Gender"
                    name={[field.name, 'gender']}
                    // name={[field.name, 'first']}
                    fieldKey={[field.fieldKey, 'gender']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select gender!',
                      },
                    ]}
                    // initialValue={item.visaType}
                  >
                    <Select className={s.selectForm}>
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Relationship"
                    name={[field.name, 'relationship']}
                    // name={[field.name, 'first']}
                    fieldKey={[field.fieldKey, 'relationship']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select the relationship!',
                      },
                    ]}
                    // initialValue={item.visaType}
                  >
                    <Select className={s.selectForm}>
                      <Option value="Father">Father</Option>
                      <Option value="Mother">Mother</Option>
                      <Option value="Grandfather">Grandfather</Option>
                      <Option value="Grandmother">Grandmother</Option>
                      <Option value="...">...</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Date of birth"
                    name={[field.name, 'dob']}
                    fieldKey={[field.fieldKey, 'dob']}
                    rules={[
                      {
                        required: true,
                        message: 'Please choose date of birth!',
                      },
                    ]}
                    // initialValue={item.visaType}
                  >
                    <DatePicker format="MM.DD.YY" />
                  </Form.Item>
                </>
              ))}
              <Form.Item>
                <Button onClick={() => add()} icon={<PlusOutlined />}>
                  Add new
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    );
  };

  _renderButton = () => {
    const { setEditing = () => {} } = this.props;
    return (
      <div className={s.spaceFooter}>
        <div className={s.cancelFooter} onClick={() => setEditing(false)}>
          Cancel
        </div>
        <Button type="primary" htmlType="submit" form="myForm" className={s.buttonFooter}>
          Save
        </Button>
      </div>
    );
  };

  render() {
    return (
      <div className={s.Edit}>
        {this._renderEditForm()}
        {this._renderButton()}
        <p />
      </div>
    );
  }
}

export default Edit;
