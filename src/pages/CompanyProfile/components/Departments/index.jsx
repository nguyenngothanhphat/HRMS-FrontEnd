/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Form, Divider, Button, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import FormDepartment from './components/FormDepartment';
import s from './index.less';

@connect(
  ({
    loading,
    departmentManagement: { listDefault = [], listByCompany: listDepartment = [] } = {},
    user: { currentUser = {} } = {},
  }) => ({
    listDefault,
    listDepartment,
    currentUser,
    loading: loading.effects['departmentManagement/upsertDepartment'],
    fetchingListDepartment: loading.effects['departmentManagement/fetchListDepartmentByCompany'],
  }),
)
class Departments extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = ({ listDepartment }) => {
    const { dispatch, currentUser: { company: { _id } = {} } = {} } = this.props;
    const payload = { listDepartment, company: _id };
    dispatch({
      type: 'departmentManagement/upsertDepartment',
      payload,
    });
  };

  removeDepartment = (id) => {
    const { dispatch, currentUser: { company: { _id } = {} } = {} } = this.props;
    const payload = { id, company: _id };
    dispatch({
      type: 'departmentManagement/removeDepartment',
      payload,
    });
  };

  render() {
    const { listDefault = [], listDepartment = [], loading, fetchingListDepartment } = this.props;
    const listByCompany = listDepartment.length === 0 ? [{}] : listDepartment;
    if (fetchingListDepartment) {
      return (
        <div className={s.root}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Departments</p>
            <p className={s.text}>
              Add departments to each work location. We will help to assign administrators and user
              rights to each of them in the later steps.
            </p>
          </div>
          <div className={s.content__viewBottom}>
            <Skeleton active />
          </div>
        </div>
      );
    }
    return (
      <Form
        ref={this.formRef}
        onFinish={this.onFinish}
        autoComplete="off"
        initialValues={{ listDepartment: listByCompany }}
      >
        <div className={s.root}>
          <div className={s.content__viewTop}>
            <p className={s.title}>Departments</p>
            <p className={s.text}>
              Add departments to each work location. We will help to assign administrators and user
              rights to each of them in the later steps.
            </p>
          </div>
          <div className={s.content__viewBottom}>
            <Form.List name="listDepartment">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <FormDepartment
                      field={field}
                      key={field.name}
                      onRemove={() => remove(field.name)}
                      list={listDefault}
                      listDepartment={listDepartment}
                      removeDepartment={this.removeDepartment}
                    />
                  ))}
                  <div className={s.viewAddDepartments} onClick={() => add()}>
                    <p className={s.viewAddDepartments__icon}>
                      <PlusOutlined />
                    </p>
                    <p className={s.viewAddDepartments__text}>Add a department</p>
                  </div>
                </>
              )}
            </Form.List>
          </div>
        </div>
        <div className={s.viewBtn}>
          <Button className={s.btnSubmit} htmlType="submit" loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    );
  }
}

export default Departments;
