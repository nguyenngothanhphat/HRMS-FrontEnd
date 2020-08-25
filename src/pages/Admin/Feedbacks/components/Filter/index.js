import React, { PureComponent } from 'react';
import { DatePicker, Form, Row, Col, Input, Select, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import styles from './index.less';

const { Item: FormItem } = Form;
const { Group: InputGroup } = Input;
const { Option } = Select;
const dateFormat = 'MMM DD YYYY';

@connect(
  ({
    group: { listGroup },
    type: { list: listOfType },
    bill: { filter },
    project: { listProject },
  }) => ({
    listGroup,
    listOfType,
    filter,
    listProject,
  })
)
@Form.create()
class Filter extends PureComponent {
  triggerFilterChange = values => {
    const {
      after = undefined,
      before = undefined,
      q = '',
      office = [],
      feedbackFor = [],
      status = [],
    } = values;
    const payload = {
      after:
        after !== null && after
          ? `${moment(after.toString()).format('YYYY-MM-DD')}T00:00:00`
          : undefined,
      before:
        before !== null && before
          ? `${moment(before.toString()).format('YYYY-MM-DD')}T23:59:59`
          : undefined,
      q,
      office,
      feedbackFor,
      status,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'feedback/fetch',
      payload,
    });
    dispatch({ type: 'feedback/save', payload: { filter: payload } });
  };

  resetFilter = () => {
    const { form, onSearch } = this.props;
    this.triggerFilterChange({});
    if (typeof onSearch === 'function') onSearch();
    form.resetFields();
  };

  handleSubmitForm = e => {
    const {
      form: { getFieldsValue },
      onSearch,
    } = this.props;
    e.preventDefault();
    const values = getFieldsValue();
    this.triggerFilterChange(values);
    if (typeof onSearch === 'function') onSearch();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const listOffice = [
      { id: 0, location: 'US' },
      { id: 1, location: 'India' },
      { id: 2, location: 'Vietnam' },
      { id: 3, location: 'Lollypop' },
      { id: 4, location: 'Other' },
    ];
    const listFeedback = [
      { id: 0, name: 'Question' },
      { id: 1, name: 'Enchancement Need' },
      { id: 2, name: 'Request' },
      { id: 3, name: 'Bug' },
      { id: 4, name: 'Other' },
    ];

    const listStatus = [
      { id: 0, name: 'PENDING' },
      { id: 1, name: 'REJECT' },
      { id: 2, name: 'COMPLETE' },
    ];
    return (
      <div style={{ height: '100%' }}>
        <Form onSubmit={this.handleSubmitForm} className={styles.form}>
          <FormItem label={formatMessage({ id: 'filter.date.range' })}>
            <InputGroup compact>
              <Row>
                <Col span={10}>
                  {getFieldDecorator('after', {
                    initialValue: undefined,
                  })(
                    <DatePicker
                      className={styles.input}
                      style={{ width: '100%' }}
                      format={dateFormat}
                      allowClear
                    />
                  )}
                </Col>
                <Col span={4}>
                  <Input
                    className={`${styles.input} ${styles.range}`}
                    placeholder="~"
                    disabled
                    allowClear
                  />
                </Col>
                <Col span={10}>
                  {getFieldDecorator('before', {
                    initialValue: undefined,
                  })(
                    <DatePicker
                      className={styles.input}
                      style={{ width: '100%' }}
                      format={dateFormat}
                      allowClear
                    />
                  )}
                </Col>
              </Row>
            </InputGroup>
          </FormItem>
          <FormItem
            label={`${formatMessage({ id: 'feedback.name' })} / ${formatMessage({
              id: 'feedback.email',
            })} / ${formatMessage({ id: 'feedback.description' })}`}
          >
            {getFieldDecorator('q', {
              initialValue: '',
            })(
              <Input
                className={styles.input}
                placeholder={formatMessage({ id: 'feedback.text-select' })}
                allowClear
              />
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: 'feedback.office' })}>
            {getFieldDecorator('office', {
              initialValue: [],
            })(
              <Select
                placeholder={formatMessage({ id: 'feedback.office-select' })}
                showSearch
                mode="multiple"
                allowClear
              >
                {listOffice.map(p => (
                  <Option key={p.location} value={p.location}>
                    {p.location}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: 'feedback.type' })}>
            {getFieldDecorator('feedbackFor', {
              initialValue: [],
            })(
              <Select
                placeholder={formatMessage({ id: 'feedback.type-select' })}
                mode="multiple"
                showSearch
                allowClear
              >
                {listFeedback.map(p => (
                  <Option key={p.name} value={p.name}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label={formatMessage({ id: 'feedback.status' })}>
            {getFieldDecorator('status', {
              initialValue: [],
            })(
              <Select
                placeholder={formatMessage({ id: 'feedback.status-select' })}
                mode="multiple"
                showSearch
                allowClear
              >
                {listStatus.map(p => (
                  <Option key={p.name} value={p.name}>
                    {p.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <div className={styles.controlButton}>
            <Button className={styles.btn} type="primary" htmlType="submit">
              <FormattedMessage id="filter.btn.submit" />
            </Button>
            <Button className={styles.btn} onClick={this.resetFilter}>
              <FormattedMessage id="filter.btn.reset" />
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Filter;
