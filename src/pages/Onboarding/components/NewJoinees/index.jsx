import { Card } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';
import UserProfilePopover from '@/components/UserProfilePopover';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { removeEmptyFields } from '@/utils/utils';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const NewJoinees = (props) => {
  const { loadingTable, listNewComer, dispatch } = props;

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
      render: ({ ticketID } = {}, record) => (
        <span
          className={styles.blueText}
          style={{ paddingLeft: '10px', cursor: 'pointer' }}
          onClick={() => {
            dispatch({
              type: 'onboarding/saveJoiningFormalities',
              payload: { itemNewComer: record },
            });
            history.push(`/onboarding/new-joinees/view-detail/${record?.candidate?._id}`);
          }}
        >
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
        const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
        return <div>{fullName}</div>;
      },
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      width: 200,
      render: (joiningDate) => (
        <span>{moment(joiningDate).locale('en').format(DATE_FORMAT_MDY)}</span>
      ),
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
      render: (hrEmployee = {}) => (
        <UserProfilePopover data={{ ...hrEmployee, ...hrEmployee.generalInfoInfo }}>
          <span className={styles.blueText}>{hrEmployee?.generalInfoInfo?.legalName}</span>
        </UserProfilePopover>
      ),
    },
    {
      title: 'Hiring Manager',
      key: 'hrManager',
      dataIndex: 'hrManager',
      width: 150,
      render: (hrManager = {}) => (
        <UserProfilePopover data={{ ...hrManager, ...hrManager.generalInfoInfo }}>
          <span className={styles.blueText}>{hrManager?.generalInfoInfo?.legalName}</span>
        </UserProfilePopover>
      ),
    },
  ];

  const onApply = (res) => {
    setFilter(res);
    setIsSearch(true);
  };

  const options = () => {
    return (
      <div className={styles.options}>
        <FilterPopover content={<FilterContent onApply={onApply} />} placement="bottomRight">
          <CustomOrangeButton>Filter</CustomOrangeButton>
        </FilterPopover>
        <CustomSearchBox onChange={onChangeKeySearch} placeholder="Search by Name" />
      </div>
    );
  };

  return (
    <div className={styles.NewJoinees}>
      <Card title="New Joinees" extra={options()}>
        <div className={styles.container}>
          <CommonTable columns={columns} list={listNewComer} loading={loadingTable} />
        </div>
      </Card>
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
