import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Table, Popover } from 'antd';
import { formatMessage, history, connect } from 'umi';
import moment from 'moment';
import filterIcon from '@/assets/offboarding-filter.svg';
import closeIcon from '@/assets/closeIcon.svg';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import Filter from './Filter';

import styles from './index.less';
import { removeEmptyFields } from '@/utils/utils';

const NewJoinees = (props) => {
  const {
    loadingTable,
    listNewComer,
    totalComer,
    dispatch,
    companyLocationList,
    companiesOfUser,
    filterList,
    // filterJoining,
  } = props;
  const { listCountry = [] } = filterList;

  const [keySearch, setKeySearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [filter, setFilter] = useState({
    fromDate: '',
    toDate: '',
    fromYearOfExp: '',
    toYearOfExp: '',
    hrEmployee: [],
    hiringManager: [],
    title: [],
  });
  const [isSearch, setIsSearch] = useState(true);

  // const fetchListEmployee = () => {
  //   const currentCompany = getCurrentCompany();
  //   const currentLocation = getCurrentLocation();

  //   const companyPayload = companiesOfUser.filter((lo) => lo?._id === currentCompany);
  //   let locationPayload = [];

  //   if (!currentLocation) {
  //     locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
  //       let stateList = [];
  //       listCountry.forEach(
  //         ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
  //           if (countryItem1 === countryItem2) {
  //             stateList = [...stateList, stateItem2];
  //           }
  //         },
  //       );
  //       return {
  //         country: countryItem1,
  //         state: stateList,
  //       };
  //     });
  //   } else {
  //     const currentLocationObj = companyLocationList.find((loc) => loc?._id === currentLocation);
  //     const currentLocationCountry = currentLocationObj?.headQuarterAddress?.country?._id;
  //     const currentLocationState = currentLocationObj?.headQuarterAddress?.state;

  //     locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
  //       let stateList = [];
  //       listCountry.forEach(
  //         ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
  //           if (
  //             countryItem1 === countryItem2 &&
  //             currentLocationCountry === countryItem2 &&
  //             currentLocationState === stateItem2
  //           ) {
  //             stateList = [...stateList, stateItem2];
  //           }
  //         },
  //       );
  //       return {
  //         country: countryItem1,
  //         state: stateList,
  //       };
  //     });
  //   }
  //   dispatch({
  //     type: 'onboard/fetchEmployeeList',
  //     payload: {
  //       company: companyPayload,
  //       department: ['HR'],
  //       location: locationPayload,
  //     },
  //   });
  //   dispatch({
  //     type: 'onboard/fetchHRManagerList',
  //     payload: {
  //       company: companyPayload,
  //       department: ['HR'],
  //       roles: ['HR-MANAGER'],
  //       location: locationPayload,
  //     },
  //   });
  // };

  const fetchListEmployee = () => {
    const currentCompany = getCurrentCompany();
    const currentLocation = getCurrentLocation();

    const companyPayload = companiesOfUser.filter((lo) => lo?._id === currentCompany);
    let locationPayload = [];

    if (!currentLocation) {
      locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listCountry.forEach(
          ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
            if (countryItem1 === countryItem2) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      });
    } else {
      const currentLocationObj = companyLocationList.find((loc) => loc?._id === currentLocation);
      const currentLocationCountry = currentLocationObj?.headQuarterAddress?.country?._id;
      const currentLocationState = currentLocationObj?.headQuarterAddress?.state;

      locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listCountry.forEach(
          ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
            if (
              countryItem1 === countryItem2 &&
              currentLocationCountry === countryItem2 &&
              currentLocationState === stateItem2
            ) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      });
    }
    dispatch({
      type: 'onboard/fetchEmployeeList',
      payload: {
        company: companyPayload,
        department: ['HR'],
        location: locationPayload,
      },
    });
    dispatch({
      type: 'onboard/fetchHRManagerList',
      payload: {
        company: companyPayload,
        department: ['HR'],
        roles: ['HR-MANAGER'],
        location: locationPayload,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: 'onboard/fetchFilterList',
      payload: {
        tenantId: getCurrentTenant(),
        id: getCurrentCompany(),
      },
    });
    dispatch({
      type: 'onboard/fetchJobTitleList',
      payload: {},
    });
    fetchListEmployee();
  }, []);

  useEffect(() => {
    if (isSearch) {
      dispatch({
        type: 'onboard/getListNewComer',
        payload: {
          searchName: keySearch,
          ...removeEmptyFields(filter),
        },
      });
      setIsSearch(false);
    }
  }, [isSearch]);

  const onChangeKeySearch = (e) => {
    setKeySearch(e.target.value);
    setPage(1);
    setIsSearch(true);
  };
  const pagination = {
    position: ['bottomLeft'],
    total: totalComer,
    // eslint-disable-next-line no-nested-ternary
    showTotal: (totalData, range) => {
      return (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {' '}
            {range[0]} - {range[1]}{' '}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {totalData}{' '}
        </span>
      );
    },
    defaultPageSize: limit,
    showSizeChanger: true,
    pageSizeOptions: ['10', '25', '50', '100'],
    pageSize: limit,
    current: page,
    onChange: (currentPage, pageSize) => {
      setPage(currentPage);
      setLimit(pageSize);
    },
  };

  const columns = [
    {
      title: <div style={{ paddingLeft: '10px' }}> Candidate ID</div>,
      key: 'ticketID',
      dataIndex: 'candidate',
      width: 150,
      render: ({ ticketID } = {}) => (
        <span className={styles.blueText} style={{ paddingLeft: '10px' }}>
          #{ticketID}
        </span>
      ),
    },
    {
      title: 'Full Name',
      dataIndex: 'candidate',
      key: 'employee',
      width: 250,
      render: ({ firstName = '', middleName = '', lastName = '' } = {}) => {
        let fullName = firstName;
        if (middleName) fullName += ` ${middleName}`;
        if (lastName) fullName += ` ${lastName}`;

        return <div>{fullName}</div>;
      },
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      width: 200,
      render: (joiningDate) => <span>{moment(joiningDate).locale('en').format('DD-MM-YYYY')}</span>,
      align: 'left',
    },
    {
      title: 'Years of Exp',
      dataIndex: 'yearsOfExp',
      key: 'yearsOfExp',
      width: 100,
    },

    {
      title: 'Job Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      align: 'left',
      render: ({ name } = {}) => <div>{name}</div>,
    },
    {
      title: 'HR POC',
      key: 'hrEmployee',
      dataIndex: 'hrEmployee',
      width: 150,
      render: ({ generalInfoInfo: { legalName = '' } = {} } = {}) => (
        <span className={styles.blueText}>{legalName}</span>
      ),
    },
    {
      title: 'Hiring Manager',
      key: 'hrManager',
      dataIndex: 'hrManager',
      width: 150,
      render: ({ generalInfoInfo: { legalName = '' } = {} } = {}) => (
        <span className={styles.blueText}>{legalName}</span>
      ),
    },
  ];

  const renderTitle = () => {
    return (
      <div className={styles.title}>
        <div className={styles.title__text}>Filter</div>
        <img
          alt="close"
          src={closeIcon}
          onClick={() => {
            setVisiblePopover(false);
          }}
        />
      </div>
    );
  };

  const onApply = (res) => {
    setVisiblePopover(!visiblePopover);
    setFilter(res);
    setIsSearch(true);
  };

  return (
    <div className={styles.approvalPage}>
      <div className={styles.approvalPage__table}>
        <div className={styles.searchFilter}>
          <Popover
            content={<Filter onApply={onApply} />}
            title={renderTitle}
            trigger="click"
            placement="bottomRight"
            visible={visiblePopover}
            onVisibleChange={() => setVisiblePopover(!visiblePopover)}
            overlayClassName={styles.filterPopover}
          >
            <img src={filterIcon} alt="" className={styles.searchFilter__icon} />
          </Popover>
          <Input
            size="large"
            placeholder="Search by Name"
            onChange={onChangeKeySearch}
            prefix={<SearchOutlined />}
            value={keySearch}
            // onPressEnter={(e) => console.log('e', e.target.value)}
            className={styles.searchFilter__input}
          />
        </div>
        <div className={styles.table}>
          <Table
            columns={columns}
            dataSource={listNewComer}
            size="small"
            loading={loadingTable}
            pagination={pagination}
            onRow={(record) => {
              const { _id = '' } = record;
              return {
                onClick: () => {
                  dispatch({
                    type: 'onboard/saveJoiningFormalities',
                    payload: { itemNewComer: record },
                  });
                  history.push(`/onboarding/newJoinees/view-detail/${_id}`);
                }, // click row
              };
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default connect(
  ({
    loading,
    location: { companyLocationList = [] } = {},
    user: { currentUser = {}, companiesOfUser = [] },
    onboard: {
      hrList = [],
      filterList = {},
      joiningFormalities: { listNewComer = [], totalComer = 0 } = {},
    },
  }) => ({
    loadingTable: loading.effects['onboard/getListNewComer'],
    listNewComer,
    totalComer,
    currentUser,
    companyLocationList,
    companiesOfUser,
    filterList,
    hrList,
  }),
)(NewJoinees);
