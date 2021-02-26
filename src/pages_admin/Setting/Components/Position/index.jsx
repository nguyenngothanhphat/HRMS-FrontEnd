import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { connect } from 'umi';
import { Input, Spin, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

@connect(({ loading, adminSetting: { tempData: { listTitle = [] } = {} } = {} }) => ({
  loading: loading.effects['adminSetting/fetchListTitle'],
  listTitle,
}))
class Position extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
      data: [],
      newValue: '',
    };
  }

  componentDidMount() {
    const { listTitle } = this.props;
    const formatData = listTitle.map((item) => {
      const { _id: PositionID, name: PositionName } = item;
      return {
        PositionID,
        PositionName,
      };
    });
    this.setState({ data: formatData });
  }

  static getDerivedStateFromProps(props, state) {
    const { listTitle } = props;
    const { data } = state;
    if (listTitle.length === data.length) {
      return {
        data,
      };
    }
    const formatData = listTitle.map((item) => {
      const { _id: PositionID, name: PositionName } = item;
      return {
        PositionID,
        PositionName,
      };
    });
    return { data: formatData };
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    this.setState({ selectedRowKeys });
  };

  handleOk = () => {
    const { testReord } = this.state;
    const { dispatch } = this.props;
    const { PositionID = '' } = testReord;
    const statusCode = dispatch({
      type: 'adminSetting/removeTitle',
      payload: {
        id: PositionID,
      },
    });
    if (statusCode === 200) {
      dispatch({
        type: 'adminSetting/fetchListTitle',
      });
    }

    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleClickDelete = (text, record) => {
    this.setState({
      visible: true,
      testReord: record,
    });
  };

  handleChangeValue = (e) => {
    const { value } = e.target;
    this.setState({ newValue: value });
  };

  handleAddNewValue = (newValue) => {
    const { dispatch } = this.props;
    if (newValue === '') return;
    dispatch({
      type: 'adminSetting/addPosition',
      payload: { name: newValue },
    });
    this.setState({ newValue: '' });
  };

  render() {
    const { selectedRowKeys, visible, testReord, data, newValue } = this.state;
    const { loading } = this.props;
    if (loading)
      return (
        <div className={styles.Position}>
          <Spin loading={loading} active size="large" />
        </div>
      );

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        key: 1,
        title: 'Position ID',
        dataIndex: 'PositionID',
        align: 'center',
      },
      {
        key: 2,
        title: 'Position name',
        dataIndex: 'PositionName',
        align: 'center',
      },
      {
        key: 3,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record) =>
          record.PositionID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue(newValue)} />
          ),
        align: 'center',
      },
    ];
    const add = {
      PositionID: '',
      PositionName: <Input onChange={this.handleChangeValue} value={newValue} />,
    };

    const renderAdd = [...data, add];

    return (
      <div className={styles.Position}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={renderAdd}
          size="small"
          pagination={false}
          rowKey="PositionID"
        />

        <Modal
          title={`Delete ${testReord.PositionName}? Are you sure?`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Position;
