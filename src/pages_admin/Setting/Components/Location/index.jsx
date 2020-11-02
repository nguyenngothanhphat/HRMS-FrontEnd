import { DeleteOutlined, PlusCircleFilled } from '@ant-design/icons';
import { connect } from 'umi';
import { Input, Select, Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { PureComponent } from 'react';
import styles from './index.less';

@connect(
  ({
    employee: { location = [] } = {},
    country: { listCountry = [] } = {},
    companiesManagement: { companiesList = [] } = {},
  }) => ({
    location,
    listCountry,
    companiesList,
  }),
)
class Location extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      visible: false,
      testReord: {},
      data: [],
      country: '',
      address: '',
      name: '',
      phone: '',
      getIndex: '',
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const formatData = location.map((item) => {
      const {
        _id: LocationID,
        name: Name,
        country: { name: Country },
        company: { name: Company },
        phone: Phone,
      } = item;
      return { LocationID, Name, Country, Company, Phone };
    });
    this.setState({ data: formatData });
  }

  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys', selectedRowKeys, 'selectedRows', selectedRows);
    this.setState({ selectedRowKeys });
  };

  handleOk = (e, getIndex) => {
    const { data } = this.state;
    data.splice(getIndex, 1);
    this.setState({
      visible: false,
      data,
    });
  };

  handleCancel = () => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleClickDelete = (text, record, index) => {
    // console.log('click', 'text: ', text, 'record: ', record, 'index: ', index);
    this.setState({
      visible: true,
      testReord: record,
      getIndex: index,
    });
  };

  handleChangeValue = (e, conditionValues) => {
    if (conditionValues === 'country') {
      this.setState({ country: e });
    }
    if (conditionValues === 'name') {
      const { value } = e.target;
      this.setState({ country: value });
    }
    if (conditionValues === 'address') {
      const { value } = e.target;
      this.setState({ address: value });
    }
  };

  handleRandomNumberID = () => {
    const min = 1;
    const max = 100;
    const randomNumber = min + Math.trunc(Math.random() * (max - min));
    if (randomNumber === min + Math.trunc(Math.random() * (max - min))) {
      const randomAgainst = min + Math.trunc(Math.random() * (max - min));
      return randomAgainst;
    }
    return randomNumber;
  };

  handleAddNewValue = (country, address) => {
    const { data } = this.state;
    const addData = {
      LocationID: this.handleRandomNumberID(),
      Country: country,
      Address: address,
    };
    const newData = [...data, addData];
    this.setState({ data: newData, country: '', address: '' });
  };

  render() {
    const { Option } = Select;
    const { listCountry } = this.props;
    const {
      selectedRowKeys,
      visible,
      testReord,
      data,
      country,
      address,
      getIndex,
      name,
      phone,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        key: 1,
        title: 'Location ID',
        dataIndex: 'LocationID',
        align: 'center',
      },
      {
        key: 2,
        title: 'Name',
        dataIndex: 'Name',
        align: 'center',
      },
      {
        key: 3,
        title: 'Country',
        dataIndex: 'Country',
        align: 'center',
      },
      {
        key: 4,
        title: 'Company',
        dataIndex: 'Company',
        align: 'center',
      },
      {
        key: 5,
        title: 'Phone',
        dataIndex: 'Phone',
        align: 'center',
      },
      {
        key: 6,
        title: 'Address',
        dataIndex: 'Address',
        align: 'center',
      },
      {
        key: 3,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record, index) =>
          record.LocationID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record, index)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue(country, address)} />
          ),
        align: 'center',
      },
    ];
    const formatListCountry = listCountry.map((item) => {
      const { _id: id, name: nameCountry } = item;
      return { id, nameCountry };
    });
    const add = {
      LocationID: '',
      Name: <Input onChange={(e) => this.handleChangeValue(e, 'name')} value={name} />,
      Country: (
        <Select
          style={{ width: 150 }}
          onChange={(value) => this.handleChangeValue(value, 'country')}
        >
          {formatListCountry.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.nameCountry}
            </Option>
          ))}
        </Select>
      ),
      Phone: <Input onChange={(e) => this.handleChangeValue(e, 'phone')} value={phone} />,
      Address: <Input onChange={(e) => this.handleChangeValue(e, 'address')} value={address} />,
    };
    const renderAdd = [...data, add];

    return (
      <div className={styles.Location}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={renderAdd}
          size="small"
          pagination={false}
          rowKey="LocationID"
          scroll={{ x: 1300 }}
        />

        <Modal
          title={`Delete ${testReord.Country}? Are you sure?`}
          visible={visible}
          onOk={(e) => this.handleOk(e, getIndex)}
          onCancel={this.handleCancel}
        />
      </div>
    );
  }
}

export default Location;
