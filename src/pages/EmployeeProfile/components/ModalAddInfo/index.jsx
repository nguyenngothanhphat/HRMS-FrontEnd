import React, { useState, useEffect } from 'react';
import { Modal, Button, Steps, Form, Input, Select, Tooltip } from 'antd';
import CreatableSelect from 'react-select/creatable';
import { DeleteOutlined } from '@ant-design/icons';
import { connect, formatMessage } from 'umi';
import plusIcon from '@/assets/add-adminstrator.svg';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';
// import UploadCertification from './components/Upload/index';
import { getCurrentTenant } from '../../../../utils/authority';
import UploadCertification from './components/UploadCertification/index';
import CustomPrimaryButton from '@/components/CustomPrimaryButton';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';
// import { removeEmptyFields } from '@/utils/utils';

const { Step } = Steps;

const ModalAddInfo = (props) => {
  const [form] = Form.useForm();
  const {
    onCancel = () => {},
    visible,
    dispatch,
    loading,
    employeeProfile: {
      employmentData: { location = {} } = {},
      tempData: { generalData = {} } = {},
      listRelation = [],
      listSkill = [],
      employee = '',
    } = {},
  } = props;
  const [currentStep, setCurrentStep] = useState(0);
  const [newSkillList, setListNewSkill] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'employeeProfile/fetchListRelation',
      payload: {},
    });
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

  const [objUrl, setObjURL] = useState({});
  const uploadFile = (item, url) => {
    const obj = { ...objUrl };
    obj[`url${item}`] = url;
    setObjURL(obj);
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
          }).then((response) => {
            if (response.data._id) {
              setListNewSkill([...newSkillList, response.data._id]);
            }
          });
        }
      });
    }
  };

  const onFinishCertification = (values) => {
    const { certificationName, qualification, skills } = values;
    let { totalExp } = values;
    if (!totalExp) {
      totalExp = generalData.totalExp || 0;
    }
    const certifications = [];
    arrCertification.forEach((item) => {
      if (
        objUrl[`url${item}`] !== undefined ||
        certificationName[`certification${item}`] !== undefined
      ) {
        certifications.push({
          name: certificationName[`certification${item}`] || 'certification',
          urlFile: objUrl[`url${item}`],
          employee,
          company: getCurrentCompany(),
        });
      }
    });

    const listSkills = [];
    if (Array.isArray(skills)) {
      skills.forEach((item) => {
        if (!item.__isNew__) {
          listSkills.push(item.value);
        }
      });
    }

    const obj = {
      ...resultForm,
      certifications,
      // otherSkills: otherSkills instanceof Array ? otherSkills : [otherSkills],
      qualification,
      skills: newSkillList.length > 0 ? listSkills.concat(newSkillList) : listSkills,
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

  // bank account
  const [arrBankAccount, setArrBankAccount] = useState([]);
  const [numOfBank, setNumOfBank] = useState(0);

  const onFinishBank = (values, country) => {
    const {
      accountName,
      accountNumber,
      accountType,
      bankName,
      branchName,
      micrCode,
      ifscCode,
      uanNumber,
      swiftcode,
      routingNumber,
    } = values;
    const arr = [];
    const getUanNumber = uanNumber ? uanNumber[`uanNumber${0}`] : '';

    switch (country) {
      case 'VN': {
        arrBankAccount.forEach((item) =>
          arr.push({
            accountName: accountName[`accountName${item}`],
            accountNumber: accountNumber[`accountNumber${item}`],
            accountType: accountType[`accountType${item}`],
            bankName: bankName[`bankName${item}`],
            branchName: branchName[`branchName${item}`],
            swiftcode: swiftcode[`swiftcode${item}`],
            employee,
          }),
        );
        break;
      }
      case 'US': {
        arrBankAccount.forEach((item) =>
          arr.push({
            bankName: bankName[`bankName${item}`],
            accountNumber: accountNumber[`accountNumber${item}`],
            routingNumber: routingNumber[`routingNumber${item}`],
            accountType: accountType[`accountType${item}`],

            employee,
          }),
        );
        break;
      }
      default: {
        arrBankAccount.forEach((item) =>
          arr.push({
            // accountName: accountName[`accountName${item}`],
            accountNumber: accountNumber[`accountNumber${item}`],
            accountType: accountType[`accountType${item}`],
            bankName: bankName[`bankName${item}`],
            branchName: branchName[`branchName${item}`],
            micrcCode: micrCode[`micrCode${item}`],
            ifscCode: ifscCode[`ifscCode${item}`],
            uanNumber: uanNumber[`uanNumber${item}`],
            // swiftcode: swiftcode[`swiftcode${item}`],
            employee,
          }),
        );
        break;
      }
    }

    const obj = { ...resultForm, bankDetails: arr };
    if (uanNumber) {
      obj.uanNumber = getUanNumber;
    }

    // temporarily disabled bank fields
    // setResultForm(obj);

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

  const onFinishTax = (values, country) => {
    const { maritalStatus, noOfDependents, nationalId } = values;
    let taxDetails = {};

    let payload = {
      tenantId: getCurrentTenant(),
      _id: employee,
      generalInfo: {
        isUpdatedProfile: true,
        isNewComer: false,
        incomeTaxRule: values.incomeTaxRule || '',
        ...resultForm,
        maritalStatus,
      },
    };

    if (country === 'IN') {
      taxDetails = { ...values, employee };
      payload = { ...payload, taxDetails };
    } else {
      taxDetails = {
        ...values,
        panNum: noOfDependents,
        employee,
      };
      payload = { ...payload, taxDetails, uanNumber: nationalId };
    }

    dispatch({
      type: 'employeeProfile/updateFirstComer',
      payload,
    });
  };

  const renderContent = () => {
    const disabledFields = true;
    const disabledTitle = 'Temporarily Disabled - Please move to the next field.';
    switch (currentStep) {
      case 0:
        if (arrContactDetail.length === 0) {
          addContact(numOfContact);
        }
        return (
          <Form
            form={form}
            name="ContactDetails"
            onFinish={onFinishContact}
            autoComplete="off"
            layout="vertical"
          >
            <div className={styles.form__title}>Emergency Contact Details</div>
            <div className={styles.form__description}>
              You are required to fill in the below details to proceed further
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
                      label="Emergency Contact Name"
                      name={['emergencyPersonName', `personName${item}`]}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter emergency contact name!',
                        },
                        {
                          pattern:
                            /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/,
                          message: 'Invalid format, please try again',
                        },
                      ]}
                    >
                      <Input placeholder="Emergency Contact Name" />
                    </Form.Item>
                    <Form.Item
                      label="Relation"
                      name={['emergencyRelation', `relation${item}`]}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter  relation!',
                        },
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
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                    <Form.Item
                      name={['emergencyContact', `contact${item}`]}
                      label="Emergency Contact's Phone Number"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the emergency contact's phone number!",
                        },
                        {
                          // pattern: /^[+0-9-]{10,15}$/,
                          pattern:
                            // eslint-disable-next-line no-useless-escape
                            /^(?=.{0,25}$)((?:(?:\(?(?:00|\+)([1-4]\d\d|[0-9]\d?)\)?)?[\-\.\ ]?)?((?:\(?\d{1,}\)?[\-\.\ ]?){0,})(?:[\-\.\ ]?(?:#|ext\.?|extension|x)[\-\.\ ]?(\d+))?)$/gm,
                          message: 'Invalid format, please try again',
                        },
                      ]}
                    >
                      <Input placeholder="Emergency Contact's Phone Number" />
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
          <Form
            form={form}
            name="Certification"
            onFinish={onFinishCertification}
            layout="vertical"
            // initialValues={{
            //   totalExp: generalData.totalExp || 0,
            // }}
          >
            <div className={styles.form__title}>Professional & Academic Background</div>
            <div className={styles.form__description}>
              You are required to fill in the below details to proceed further
            </div>
            <Form.Item
              label="Total Years of Experience"
              name="totalExp"
              style={{ marginTop: '24px' }}
              rules={[
                {
                  required: true,
                  message: 'Please enter relevant years of experience!',
                },
                {
                  pattern: /^\d{1,2}$|^\d+\.\d{0,2}$/,
                  message: 'Input only number, greater than or equal to zero and less than 99!',
                },
              ]}
            >
              <Input placeholder="Total Years of Experience" />
            </Form.Item>
            <Form.Item
              label="Highest Educational Qualification"
              name="qualification"
              rules={[
                {
                  required: true,
                  message: 'Please enter your highest educational qualification!',
                },
              ]}
            >
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
                <span className={styles.text}>Add another Certification</span>
              </Button>
            </Form.Item>
            <Form.Item
              label="Skills"
              name="skills"
              rules={[
                {
                  required: true,
                  message: 'Please enter skills',
                },
              ]}
            >
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
              {/* <Select
                placeholder="Select skills"
                mode="tags"
                tagRender={tagRender}
                showArrow
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : null}
                onChange={changeSkill}
              >
                {listSkill.map((item) => (
                  <Select.Option key={item._id}>{item.name}</Select.Option>
                ))}
                <Select.Option key="Other">Other</Select.Option>
              </Select> */}
            </Form.Item>
            {/* {newSkill && (
              <Form.Item
                label="Other Skill"
                name="otherSkills"
                //   rules={[
                //   {
                //     required: true,
                //     message: "Please enter other skill!"
                //   },
                // ]}
              >
                <Input />
              </Form.Item>
            )} */}
          </Form>
        );
      case 2: {
        if (arrBankAccount.length === 0) {
          addBank(numOfBank);
        }
        if (location?.headQuarterAddress?.country?._id === 'VN') {
          return (
            <Form
              form={form}
              name="BankAccount"
              onFinish={(values) => onFinishBank(values, 'VN')}
              autoComplete="off"
              layout="vertical"
            >
              <div className={styles.form__title}>Bank Details</div>
              <div className={styles.form__description}>
                You are required to fill in the below details to proceed further
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
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              name={['bankName', `bankName${item}`]}
                              label="Bank Name"
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the bank name!',
                                },
                              ]}
                            >
                              <Input placeholder="Bank Name" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Branch Name"
                              name={['branchName', `branchName${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the branch name!',
                                },
                              ]}
                            >
                              <Input placeholder="Branch Name" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Account Type"
                              name={['accountType', `accountType${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the account type!',
                                },
                              ]}
                            >
                              <Select
                                placeholder="Please select a choice"
                                showArrow
                                className={styles.inputForm}
                                disabled={disabledFields}
                              >
                                <Select.Option value="Salary Account">Salary Account</Select.Option>
                                <Select.Option value="Personal Account">
                                  Personal Account
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Account Number"
                              name={['accountNumber', `accountNumber${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the account number!',
                                },
                                {
                                  pattern: /^[\d]{0,16}$/,
                                  message: 'Input numbers only and a max of 16 digits',
                                },
                              ]}
                            >
                              <Input placeholder="Account Number" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Swift Code"
                              name={['swiftcode', `swiftcode${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the swift code!',
                                },
                              ]}
                            >
                              <Input placeholder="Swift Code" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Account Name"
                              name={['accountName', `accountName${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the account name!',
                                },
                              ]}
                            >
                              <Input placeholder="Account Name" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                        </div>
                      ),
                  )}
              </div>
              <Form.Item>
                <Button
                  type="link"
                  className={styles.btnAdd}
                  onClick={() => addBank(numOfBank)}
                  disabled={disabledFields}
                >
                  <img src={plusIcon} alt="plusIcon" />
                  <span className={styles.text}>
                    Add another Account <span>(You can add upto 4 accounts)</span>
                  </span>
                </Button>
              </Form.Item>
            </Form>
          );
        }

        if (location?.headQuarterAddress?.country?._id === 'US') {
          return (
            <Form
              form={form}
              name="BankAccount"
              onFinish={(values) => onFinishBank(values, 'US')}
              autoComplete="off"
              layout="vertical"
            >
              <div className={styles.form__title}>Bank Details</div>
              <div className={styles.form__description}>
                You are required to fill in the below details to proceed further
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
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              name={['bankName', `bankName${item}`]}
                              label="Bank Name"
                              rules={[
                                {
                                  // required: true,
                                  required: !disabledFields,
                                  message: 'Please enter the bank name!',
                                },
                              ]}
                            >
                              <Input placeholder="Bank Name" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Account Type"
                              name={['accountType', `accountType${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the account type!',
                                },
                              ]}
                            >
                              <Select
                                placeholder="Please select a choice"
                                showArrow
                                className={styles.inputForm}
                                disabled={disabledFields}
                              >
                                <Select.Option value="Checking Account">
                                  Checking Account
                                </Select.Option>
                                <Select.Option value="Savings Account">
                                  Savings Account
                                </Select.Option>
                              </Select>
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Account Number"
                              name={['accountNumber', `accountNumber${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the account number!',
                                },
                                {
                                  pattern: /^[\d]{0,16}$/,
                                  message: 'Input numbers only and a max of 16 digits',
                                },
                              ]}
                            >
                              <Input placeholder="Account Number" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                          <Tooltip title={disabledTitle}>
                            <Form.Item
                              label="Routing Number"
                              name={['routingNumber', `routingNumber${item}`]}
                              rules={[
                                {
                                  required: !disabledFields,
                                  message: 'Please enter the routing number!',
                                },
                                {
                                  pattern: /^[\d]{0,9}$/,
                                  message: 'Input numbers only and a max of 9 digits',
                                },
                              ]}
                            >
                              <Input placeholder="Routing Number" disabled={disabledFields} />
                            </Form.Item>
                          </Tooltip>
                        </div>
                      ),
                  )}
              </div>
              <Form.Item>
                <Button
                  type="link"
                  className={styles.btnAdd}
                  onClick={() => addBank(numOfBank)}
                  disabled={disabledFields}
                >
                  <img src={plusIcon} alt="plusIcon" />
                  <span className={styles.text}>
                    Add another Account <span>(You can add upto 4 accounts)</span>
                  </span>
                </Button>
              </Form.Item>
            </Form>
          );
        }

        return (
          <Form
            form={form}
            name="BankAccount"
            onFinish={onFinishBank}
            autoComplete="off"
            layout="vertical"
          >
            <div className={styles.form__title}>Bank Details</div>
            <div className={styles.form__description}>
              You are required to fill in the below details to proceed further
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
                        <Tooltip title={disabledTitle}>
                          <Form.Item
                            name={['bankName', `bankName${item}`]}
                            label="Bank Name"
                            rules={[
                              {
                                required: !disabledFields,
                                message: 'Please enter the bank name!',
                              },
                            ]}
                          >
                            <Input placeholder="Bank Name" disabled={disabledFields} />
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={disabledTitle}>
                          <Form.Item
                            label="Branch Name"
                            name={['branchName', `branchName${item}`]}
                            rules={[
                              {
                                required: !disabledFields,
                                message: 'Please enter the branch name!',
                              },
                            ]}
                          >
                            <Input placeholder="Branch Name" disabled={disabledFields} />
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={disabledTitle}>
                          <Form.Item
                            label="Account Type"
                            name={['accountType', `accountType${item}`]}
                            rules={[
                              {
                                required: !disabledFields,
                                message: 'Please enter the account type!',
                              },
                            ]}
                          >
                            <Select
                              placeholder="Please select a choice"
                              showArrow
                              className={styles.inputForm}
                              disabled={disabledFields}
                            >
                              <Select.Option value="Salary Account">Salary Account</Select.Option>
                              <Select.Option value="Personal Account">
                                Personal Account
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={disabledTitle}>
                          <Form.Item
                            label="Account Number"
                            name={['accountNumber', `accountNumber${item}`]}
                            rules={[
                              {
                                required: !disabledFields,
                                message: 'Please enter the account number!',
                              },
                              {
                                pattern: /^[\d]{0,16}$/,
                                message: 'Input numbers only and a max of 16 digits',
                              },
                            ]}
                          >
                            <Input placeholder="Account Number" disabled={disabledFields} />
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={disabledTitle}>
                          <Form.Item
                            label="MICR Code"
                            name={['micrCode', `micrCode${item}`]}
                            rules={[
                              {
                                required: !disabledFields,
                                message: 'Please enter the MICR code!',
                              },
                            ]}
                          >
                            <Input placeholder="MICR Code" disabled={disabledFields} />
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={disabledTitle}>
                          <Form.Item label="IFSC Code" name={['ifscCode', `ifscCode${item}`]}>
                            <Input placeholder="IFSC Code" disabled={disabledFields} />
                          </Form.Item>
                        </Tooltip>
                        <Tooltip title={disabledTitle}>
                          <Form.Item
                            label="UAN Number"
                            name={['uanNumber', `uanNumber${item}`]}
                            rules={[
                              // {
                              //   required: true,
                              //   message: "Please enter UAN number!"
                              // },
                              {
                                pattern: /^[\d]{0,16}$/,
                                message: 'Input numbers only and a max of 16 digits',
                              },
                            ]}
                          >
                            <Input placeholder="UAN Number" disabled={disabledFields} />
                          </Form.Item>
                        </Tooltip>
                      </div>
                    ),
                )}
            </div>
            <Form.Item>
              <Button
                type="link"
                className={styles.btnAdd}
                onClick={() => addBank(numOfBank)}
                disabled={disabledFields}
              >
                <img src={plusIcon} alt="plusIcon" />
                <span className={styles.text}>
                  Add another Account <span>(You can add upto 4 accounts)</span>
                </span>
              </Button>
            </Form.Item>
          </Form>
        );
      }
      case 3: {
        if (location?.headQuarterAddress?.country?._id === 'VN') {
          return (
            <Form
              form={form}
              name="TaxDetail"
              onFinish={onFinishTax}
              autoComplete="off"
              layout="vertical"
            >
              <div className={styles.form__title}>Tax Details</div>
              <div className={styles.form__description}>
                You are required to fill in the below details to proceed further
              </div>
              <Tooltip title={disabledTitle}>
                <Form.Item
                  label="National ID Card Number"
                  name="nationalId"
                  style={{ marginTop: '24px' }}
                  rules={[
                    {
                      required: !disabledFields,
                      message: 'Please enter the National id card number',
                    },
                  ]}
                >
                  <Input
                    maxLength={50}
                    placeholder="National ID Card Number"
                    disabled={disabledFields}
                  />
                </Form.Item>
              </Tooltip>
              <Form.Item
                label="Marital Status"
                name="maritalStatus"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your Marital status!',
                  },
                ]}
              >
                <Select placeholder="Marital Status" showArrow>
                  <Select.Option value="Single">Single</Select.Option>
                  <Select.Option value="Married">Married</Select.Option>
                  <Select.Option value="Widowed">Widowed</Select.Option>
                  <Select.Option value="Divorced">Divorced</Select.Option>
                  <Select.Option value="Rather not mention">Rather not mention</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="No. of Dependents"
                name="noOfDependents"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the no. of dependents!',
                  },
                ]}
              >
                <Input maxLength={50} placeholder="No. of Dependents" />
              </Form.Item>
              <Form.Item
                label="Residency Status"
                name="residencyStatus"
                rules={[
                  {
                    required: true,
                    message: 'Please select your residency status!',
                  },
                ]}
              >
                <Select placeholder="Residency Status" showArrow>
                  <Select.Option value="Resident">Resident</Select.Option>
                  <Select.Option value="Non Resident">Non Resident</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          );
        }
        if (location?.headQuarterAddress?.country?._id === 'IN') {
          return (
            <Form
              form={form}
              name="TaxDetail"
              onFinish={(values) => onFinishTax(values, 'IN')}
              autoComplete="off"
              layout="vertical"
            >
              <div className={styles.form__title}>Tax Details</div>
              <div className={styles.form__description}>
                You are required to fill in the below details to proceed further
              </div>
              <Form.Item
                label="Income Tax Rule"
                name="incomeTaxRule"
                style={{ marginTop: '24px' }}
                rules={[
                  {
                    required: true,
                    message: 'Please select an Income tax rule!',
                  },
                ]}
              >
                <Select placeholder="Income Tax Rule" showArrow>
                  <Select.Option value="Old Tax Regime">Old Tax Regime</Select.Option>
                  <Select.Option value="New Tax Regime">New Tax Regime</Select.Option>
                </Select>
              </Form.Item>
              <Tooltip title={disabledTitle}>
                <Form.Item label="PAN Number" name="panNum">
                  <Input maxLength={50} placeholder="PAN Number" disabled={disabledFields} />
                </Form.Item>
              </Tooltip>

              <Form.Item
                label="Marital Status"
                name="maritalStatus"
                rules={[
                  {
                    required: true,
                    message: 'Please select your marital status!',
                  },
                ]}
              >
                <Select placeholder="Marital Status" showArrow>
                  <Select.Option value="Single">Single</Select.Option>
                  <Select.Option value="Married">Married</Select.Option>
                  <Select.Option value="Widowed">Widowed</Select.Option>
                  <Select.Option value="Divorced">Divorced</Select.Option>
                  <Select.Option value="Rather not mention">Rather not mention</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="No. of Dependents"
                name="noOfDependents"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the no. of dependents!',
                  },
                ]}
              >
                <Input maxLength={50} placeholder="No. of Dependents" />
              </Form.Item>
              <Form.Item
                label="Residency Status"
                name="residencyStatus"
                rules={[
                  {
                    required: true,
                    message: 'Please select your residency status!',
                  },
                ]}
              >
                <Select placeholder="Residency Status" showArrow>
                  <Select.Option value="Resident">Resident</Select.Option>
                  <Select.Option value="Non Resident">Non Resident</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          );
        }
        if (location?.headQuarterAddress?.country?._id === 'US') {
          return (
            <Form
              form={form}
              name="TaxDetail"
              onFinish={onFinishTax}
              autoComplete="off"
              layout="vertical"
            >
              <div className={styles.form__title}>Tax Details</div>
              <div className={styles.form__description}>
                You are required to fill in the below details to proceed further
              </div>
              <Tooltip title={disabledTitle}>
                <Form.Item
                  label="Social Security Card Number"
                  name="nationalId"
                  style={{ marginTop: '24px' }}
                >
                  <Input
                    maxLength={50}
                    placeholder="Social Security Card Number"
                    disabled={disabledFields}
                  />
                </Form.Item>
              </Tooltip>
              <Form.Item
                label="Marital Status"
                name="maritalStatus"
                rules={[
                  {
                    required: true,
                    message: 'Please select your marital status!',
                  },
                ]}
              >
                <Select placeholder="Marital Status" showArrow>
                  <Select.Option value="Single">Single</Select.Option>
                  <Select.Option value="Married">Married</Select.Option>
                  <Select.Option value="Widowed">Widowed</Select.Option>
                  <Select.Option value="Separated">Separated</Select.Option>
                  <Select.Option value="Divorced">Divorced</Select.Option>
                  <Select.Option value="Rather not mention">Rather not mention</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="No. of Dependents"
                name="noOfDependents"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the no. of dependents!',
                  },
                ]}
              >
                <Input maxLength={50} placeholder="No. of Dependents" />
              </Form.Item>
              <Form.Item
                label="Residency Status"
                name="residencyStatus"
                rules={[
                  {
                    required: true,
                    message: 'Please select your residency status!',
                  },
                ]}
              >
                <Select placeholder="Residency Status" showArrow>
                  <Select.Option value="Resident">Resident</Select.Option>
                  <Select.Option value="Non Resident">Non Resident</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          );
        }
        return (
          <Form
            form={form}
            name="TaxDetail"
            onFinish={onFinishTax}
            autoComplete="off"
            layout="vertical"
          >
            <div className={styles.form__title}>Tax Details</div>
            <div className={styles.form__description}>
              You are required to fill in the below details to proceed further
            </div>
            <Tooltip title={disabledTitle}>
              <Form.Item
                label="Social Security Card Number"
                name="nationalId"
                style={{ marginTop: '24px' }}
                rules={[
                  {
                    required: !disabledFields,
                    message: 'Please enter your Social security card number!',
                  },
                ]}
              >
                <Input
                  maxLength={50}
                  placeholder="Social Security Card Number"
                  disabled={disabledFields}
                />
              </Form.Item>
            </Tooltip>
            <Form.Item
              label="Marital Status"
              name="maritalStatus"
              rules={[
                {
                  required: true,
                  message: 'Please select your marital status!',
                },
              ]}
            >
              <Select placeholder="Marital Status" showArrow>
                <Select.Option value="Single">Single</Select.Option>
                <Select.Option value="Married">Married</Select.Option>
                <Select.Option value="Widowed">Widowed</Select.Option>
                <Select.Option value="Separated">Separated</Select.Option>
                <Select.Option value="Divorced">Divorced</Select.Option>
                <Select.Option value="Rather not mention">Rather not mention</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="No. of Dependents"
              name="noOfDependents"
              rules={[
                {
                  required: true,
                  message: 'Please enter the no. of dependents!',
                },
              ]}
            >
              <Input maxLength={50} placeholder="No. of Dependents" />
            </Form.Item>
            <Form.Item
              label="Residency Status"
              name="residencyStatus"
              rules={[
                {
                  required: true,
                  message: 'Please select your residency status!',
                },
              ]}
            >
              <Select placeholder="Residency Status" showArrow>
                <Select.Option value="Resident">Resident</Select.Option>
                <Select.Option value="Non Resident">Non Resident</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        );
      }

      default:
        return '';
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case 0:
        return [
          <CustomPrimaryButton key="submit" htmlType="submit" form="ContactDetails">
            Continue
          </CustomPrimaryButton>,
        ];
      case 1:
        return [
          <CustomSecondaryButton onClick={() => setCurrentStep(currentStep - 1)}>
            <span style={{ color: '#ffa100' }}>Previous</span>
          </CustomSecondaryButton>,
          <CustomPrimaryButton key="submit" htmlType="submit" form="Certification">
            Continue
          </CustomPrimaryButton>,
        ];
      case 2:
        return [
          <CustomSecondaryButton onClick={() => setCurrentStep(currentStep - 1)}>
            <span style={{ color: '#ffa100' }}>Previous</span>
          </CustomSecondaryButton>,
          <CustomPrimaryButton key="submit" htmlType="submit" form="BankAccount">
            Continue
          </CustomPrimaryButton>,
        ];
      case 3:
        return [
          <CustomSecondaryButton onClick={() => setCurrentStep(currentStep - 1)}>
            <span style={{ color: '#ffa100' }}>Previous</span>
          </CustomSecondaryButton>,
          <CustomPrimaryButton key="submit" htmlType="submit" form="TaxDetail" loading={loading}>
            Submit
          </CustomPrimaryButton>,
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
      visible={visible}
      centered
    >
      <div className={styles.main}>
        <div className={styles.mainTop}>
          <Steps
            current={currentStep}
            onChange={(current) => setCurrentStep(current)}
            className={styles.step}
          >
            <Step disabled />
            <Step disabled />
            <Step disabled />
            <Step disabled />
          </Steps>
        </div>
        <div className={styles.mainContent}>{renderContent()}</div>
      </div>
    </Modal>
  );
};

export default connect(({ loading, employeeProfile = {} }) => ({
  loading: loading.effects['employeeProfile/updateFirstComer'],
  employeeProfile,
}))(ModalAddInfo);
