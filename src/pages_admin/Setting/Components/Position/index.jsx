import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { connect } from 'umi';
import { Input, Select, Spin, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

@connect(
  ({ loading, adminSetting: { tempData: { listTitle = [], department = [] } = {} } = {} }) => ({
    loading: loading.effects['adminSetting/fetchListTitle'],
    listTitle,
    department,
  }),
)
class Position extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
      data: [],
      newValue: '',
      department: '',
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

  handleAddNewValue = () => {
    const { department, newValue } = this.state;
    const { dispatch } = this.props;
    if (newValue === '') return;
    dispatch({
      type: 'adminSetting/addPosition',
      payload: { name: newValue, department },
    });
    this.setState({ newValue: '' });
  };

  render() {
    const { selectedRowKeys, visible, testReord, data, newValue, department } = this.state;
    const { loading, department: departmentList = [] } = this.props;
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
            <PlusCircleFilled onClick={() => this.handleAddNewValue()} />
          ),
        align: 'center',
      },
    ];
    const add = {
      PositionID: '',
      PositionName: (
        <>
          <Select
            onChange={(value) => {
              this.setState({ department: value });
            }}
            placeholder="Select department"
          >
            {departmentList.map((d) => (
              <Select.Option value={d._id}>{d.name}</Select.Option>
            ))}
          </Select>
          <Input
            disabled={!department}
            placeholder="Position Name"
            onChange={this.handleChangeValue}
            value={newValue}
          />
        </>
      ),
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
