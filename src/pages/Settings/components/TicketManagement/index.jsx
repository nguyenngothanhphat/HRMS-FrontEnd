import { Button, Popconfirm, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import DownArrowIcon from '@/assets/adminSetting/downArrow.png';
import EditIcon from '@/assets/adminSetting/edit.svg';
import CommonTable from '../CommonTable';
import EditModal from './components/EditModal';
import styles from './index.less';

const { Option } = Select;

const TicketManagement = (props) => {
  const {
    adminSetting: { settingTicketList = [] } = {},
    dispatch,
    companyLocationList = [],
    loadingFetchSettingTicketList = false,
    loadingRemove = false,
    totalTitle = 0,
  } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSettingTicketID, setSelectedSettingTicketID] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedCountry, setSelectedCountry] = useState('');

  const fetchSettingTicketList = () => {
    if (selectedCountry) {
      dispatch({
        type: 'adminSetting/fetchSettingTicketList',
        payload: { page, limit, country: selectedCountry },
      });
    }
  };

  useEffect(() => {
    fetchSettingTicketList();
  }, [page, limit, selectedCountry]);

  useEffect(() => {
    if (companyLocationList.length > 0) {
      setSelectedCountry(companyLocationList[0].headQuarterAddress?.country?._id);
    }
  }, [JSON.stringify(companyLocationList)]);

  const handleIsModalVisible = (value) => {
    setIsModalVisible(value);
  };

  const onEdit = (row) => {
    setIsModalVisible(true);
    setSelectedSettingTicketID(row._id);
  };

  const onRemoveSupportTeam = async (row) => {
    const res = await dispatch({
      type: 'adminSetting/removeSettingTicket',
      payload: {
        _id: row._id,
        status: 'INACTIVE',
      },
    });
    if (res.statusCode === 200) {
      fetchSettingTicketList();
    }
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Support Team',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
      },
      {
        title: 'Query Type',
        dataIndex: 'queryType',
        width: '45%',
        key: 'queryType',
        render: (queryType = []) => {
          return (
            <div>
              {queryType.map((type) => (
                <span className={styles.queryTypeTag}>{type.name}</span>
              ))}
            </div>
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: '15%',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <Popconfirm title="Sure to remove?" onConfirm={() => onRemoveSupportTeam(row)}>
                <img src={DeleteIcon} alt="" />
              </Popconfirm>
              <img src={EditIcon} onClick={() => onEdit(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  const renderCountry = () => {
    let countryArr = [];
    if (companyLocationList.length > 0) {
      countryArr = companyLocationList.map((item) => {
        return item.headQuarterAddress?.country;
      });
    }
    const newArr = removeDuplicate(countryArr, (item) => item?._id);

    const getFlag = (id) => {
      const flag = newArr.find((x) => x._id === id)?.flag;

      return (
        <div
          style={{
            maxWidth: '16px',
            height: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '12px',
          }}
        >
          <img
            src={flag}
            alt="flag"
            style={{
              width: '100%',
              borderRadius: '50%',
              height: '100%',
            }}
          />
        </div>
      );
    };
    return (
      <>
        {newArr.map((item) => (
          <Option key={item?._id} value={item?._id} className={styles.optionCountry}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {getFlag(item?._id)}
              <span style={{ fontSize: '12px', fontWeight: '500', color: '#2C6DF9' }}>
                {item?.name}
              </span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  const renderCountrySelectBox = () => {
    return (
      <Select
        size="large"
        showArrow
        filterOption={(input, option) => {
          return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
        className={styles.countrySelectBox}
        suffixIcon={<img src={DownArrowIcon} alt="" />}
        value={selectedCountry}
        onChange={(val) => setSelectedCountry(val)}
      >
        {renderCountry()}
      </Select>
    );
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <span className={styles.title}>Ticket Management</span>
        <div className={styles.options}>
          {renderCountrySelectBox()}
          <Button onClick={() => handleIsModalVisible(true)}>Add New</Button>
        </div>
      </div>
    );
  };

  const onChangePage = (pageTemp, limitTemp) => {
    setPage(pageTemp);
    setLimit(limitTemp);
  };

  return (
    <div
      className={styles.TicketManagement}
      style={settingTicketList.length === 0 ? {} : { paddingBottom: '0' }}
    >
      {renderHeader()}
      <CommonTable
        columns={generateColumns()}
        list={settingTicketList}
        isBackendPaging
        page={page}
        limit={limit}
        total={totalTitle}
        onChangePage={onChangePage}
        loading={loadingFetchSettingTicketList || loadingRemove}
      />
      <EditModal
        visible={isModalVisible}
        onClose={() => {
          handleIsModalVisible(false);
          setSelectedSettingTicketID('');
        }}
        onRefresh={() => fetchSettingTicketList()}
        selectedSettingTicketID={selectedSettingTicketID}
        action={selectedSettingTicketID ? 'edit' : 'add'}
        country={selectedCountry}
      />
    </div>
  );
};
export default connect(({ loading, location: { companyLocationList = [] }, adminSetting }) => ({
  adminSetting,
  companyLocationList,
  loadingFetchSettingTicketList: loading.effects['adminSetting/fetchSettingTicketList'],
  loadingRemove: loading.effects['adminSetting/removeSettingTicket'],
}))(TicketManagement);
