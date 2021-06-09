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
      name: '',
      phone: '',
      headQuarterAddress: '',
      headQuarterState: '',
      headQuarterZipCode: '',
      legalAddress: '',
      legalState: '',
      legalZipCode: '',
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
        company: {
          name: Company,
          headQuarterAddress: {
            address: headQuarterAddress,
            state: headQuarterState,
            zipCode: headQuarterZipCode,
          },
          legalAddress: { address: legalAddress, state: legalState, zipCode: legalZipCode },
        },
        phone: Phone,
      } = item;
      return {
        LocationID,
        Name,
        Country,
        Company,
        Phone,
        headQuarterAddress,
        headQuarterState,
        headQuarterZipCode,
        legalAddress,
        legalState,
        legalZipCode,
      };
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
    // if (conditionValues === 'address') {
    //   const { value } = e.target;
    //   this.setState({ address: value });
    // }
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

  handleAddNewValue = (country) => {
    const { data } = this.state;
    const addData = {
      LocationID: this.handleRandomNumberID(),
      Country: country,
    };
    const newData = [...data, addData];
    this.setState({ data: newData, country: '' });
  };

  render() {
    const { Option } = Select;
    const { listCountry, location } = this.props;
    const {
      selectedRowKeys,
      visible,
      testReord,
      data,
      country,
      getIndex,
      name,
      phone,
      headQuarterAddress,
      headQuarterState,
      headQuarterZipCode,
      legalAddress,
      legalState,
      legalZipCode,
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
        title: 'Headquarter Address',
        dataIndex: 'headQuarterAddress',
        align: 'center',
      },
      {
        key: 7,
        title: 'Headquarter Country',
        dataIndex: 'headQuarterCountry',
        align: 'center',
      },
      {
        key: 8,
        title: 'Headquarter State',
        dataIndex: 'headQuarterState',
        align: 'center',
      },
      {
        key: 9,
        title: 'Headquarter ZipCode',
        dataIndex: 'headQuarterZipCode',
        align: 'center',
      },
      {
        key: 10,
        title: 'Legal Address',
        dataIndex: 'legalAddress',
        align: 'center',
      },
      {
        key: 11,
        title: 'Legal Country',
        dataIndex: 'legalCountry',
        align: 'center',
      },
      {
        key: 12,
        title: 'Legal State',
        dataIndex: 'legalState',
        align: 'center',
      },
      {
        key: 13,
        title: 'Legal ZipCode',
        dataIndex: 'legalZipCode',
        align: 'center',
      },
      {
        key: 19,
        title: 'Action',
        dataIndex: 'Action',
        render: (text, record, index) =>
          record.LocationID !== '' ? (
            <DeleteOutlined onClick={() => this.handleClickDelete(text, record, index)} />
          ) : (
            <PlusCircleFilled onClick={() => this.handleAddNewValue(country)} />
          ),
        align: 'center',
      },
    ];
    const getListCompany = location.map((item) => {
      const {
        company: { _id: id, name: nameCompany },
      } = item;
      return { id, nameCompany };
    });
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
      Company: (
        <Select
          style={{ width: 150 }}
          onChange={(value) => this.handleChangeValue(value, 'company')}
        >
          {getListCompany.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.nameCompany}
            </Option>
          ))}
        </Select>
      ),
      Phone: <Input onChange={(e) => this.handleChangeValue(e, 'phone')} value={phone} />,
      headQuarterAddress: (
        <Input
          onChange={(e) => this.handleChangeValue(e, 'headQuarterAddress')}
          value={headQuarterAddress}
        />
      ),
      headQuarterState: (
        <Input
          onChange={(e) => this.handleChangeValue(e, 'headQuarterState')}
          value={headQuarterState}
        />
      ),
      headQuarterZipCode: (
        <Input
          onChange={(e) => this.handleChangeValue(e, 'headQuarterZipCode')}
          value={headQuarterZipCode}
        />
      ),
      legalAddress: (
        <Input onChange={(e) => this.handleChangeValue(e, 'legalAddress')} value={legalAddress} />
      ),
      legalState: (
        <Input onChange={(e) => this.handleChangeValue(e, 'legalState')} value={legalState} />
      ),
      legalZipCode: (
        <Input onChange={(e) => this.handleChangeValue(e, 'legalZipCode')} value={legalZipCode} />
      ),
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
          scroll={{ x: 2300 }}
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
