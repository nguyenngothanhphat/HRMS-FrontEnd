/* eslint-disable react/jsx-curly-newline */
import { Form, Input } from 'antd';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { connect } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import FormCertification from './components/FormCertification';
import s from './index.less';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const Edit = (props) => {
  const {
    dispatch,
    handleCancel = () => {},
    loading,
    isProfileOwner = false,
    employeeProfile: {
      employee = '',
      listSkill = [],
      employmentData: { generalInfo = {} } = {},
    } = {},
  } = props;

  const [notValid, setNotValid] = useState(false);
  const [newSkills, setNewSkills] = useState([]);

  const {
    preJobTitle = '',
    skills = [],
    preCompany = '',
    linkedIn = '',
    totalExp = 0,
    qualification = '',
  } = generalInfo;

  let { certification = [{}] } = generalInfo;
  certification = certification?.length > 0 ? certification : [{}];

  const getIdSkill = skills.map((item) => {
    return {
      label: item.name,
      value: item._id,
    };
  });

  const checkCertification = (listCertification) => {
    const listNoName = listCertification.filter((item) => !item.name);
    setNotValid(listNoName.length > 0);
  };

  const handleFormChange = (changedValues) => {
    if (changedValues.certification) {
      checkCertification(changedValues.certification);
    }
  };

  const handleRemoveCertification = ({ _id: id }) => {
    dispatch({
      type: 'employeeProfile/removeCertification',
      payload: {
        id,
      },
    });
  };

  const handleUpdateCertification = (list) => {
    list.forEach((element) => {
      if (element._id && element.name) {
        dispatch({
          type: 'employeeProfile/updateCertification',
          payload: {
            name: element?.name,
            id: element?._id,
            urlFile: element?.urlFile,
          },
        });
      } else if (element.name || element.urlFile) {
        dispatch({
          type: 'employeeProfile/addCertification',
          payload: {
            name: element?.name || '',
            urlFile: element?.urlFile,
            employee,
            company: getCurrentCompany(),
          },
        });
      } else if (element._id) {
        dispatch({
          type: 'employeeProfile/removeCertification',
          payload: {
            id: element?._id,
          },
        });
      }
    });
  };

  const handleChangeSkill = (value) => {
    if (value.length > 0) {
      value.forEach(async (item) => {
        if (item.__isNew__ === true) {
          await dispatch({
            type: 'employeeProfile/addNewSkill',
            payload: {
              name: item.label,
            },
          }).then((res) => {
            if (res.statusCode === 200) {
              setNewSkills([...newSkills, res.data?._id]);
            }
          });
        }
      });
    }
  };

  const onFinish = async (values) => {
    const payload = {
      _id: employee,
      generalInfo: {
        preJobTitle: values.preJobTitle,
        skills: [...values.skills.map((x) => x.value), ...newSkills],
        preCompany: values.preCompany,
        linkedIn: values.linkedIn,
        totalExp: values.totalExp,
        qualification: values.qualification,
        certification: values.certification,
      },
    };
    await handleUpdateCertification(payload.generalInfo?.certification);
    const res = await dispatch({
      type: 'employeeProfile/updateGeneralInfo',
      payload,
    });
    if (res.statusCode === 200) {
      handleCancel();
    }
  };

  return (
    <div className={s.root}>
      <Form
        name="backgroundForm"
        initialValues={{
          preJobTitle,
          preCompany,
          linkedIn,
          totalExp,
          qualification,
          skills: getIdSkill,
          certification,
        }}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...formItemLayout}
        onFinish={onFinish}
        requiredMark={false}
        className={s.form}
        labelAlign="left"
        colon={false}
        onValuesChange={handleFormChange}
      >
        <div className={s.formContainer}>
          <Form.Item label="Previous Job Title" name="preJobTitle">
            <Input disabled={!isProfileOwner} placeholder="Type the previous job title" />
          </Form.Item>
          <Form.Item label="Previous Company" name="preCompany">
            <Input disabled={!isProfileOwner} placeholder="Type the previous company" />
          </Form.Item>
          <Form.Item label="Total Experience" name="totalExp">
            <Input disabled={!isProfileOwner} placeholder="Type the total experience" />
          </Form.Item>
          <Form.Item label="Highest Qualification" name="qualification">
            <Input disabled={!isProfileOwner} placeholder="Type the highest qualification" />
          </Form.Item>
          <Form.Item label="LinkedIn" name="linkedIn">
            <Input className={s.linkedIn} placeholder="Type the linkedin url" />
          </Form.Item>
          <Form.Item name="certification" className={s.certificationContainer}>
            <FormCertification
              notValid={notValid}
              handleRemoveCertification={handleRemoveCertification}
            />
          </Form.Item>
          <Form.Item label="Skills" name="skills">
            <CreatableSelect
              isMulti
              onChange={(value) => handleChangeSkill(value)}
              options={listSkill
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => {
                  return {
                    label: item.name,
                    value: item._id,
                  };
                })}
            />
          </Form.Item>
        </div>
        <div className={s.viewFooter}>
          <CustomSecondaryButton onClick={handleCancel}>Cancel</CustomSecondaryButton>
          <CustomPrimaryButton
            type="primary"
            htmlType="submit"
            loading={loading}
            form="backgroundForm"
          >
            Save
          </CustomPrimaryButton>
        </div>
      </Form>
    </div>
  );
};

export default connect(
  ({
    loading,
    employeeProfile = {},
    user: { currentUser: { employee: { _id: myEmployeeID = '' } = {} } = {} } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateGeneralInfo'],
    employeeProfile,
    myEmployeeID,
  }),
)(Edit);
