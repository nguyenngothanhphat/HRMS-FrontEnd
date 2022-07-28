import { CloseOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import FilterPopover from '@/components/FilterPopover';
import CustomSearchBox from '@/components/CustomSearchBox';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CommonTable from '../CommonTable';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const NewJoinees = (props) => {
  const {
    dispatch,
    loadingFetch = false,
    resourceManagement: { newJoineeList = [], selectedLocations = [], selectedDivisions = [] } = {},
  } = props;

  const [searchValue, setSearchValue] = useState('');
  const [applied, setApplied] = useState(0);
  const [form, setForm] = useState(null);
  const fetchData = (payloadParams) => {
    const payload = { ...payloadParams, selectedDivisions, selectedLocations };
    if (searchValue) {
      payload.searchValue = searchValue;
    }

    dispatch({
      type: 'resourceManagement/fetchNewJoineeList',
      payload: {
        ...payload,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [searchValue, JSON.stringify(selectedLocations), JSON.stringify(selectedDivisions)]);

  const generateColumns = () => {
    const columns = [
      {
        title: 'Candidate ID',
        dataIndex: 'ticketId',
        key: 'ticketId',
        width: '21%',
        render: (ticketId = '') => {
          return <span>{ticketId || '-'}</span>;
        },
      },
      {
        title: 'Name',
        dataIndex: 'candidateFullName',
        key: 'candidateFullName',
        width: '20%',
        render: (candidateFullName = '') => {
          return <div>{candidateFullName}</div>;
        },
      },
      {
        title: 'Job Title',
        dataIndex: 'title',
        key: 'title',
        render: ({ name } = {}) => <div>{name}</div>,
      },
      {
        title: 'Joining Date',
        dataIndex: 'joiningDate',
        key: 'joiningDate',
        render: (joiningDate) => (
          <span>{moment(joiningDate).locale('en').format(DATE_FORMAT_MDY)}</span>
        ),
      },
    ];

    return columns;
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onChangeSearch = (e) => {
    const formatValue = e.target.value.toLowerCase();
    onSearchDebounce(formatValue);
  };
  const clearTagFilter = () => {
    fetchData({});
    setApplied(0);
    form?.resetFields();
  };

  const renderOption = () => {
    return (
      <div className={styles.optionContainer}>
        <div>
          {applied > 0 && (
            <Tag
              className={styles.tagCountFilter}
              closable
              onClose={clearTagFilter}
              closeIcon={<CloseOutlined />}
            >
              {applied} filters applied
            </Tag>
          )}
        </div>
        <div className={styles.options}>
          <FilterPopover
            realTime
            content={
              <FilterContent setApplied={setApplied} setForm={setForm} onFilter={fetchData} />
            }
          >
            <CustomOrangeButton />
          </FilterPopover>
        </div>
        <CustomSearchBox placeholder="Search by Candidate ID, Name..." onSearch={onChangeSearch} />
      </div>
    );
  };

  return (
    <Card title="New Joinees" extra={renderOption()} className={styles.NewJoinees}>
      <div className={styles.tableContainer}>
        <CommonTable
          columns={generateColumns()}
          list={newJoineeList}
          loading={loadingFetch}
          scrollable
          // limit={5}
        />
      </div>
    </Card>
  );
};

export default connect(({ resourceManagement, loading }) => ({
  resourceManagement,
  loadingFetch: loading.effects['resourceManagement/fetchNewJoineeList'],
}))(NewJoinees);
