import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, history } from 'umi';
import ModalConfirmRemove from '../ModalConfirmRemove';
import styles from './index.less';

class TableCompanies extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      visible: false,
    };
  }

  generateColumns = () => {
    const columns = [
      {
        title: formatMessage({ id: 'pages_admin.companies.table.companyID' }),
        dataIndex: 'company',
        key: 'company',
        width: '10%',
        align: 'left',
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: {
          compare: (a, b) => a.company.id - b.company.id,
        },
        render: (company) => <span>{company.id}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.companyName' }),
        dataIndex: 'company',
        align: 'left',
        width: '10%',
        render: (company) => <span>{company.name}</span>,
      },
      {
        title: 'DBA',
        dataIndex: 'company',
        align: 'left',
        render: (company) => <span>{company.dba}</span>,
      },
      {
        title: 'EIN',
        dataIndex: 'company',
        align: 'left',
        render: (company) => <span>{company.ein}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.headQuarterAdd' }),
        dataIndex: 'company',
        width: '15%',
        align: 'left',
        render: (company) => <span>{company.headQuarterAddress.country}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.workLocation' }),
        dataIndex: 'locations',
        key: 'locations',
        render: (locations) =>
          locations.map((location, index) => {
            return (
              <span key={`${index + 1}`}>
                {location.country}
                <br />
              </span>
            );
          }),
        align: 'left',
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.ownerEmail' }),
        dataIndex: 'user',
        width: '15%',
        align: 'center',
        render: (user) => <span>{user.email}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.ownerName' }),
        dataIndex: 'user',
        align: 'center',
        render: (user) => <span>{user.firstName}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.license' }),
        dataIndex: 'user',
        align: 'center',
        render: (user) => <span>{user.firstName}</span>,
        // align: 'left',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: '5%',
        align: 'center',
        render: () => (
          <div className={styles.employeesAction}>
            <img
              src="assets/images/remove.svg"
              alt="removeIcon"
              onClick={(e) => this.deleteEmployee(e)}
              width="15px"
            />
          </div>
        ),
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  deleteEmployee = (e) => {
    e.stopPropagation();
    this.openModal();
  };

  editUser = (key, e) => {
    e.preventDefault();
    alert('EDIT USER', key);
  };

  // pagination
  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  // onSortChange = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  // };

  onSelectChange = (selectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  handleCompanyDetail = (record) => {
    history.push(`/companies/company-detail/${record.company.id}`);
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys, visible } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '100vw',
      y: 'max-content',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.tableEmployees}>
        <Table
          size="small"
          loading={loading}
          onRow={(record) => {
            return {
              onClick: () => this.handleCompanyDetail(record), // click row
            };
          }}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.generateColumns()}
          dataSource={data}
          scroll={scroll}
          rowKey={(record) => record.company.id}
          // onChange={this.onSortChange}
        />
        <ModalConfirmRemove
          titleModal="Confirm Remove Employee"
          visible={visible}
          handleCancel={this.handleCancel}
          getResponse={this.getResponse}
        />
      </div>
    );
  }
}
export default TableCompanies;
