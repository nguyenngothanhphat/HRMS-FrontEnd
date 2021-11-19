import React, { useState, useEffect } from 'react';
import { Modal, Button, Steps, Form, Input, Select, Tag } from 'antd';
import { DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons';
import plusIcon from '@/assets/add-adminstrator.svg';
import { connect, formatMessage } from 'umi';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';
// import UploadCertification from './components/Upload/index';
import { getCurrentTenant } from '../../../../utils/authority';
import UploadCertification from './components/UploadCertification/index';

const { Step } = Steps;

const ModalAddInfo = (props) => {
  const {
    onCancel = () => { },
    visible,
    dispatch,
    listRelation,
    listSkill,
    generalId,
    loading,
    idCurrentEmployee,
    location
  } = props;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    dispatch({
      type: 'employeeProfile/fetchListRelation',
      payload: {},
    });
    // dispatch({
    //   type: 'employeeProfile/fetchListSkill',
    //   payload: {},
    // });
  }, []);
  const [resultForm, setResultForm] = useState({});

  // contact detail
  const [arrContactDetail, setArrContactDetail] = useState([]);
  const [numOfContact, setNumOfContact] = useState(0);
  const onFinishContact = (values) => {
    const { emergencyContact = [], emergencyPersonName = [], emergencyRelation } = values;
    const arr = [];
    arrContactDetail.forEach((key) => {
      arr.push({
        emergencyContact: emergencyContact[`contact${key}`],
        emergencyPersonName: emergencyPersonName[`personName${key}`],
        emergencyRelation: emergencyRelation[`relation${key}`],
      });
    });
    setResultForm({ emergencyContactDetails: arr });
    setCurrentStep(currentStep + 1);
  };

  const addContact = (key) => {
    const tempArr = arrContactDetail || [];
    tempArr.push(key);
    setArrContactDetail(tempArr);
    setNumOfContact(numOfContact + 1);
  };
  const removeContact = (key) => {
    const tempArr = [...arrContactDetail];
    tempArr.splice(key, 1);
    setArrContactDetail(tempArr);
  };

  // Certifications
  const [arrCertification, setArrCertification] = useState([]);
  const [numOfCertification, setNumOfCertification] = useState(0);
  const [newSkill, setNewSkill] = useState(false);
  const tagRender = (prop) => {
    const { label, onClose } = prop;
    return (
      <Tag
        icon={<CloseCircleOutlined className={styles.iconClose} onClick={onClose} />}
        color="#EAECEF"
      >
        {label}
      </Tag>
    );
  };
  const [objUrl, setObjURL] = useState({});
  const uploadFile = (item, url) => {
    const obj = { ...objUrl };
    obj[`url${item}`] = url;
    setObjURL(obj);
  };

  const onFinishCertification = (values) => {
    const { certificationName, otherSkills, qualification, skills, totalExp } = values;
    const certifications = [];
    arrCertification.forEach((item) => {
      certifications.push({
        name: certificationName[`certification${item}`] || 'certification',
        urlFile: objUrl[`url${item}`],
        employee: idCurrentEmployee,
        company: getCurrentCompany(),
      });
    });
    const tempSkill = skills.filter((item) => item !== 'Other');
    const obj = {
      ...resultForm,
      certifications,
      otherSkills,
      qualification,
      skills: tempSkill,
      totalExp,
    };
    setResultForm(obj);
    setCurrentStep(currentStep + 1);
  };

  const addCertification = (key) => {
    const tempArr = arrCertification || [];
    tempArr.push(key);
    setArrCertification(tempArr);
    setNumOfCertification(numOfCertification + 1);
  };
  const removeCertification = (key) => {
    const tempArr = [...arrCertification];
    tempArr.splice(key, 1);
    setArrCertification(tempArr);
  };
  const changeSkill = (arr) => {
    if (arr.includes('Other')) {
      setNewSkill(true);
    } else setNewSkill(false);
  };
  // bank account
  const [arrBankAccount, setArrBankAccount] = useState([]);
  const [numOfBank, setNumOfBank] = useState(0);

  const onFinishBank = (values) => {
    const {
      // accountName,
      accountNumber,
      accountType,
      bankName,
      branchName,
      micrCode,
      ifscCode,
      uanNumber,
      // swiftcode,
    } = values;
    const arr = [];
    arrBankAccount.forEach((item) =>
      arr.push({
        // accountName: accountName[`accountName${item}`],
        accountNumber: accountNumber[`accountNumber${item}`],
        accountType: accountType[`accountType${item}`],
        bankName: bankName[`bankName${item}`],
        branchName: branchName[`branchName${item}`],
        micrCode: micrCode[`micrCode${item}`],
        ifscCode: ifscCode[`ifscCode${item}`],
        uanNumber: uanNumber[`uanNumber${item}`],
        // swiftcode: swiftcode[`swiftcode${item}`],
        employee: idCurrentEmployee,
      }),
    );
    const obj = { ...resultForm, bankDetails: arr };
    setResultForm(obj);
    setCurrentStep(currentStep + 1);
  };
  const onFinishBankVN = (values) => {
    const {
      accountName,
      accountNumber,
      accountType,
      bankName,
      branchName,
      swiftcode,
    } = values;
    const arr = [];
    arrBankAccount.forEach((item) =>
      arr.push({
        accountName: accountName[`accountName${item}`],
        accountNumber: accountNumber[`accountNumber${item}`],
        accountType: accountType[`accountType${item}`],
        bankName: bankName[`bankName${item}`],
        branchName: branchName[`branchName${item}`],
        swiftcode: swiftcode[`swiftcode${item}`],
        employee: idCurrentEmployee,
      }),
    );
    const obj = { ...resultForm, bankDetails: arr };
    setResultForm(obj);
    setCurrentStep(currentStep + 1);
  };

  const addBank = (key) => {
    if (arrBankAccount.length < 4) {
      const tempArr = arrBankAccount || [];
      tempArr.push(key);
      setArrBankAccount(tempArr);
      setNumOfBank(numOfBank + 1);
    }
  };
  const removeBank = (key) => {
    const tempArr = [...arrBankAccount];
    tempArr.splice(key, 1);
    setArrBankAccount(tempArr);
  };
  // tax detail
  const onFinishTaxIN = (values) => {
    const { maritalStatus, noOfDependents } = values;
    const taxDetails = { ...values, panNum: noOfDependents, employee: idCurrentEmployee };
    const obj = { ...resultForm, taxDetails, maritalStatus };
    dispatch({
      type: 'employeeProfile/updateFirstGeneralInfo',
      payload: {
        tenantId: getCurrentTenant(),
        id: generalId,
        isUpdatedProfile: true,
        isNewComer: false,
        ...obj,
      },
    });
  };
  const onFinishTax = (values) => {
    const { maritalStatus, noOfDependents } = values;
    const incomeTaxRule = ""
    const taxDetails = { ...values, panNum: noOfDependents, employee: idCurrentEmployee, incomeTaxRule };
    const obj = { ...resultForm, taxDetails, maritalStatus };
    dispatch({
      type: 'employeeProfile/updateFirstGeneralInfo',
      payload: {
        tenantId: getCurrentTenant(),
        id: generalId,
        isUpdatedProfile: true,
        isNewComer: false,
        ...obj,
      },
    });
  };


  const renderContent = () => {
    switch (currentStep) {
      case 0:
        if (arrContactDetail.length === 0) {
          addContact(numOfContact);
        }
        return (
          <Form
            name="ContactDetails"
            onFinish={onFinishContact}
            autoComplete="off"
            layout="vertical"
          >
            <div className={styles.form__title}>Emergency Contact Details</div>
            <div className={styles.form__description}>
              You are required to fill in certain deatils to proceed further
            </div>
            <div className={styles.form__block}>
              {arrContactDetail.length > 0 &&
                arrContactDetail.map((item, index) => (
                  <div key={item} className={styles.containBlock}>
                    {arrContactDetail.length > 1 && (
                      <div className={styles.deleteBlock}>
                        <Button
                          type="link"
                          className={styles.btnRemove}
                          onClick={() => removeContact(index)}
                        >
                          <DeleteOutlined className={styles.action__icon} />
                          <span>Delete</span>
                        </Button>
                      </div>
                    )}
                    <Form.Item
                      name={['emergencyContact', `contact${item}`]}
                      label="Emergency Contact"
                      rules={[
                        {
                          pattern: /^[+]*[\d]{0,10}$/,
                          message: formatMessage({
                            id: 'pages.employeeProfile.validateWorkNumber',
                          }),
                        },
                      ]}
                    >
                      <Input placeholder="Emergency Contact" />
                    </Form.Item>
                    <Form.Item
                      label="Person’s Name"
                      name={['emergencyPersonName', `personName${item}`]}
                      rules={[
                        {
                          pattern: /^[a-zA-Z ]*$/,
                          message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
                        },
                      ]}
                    >
                      <Input placeholder="Person’s Name" />
                    </Form.Item>
                    <Form.Item
                      label="Relation"
                      name={['emergencyRelation', `relation${item}`]}
                      rules={[
                        {
                          pattern: /^[a-zA-Z ]*$/,
                          message: formatMessage({ id: 'pages.employeeProfile.validateName' }),
                        },
                      ]}
                    >
                      <Select
                        size={14}
                        placeholder="Please select a choice"
                        showArrow
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        className={styles.inputForm}
                      >
                        {listRelation.map((value, i) => {
                          return (
                            <Select.Option key={`${i + 1}`} value={value}>
                              {value}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                ))}
            </div>
            <Form.Item>
              <Button
                type="link"
                className={styles.btnAdd}
                onClick={() => addContact(numOfContact)}
              >
                <img src={plusIcon} alt="plusIcon" />
                <span className={styles.text}>Add another</span>
              </Button>
            </Form.Item>
          </Form>
        );
      case 1:
        if (arrCertification.length === 0) {
          addCertification(numOfCertification);
        }
        return (
          <Form name="Certification" onFinish={onFinishCertification} layout="vertical">
            <div className={styles.form__title}>Professional & Academic Background</div>
            <div className={styles.form__description}>
              You are required to fill in certain deatils to proceed further
            </div>
            <Form.Item
              label="Relevant Years of Experience"
              name="totalExp"
              style={{ marginTop: '24px' }}
            >
              <Input placeholder="Relevant Years of Experience" />
            </Form.Item>
            <Form.Item label="Highest Educational Qualification" name="qualification">
              <Input placeholder="Highest Educational Qualification" />
            </Form.Item>
            <div className={styles.form__block}>
              {arrCertification.length > 0 &&
                arrCertification.map((item, index) => (
                  <div key={item} className={styles.containBlock}>
                    {arrCertification.length > 1 && (
                      <div className={styles.deleteBlock}>
                        <Button
                          type="link"
                          className={styles.btnRemove}
                          onClick={() => removeCertification(index)}
                        >
                          <DeleteOutlined className={styles.action__icon} />
                          <span>Delete</span>
                        </Button>
                      </div>
                    )}
                    <Form.Item
                      name={['certificationName', `certification${item}`]}
                      label="Certifications"
                    >
                      <Input placeholder="Certifications" />
                    </Form.Item>
                    <Form.Item name={['certificationURL', `Url${item}`]}>
                      <UploadCertification
                        handleFieldChange={uploadFile}
                        url={objUrl[`url${item}`]}
                        item={item}
                      />
                    </Form.Item>
                  </div>
                ))}
            </div>
            <Form.Item>
              <Button
                type="link"
                className={styles.btnAdd}
                onClick={() => addCertification(numOfCertification)}
              >
                <img src={plusIcon} alt="plusIcon" />
                <span className={styles.text}>Add another</span>
              </Button>
            </Form.Item>
            <Form.Item label="Skills" name="skills">
              <Select
                placeholder="Select skill"
                mode="multiple"
                tagRender={tagRender}
                showArrow
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={changeSkill}
              >
                {listSkill.map((item) => (
                  <Select.Option key={item._id}>{item.name}</Select.Option>
                ))}
                <Select.Option key="Other">Other</Select.Option>
              </Select>
            </Form.Item>
            {newSkill && (
              <Form.Item label="Other Skill" name="otherSkills">
                <Input />
              </Form.Item>
            )}
          </Form>
        );
      case 2:
        if (arrBankAccount.length === 0) {
          addBank(numOfBank);
        }
        if (location.headQuarterAddress.country === "VN") {
          return (
            <Form name="BankAccount" onFinish={onFinishBankVN} autoComplete="off" layout="vertical">
              <div className={styles.form__title}>Bank Details</div>
              <div className={styles.form__description}>
                You are required to fill in certain deatils to proceed further
              </div>
              <div className={styles.form__block}>
                {arrBankAccount.length > 0 &&
                  arrBankAccount.map(
                    (item, index) =>
                      index < 4 && (
                        <div key={item} className={styles.containBlock}>
                          {arrBankAccount.length > 1 && (
                            <div className={styles.deleteBlock}>
                              <Button
                                type="link"
                                className={styles.btnRemove}
                                onClick={() => removeBank(index)}
                              >
                                <DeleteOutlined className={styles.action__icon} />
                                <span>Delete</span>
                              </Button>
                            </div>
                          )}
                          <Form.Item name={['bankName', `bankName${item}`]} label="Bank Name">
                            <Input placeholder="Bank Name" />
                          </Form.Item>
                          <Form.Item label="Branch Name" name={['branchName', `branchName${item}`]}>
                            <Input placeholder="Branch Name" />
                          </Form.Item>
                          <Form.Item
                            label="Account Type"
                            name={['accountType', `accountType${item}`]}
                          >
                            <Select
                              placeholder="Please select a choice"
                              showArrow
                              className={styles.inputForm}
                            >
                              <Select.Option value="Salary Account">Salary Account</Select.Option>
                              <Select.Option value="Personal Account">Personal Account</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="Account Number"
                            name={['accountNumber', `accountNumber${item}`]}
                            rules={[
                              {
                                pattern: /^[\d]{0,10}$/,
                                message: 'Input only number',
                              },
                            ]}
                          >
                            <Input placeholder="Account Number" />
                          </Form.Item>
                          <Form.Item label="Swift Code" name={['swiftcode', `swiftcode${item}`]}>
                            <Input placeholder="Swift Code" />
                          </Form.Item>
                          <Form.Item
                            label="Account Name"
                            name={['accountName', `accountName${item}`]}
                          >
                            <Input placeholder="Account Name" />
                          </Form.Item>
                        </div>
                      ),
                  )}
              </div>
              <Form.Item>
                <Button type="link" className={styles.btnAdd} onClick={() => addBank(numOfBank)}>
                  <img src={plusIcon} alt="plusIcon" />
                  <span className={styles.text}>
                    Add another <span>(You can add upto 4 accounts)</span>
                  </span>
                </Button>
              </Form.Item>
            </Form>
          )
        }
        else {
          return (
            <Form name="BankAccount" onFinish={onFinishBank} autoComplete="off" layout="vertical">
              <div className={styles.form__title}>Bank Details</div>
              <div className={styles.form__description}>
                You are required to fill in certain deatils to proceed further
              </div>
              <div className={styles.form__block}>
                {arrBankAccount.length > 0 &&
                  arrBankAccount.map(
                    (item, index) =>
                      index < 4 && (
                        <div key={item} className={styles.containBlock}>
                          {arrBankAccount.length > 1 && (
                            <div className={styles.deleteBlock}>
                              <Button
                                type="link"
                                className={styles.btnRemove}
                                onClick={() => removeBank(index)}
                              >
                                <DeleteOutlined className={styles.action__icon} />
                                <span>Delete</span>
                              </Button>
                            </div>
                          )}
                          <Form.Item name={['bankName', `bankName${item}`]} label="Bank Name">
                            <Input placeholder="Bank Name" />
                          </Form.Item>
                          <Form.Item label="Branch Name" name={['branchName', `branchName${item}`]}>
                            <Input placeholder="Branch Name" />
                          </Form.Item>
                          <Form.Item
                            label="Account Type"
                            name={['accountType', `accountType${item}`]}
                          >
                            <Select
                              placeholder="Please select a choice"
                              showArrow
                              className={styles.inputForm}
                            >
                              <Select.Option value="Salary Account">Salary Account</Select.Option>
                              <Select.Option value="Personal Account">Personal Account</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="Account Number"
                            name={['accountNumber', `accountNumber${item}`]}
                            rules={[
                              {
                                pattern: /^[\d]{0,10}$/,
                                message: 'Input only number',
                              },
                            ]}
                          >
                            <Input placeholder="Account Number" />
                          </Form.Item>
                          <Form.Item label="MICR Code" name={['micrCode', `micrCode${item}`]}>
                            <Input placeholder="MICR Code" />
                          </Form.Item>
                          <Form.Item label="IFSC Code" name={['ifscCode', `ifscCode${item}`]}>
                            <Input placeholder="IFSC Code" />
                          </Form.Item>
                          <Form.Item
                            label="UAN Number"
                            name={['uanNumber', `uanNumber${item}`]}
                            rules={[
                              {
                                pattern: /^[\d]{0,10}$/,
                                message: 'Input only number',
                              },
                            ]}
                          >
                            <Input placeholder="UAN Number" />
                          </Form.Item>
                        </div>
                      ),
                  )}
              </div>
              <Form.Item>
                <Button type="link" className={styles.btnAdd} onClick={() => addBank(numOfBank)}>
                  <img src={plusIcon} alt="plusIcon" />
                  <span className={styles.text}>
                    Add another <span>(You can add upto 4 accounts)</span>
                  </span>
                </Button>
              </Form.Item>
            </Form>
          )
        };
      case 3:
        if (location.headQuarterAddress.country === "VN") {
          return (
            <Form name="TaxDetail" onFinish={onFinishTax} autoComplete="off" layout="vertical">
              <div className={styles.form__title}>Tax Details</div>
              <div className={styles.form__description}>
                You are required to fill in certain deatils to proceed further
              </div>
              <Form.Item label="National ID Card Number" name="nationalId" style={{ marginTop: '24px' }}>
                <Input maxLength={50} placeholder="National ID Card Number" />
              </Form.Item>
              <Form.Item label="Marital Status" name="maritalStatus">
                <Select placeholder="Marital Status" showArrow>
                  <Select.Option value="Single">Single</Select.Option>
                  <Select.Option value="Married">Married</Select.Option>
                  <Select.Option value="Rather not mention">Rather not mention</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="No. of Dependents" name="noOfDependents">
                <Input maxLength={50} placeholder="No. of Dependents" />
              </Form.Item>
              <Form.Item label="Residency Status" name="residencyStatus">
                <Select placeholder="Residency Status" showArrow>
                  <Select.Option value="Resident">Resident</Select.Option>
                  <Select.Option value="Non Resident">Non Resident</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          )
        }
        else if (location.headQuarterAddress.country === "IN") {
          return (
            <Form name="TaxDetail" onFinish={onFinishTaxIN} autoComplete="off" layout="vertical">
              <div className={styles.form__title}>Tax Details</div>
              <div className={styles.form__description}>
                You are required to fill in certain deatils to proceed further
              </div>
              <Form.Item label="Income Tax Rule" name="incomeTaxRule" style={{ marginTop: '24px' }}>
                <Select placeholder="Income Tax Rule" showArrow>
                  <Select.Option value="Old Tax Regime">Old Tax Regime</Select.Option>
                  <Select.Option value="New Tax Regime">New Tax Regime</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="PAN Number" name="panNum">
                <Input maxLength={50} placeholder="PAN Number" />
              </Form.Item>
              <Form.Item label="Marital Status" name="maritalStatus">
                <Select placeholder="Marital Status" showArrow>
                  <Select.Option value="Single">Single</Select.Option>
                  <Select.Option value="Married">Married</Select.Option>
                  <Select.Option value="Rather not mention">Rather not mention</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="No. of Dependents" name="noOfDependents">
                <Input maxLength={50} placeholder="No. of Dependents" />
              </Form.Item>
              <Form.Item label="Residency Status" name="residencyStatus">
                <Select placeholder="Residency Status" showArrow>
                  <Select.Option value="Resident">Resident</Select.Option>
                  <Select.Option value="Non Resident">Non Resident</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          )
        }
        else {
          return (
            <Form name="TaxDetail" onFinish={onFinishTax} autoComplete="off" layout="vertical">
              <div className={styles.form__title}>Tax Details</div>
              <div className={styles.form__description}>
                You are required to fill in certain deatils to proceed further
              </div>
              <Form.Item label="Social Security Card Number" name="cardNumber" style={{ marginTop: '24px' }}>
                <Input maxLength={50} placeholder="Social Security Card Number" />
              </Form.Item>
              <Form.Item label="Marital Status" name="maritalStatus">
                <Select placeholder="Marital Status" showArrow>
                  <Select.Option value="Single">Single</Select.Option>
                  <Select.Option value="Married">Married</Select.Option>
                  <Select.Option value="Rather not mention">Rather not mention</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="No. of Dependents" name="noOfDependents">
                <Input maxLength={50} placeholder="No. of Dependents" />
              </Form.Item>
              <Form.Item label="Residency Status" name="residencyStatus">
                <Select placeholder="Residency Status" showArrow>
                  <Select.Option value="Resident">Resident</Select.Option>
                  <Select.Option value="Non Resident">Non Resident</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          )
        }
      default:
        return '';
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case 0:
        return [
          <Button
            className={styles.btnSubmit}
            type="primary"
            key="submit"
            htmlType="submit"
            form="ContactDetails"
          >
            Continue
          </Button>,
        ];
      case 1:
        return [
          <Button
            type="link"
            onClick={() => setCurrentStep(currentStep - 1)}
            className={styles.btnCancel}
          >
            Previous
          </Button>,
          <Button
            className={styles.btnSubmit}
            type="primary"
            key="submit"
            htmlType="submit"
            form="Certification"
          >
            Continue
          </Button>,
        ];
      case 2:
        return [
          <Button
            type="link"
            onClick={() => setCurrentStep(currentStep - 1)}
            className={styles.btnCancel}
          >
            Previous
          </Button>,
          <Button
            className={styles.btnSubmit}
            type="primary"
            key="submit"
            htmlType="submit"
            form="BankAccount"
          >
            Continue
          </Button>,
        ];
      case 3:
        return [
          <Button
            type="link"
            onClick={() => setCurrentStep(currentStep - 1)}
            className={styles.btnCancel}
          >
            Previous
          </Button>,
          <Button
            className={styles.btnSubmit}
            type="primary"
            key="submit"
            htmlType="submit"
            form="TaxDetail"
            loading={loading}
          >
            Submit
          </Button>,
        ];

      default:
        return [];
    }
  };
  return (
    <Modal
      className={styles.modalCustom}
      onCancel={() => onCancel()}
      destroyOnClose
      maskClosable={false}
      closable={false}
      footer={renderFooter()}
      title="Employee Details"
      style={{ top: 40 }}
      visible={visible}
    >
      <div className={styles.main}>
        <div className={styles.mainTop}>
          <Steps
            current={currentStep}
            onChange={(current) => setCurrentStep(current)}
            className={styles.step}
          >
            <Step />
            <Step />
            <Step />
            <Step />
          </Steps>
        </div>
        <div className={styles.mainContent}>{renderContent()}</div>
      </div>
    </Modal>
  );
};

export default connect(
  ({
    loading,
    employeeProfile: {
      originData: { generalData: { _id: generalId = '' } = {}, employmentData: { location = {} } = {} } = {},
      tempData: { generalData = {} } = {},
      listRelation = [],
      listSkill = [],
      idCurrentEmployee,
      tenantCurrentEmployee = '',
    } = {},
  }) => ({
    loading: loading.effects['employeeProfile/updateFirstGeneralInfo'],
    location,
    generalId,
    generalData,
    listSkill,
    listRelation,
    idCurrentEmployee,
    tenantCurrentEmployee,
  }),
)(ModalAddInfo);
