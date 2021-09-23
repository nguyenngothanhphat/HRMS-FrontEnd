import React, { useState, useEffect } from 'react';
import { Select, Table } from 'antd';
import { connect } from 'umi';
import { uniqBy, filter, trimStart, trim } from 'lodash';
import ImportIcon from './images/import.svg';
import EditIcon from './images/edit.svg';
import EditSalaryID from './component/EditSalaryID';
import EditSalaryVN from './component/EditSalaryVN';
import ImportSalary from './component/ImportSalary';

import styles from './index.less';

const { Option } = Select;

const SalaryStructure = (props) => {
  const { locationList, listSalary, dispatch, loadingSalaryTable } = props;
  const [listLocation, setListLocation] = useState([]);
  const [listCountry, setListCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const [openModal, setOpenModal] = useState('');
  const [salaryId, setSalaryId] = useState('');
  const [rowSelected, setRowSelected] = useState({});

  useEffect(() => {
    dispatch({
      type: 'employeeSetting/fetchLocationList',
    });
  }, []);

  const getListLocation = (countryId) => {
    const arrLocation = filter(
      locationList,
      (item) => item.headQuarterAddress.country._id === countryId,
    );
    setListLocation(arrLocation);
    setSelectedLocation(arrLocation[0]._id);
    dispatch({
      type: 'employeeSetting/fetchListSalaryByLocation',
      payload: {
        location: arrLocation[0]._id,
      },
    });
  };

  useEffect(() => {
    if (locationList.length) {
      const arrCountry = uniqBy(
        locationList.map((item) => item.headQuarterAddress.country),
        '_id',
      );
      setListCountry(arrCountry);
      setSelectedCountry(arrCountry[0]._id);
      getListLocation(arrCountry[0]._id);
    }
  }, [locationList]);

  const onChangeCountry = (countryId) => {
    setSelectedCountry(countryId);
    getListLocation(countryId);
  };

  const onChangeLocation = (value) => {
    setSelectedLocation(value);
    dispatch({
      type: 'employeeSetting/fetchListSalaryByLocation',
      payload: {
        location: value,
      },
    });
  };

  const onClickImport = (record) => {
    setOpenModal('import');
    setRowSelected(record);
  };
  const onClickEdit = (id) => {
    if (selectedCountry === 'VN') setOpenModal('editVN');
    else setOpenModal('edit');
    setSalaryId(id);
  };
  const onCancel = () => {
    setOpenModal('');
    setSalaryId('');
    setRowSelected({});
  };
  const onSubmitUpdate = async (value) => {
    const responsive = await dispatch({
      type: 'employeeSetting/updateSalary',
      payload: value,
    });
    if (responsive.statusCode === 200) onChangeLocation(selectedLocation);
    onCancel();
  };
  const onSubmitImport = async (data) => {
    const responsive = await dispatch({
      type: 'employeeSetting/importSalary',
      payload: data,
    });
    if (responsive.statusCode === 200) onChangeLocation(selectedLocation);
    onCancel();
  };
  const formatNumber = (value) => {
    // const temp = toString(value);
    const list = trim(value).split('.');
    let num = list[0] === '0' ? list[0] : trimStart(list[0], '0');
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    list[0] = result;
    return list.join('.');
  };
  const renderValue = (obj) => {
    let prefix = '';
    switch (selectedCountry) {
      case 'VN':
        prefix = '₫';
        break;
      case 'IN':
        prefix = '₹';
        break;
      default:
        prefix = '$';
        break;
    }
    if (obj) {
      if (obj.minimum && obj.maximum)
        return `${prefix} ${formatNumber(obj.minimum)} - ${prefix} ${formatNumber(obj.maximum)}`;
      return (obj.minimum && `${prefix} ${formatNumber(obj.minimum)}`) || '0';
    }
    return '0';
  };
  const renderSingle = (value) => {
    let prefix = '';
    switch (selectedCountry) {
      case 'VN':
        prefix = '₫';
        break;
      case 'IN':
        prefix = '₹';
        break;
      default:
        prefix = '$';
        break;
    }
    if (value) return `${prefix} ${formatNumber(value)}`;
    return '0';
  };
  const columnsIndia = [
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      align: 'center',
      render: ({ name = '' } = {}) => <div>{name}</div>,
    },
    {
      title: 'Base Salary Range',
      dataIndex: 'base_salary',
      key: 'base_salary',
      align: 'center',
      render: (value) => <div>{renderValue(value)}</div>,
    },
    {
      title: 'Allowances Range',
      dataIndex: 'allowances_range',
      align: 'center',
      key: 'allowances_range',
      render: (value) => <div>{renderValue(value)}</div>,
    },
    {
      title: 'Variable Pay Target %',
      dataIndex: 'variable_pay_target',
      key: 'variable_pay_target',
      align: 'center',
      render: (value) => <div>{value || 0}%</div>,
    },
    {
      title: 'Total Compensation Range',
      dataIndex: 'total_compensation',
      key: 'total_compensation',
      align: 'center',
      render: (value) => <div>{renderValue(value)}</div>,
    },
    {
      title: 'Action',
      dataIndex: '_id',
      align: 'center',
      key: 'action',
      render: (id, record) => (
        <div className={styles.actionsButton}>
          <img src={ImportIcon} onClick={() => onClickImport(record)} alt="import" />
          <img src={EditIcon} onClick={() => onClickEdit(id)} alt="edit" />
        </div>
      ),
    },
  ];

  const getValueByKey = (settings, key) => {
    const result = filter(settings, (item) => item.key === key);
    return (result && result[0] && result[0].value) || 0;
  };
  const columnsVN = [
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      align: 'center',
      fixed: 'left',
      width: '10%',
      render: ({ name = '' } = {}) => <div>{name}</div>,
    },
    {
      title: 'Base Salary Range',
      dataIndex: 'base_salary',
      key: 'base_salary',
      align: 'center',
      width: '30%',
      render: (value) => <div>{renderValue(value)}</div>,
    },
    {
      title: 'Variable Pay Target %',
      dataIndex: 'variable_pay_target',
      key: 'variable_pay_target',
      align: 'center',
      width: '23%',

      render: (value) => <div>{value || 0}%</div>,
    },
    {
      title: '13th Month salary',
      dataIndex: 'salary_13th',
      key: 'salary_13th',
      align: 'center',
      width: '20%',

      render: (value) => <div>{value ? 'Eligible' : 'Not eligible'}</div>,
    },

    {
      title: 'Total Compensation Range',
      dataIndex: 'total_compensation',
      key: 'total_compensation',
      align: 'center',
      width: '27%',

      render: (value) => <div>{renderValue(value)}</div>,
    },
    {
      title: 'Lunch Allowance',
      dataIndex: 'settings',
      align: 'center',
      key: 'allowances_lunch',
      width: '20%',
      render: (settings) => {
        const lunch = getValueByKey(settings, 'lunch_allowance');
        return <div>{renderSingle(lunch)}</div>;
      },
    },
    {
      title: 'Petrol Allowance',
      dataIndex: 'settings',
      align: 'center',
      key: 'allowances_range',
      width: '20%',
      render: (settings) => {
        const petrol = getValueByKey(settings, 'petrol_allowance');
        return <div>{renderSingle(petrol)}</div>;
      },
    },
    {
      title: 'Mob & Internet Allowance',
      dataIndex: 'settings',
      align: 'center',
      key: 'allowances_range',
      width: '30%',
      render: (settings) => {
        const mobileInternet = getValueByKey(settings, 'mobile_internet_allowance');
        return <div>{renderSingle(mobileInternet)}</div>;
      },
    },
    {
      title: 'Action',
      dataIndex: '_id',
      align: 'center',
      key: 'action',
      fixed: 'right',
      width: '20%',

      render: (id, record) => (
        <div className={styles.actionsButton}>
          <img src={ImportIcon} onClick={() => onClickImport(record)} alt="import" />
          <img src={EditIcon} onClick={() => onClickEdit(id)} alt="edit" />
        </div>
      ),
    },
  ];
  return (
    <div className={styles.salaryStructure}>
      <div className={styles.header}>
        <div className={styles.header__title}>Salary Structure</div>
        <div className={styles.header__description}>
          Set salary structure based on the location and grade of the employee
        </div>
      </div>
      <div className={styles.selectOption}>
        <div className={styles.selectGroup}>
          <div className={styles.selectGroup__label}>Country</div>
          <div className={styles.selectGroup__select}>
            <Select
              showSearch
              showArrow
              // loading={loadingFetchCountry}
              value={selectedCountry}
              // placeholder="Select location"
              onChange={onChangeCountry}
              filterOption={(input, option) => {
                return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {listCountry.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className={styles.selectGroup}>
          <div className={styles.selectGroup__label}>Location</div>
          <div className={styles.selectGroup__select}>
            <Select
              showSearch
              showArrow
              // loading={loadingFetchCountry}
              value={selectedLocation}
              // placeholder="Select location"
              onChange={onChangeLocation}
              filterOption={(input, option) => {
                return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
            >
              {listLocation.map((item) => (
                <Option key={item._id} value={item._id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className={styles.tableSalary}>
        {selectedCountry === 'VN' ? (
          <Table
            dataSource={listSalary}
            columns={columnsVN}
            pagination={false}
            loading={loadingSalaryTable}
            size="small"
            scroll={{ x: 1500 }}
          />
        ) : (
          <Table
            dataSource={listSalary}
            columns={columnsIndia}
            pagination={false}
            loading={loadingSalaryTable}
            size="small"
          />
        )}
      </div>
      <EditSalaryVN
        visible={openModal === 'editVN'}
        onCancel={onCancel}
        onOk={onSubmitUpdate}
        salaryId={salaryId}
      />
      <EditSalaryID
        visible={openModal === 'edit'}
        onCancel={onCancel}
        onOk={onSubmitUpdate}
        salaryId={salaryId}
      />
      <ImportSalary
        visible={openModal === 'import'}
        onCancel={onCancel}
        onOk={onSubmitImport}
        salaryData={rowSelected}
        listLocation={listLocation}
        listCountry={listCountry}
      />
    </div>
  );
};

export default connect(({ loading, employeeSetting: { locationList, listSalary = [] } = {} }) => ({
  loadingSalaryTable: loading.effects['employeeSetting/fetchListSalaryByLocation'],
  locationList,
  listSalary,
}))(SalaryStructure);
