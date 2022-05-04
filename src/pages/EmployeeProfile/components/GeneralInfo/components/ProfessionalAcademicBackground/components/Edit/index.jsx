/* eslint-disable react/jsx-curly-newline */
import React, { PureComponent } from 'react';
import { Button, Form, Input } from 'antd';
import CreatableSelect from 'react-select/creatable';
import { connect } from 'umi';
import FormCertification from './components/FormCertification';
import s from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

// const { Option } = Select;

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
    user: { currentUser: { employee: { _id: myEmployeeID = '' } = {} } = {} } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    loadingAddNewSkill: loading.effects['employeeProfile/addNewSkill'],
    generalDataOrigin,
    generalData,
    myEmployeeID,
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
      newSkillList: [],
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
    const { newSkillList } = this.state;
    const listSkill = [];
    newSkills.forEach((item) => {
      if (!item.__isNew__) {
        listSkill.push(item.value ? item.value : item._id);
      }
    });
    const {
      preJobTitle = '',
      // skills = [],
      preCompany = '',
      linkedIn = '',
      totalExp = 0,
      qualification = '',
      certification = [],
      // otherSkills = '',
      _id: id = '',
    } = generalDataTemp;
    const payloadChanges = {
      id,
      preJobTitle,
      skills: newSkillList.length > 0 ? listSkill.concat(newSkillList) : listSkill,
      preCompany,
      linkedIn,
      totalExp,
      qualification,
      certification,
      // otherSkills: otherSkills instanceof Array ? otherSkills : [otherSkills],
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
      // 'otherSkills',
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

  handleChangeSkill = (value) => {
    const { dispatch } = this.props;
    const { newSkillList } = this.state;
    if (value.length > 0) {
      value.forEach(async (item) => {
        if (item.__isNew__ === true) {
          await dispatch({
            type: 'employeeProfile/addNewSkill',
            payload: {
              name: item.label,
            },
          }).then((response) => {
            if (response.data._id) {
              this.setState({ newSkillList: [...newSkillList, response.data._id] });
            }
          });
        }
      });
    }
  };

  handleSave = async () => {
    const {
      dispatch,
      generalData,
      // listSkill = [],
      generalData: { employee = '' } = {},
      myEmployeeID = '',
    } = this.props;
    const check = employee === myEmployeeID;
    const { skills } = generalData;
    const newSkills = skills.filter((e) => e !== 'Other');
    const payload = this.processDataChanges(newSkills) || {};
    const dataTempKept = this.processDataKept() || {};
    const { certification } = payload;
    await this.handleUpdateCertification(certification);
    await dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
      dataTempKept,
      key: 'openAcademic',
      isLinkedIn: check,
    });
    // const listOtherSkill = payload.otherSkills.length > 0 ? payload.otherSkills[0] : '';
    // const checkDuplication = listSkill.filter((e) => e.name.toUpperCase().replace(' ','') === listOtherSkill.toUpperCase().replace(' ', '')) || [];
    // if(checkDuplication.length > 0) {
    //   notification.error({
    //     message: 'This skill is available on the skill list above, please select it on skills.',
    //   });
    //   return;
    // }
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
      // otherSkills = [],
    } = generalData;
    let { certification = [{}] } = generalData;
    certification = certification?.length > 0 ? certification : [{}];
    // const getIdSkill = skills.map((item) => item._id);
    const getIdSkill = skills.map((item) => {
      return {
        label: item.name,
        value: item._id,
      };
    });
    // const newOtherSkills = otherSkills.length > 0 ? otherSkills : [];
    // const verifySkillOther = skills.filter((item) => item === 'Other');
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
            // otherSkills: newOtherSkills,
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
              <CreatableSelect
                isMulti
                onChange={(value) => this.handleChangeSkill(value)}
                options={listSkill
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => {
                    return {
                      label: item.name,
                      value: item._id,
                    };
                  })}
              />
              {/* <Select
                placeholder="Select skills"
                mode="tags"
                showArrow
                // onSelect={this.handleNewSkill}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : null
                }
              >
                {listSkill.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                  <Option key={item._id}>{item.name}</Option>
                ))}
                <Option key="Other">Other</Option>
              </Select> */}
            </Form.Item>
            {/* {verifySkillOther.length > 0 || otherSkills.length > 0 ? (
              <Form.Item label="OtherSkill" name="otherSkills">
                <Input maxLength={50} />
              </Form.Item>
            ) : (
              ''
            )} */}
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
