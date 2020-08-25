import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Table, Button, Icon, Input, Row, Col, Modal, Avatar, Select, Skeleton } from 'antd';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

@connect(
  ({
    type: { list: listType },
    loading,
    locations: { list: listLocation, defaultLocation },
    user,
  }) => ({
    listType,
    loading: loading.models.type,
    listLocation,
    defaultLocation,
    user,
  })
)
class TypeList extends Component {
  state = { q: '', location: 0 };

  componentDidMount() {
    const { dispatch, selectTypeStatus: status, defaultLocation } = this.props;
    dispatch({ type: 'type/fetch', payload: { status } });
    dispatch({ type: 'locations/fetch', payload: { status: 'ACTIVE' }, defaultLocation });
    this.setState({ location: defaultLocation });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultLocation !== state.location) {
      return {
        location: props.defaultLocation,
      };
    }
    return null;
  }

  componentDidUpdate(
    _preProps,
    {
      // q: prevQ,
      date: prevDate = {},
    }
  ) {
    const {
      date = {},
      // q
    } = this.state;
    const { dispatch, selectTypeStatus: status } = this.props;
    if (
      // prevQ !== q ||
      JSON.stringify(date) !== JSON.stringify(prevDate)
    ) {
      dispatch({
        type: 'type/fetch',
        payload: {
          // q,
          date,
          status,
        },
      });
    }
  }

  onChangePagination = pageNumber => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  showConfirm = ({ type, id }) => {
    const { dispatch } = this.props;
    const action = {
      remove: {
        title: formatMessage({ id: 'type.remove.confirm' }),
        onOk() {
          dispatch({ type: 'type/remove', payload: id });
        },
      },
    };

    Modal.confirm({
      ...action[type],
    });
  };

  showDrawer = () => {
    const { showDrawer } = this.props;
    if (typeof showDrawer === 'function') showDrawer();
  };

  handleSearch = value => {
    this.setState({
      q: value,
    });
  };

  isObjExistArrayType = (item, arr) => {
    let result = false;
    let obj;
    if (arr.length > 0) {
      obj = arr.find(i => i.id === item.id);
    }

    if (obj) result = true;
    return result;
  };

  isIdExistArrayId = (item, arr) => {
    let result = false;
    let obj;
    if (arr.length > 0) {
      obj = arr.find(i => i === item);
    }

    if (obj) result = true;
    return result;
  };

  render() {
    const {
      onClick,
      listType,
      listLocation,
      defaultLocation,
      loading,
      selectTypeStatus: status,
    } = this.props;
    const { location, pageSelected, q = '' } = this.state;
    const filteredListType = listType.filter(item => {
      const { type = '' } = item;
      return type.toLowerCase().indexOf(q.toLowerCase()) > -1;
    });
    let listMainType = [];
    let listSubType = [];
    const listParrentId = [];
    if (status === 'ACTIVE') {
      listMainType = filteredListType.filter(item => !item.parent);
      listSubType = filteredListType.filter(item => item.parent);
      if (listSubType.length > 0) {
        listSubType.forEach(item => {
          const parrentItem = listType.find(t => {
            return t.id === item.parent.id;
          });
          if (parrentItem && !this.isIdExistArrayId(parrentItem, listParrentId)) {
            listParrentId.push(parrentItem.id);
          }
          if (parrentItem && !this.isObjExistArrayType(parrentItem, listMainType)) {
            listMainType = [...listMainType, parrentItem];
          }
        });
      }
    } else {
      listMainType = filteredListType;
    }
    const customListType =
      listMainType.length > 0 &&
      listMainType
        .map(item => {
          const subType = listSubType
            .filter(i => i.parent.id === item.id)
            .map(i => ({ ...i, title: { thumbnailUrl: i.thumbnailUrl, type: i.type }, item: i }));
          if (subType && subType.length > 0) {
            return {
              ...item,
              children: subType,
              title: { thumbnailUrl: item.thumbnailUrl, type: item.type },
              item,
            };
          }
          return {
            ...item,
            key: item.id,
            title: { thumbnailUrl: item.thumbnailUrl, type: item.type },
            item,
          };
        })
        .filter(i => i.location._id === location);
    const list = customListType;
    const pagination = {
      showSizeChanger: false,
      showQuickJumper: false,
      hideOnSinglePage: true,
      pageSize: 10,
      current: pageSelected,
      onChange: this.onChangePagination,
    };
    const header = (
      <Row type="flex" justify="space-between">
        <Col span={8}>
          <Search
            placeholder={formatMessage({ id: 'common.search.search-a-type' })}
            onChange={e => this.setState({ q: e.target.value })}
            allowClear
            value={q}
          />
        </Col>
        <Col span={8}>
          <Select
            style={{ minWidth: 209 }}
            defaultValue={location}
            value={location}
            onChange={value => {
              const { dispatch } = this.props;
              dispatch({ type: 'locations/changeSelectedLocation', payload: value });
              this.setState({ q: '', pageSelected: 1 });
            }}
          >
            {listLocation.map(item => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Button type="primary" onClick={this.showDrawer}>
            <FormattedMessage id="common.create-new-type" />
          </Button>
        </Col>
      </Row>
    );

    const columns = [
      {
        width: 180,
        align: 'right',
        key: 'action',
        dataIndex: 'item',
        render: item => (
          <div className={styles.actionBtn}>
            <Button
              className="m-1 btn-info fill"
              onClick={() => {
                if (typeof onClick === 'function') onClick(item);
              }}
            >
              <FormattedMessage id="common.edit" />
            </Button>
            <Button
              className="m-1 btn btn-danger no-border b-l-sm b-gray"
              onClick={() => {
                this.showConfirm({ type: 'remove', id: item.id });
              }}
            >
              <Icon type="close" />
            </Button>
          </div>
        ),
      },
    ];

    columns.unshift({
      dataIndex: 'title',
      key: 'id',
      render: (title, record) => {
        const { thumbnailUrl = '', type = '' } = title;
        const { parent = {} } = record;
        let parentType = '';
        if (parent !== null) {
          parentType = parent.type;
        }
        return (
          <span>
            <Avatar src={thumbnailUrl} className={styles.avatar} />
            {parentType ? (
              <span className={styles.type}>{`${parentType} / ${type}`}</span>
            ) : (
              <span className={styles.type}>{type}</span>
            )}
          </span>
        );
      },
    });
    return (
      <Skeleton loading={!defaultLocation}>
        <Table
          loading={loading}
          rowKey="id"
          pagination={pagination}
          className={styles.root}
          columns={columns}
          defaultExpandAllRows={false}
          expandedRowKeys={q !== '' ? listParrentId : []}
          dataSource={list}
          showHeader={false}
          title={() => header}
        />
      </Skeleton>
    );
  }
}

export default TypeList;
