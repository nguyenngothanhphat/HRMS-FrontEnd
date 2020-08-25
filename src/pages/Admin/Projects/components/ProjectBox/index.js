import React, { Component, Fragment } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Form, Input, Button, Skeleton, Switch, Checkbox, notification } from 'antd';
import { connect } from 'dva';
import { capitalizeFirstLetter } from '@/utils/utils';
import AssignBox from '../AssignBox';
import styles from './index.less';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading }) => ({
  saving: loading.effects['project/saveProject'],
}))
class ProjectBox extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'project/save', payload: { item: undefined } });
  }

  handleCancel = e => {
    const { onCancel, form } = this.props;
    if (typeof onCancel === 'function') onCancel(e);
    form.resetFields();
  };

  handleSave = event => {
    event.preventDefault();
    const { dispatch, form, projectItem, onCancel, location } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (values.isVisibleAll === false && values.members.length === 0) {
        notification.error({ message: formatMessage({ id: 'project.visibility.required' }) });
        return;
      }
      dispatch({
        type: 'project/saveProject',
        payload: {
          method: projectItem._id ? 'update' : 'add',
          ...(projectItem ? { id: projectItem._id } : {}),
          ...values,
          ...{ members: values.members },
          ...{ status: values.status ? 'ACTIVE' : 'INACTIVE' },
          location,
        },
      }).then(response => {
        if (typeof onCancel === 'function' && response === true) onCancel();
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator, saving, loading, getFieldValue },
      projectItem = {},
      action,
    } = this.props;
    const { name = '', members = [], description = '', isVisibleAll = false, status = 'ACTIVE' } =
      projectItem || {};
    const getStatus = text => {
      if (text === 'ACTIVE') return true;
      if (text === 'INACTIVE') return false;
      return false;
    };
    return (
      <Skeleton loading={loading} style={{ padding: '0 24px', height: '100%' }}>
        {(projectItem || action === 'add') && (
          <Fragment>
            <Form className={styles.formAdd} layout="horizontal" style={{ height: '100%' }}>
              <FormItem label={formatMessage({ id: 'common.name' })}>
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: formatMessage({ id: 'project.required.name' }) },
                  ],
                  initialValue: name,
                })(
                  <Input
                    className={styles.input}
                    placeholder={formatMessage({ id: 'bill.form.project' })}
                  />
                )}
              </FormItem>
              <Form.Item label={capitalizeFirstLetter(formatMessage({ id: 'common.status' }))}>
                {getFieldDecorator('status', {
                  valuePropName: 'checked',
                  initialValue: getStatus(status),
                })(
                  <Switch
                    style={{ width: 95 }}
                    checkedChildren={formatMessage({ id: 'project.active' })}
                    unCheckedChildren={formatMessage({ id: 'project.inactive' })}
                  />
                )}
              </Form.Item>
              <FormItem label={formatMessage({ id: 'common.description' })}>
                {getFieldDecorator('description', {
                  initialValue: description,
                })(<Input className={styles.input} placeholder="Project Description" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('isVisibleAll', {
                  valuePropName: 'checked',
                  initialValue: isVisibleAll,
                })(<Checkbox>{formatMessage({ id: 'project.visibility.checkbox' })}</Checkbox>)}
              </FormItem>
              <FormItem label={capitalizeFirstLetter(formatMessage({ id: 'project.visibility' }))}>
                {getFieldDecorator('members', {
                  initialValue: members,
                })(
                  <AssignBox
                    disabled={getFieldValue('isVisibleAll')}
                    placeholder={formatMessage({ id: 'common.search.type-to-search' })}
                    styleName={styles.select}
                    listUser={members}
                  />
                )}
              </FormItem>
              <div className={styles.controlButton}>
                <Button
                  className={styles.btn}
                  onClick={() => this.handleCancel()}
                  style={{ marginRight: 8 }}
                >
                  <FormattedMessage id="common.cancel" />
                </Button>
                <Button
                  className={styles.btn}
                  onClick={e => this.handleSave(e)}
                  type="primary"
                  loading={saving}
                >
                  <FormattedMessage id="common.save" />
                </Button>
              </div>
            </Form>
          </Fragment>
        )}
      </Skeleton>
    );
  }
}

export default ProjectBox;
