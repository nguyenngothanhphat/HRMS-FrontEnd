import { Card, Form, DatePicker, Popconfirm } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import EditIcon from '@/assets/projectManagement/edit2.svg';
import CancelXIcon from '@/assets/projectManagement/cancelX.svg';
import ApproveCheckIcon from '@/assets/projectManagement/approveCheck.svg';
import CommonTable from '../../../CommonTable';
import FilterButton from '../../../FilterButton';
import FilterPopover from '../../../FilterPopover';
import OrangeAddButton from '../../../OrangeAddButton';
import SearchBar from '../../../SearchBar';
import AddResourcesModal from '../AddResourcesModal';
import FilterResourcesContent from './components/FilterResourcesContent';
import { DATE_FORMAT_LIST } from '@/utils/projectManagement';
import styles from './index.less';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <DatePicker format={DATE_FORMAT_LIST} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ResourcesCard = (props) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [addResourceModalVisible, setAddResourceModalVisible] = useState('');

  const {
    dispatch,
    projectDetails: {
      projectDetail: { id = '' } = {},
      projectResourceList = [],
      projectResourceListTotal: total = '',
    } = {},
    loadingFetchList = false,
  } = props;

  // editable table
  const [form] = Form.useForm();
  const [data, setData] = useState(projectResourceList);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Validate Failed:', errInfo);
    }
  };

  // functions
  const fetchResourceOfProject = (name, p, l) => {
    dispatch({
      type: 'projectDetails/fetchResourceOfProjectEffect',
      payload: {
        project: [id],
        name,
        page: p,
        limit: l,
      },
    });
  };

  useEffect(() => {
    fetchResourceOfProject(searchValue, page, limit);
  }, [page, limit]);

  // useEffect(() => {
  //   fetchResourceOfProject();
  // }, []);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l || limit);
  };

  const onSearchDebounce = debounce((value) => {
    fetchResourceOfProject(value);
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const renderTimeTitle = (title) => {
    return (
      <span className={styles.timeTitle}>
        <span>{title}</span>
        <span className={styles.smallText}>(mm/dd/yyyy)</span>
      </span>
    );
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        fixed: 'left',
        render: (generalInfo = {}) => {
          const { legalName = '', userId = '' } = generalInfo;
          return (
            <span className={styles.nameContainer}>
              <span className={styles.name}>{legalName}</span>
              {userId && <span className={styles.userId}>({userId})</span>}
            </span>
          );
        },
      },
      {
        title: 'Designation',
        dataIndex: 'titleInfo',
        key: 'titleInfo',
        render: (titleInfo) => {
          return (
            <div className={styles.cell}>
              <span>{titleInfo.name}</span>
            </div>
          );
        },
      },
      {
        title: 'Billing Status',
        dataIndex: 'billingStatus',
        key: 'billingStatus',
        render: (billingStatus) => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('Start Date'),
        dataIndex: 'startDate',
        key: 'startDate',
        align: 'center',
        editable: true,
        render: (startDate) => {
          return <span>{startDate || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('End Date'),
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        render: (endDate) => {
          return <span>{endDate || '-'}</span>;
        },
      },
      {
        title: renderTimeTitle('Revised End Date'),
        dataIndex: 'revisedEndDate',
        key: 'revisedEndDate',
        align: 'center',
        editable: true,
        render: (revisedEndDate) => {
          return <span>{revisedEndDate || '-'}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, record) => {
          const editable = isEditing(record);
          if (editable) {
            return (
              <div className={styles.actions}>
                <img src={ApproveCheckIcon} alt="" onClick={() => save(record.key)} />
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <img src={CancelXIcon} alt="" />
                </Popconfirm>
              </div>
            );
          }
          return (
            <div className={styles.actions}>
              <img src={EditIcon} alt="" onClick={() => edit(record)} />
              <img src={DeleteIcon} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const content = <FilterResourcesContent />;
    return (
      <div className={styles.options}>
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <OrangeAddButton text="Add Resources" onClick={() => setAddResourceModalVisible(true)} />
        <SearchBar onSearch={onSearch} placeholder="Search by Resource Type" />
      </div>
    );
  };

  return (
    <div className={styles.ResourcesCard}>
      <Card title="Resource" extra={renderOption()}>
        <div className={styles.tableContainer}>
          <CommonTable
            columns={generateColumns()}
            list={data}
            page={page}
            limit={limit}
            onChangePage={onChangePage}
            loading={loadingFetchList}
            total={total}
            isBackendPaging
          />
        </div>
      </Card>
      <AddResourcesModal
        visible={addResourceModalVisible}
        onClose={() => setAddResourceModalVisible(false)}
      />
    </div>
  );
};
export default connect(({ projectDetails, loading }) => ({
  projectDetails,
  loadingFetchList: loading.effects['projectDetails/fetchResourceOfProjectEffect'],
}))(ResourcesCard);
