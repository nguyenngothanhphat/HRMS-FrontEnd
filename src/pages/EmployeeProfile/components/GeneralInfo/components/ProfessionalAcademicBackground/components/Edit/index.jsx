import React, { PureComponent } from 'react';
import { Button, Form, Input } from 'antd';
import { connect } from 'umi';
import s from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 9 },
};

@connect(({ employeeProfile: { tempData: { generalData = {} } = {} } = {} }) => ({
  generalData,
}))
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      generalData: {},
    };
  }

  static getDerivedStateFromProps(props) {
    if ('generalData' in props) {
      return { generalData: props.generalData };
    }
    return null;
  }

  render() {
    const { handleCancel = () => {} } = this.props;
    const { generalData } = this.state;
    const {
      preJobTitle = '',
      // skills = [],
      preCompany = '',
      pastExp = 0,
      totalExp = 0,
      qualification = '',
      // certification = [],
    } = generalData;
    console.log('generalData from state', generalData);
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
          }}
          {...formItemLayout}
          onFinish={this.onFinish}
          requiredMark={false}
          className={s.form}
          labelAlign="left"
          colon={false}
        >
          <Form.Item label="Previous Job Tilte" name="preJobTitle" rules={[]}>
            <Input />
          </Form.Item>
          <Form.Item label="Previous Company" name="preCompany" rules={[]}>
            <Input />
          </Form.Item>
          <Form.Item label="Past Experience" name="pastExp" rules={[]}>
            <Input />
          </Form.Item>
          <Form.Item label="Past Experience" name="totalExp" rules={[]}>
            <Input />
          </Form.Item>
          <Form.Item label="Qualification" name="qualification" rules={[]}>
            <Input />
          </Form.Item>
        </Form>
        <div className={s.viewFooter}>
          <div className={s.viewFooter__cancel} onClick={handleCancel}>
            Cancel
          </div>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </div>
    );
  }
}

export default Edit;
