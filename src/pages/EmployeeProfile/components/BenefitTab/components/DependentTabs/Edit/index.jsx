// import React, { PureComponent } from 'react';
// import { Form, Button, Input, Select, DatePicker } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import { connect } from 'umi';
// import moment from 'moment';
// import RemoveIcon from './assets/removeIcon.svg';
// import s from './index.less';

// const { Option } = Select;

// @connect(
//   ({
//     employeeProfile: {
//       idCurrentEmployee = '',
//       tenantCurrentEmployee = '',
//       originData: { dependentDetails: { _id: dependentsId = '' } = {} } = {},
//     } = {},
//     loading,
//   }) => ({
//     dependentsId,
//     idCurrentEmployee,
//     tenantCurrentEmployee,
//     loadingUpdate: loading.effects['employeeProfile/updateEmployeeDependentDetails'],
//     loadingAdd: loading.effects['employeeProfile/addDependentsOfEmployee'],
//     loadingRemove: loading.effects['employeeProfile/removeEmployeeDependentDetails'],
//   }),
// )
// class Edit extends PureComponent {
//   formRef = React.createRef();

//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   formatData = () => {
//     const { data = [] } = this.props;
//     if (data.length > 0) {
//       return data.map((value) => {
//         const { legalName = '', gender = '', relationship = '', dob = '' } = value;
//         return {
//           legalName,
//           gender,
//           relationship,
//           dob: moment(dob).locale('en'),
//         };
//       });
//     }
//     return [
//       {
//         legalName: '',
//         gender: '',
//         relationship: '',
//         dob: null,
//       },
//     ];
//   };

//   handleSave = async (values) => {
//     let payload = {};
//     const {
//       dispatch,
//       dependentsId = '',
//       setEditing = () => {},
//       setAdding = () => {},
//       data = [],
//       idCurrentEmployee = '',
//       tenantCurrentEmployee = '',
//     } = this.props;

//     const { dependents = [] } = values;

//     let type = 'employeeProfile/addDependentsOfEmployee';
//     if (dependents.length === 0) {
//       type = 'employeeProfile/removeEmployeeDependentDetails';
//       payload.id = dependentsId;
//       payload.tenantId = tenantCurrentEmployee;
//     } else if (data.length > 0) {
//       payload = values;
//       payload.id = dependentsId;
//       payload.tenantId = tenantCurrentEmployee;
//       type = 'employeeProfile/updateEmployeeDependentDetails';
//     } else {
//       payload = {
//         employee: idCurrentEmployee,
//         dependents,
//         tenantId: tenantCurrentEmployee,
//       };
//     }

//     const res = await dispatch({
//       type,
//       payload,
//     });
//     const { statusCode = 0 } = res;
//     if (statusCode === 200) {
//       setEditing(false);
//       setAdding(false);
//     }
//   };

//   _renderEditForm = () => {
//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 6 },
//         sm: { span: 6 },
//       },
//       wrapperCol: {
//         xs: { span: 9 },
//         sm: { span: 12 },
//       },
//     };

//     const formatData = this.formatData();

//     return (
//       <Form
//         className={s.Form}
//         // eslint-disable-next-line react/jsx-props-no-spreading
//         {...formItemLayout}
//         ref={this.formRef}
//         id="myForm"
//         onFinish={this.handleSave}
//         initialValues={{ dependents: formatData }}
//       >
//         <Form.List name="dependents">
//           {(fields, { add, remove }) => (
//             <>
//               {fields.map((field, index) => (
//                 <>
//                   {index > 0 && <div className={s.line} />}
//                   <div className={s.title}>
//                     <span className={s.text}>Dependent {index + 1}</span>

//                     <img src={RemoveIcon} alt="remove" onClick={() => remove(field.name)} />
//                   </div>

//                   <Form.Item
//                     label="Legal Name"
//                     name={[field.name, 'legalName']}
//                     // name={[field.name, 'first']}
//                     fieldKey={[field.fieldKey, 'legalName']}
//                     rules={[
//                       {
//                         required: true,
//                         message: 'Please type name!',
//                       },
//                     ]}
//                     // initialValue={item.visaType}
//                   >
//                     <Input />
//                   </Form.Item>
//                   <Form.Item
//                     label="Gender"
//                     name={[field.name, 'gender']}
//                     // name={[field.name, 'first']}
//                     fieldKey={[field.fieldKey, 'gender']}
//                     rules={[
//                       {
//                         required: true,
//                         message: 'Please select gender!',
//                       },
//                     ]}
//                     // initialValue={item.visaType}
//                   >
//                     <Select className={s.selectForm}>
//                       <Option value="Male">Male</Option>
//                       <Option value="Female">Female</Option>
//                       <Option value="Other">Other</Option>
//                     </Select>
//                   </Form.Item>
//                   <Form.Item
//                     label="Relationship"
//                     name={[field.name, 'relationship']}
//                     // name={[field.name, 'first']}
//                     fieldKey={[field.fieldKey, 'relationship']}
//                     rules={[
//                       {
//                         required: true,
//                         message: 'Please select the relationship!',
//                       },
//                     ]}
//                     // initialValue={item.visaType}
//                   >
//                     <Select className={s.selectForm}>
//                       <Option value="Father">Father</Option>
//                       <Option value="Mother">Mother</Option>
//                       <Option value="Grandfather">Grandfather</Option>
//                       <Option value="Grandmother">Grandmother</Option>
//                       <Option value="...">...</Option>
//                     </Select>
//                   </Form.Item>
//                   <Form.Item
//                     label="Date of birth"
//                     name={[field.name, 'dob']}
//                     fieldKey={[field.fieldKey, 'dob']}
//                     rules={[
//                       {
//                         required: true,
//                         message: 'Please choose date of birth!',
//                       },
//                     ]}
//                     // initialValue={item.visaType}
//                   >
//                     <DatePicker className={s.dateForm} format="MM.DD.YY" />
//                   </Form.Item>
//                 </>
//               ))}
//               <div onClick={() => add()} className={s.addNewBtn}>
//                 <PlusOutlined />
//                 <span className={s.btnTitle}>Add new</span>
//               </div>
//             </>
//           )}
//         </Form.List>
//       </Form>
//     );
//   };

//   _renderButton = () => {
//     const {
//       setEditing = () => {},
//       setAdding = () => {},
//       loadingUpdate = false,
//       loadingAdd = false,
//       loadingRemove = false,
//     } = this.props;
//     return (
//       <div className={s.spaceFooter}>
//         <div
//           className={s.cancelFooter}
//           onClick={() => {
//             setAdding(false);
//             setEditing(false);
//           }}
//         >
//           Cancel
//         </div>
//         <Button
//           loading={loadingUpdate || loadingAdd || loadingRemove}
//           type="primary"
//           htmlType="submit"
//           form="myForm"
//           className={s.buttonFooter}
//         >
//           Save
//         </Button>
//       </div>
//     );
//   };

//   render() {
//     return (
//       <div className={s.Edit}>
//         {this._renderEditForm()}
//         {this._renderButton()}
//       </div>
//     );
//   }
// }

// export default Edit;

import React, { PureComponent } from 'react';
import { Form, Button, Input, Select, DatePicker, Modal } from 'antd';
import moment from 'moment';

import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    employeeProfile: {
      idCurrentEmployee = '',
      tenantCurrentEmployee = '',
      originData: { dependentDetails: { _id: dependentsId = '' } = {} } = {},
    } = {},
    loading,
  }) => ({
    dependentsId,
    idCurrentEmployee,
    tenantCurrentEmployee,
    loadingUpdate: loading.effects['employeeProfile/updateEmployeeDependentDetails'],
    loadingAdd: loading.effects['employeeProfile/addDependentsOfEmployee'],
    loadingRemove: loading.effects['employeeProfile/removeEmployeeDependentDetails'],
  }),
)
class Edit extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {};
  }

  disabledDate = (current) => {
    // Can not select days after today and today
    return current && current > moment().endOf('day');
  };

  formatData = () => {
    const { data = [] } = this.props;
    if (data.length > 0) {
      return data.map((value) => {
        const { firstName = '', lastName = '', gender = '', relationship = '', dob = '' } = value;
        return {
          firstName,
          lastName,
          gender,
          relationship,
          dob: moment(dob).locale('en'),
        };
      });
    }
    return [
      {
        firstName: '',
        lastName: '',
        gender: '',
        relationship: '',
        dob: null,
      },
    ];
  };

  handleSave = async (values) => {
    const { onClose = () => {} } = this.props;
    let payload = {};
    const {
      dispatch,
      dependentsId = '',
      setEditing = () => {},
      // setAdding = () => {},
      data = [],
      idCurrentEmployee = '',
      tenantCurrentEmployee = '',
    } = this.props;

    const { dependents = [] } = values;
    let type = 'employeeProfile/addDependentsOfEmployee';
    if (dependents.length === 0) {
      type = 'employeeProfile/removeEmployeeDependentDetails';
      payload.id = dependentsId;
      payload.tenantId = tenantCurrentEmployee;
    } else if (data.length > 0) {
      payload = values;
      payload.id = dependentsId;
      payload.tenantId = tenantCurrentEmployee;
      type = 'employeeProfile/updateEmployeeDependentDetails';
    } else {
      payload = {
        employee: idCurrentEmployee,
        dependents,
        tenantId: tenantCurrentEmployee,
      };
    }

    const res = await dispatch({
      type,
      payload,
    });
    const { statusCode = 0 } = res;
    if (statusCode === 200) {
      setEditing(false);
      // setAdding(false);
      onClose();
    }
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderEditForm = () => {
    const formatData = this.formatData();

    return (
      <Form
        className={styles.Form}
        // eslint-disable-next-line react/jsx-props-no-spreading
        ref={this.formRef}
        id="myForm"
        onFinish={this.handleSave}
        initialValues={{ dependents: formatData }}
      >
        <Form.List name="dependents">
          {(fields) => (
            <>
              {fields.map((field, index) => (
                <>
                  {index > 0 && <div className={styles.line} />}
                  <Form.Item
                    label="First Name"
                    name={[field.name, 'firstName']}
                    fieldKey={[field.fieldKey, 'firstName']}
                    rules={[
                      {
                        required: true,
                        message: 'Please type first name!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Last Name"
                    name={[field.name, 'lastName']}
                    fieldKey={[field.fieldKey, 'lastName']}
                    rules={[
                      {
                        required: true,
                        message: 'Please type last name!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Gender"
                    name={[field.name, 'gender']}
                    fieldKey={[field.fieldKey, 'gender']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select gender!',
                      },
                    ]}
                  >
                    <Select className={styles.selectForm}>
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Relationship"
                    name={[field.name, 'relationship']}
                    fieldKey={[field.fieldKey, 'relationship']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select the relationship!',
                      },
                    ]}
                  >
                    <Select className={styles.selectForm}>
                      <Option value="Father">Father</Option>
                      <Option value="Mother">Mother</Option>
                      <Option value="Grandfather">Grandfather</Option>
                      <Option value="Grandmother">Grandmother</Option>
                      <Option value="...">...</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Date of Birth"
                    name={[field.name, 'dob']}
                    fieldKey={[field.fieldKey, 'dob']}
                    rules={[
                      {
                        required: true,
                        message: 'Please choose date of birth!',
                      },
                    ]}
                  >
                    <DatePicker
                      className={styles.dateForm}
                      format="MM.DD.YY"
                      disabledDate={this.disabledDate}
                    />
                  </Form.Item>
                </>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    );
  };

  render() {
    const { visible, loadingAdd } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Edit Dependant</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return <div className={styles.content}>{this.renderEditForm()}</div>;
    };

    return (
      <>
        <Modal
          className={`${styles.EditDependant} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={450}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                htmlType="submit"
                form="myForm"
                loading={loadingAdd}
              >
                Save Change
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default Edit;
