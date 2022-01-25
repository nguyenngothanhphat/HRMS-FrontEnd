/* eslint-disable react/jsx-curly-newline */
import React, { PureComponent } from 'react';
import { Button, Form, Input, Select, notification } from 'antd';
import { connect } from 'umi';
import FormCertification from './components/FormCertification';
import s from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const { Option } = Select;

@connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: generalDataOrigin = {}, compensationData = {} } = {},
      tempData: { generalData = {} } = {},
      listSkill = [],
      // listTitle = [],
      tenantCurrentEmployee = '',
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    generalDataOrigin,
    generalData,
    listSkill,
    // listTitle,
    compensationData,
    tenantCurrentEmployee,
  }),
)
class Edit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      notValid: false,
    };
  }

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
    if (changedValues.certification) {
      this.checkCeritification(changedValues.certification);
    }
  };

  checkCeritification = (listCertification) => {
    const listNoName = listCertification.filter((item) => !item.name);
    if (listNoName.length > 0) {
      this.setState({ notValid: true });
    } else {
      this.setState({ notValid: false });
    }
  };

  processDataChanges = (newSkills) => {
    const { generalData: generalDataTemp, tenantCurrentEmployee = '' } = this.props;
    const {
      preJobTitle = '',
      // skills = [],
      preCompany = '',
      linkedIn = '',
      totalExp = 0,
      qualification = '',
      certification = [],
      otherSkills = '',
      _id: id = '',
    } = generalDataTemp;
    const payloadChanges = {
      id,
      preJobTitle,
      skills: newSkills,
      preCompany,
      linkedIn,
      totalExp,
      qualification,
      certification,
      otherSkills: otherSkills instanceof Array ? otherSkills : [otherSkills],
      tenantId: tenantCurrentEmployee,
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
      'linkedIn',
      'totalExp',
      'qualification',
      'certification',
      'otherSkills',
    ];
    listKey.forEach((item) => delete newObj[item]);
    return newObj;
  };

  handleRemoveCertification = ({ _id: id }) => {
    const { dispatch, currentTenantEmployee = '' } = this.props;
    dispatch({
      type: 'employeeProfile/removeCertification',
      payload: {
        tenantId: currentTenantEmployee,
        id,
      },
    });
  };

  handleUpdateCertification = (list) => {
    const { dispatch, compensationData = {}, tenantCurrentEmployee = '' } = this.props;
    const { employee = {}, company = {} } = compensationData;
    const tenantId = tenantCurrentEmployee;

    list.forEach((element) => {
      if (element._id) {
        dispatch({
          type: 'employeeProfile/updateCertification',
          payload: {
            name: element?.name,
            id: element?._id,
            urlFile: element?.urlFile,
            tenantId,
          },
        });
      } else if (element.name || element.urlFile) {
        dispatch({
          type: 'employeeProfile/addCertification',
          payload: {
            name: element?.name || '',
            urlFile: element?.urlFile,
            employee,
            company,
            tenantId,
          },
        });
      }
    });
  };

  handleSave = async () => {
    const { dispatch, generalData, listSkill = [] } = this.props;
    const { skills } = generalData;
    const newSkills = skills.filter((e) => e !== 'Other');
    const payload = this.processDataChanges(newSkills) || {};
    const dataTempKept = this.processDataKept() || {};
    const { certification } = payload;
    await this.handleUpdateCertification(certification);
    const checkDuplication =
      payload.otherSkills.length > 0
        ? listSkill.filter((e) => e.name.toUpperCase() === payload.otherSkills[0].toUpperCase()) ||
          []
        : [];
    if (checkDuplication.length > 0) {
      notification.error({
        message: 'This skill is available on the skill list above, please select it on skills.',
      });
      return;
    }
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
      // listTitle = [],
      profileOwner = false,
    } = this.props;
    const { notValid } = this.state;
    const {
      preJobTitle = '',
      skills = [],
      preCompany = '',
      linkedIn = '',
      totalExp = 0,
      qualification = '',
      otherSkills = [],
    } = generalData;

    let { certification = [{}] } = generalData;
    certification = certification?.length > 0 ? certification : [{}];
    const getIdSkill = skills.map((item) => item._id);
    const newOtherSkills = otherSkills.length > 0 ? otherSkills : [];
    const veriOther = skills.filter((item) => item === 'Other');
    return (
      <div className={s.root}>
        <Form
          name="basic"
          initialValues={{
            preJobTitle,
            preCompany,
            linkedIn,
            totalExp,
            qualification,
            skills: getIdSkill,
            otherSkills: newOtherSkills,
            certification,
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...formItemLayout}
          onFinish={this.handleSave}
          requiredMark={false}
          className={s.form}
          labelAlign="left"
          colon={false}
          onValuesChange={this.handleFormChange}
        >
          <div className={s.formContainer}>
            <Form.Item label="Previous Job Tilte" name="preJobTitle">
              <Input disabled={!profileOwner} placeholder="Type the previous job title" />
            </Form.Item>
            <Form.Item label="Previous Company" name="preCompany">
              <Input disabled={!profileOwner} placeholder="Type the previous company" />
            </Form.Item>
            <Form.Item label="Total Experience" name="totalExp">
              <Input disabled={!profileOwner} placeholder="Type the total experience" />
            </Form.Item>
            <Form.Item label="Highest Qualification" name="qualification">
              <Input disabled={!profileOwner} placeholder="Type the highest qualification" />
            </Form.Item>
            <Form.Item label="Linkedin" name="linkedIn">
              <Input className={s.linkedIn} placeholder="Type the linkedin url" />
            </Form.Item>
            <Form.Item name="certification" className={s.certificationContainer}>
              <FormCertification
                notValid={notValid}
                handleRemoveCertification={this.handleRemoveCertification}
              />
            </Form.Item>
            <Form.Item label="Skills" name="skills">
              <Select
                placeholder="Select skills"
                mode="multiple"
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {listSkill.map((item) => (
                  <Option key={item._id}>{item.name}</Option>
                ))}
                <Option key="Other">Other</Option>
              </Select>
            </Form.Item>
            {veriOther.length > 0 || otherSkills.length > 0 ? (
              <Form.Item label="OtherSkill" name="otherSkills">
                <Input maxLength={50} />
              </Form.Item>
            ) : (
              ''
            )}
          </div>
          <div className={s.viewFooter}>
            <div className={s.viewFooter__cancel} onClick={handleCancel}>
              Cancel
            </div>
            <Button
              className={s.viewFooter__submit}
              type="primary"
              htmlType="submit"
              loading={loading}
              // disabled={notValid}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Edit;
