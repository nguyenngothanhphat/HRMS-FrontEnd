import React, { Component } from 'react';
import { DatePicker, Form, Row, Col, Input, Select, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './style.less';

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
    user: {
      currentUser: {
        location: { _id: locationId },
      },
    },
  }) => ({
    listGroup,
    listOfType,
    filter,
    listProject,
    locationId,
  })
)
@Form.create()
class Filter extends Component {
  componentDidMount() {
    const { dispatch, locationId } = this.props;
    dispatch({ type: 'group/fetchGroup' });
    dispatch({ type: 'type/fetch', payload: { location: locationId } });
    dispatch({ type: 'project/fetchByAssign' });
  }

  triggerFilterChange = filter => {
    const { dispatch } = this.props;

    dispatch({
      type: 'bill/fetchActiveBills',
      payload: { options: filter },
    });
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
      listOfType,
      listGroup,
    } = this.props;
    e.preventDefault();
    const values = getFieldsValue();
    values.type = values.type.map(item => {
      const currentType = listOfType.find(i => {
        return i.type === item;
      });
      if (currentType) {
        return currentType._id;
      }
      return null;
    });
    values.group = values.group.map(item => {
      const currentGroup = listGroup.find(i => {
        return i.groupName === item;
      });
      if (currentGroup) {
        return currentGroup._id;
      }
      return null;
    });
    this.triggerFilterChange(values);
    if (typeof onSearch === 'function') onSearch();
  };

  render() {
    const {
      form: { getFieldDecorator },
      listGroup,
      listOfType,
      filter,
    } = this.props;

    return (
      <div className={styles.root} style={{ height: '100%' }}>
        <Form onSubmit={this.handleSubmitForm} className={styles.form}>
          <FormItem label={formatMessage({ id: 'filter.date.range' })}>
            <InputGroup compact>
              <Row>
                <Col span={10}>
                  {getFieldDecorator('date.0', {
                    initialValue: filter.date ? filter.date[0] : null,
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
                  {getFieldDecorator('date.1', {
                    initialValue: filter.date ? filter.date[1] : null,
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
          <FormItem label={formatMessage({ id: 'bill.type' }, { format: 0 })}>
            {getFieldDecorator('type', {
              initialValue: filter.type
                ? filter.type.map(item => {
                    const currentType = listOfType.find(i => {
                      return i._id === item;
                    });
                    if (currentType) {
                      return currentType.type;
                    }
                    return null;
                  })
                : [],
            })(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'filter.select.type.placeholder' })}
                className={styles.select}
                allowClear
              >
                {listOfType
                  .map(item => {
                    return {
                      ...item,
                      typeName: item.parent ? `${item.parent.type} / ${item.type}` : item.type,
                    };
                  })
                  .sort((a, b) => {
                    if (a.typeName < b.typeName) return -1;
                    if (a.typeName > b.typeName) return 1;
                    return 0;
                  })
                  .map(t => {
                    const { typeName, type } = t;
                    return <Option key={type}>{typeName}</Option>;
                  })}
              </Select>
            )}
          </FormItem>
          <FormItem label={formatMessage({ id: 'bill.group' })}>
            {getFieldDecorator('group', {
              initialValue: filter.group
                ? filter.group.map(item => {
                    const currentGroup = listGroup.find(i => {
                      return i._id === item;
                    });
                    if (currentGroup) {
                      return currentGroup.groupName;
                    }
                    return null;
                  })
                : [],
            })(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'filter.select.group.placeholder' })}
                className={styles.select}
                allowClear
              >
                {listGroup
                  .sort((a, b) => {
                    if (a.groupName < b.groupName) return -1;
                    if (a.groupName > b.groupName) return 1;
                    return 0;
                  })
                  .map(({ groupName }) => (
                    <Option key={groupName}>{groupName}</Option>
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
