import { Table } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage, history, connect } from 'umi';

import { setTenantCurrentCompany } from '@/utils/authority';

import styles from './index.less';

@connect()
class TableCompanies extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      visible: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setFirstPage();
    }
  }

  generateColumns = () => {
    const columns = [
      {
        title: formatMessage({ id: 'pages_admin.companies.table.companyID' }),
        dataIndex: 'code',
        key: 'code',
        // width: '15%',
        align: 'left',
        defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend', 'ascend'],
        // sorter: {
        //   compare: (a, b) => a.company.id - b.company.id,
        // },
        // render: (company) => <span>{company.id}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.companyName' }),
        dataIndex: 'name',
        align: 'left',
        // width: '10%',
      },
      {
        title: 'DBA',
        dataIndex: 'dba',
        align: 'left',
        // render: (company) => <span>{company.dba}</span>,
      },
      {
        title: 'EIN',
        dataIndex: 'ein',
        align: 'left',
        // render: (company) => <span>{company.ein}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.headQuarterAdd' }),
        dataIndex: 'headQuarterAddress',
        // width: '15%',
        align: 'left',
        render: (headQuarterAddress) => {
          const {
            addressLine1 = '',
            addressLine2 = '',
            state = '',
            country = {},
            zipCode = '',
          } = headQuarterAddress;
          return (
            <span>
              {addressLine1}
              {addressLine2 && ', '}
              {addressLine2}
              {state && ', '}
              {state}
              {country ? ', ' : ''}
              {country?.name || country || ''}
              {zipCode && ', '}
              {zipCode}
            </span>
          );
        },
      },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.workLocation' }),
        //   dataIndex: 'locations',
        //   key: 'locations',
        //   render: (locations) =>
        //     locations.map((location, index) => {
        //       return (
        //         <span key={`${index + 1}`}>
        //           {location.country}
        //           <br />
        //         </span>
        //       );
        //     }),
        align: 'left',
      },
      // {
      //   title: formatMessage({ id: 'pages_admin.companies.table.ownerEmail' }),
      //   // dataIndex: 'user',
      //   width: '15%',
      //   align: 'center',
      //   render: () => <span>test.name@terralogic.com</span>,
      // },
      // {
      //   title: formatMessage({ id: 'pages_admin.companies.table.ownerName' }),
      //   // dataIndex: 'user',
      //   align: 'center',
      //   render: () => <span>firstName lastName</span>,
      // },
      {
        title: formatMessage({ id: 'pages_admin.companies.table.license' }),
        // dataIndex: 'user',
        align: 'center',
        render: () => <span>v4.0</span>,
        // align: 'left',
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
    const { dispatch } = this.props;
    setTenantCurrentCompany(record.tenant);
    dispatch({
      type: 'companiesManagement/save',
      payload: {
        tenantCurrentCompany: record.tenant,
      },
    });
    history.push(`/companies-management/company-detail/${record._id}`);
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys, visible } = this.state;
    const rowSize = 10;
    const scroll = {
      // x: '100vw',
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
          size="middle"
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
          rowKey={(record) => record._id}
          // onChange={this.onSortChange}
        />
      </div>
    );
  }
}
export default TableCompanies;
