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
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {}, compensationData = {} } = {},
      tempData: { generalData = {} } = {},
      listSkill = [],
      listTitle = [],
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    generalDataOrigin,
    generalData,
    listSkill,
    listTitle,
    compensationData,
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
    const { generalDataOrigin, generalData, dispatch } = this.props;
    const payload = { ...generalData, ...changedValues };
    const isModified = JSON.stringify(payload) !== JSON.stringify(generalDataOrigin);
    dispatch({
      type: 'employeeProfile/saveTemp',
      payload: { generalData: payload },
    });
    dispatch({
      type: 'employeeProfile/save',
      payload: { isModified },
    });
  };

  processDataChanges = () => {
    const { generalData: generalDataTemp } = this.props;
    const {
      preJobTitle = '',
      skills = [],
      preCompany = '',
      pastExp = 0,
      totalExp = 0,
      qualification = '',
      certification = [],
      _id: id = '',
    } = generalDataTemp;
    const payloadChanges = {
      // ...generalDataOrigin,
      id,
      preJobTitle,
      skills,
      preCompany,
      pastExp,
      totalExp,
      qualification,
      certification,
    };
    return payloadChanges;
  };

  processDataKept = () => {
    const { generalData } = this.props;
    const newObj = { ...generalData };
    const listKey = [
      'preJobTitle',
      'skills',
      'preCompany',
      'pastExp',
      'totalExp',
      'qualification',
      'certification',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleUpdateCertification = (list) => {
    const { dispatch, compensationData } = this.props;
    const { employee, company } = compensationData;
    list.forEach((element) => {
      if (element._id) {
        dispatch({
          type: 'employeeProfile/updateCertification',
          payload: {
            id: element._id,
            urlFile: element.urlFile,
          },
        });
      } else if (element.name || element.urlFile) {
        dispatch({
          type: 'employeeProfile/addCertification',
          payload: {
            name: element.name,
            urlFile: element.urlFile,
            employee,
            company,
          },
        });
      }
    });
  };

  handleSave = async () => {
    const { dispatch } = this.props;
    const payload = this.processDataChanges() || {};
    const dataTempKept = this.processDataKept() || {};
    const { certification } = payload;
    await this.handleUpdateCertification(certification);
    dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openAcademic',
    });
  };

  render() {
    const {
      generalData,
      handleCancel = () => {},
      listSkill = [],
      loading,
      listTitle = [],
    } = this.props;
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
          onFinish={this.handleSave}
          requiredMark={false}
          className={s.form}
          labelAlign="left"
          colon={false}
          onValuesChange={this.handleFormChange}
        >
          <Form.Item label="Previous Job Tilte" name="preJobTitle">
            <Select
              placeholder="Select title"
              showArrow
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listTitle.map((item) => (
                <Option key={item._id}>{item.name}</Option>
              ))}
            </Select>
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
          <div className={s.viewFooter}>
            <div className={s.viewFooter__cancel} onClick={handleCancel}>
              Cancel
            </div>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Edit;
