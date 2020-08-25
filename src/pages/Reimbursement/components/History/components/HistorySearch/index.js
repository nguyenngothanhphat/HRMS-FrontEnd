import React, { useState } from 'react';
import { Icon, Form, Select, Button, DatePicker, Input, Empty, Spin } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import styles from './style.less';

const HistorySearch = props => {
  const {
    form,
    dispatch,
    list,
    onClose,
    listProject,
    _id: locationId,
    loadingReset,
    loadingFetch,
  } = props;
  const { getFieldDecorator, validateFieldsAndScroll, setFieldsValue, resetFields } = form;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY/MM/DD';
  const [fetching, setFetching] = useState(false);
  const customListProject = listProject.filter(item => item.location._id === locationId);

  const handleSubmit = () => {
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { date = [], q = '', status = [], creators = [], projects = [] } = values;
        const [after, before] = date;
        dispatch({
          type: 'reportHistory/search',
          payload: {
            method: 'list',
            before: before
              ? `${moment(before.toString()).format('YYYY-MM-DD')}T23:59:59`
              : undefined,
            after: after ? `${moment(after.toString()).format('YYYY-MM-DD')}T00:00:00` : undefined,
            status,
            creators,
            q,
            projects,
          },
        }).then(() => onClose());
      }
    });
  };

  const resetFilter = async () => {
    await resetFields();
    await dispatch({ type: 'reportHistory/reset', payload: { method: 'list' } }).then(() =>
      onClose()
    );
  };

  const search = q => {
    setFetching(true);
    dispatch({ type: 'user/find', payload: { q } }).then(() => setFetching(false));
  };

  const onChangeCreator = text => {
    search(text);
  };

  let notFoundContent = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={formatMessage({ id: 'common.report.history.search.email.failed' })}
    />
  );
  if (fetching) {
    notFoundContent = (
      <div style={{ textAlign: 'center' }}>
        <Spin size="small" />
      </div>
    );
  } else if (fetching === undefined) {
    notFoundContent = (
      <div>
        <Icon type="search" /> <FormattedMessage id="common.report.history.search.email" />
      </div>
    );
  }

  return (
    <Form className={styles.root}>
      <Form.Item label={formatMessage({ id: 'common.keyword' })}>
        {getFieldDecorator('q', {
          initialValue: '',
          rules: [{}],
        })(
          <Input
            placeholder={formatMessage({ id: 'common.search-history.placeholder' })}
            // onSearch={handleSearch}
            allowClear
          />
        )}
      </Form.Item>
      <Form.Item label={formatMessage({ id: 'common.date' })}>
        {getFieldDecorator('date', {})(
          <RangePicker placeholder={['From', 'To']} format={dateFormat} allowClear />
        )}
      </Form.Item>
      <Form.Item label={formatMessage({ id: 'common.status' })}>
        {getFieldDecorator('status', {})(
          <Select
            mode="multiple"
            onChange={() => setFieldsValue({ type: undefined })}
            placeholder={formatMessage({ id: 'reimbursement.choose-status' })}
          >
            <Option value="PENDING">{formatMessage({ id: 'reimbursement.status.pending' })}</Option>
            <Option value="COMPLETE">
              {formatMessage({ id: 'reimbursement.status.complete' })}
            </Option>
            <Option value="DRAFT">{formatMessage({ id: 'reimbursement.status.draft' })}</Option>
            <Option value="REJECT">{formatMessage({ id: 'reimbursement.status.reject' })}</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label={formatMessage({ id: 'common.creator' })}>
        {getFieldDecorator('creators', {})(
          <Select
            mode="multiple"
            onSearch={onChangeCreator}
            notFoundContent={notFoundContent}
            loading={fetching}
            allowClear
            placeholder={formatMessage({ id: 'reimbursement.type-to-search' })}
          >
            {list.map(({ email }) => {
              if (email.length !== 0) {
                return <Option key={email}>{email}</Option>;
              }
              return '';
            })}
          </Select>
        )}
      </Form.Item>
      <Form.Item label={formatMessage({ id: 'reimbursement.projects' })}>
        {getFieldDecorator('projects', {})(
          <Select
            mode="multiple"
            // onChange={() => setFieldsValue({ type: undefined })}
            placeholder={formatMessage({ id: 'reimbursement.projects.placeholder' })}
            filterOption={(input, option) =>
              typeof option.props.children === 'string' &&
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1
            }
          >
            {customListProject.map(item => {
              const { name, _id } = item;
              return (
                <Option key={_id} value={_id}>
                  {name}
                </Option>
              );
            })}
          </Select>
        )}
      </Form.Item>
      <div className={styles.controlButton}>
        <Button className={styles.btn} type="primary" onClick={handleSubmit} loading={loadingFetch}>
          <FormattedMessage id="filter.btn.submit" />
        </Button>
        <Button className={styles.btn} onClick={resetFilter} loading={loadingReset}>
          <FormattedMessage id="filter.btn.reset" />
        </Button>
      </div>
    </Form>
  );
};
export default Form.create()(
  connect(
    ({
      loading,
      project: { listProject },
      user: {
        list,
        currentUser: {
          location: { _id },
        },
      },
    }) => ({
      list,
      _id,
      listProject,
      loadingFetch: loading.effects['reportHistory/search'],
      loadingReset: loading.effects['reportHistory/reset'],
    })
  )(HistorySearch)
);
