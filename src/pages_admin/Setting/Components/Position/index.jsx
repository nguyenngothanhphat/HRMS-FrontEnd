import { DeleteOutlined, PlusCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { Input, Select, Table, Row, Col, Pagination, InputNumber } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

const { confirm } = Modal;
@connect(
  ({
    loading,
    adminSetting: {
      tempData: { listTitle = [], totalTitle, department = [] } = {},
      countEmployee,
    } = {},
  }) => ({
    loading: loading.effects['adminSetting/fetchListTitle'],
    listTitle,
    totalTitle,
    department,
    countEmployee,
  }),
)
class Position extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // selectedRowKeys: [],
      visible: false,
      testRecord: {},
      newPosition: {
        name: '',
        grade: 1,
        department: '',
      },
      page: 1,
      limit: 10,
      // total: 0,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { page, limit } = this.state;
    dispatch({
      type: 'adminSetting/fetchListTitle',
      payload: { page, limit },
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, limit } = this.state;
    const { dispatch } = this.props;

    if (page !== prevState.page || limit !== prevState.limit)
      dispatch({
        type: 'adminSetting/fetchListTitle',
        payload: { page, limit },
      });
  }

  handleOk = async () => {
    const { testRecord, page, limit } = this.state;
    const { dispatch } = this.props;
    const { _id = '' } = testRecord;
    const statusCode = await dispatch({
      type: 'adminSetting/removeTitle',
      payload: {
        id: _id,
      },
    });
    if (statusCode === 200) {
      dispatch({
        type: 'adminSetting/fetchListTitle',
        payload: { page, limit },
      });
    }

    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  showPropsConfirm = () => {
    const { countEmployee } = this.props;
    confirm({
      title: 'Are you sure delete this Position?',
      icon: <ExclamationCircleOutlined />,
      content: `This position currently has ${countEmployee} employees`,
      okText: 'Yes',
      okType: 'danger',
      okButtonProps: {
        disabled: countEmployee === 0,
      },
      cancelText: 'No',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  handleClickDelete = async (text, record) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'adminSetting/countEmployeeInPosition',
      payload: { title: record._id },
    });

    this.setState({
      visible: true,
      testRecord: record,
    });
  };

  handleChangeValue = (value) => {
    const { newPosition } = this.state;
    this.setState({ newPosition: { ...newPosition, ...value } });
  };

  handleAddNewValue = async () => {
    const { newPosition, page, limit } = this.state;
    const { dispatch } = this.props;
    if (newPosition.name === '') return;
    const statusCode = await dispatch({
      type: 'adminSetting/addPosition',
      payload: newPosition,
    });
    if (statusCode === 200) {
      dispatch({
        type: 'adminSetting/fetchListTitle',
        payload: { page, limit },
      });
      this.setState({ newPosition: { name: '', grade: 1, department: '' } });
    }
  };

  render() {
    const { visible, testRecord, newPosition, page, limit } = this.state;
    const { loading, department: departmentList = [], totalTitle, listTitle } = this.props;

    const columns = [
      {
        key: 1,
        title: 'Position ID',
        dataIndex: 'titleId',
        align: 'left',
        width: '15%',
      },
      {
        key: 2,
        title: 'Position name',
        dataIndex: 'name',
        align: 'left',
        width: '30%',
      },
      {
        key: 3,
        title: 'Department Name',
        dataIndex: 'department',
        align: 'left',
        width: '30%',
        render: (_, record) => record.department.name,
      },
      {
        key: 4,
        title: 'Grade level',
        dataIndex: 'grade',
        align: 'center',
        width: '15%',
      },
      {
        key: 5,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record) =>
          record.titleId !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue()} />
          ),
        align: 'center',
      },
    ];
    const add = {
      titleId: '',
      name: (
        <>
          <Input
            disabled={!newPosition.department}
            placeholder="Position Name"
            onChange={(e) => this.handleChangeValue({ name: e.target.value })}
            value={newPosition.name}
          />
        </>
      ),
      grade: (
        <>
          <InputNumber
            disabled={!newPosition.department}
            placeholder="Grade level"
            onChange={(e) => this.handleChangeValue({ grade: e.target.value })}
            defaultValue={newPosition.grade}
          />
        </>
      ),
      department: {
        name: (
          <Select
            onChange={
              (value) =>
                this.handleChangeValue({
                  department: value,
                })
              // eslint-disable-next-line react/jsx-curly-newline
            }
            placeholder="Select department"
            defaultValue={newPosition.department}
          >
            {departmentList.map((d) => (
              <Select.Option value={d._id}>{d.name}</Select.Option>
            ))}
          </Select>
        ),
      },
    };

    const renderAdd = [...listTitle, add];

    return (
      <div className={styles.Position}>
        <Row>
          <Col span={24}>
            <Table
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={renderAdd}
              loading={loading}
              size="small"
              pagination={false}
              rowKey="PositionID"
            />
          </Col>
        </Row>
        <Row className={styles.pagination}>
          <Pagination
            size="small"
            total={totalTitle}
            defaultPageSize={limit}
            showSizeChanger
            pageSizeOptions={[10, 25, 50, 100]}
            current={page}
            showTotal={(totals, range) => `Showing ${range[0]}-${range[1]} of ${totals} `}
            onChange={(e) => this.setState({ page: e })}
            onShowSizeChange={(e) => this.setState({ limit: e })}
          />
        </Row>
        <Modal
          title={`Delete ${testRecord.PositionName}? Are you sure?`}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Position;
