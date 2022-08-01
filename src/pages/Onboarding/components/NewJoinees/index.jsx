import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import { removeEmptyFields } from '@/utils/utils';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const NewJoinees = (props) => {
  const {
    loadingTable,
    listNewComer,
    dispatch,
    companyLocationList,
    companiesOfUser,
    filterList,
    // filterJoining,
  } = props;
  const { listCountry = [] } = filterList;

  const [keySearch, setKeySearch] = useState('');
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
      type: 'onboarding/fetchEmployeeList',
      payload: {
        company: companyPayload,
        department: ['HR'],
        location: locationPayload,
      },
    });
    dispatch({
      type: 'onboarding/fetchHRManagerList',
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
      type: 'onboarding/fetchFilterList',
      payload: {
        tenantId: getCurrentTenant(),
        id: getCurrentCompany(),
      },
    });
    dispatch({
      type: 'onboarding/fetchJobTitleList',
      payload: {},
    });
    fetchListEmployee();
  }, []);

  useEffect(() => {
    if (isSearch) {
      dispatch({
        type: 'onboarding/getListNewComer',
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
    setIsSearch(true);
  };

  const columns = [
    {
      title: <div style={{ paddingLeft: '10px' }}>Candidate ID</div>,
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

  const onApply = (res) => {
    setFilter(res);
    setIsSearch(true);
  };

  return (
    <div className={styles.approvalPage}>
      <div className={styles.approvalPage__table}>
        <div className={styles.searchFilter}>
          <FilterPopover content={<FilterContent onApply={onApply} />} placement="bottomRight">
            <CustomOrangeButton>Filter</CustomOrangeButton>
          </FilterPopover>
          <CustomSearchBox onChange={onChangeKeySearch} placeholder="Search by Name" />
        </div>
        <div className={styles.table}>
          <CommonTable
            columns={columns}
            list={listNewComer}
            loading={loadingTable}
            onRow={(record) => {
              const { _id = '' } = record;
              return {
                onClick: () => {
                  dispatch({
                    type: 'onboarding/saveJoiningFormalities',
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
    onboarding: {
      hrList = [],
      filterList = {},
      joiningFormalities: { listNewComer = [], totalComer = 0 } = {},
    },
  }) => ({
    loadingTable: loading.effects['onboarding/getListNewComer'],
    listNewComer,
    totalComer,
    currentUser,
    companyLocationList,
    companiesOfUser,
    filterList,
    hrList,
  }),
)(NewJoinees);
