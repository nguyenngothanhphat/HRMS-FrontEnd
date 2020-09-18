import React, { PureComponent } from 'react';
import { Button, Form, Input, Select, Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import FormCertification from './components/FormCertification';
import s from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};

const { Option } = Select;

@connect(
  ({
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {} } = {},
      tempData: { generalData = {} } = {},
      listSkill = [],
    } = {},
  }) => ({
    generalDataOrigin,
    generalData,
    listSkill,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  tagRender = (props) => {
    const { label, onClose } = props;
    return (
      <Tag icon={<CloseCircleOutlined className={s.iconClose} onClick={onClose} />} color="red">
        {label}
      </Tag>
    );
  };

  handleFormChange = (changedValues) => {
    console.log('changedValues', changedValues);
    const { generalData } = this.props;
    const payload = { ...generalData, ...changedValues };
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: payload },
    });
  };

  handleSave = () => {
    const { generalData, generalDataOrigin } = this.props;
    const payloadUpdate = { ...generalDataOrigin, ...generalData };
    console.log('payloadUpdate', payloadUpdate);
  };

  render() {
    const { generalData, handleCancel = () => {}, listSkill = [] } = this.props;
    const {
      preJobTitle = '',
      skills = [],
      preCompany = '',
      pastExp = 0,
      totalExp = 0,
      qualification = '',
    } = generalData;
    let { certification = [{}] } = generalData;
    certification = certification?.length > 0 ? certification : [{}];
    const getIdSkill = skills.map((item) => item._id);
    return (
      <div className={s.root}>
        <Form
          name="basic"
          initialValues={{
            preJobTitle,
            preCompany,
            pastExp,
            totalExp,
            qualification,
            skills: getIdSkill,
            certification,
          }}
          {...formItemLayout}
          onFinish={this.onFinish}
          requiredMark={false}
          className={s.form}
          labelAlign="left"
          colon={false}
          onValuesChange={this.handleFormChange}
        >
          <Form.Item label="Previous Job Tilte" name="preJobTitle">
            <Input />
          </Form.Item>
          <Form.Item label="Previous Company" name="preCompany">
            <Input />
          </Form.Item>
          <Form.Item label="Past Experience" name="pastExp">
            <Input />
          </Form.Item>
          <Form.Item label="Total Experience" name="totalExp">
            <Input />
          </Form.Item>
          <Form.Item label="Qualification" name="qualification">
            <Input />
          </Form.Item>
          <Form.Item name="certification" className={s.certificationContainer}>
            <FormCertification />
          </Form.Item>
          <Form.Item label="Skills" name="skills">
            <Select
              placeholder="Select skill"
              mode="multiple"
              tagRender={this.tagRender}
              onKeyDown={this.handleOnKeyDown}
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listSkill.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <div className={s.viewFooter}>
          <div className={s.viewFooter__cancel} onClick={handleCancel}>
            Cancel
          </div>
          <Button type="primary" htmlType="submit" onClick={this.handleSave}>
            Save
          </Button>
        </div>
      </div>
    );
  }
}

export default Edit;
