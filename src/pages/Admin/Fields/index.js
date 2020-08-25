import React, { Component } from 'react';
import { Row, Col, Button, Icon, Input, Select, Table, Empty, Modal, notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import New from './new';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

@connect(({ locations: { list, defaultLocation }, customField: { listCustomField }, loading }) => ({
  list,
  defaultLocation,
  listCustomField,
  loading: loading.models.customField,
}))
class Fields extends Component {
  static getDerivedStateFromProps(props) {
    if ('defaultLocation' in props) {
      return { location: props.defaultLocation };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      searchText: '',
      pageSelected: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const status = 'ACTIVE';
    dispatch({ type: 'locations/fetch', payload: { status } });
    dispatch({ type: 'customField/fetch' });
  }

  handleSearch = searchText => {
    this.setState({
      searchText,
    });
  };

  handleChange = text => {
    const { dispatch } = this.props;
    dispatch({ type: 'locations/changeSelectedLocation', payload: text });
    this.setState({
      pageSelected: 1,
    });
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    this.setState({
      sortedField: sorter,
    });
  };

  onChangePagination = pageNumber => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  showModal = location => {
    if (location === '') {
      notification.error({
        message: formatMessage({ id: 'custom.selectLocation' }),
      });
      return;
    }
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showConfirm = ({ type, id }) => {
    const { dispatch } = this.props;
    const action = {
      delete: {
        title: formatMessage({ id: 'custom.confirmDelete' }),
        onOk() {
          dispatch({
            type: 'customField/deleteCustomField',
            id,
          });
        },
      },
    };

    Modal.confirm({
      ...action[type],
    });
  };

  createListCustomFieldByLocation = list => {
    const { location } = this.state;

    const listCustomFieldByLocation = list.filter(
      item => item.expenseType.location._id === location
    );
    return listCustomFieldByLocation;
  };

  render() {
    const { list, listCustomField, loading, defaultLocation } = this.props;
    const { location, sortedField = {}, visible, searchText, pageSelected } = this.state;
    const pagination = {
      showSizeChanger: false,
      showQuickJumper: false,
      hideOnSinglePage: true,
      pageSize: 5,
      current: pageSelected,
      onChange: this.onChangePagination,
    };
    const listCustomFieldByLocation = this.createListCustomFieldByLocation(listCustomField);
    const columns = [
      {
        title: formatMessage({ id: 'custom.NAME' }).toUpperCase(),
        dataIndex: 'name',
        key: 'name',
        sorter: (item, nextItem) => item.name.localeCompare(nextItem.name),
        sortOrder: sortedField.columnKey === 'name' && sortedField.order,
      },
      {
        title: formatMessage({ id: 'bill.type' }).toUpperCase(),
        dataIndex: 'expenseType',
        key: 'expenseType',
        sorter: (item, nextItem) => item.expenseType.type.localeCompare(nextItem.expenseType.type),
        sortOrder: sortedField.columnKey === 'expenseType' && sortedField.order,
        render: expenseType =>
          expenseType.parent
            ? `${expenseType.parent.type} / ${expenseType.type}`
            : expenseType.type,
      },
      {
        title: formatMessage({ id: 'custom.PLACEHOLDER' }).toUpperCase(),
        dataIndex: 'placeholder',
        key: 'placeholder',
      },
      {
        title: formatMessage({ id: 'custom.FIELDTYPE' }).toUpperCase(),
        dataIndex: 'type',
        key: 'type',
        sorter: (item, nextItem) => item.type.localeCompare(nextItem.type),
        sortOrder: sortedField.columnKey === 'type' && sortedField.order,
        render: text => text.toUpperCase(),
      },
      {
        title: formatMessage({ id: 'custom.MANDATORY' }).toUpperCase(),
        dataIndex: 'mandatory',
        key: 'mandatory',
        render: mandatory =>
          mandatory ? formatMessage({ id: 'common.yes' }) : formatMessage({ id: 'common.no' }),
      },
      {
        title: formatMessage({ id: 'common.table.action' }),
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: _id => (
          <div style={{ textAlign: 'center' }}>
            <span
              onClick={() => this.showConfirm({ type: 'delete', id: _id._id })}
              className={styles.btnDel}
            >
              <Icon type="delete" theme="filled" style={{ fontSize: '22px' }} />
            </span>
          </div>
        ),
      },
    ];

    const kw = searchText.trim().toLowerCase();

    const listDisplay = kw
      ? listCustomFieldByLocation.filter(item => {
          const name = item.name.toLowerCase();
          return kw && name.indexOf(kw) > -1;
        })
      : listCustomFieldByLocation;

    return (
      <div className="wrapper">
        <Row type="flex" justify="space-between" style={{ paddingBottom: '24px' }}>
          {location !== '' ? (
            <Col span={10}>
              <Search
                placeholder={formatMessage({ id: 'custom.search' })}
                onSearch={value => this.handleSearch(value)}
                allowClear
              />
            </Col>
          ) : null}
          <Col span={6}>
            <Select
              placeholder={formatMessage({ id: 'custom.selectLocation' })}
              style={{ width: '100%' }}
              onChange={value => this.handleChange(value)}
              value={defaultLocation}
            >
              {list.map(({ _id, name }) => (
                <Option key={_id} value={_id}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={() => this.showModal(location)}>
              <Icon type="plus" />
              {formatMessage({ id: 'custom.add' })}
            </Button>
          </Col>
        </Row>
        <Row>
          {location !== '' ? (
            <Table
              loading={loading}
              dataSource={listDisplay}
              rowKey="_id"
              locale={{
                emptyText: <Empty description={formatMessage({ id: 'custom.empty' })} />,
              }}
              pagination={{
                ...pagination,
                total: listDisplay.length,
              }}
              onChange={this.handleChangeTable}
              columns={columns}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={formatMessage({ id: 'custom.plzSelectLocation' })}
            />
          )}
        </Row>
        {visible && (
          <Modal
            title={formatMessage({ id: 'custom.add' })}
            visible={!!visible}
            footer={false}
            onCancel={this.handleCancel}
          >
            <New location={location} cancelModal={this.handleCancel} />
          </Modal>
        )}
      </div>
    );
  }
}

export default Fields;
