import { CloseOutlined } from '@ant-design/icons';
import { Card, DatePicker, Form, Popconfirm, Tag } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import ApproveCheckIcon from '@/assets/projectManagement/approveCheck.svg';
import CancelXIcon from '@/assets/projectManagement/cancelX.svg';
import EditIcon from '@/assets/projectManagement/edit2.svg';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import DeleteIcon from '@/assets/projectManagement/recycleBin.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import AddResourcesModal from '../AddResourcesModal';
import FilterResourcesContent from './components/FilterResourcesContent';
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
              message: `Required fields!`,
            },
          ]}
        >
          <DatePicker format={DATE_FORMAT_MDY} />
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
  const [removeResourceModalVisible, setRemoveResourceModalVisible] = useState('');
  const [removingPackage, setRemovingPackage] = useState('');
  const [applied, setApplied] = useState(0);
  // if reselect project status or search, clear filter form
  const [needResetFilterForm, setNeedResetFilterForm] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const {
    dispatch,
    projectDetails: {
      projectDetail: { id = '' } = {},
      projectResourceList = [],
      projectResourceListTotal: total = '',
    } = {},
    loadingFetchList = false,
    loadingRemove = false,
  } = props;

  // permissions
  const { allowModify = false } = props;

  // editable table
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState('');

  // function
  const updateResourceOfProject = (record, key) => {
    const findRecord = data.find((x) => x._id === key);
    if (findRecord) {
      dispatch({
        type: 'projectDetails/updateResourceOfProjectEffect',
        payload: {
          id: findRecord.resourceId,
          startDate: record.startDate ? moment(record.startDate).format(DATE_FORMAT_YMD) : null,
          revisedEndDate: record.revisedEndDate
            ? moment(record.revisedEndDate).format(DATE_FORMAT_YMD)
            : null,
        },
      });
    }
  };

  const formatData = (originData) => {
    const tempData = JSON.parse(JSON.stringify(originData));
    return tempData.map((item) => {
      const { projects = [] } = item;
      if (projects.length > 0) {
        const firstProject = projects.find((x) => x.project.id === id);
        return {
          ...item,
          startDate: firstProject.startDate,
          endDate: firstProject.endDate,
          revisedEndDate: firstProject.revisedEndDate,
          billingStatus: firstProject.status,
          utilization: firstProject.utilization,
          resourceId: firstProject.id,
        };
      }
      return item;
    });
  };

  useEffect(() => {
    const formattedData = formatData(projectResourceList);
    setData(formattedData);
  }, [JSON.stringify(projectResourceList)]);

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
      revisedEndDate: record.revisedEndDate ? moment(record.revisedEndDate) : null,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);

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

      updateResourceOfProject(row, key);
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
        projects: [id],
        ...name,
        page: p,
        limit: l,
        adminMode: true,
      },
    });
  };

  useEffect(() => {
    fetchResourceOfProject({ name: searchValue }, page, limit);
  }, [page, limit]);

  // useEffect(() => {
  //   fetchResourceOfProject();
  // }, []);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l || limit);
  };

  const onSearchDebounce = debounce((value) => {
    fetchResourceOfProject({ name: value });
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const onFilter = (filterPayload) => {
    fetchResourceOfProject({ name: searchValue, ...filterPayload }, page, limit);
    if (Object.keys(filterPayload).length > 0) {
      setIsFiltering(true);
      setApplied(Object.keys(filterPayload).length);
    } else {
      setIsFiltering(false);
      setApplied(0);
    }
  };

  const clearFilter = () => {
    onFilter({});
    setNeedResetFilterForm(true);
  };

  const removeResourceOfProject = async (key) => {
    const findRecord = data.find((x) => x._id === key);
    if (findRecord) {
      const res = await dispatch({
        type: 'projectDetails/removeResourceOfProjectEffect',
        payload: {
          id: findRecord.resourceId,
        },
      });
      if (res.statusCode === 200) {
        setRemoveResourceModalVisible(false);
        setRemovingPackage('');
        const tempData = data.filter((x) => x._id !== key);
        setData(tempData);
        fetchResourceOfProject({ name: searchValue }, page, limit);
      }
    }
  };

  const renderTimeTitle = (title) => {
    return (
      <span className={styles.timeTitle}>
        <span>{title}</span>{' '}
        <span className={styles.smallText}>({DATE_FORMAT_MDY.toLowerCase()})</span>
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
          const { legalName = '', workEmail = '' } = generalInfo || {};
          const userId = workEmail.substring(0, workEmail.lastIndexOf('@'));
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
              <span>{titleInfo?.name}</span>
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
          return (
            <span>{startDate ? moment(startDate).locale('en').format(DATE_FORMAT_MDY) : '-'}</span>
          );
        },
      },
      {
        title: renderTimeTitle('End Date'),
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        render: (endDate) => {
          return (
            <span>{endDate ? moment(endDate).locale('en').format(DATE_FORMAT_MDY) : '-'}</span>
          );
        },
      },
      {
        title: renderTimeTitle('Revised End Date'),
        dataIndex: 'revisedEndDate',
        key: 'revisedEndDate',
        align: 'center',
        editable: true,
        render: (revisedEndDate) => {
          return (
            <span>
              {revisedEndDate ? moment(revisedEndDate).locale('en').format(DATE_FORMAT_MDY) : '-'}
            </span>
          );
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, record) => {
          if (!allowModify) return '';
          const editable = isEditing(record);
          if (editable) {
            return (
              <div className={styles.actions}>
                <img src={ApproveCheckIcon} alt="" onClick={() => save(record._id)} />
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <img src={CancelXIcon} alt="" />
                </Popconfirm>
              </div>
            );
          }
          return (
            <div className={styles.actions}>
              <img src={EditIcon} alt="" onClick={() => edit(record)} />

              <img
                src={DeleteIcon}
                alt=""
                onClick={() => {
                  setRemoveResourceModalVisible(true);
                  setRemovingPackage(record);
                }}
              />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const mergedColumns = generateColumns().map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const renderOption = () => {
    const content = (
      <FilterResourcesContent
        onFilter={onFilter}
        needResetFilterForm={needResetFilterForm}
        setNeedResetFilterForm={setNeedResetFilterForm}
        setIsFiltering={setIsFiltering}
        setApplied={setApplied}
      />
    );
    return (
      <div className={styles.options}>
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            closeIcon={<CloseOutlined />}
            onClose={() => {
              clearFilter();
            }}
          >
            {applied} filters applied
          </Tag>
        )}
        <FilterPopover placement="bottomRight" content={content}>
          <CustomOrangeButton showDot={isFiltering} />
        </FilterPopover>
        {allowModify && (
          <CustomOrangeButton
            onClick={() => setAddResourceModalVisible(true)}
            icon={OrangeAddIcon}
            fontSize={13}
          >
            Add Resources
          </CustomOrangeButton>
        )}
        <CustomSearchBox onSearch={onSearch} placeholder="Search by Name, Resource Type" />
      </div>
    );
  };

  return (
    <div className={styles.ResourcesCard}>
      <Card title="Resource" extra={renderOption()}>
        <div className={styles.tableContainer}>
          <Form form={form} component={false}>
            <CommonTable
              columns={mergedColumns}
              list={data}
              page={page}
              limit={limit}
              onChangePage={onChangePage}
              loading={loadingFetchList}
              total={total}
              isBackendPaging
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
            />
          </Form>
        </div>
      </Card>
      <AddResourcesModal
        visible={addResourceModalVisible}
        onClose={() => setAddResourceModalVisible(false)}
        refreshResourceList={() => fetchResourceOfProject({ name: searchValue }, page, limit)}
      />
      <CommonModal
        visible={removeResourceModalVisible}
        onClose={() => {
          setRemoveResourceModalVisible(false);
          setRemovingPackage('');
        }}
        onFinish={() => removeResourceOfProject(removingPackage._id)}
        title="Delete Resource"
        firstText="Yes, Delete"
        width={500}
        loading={loadingRemove}
        content={
          <Form name="myForm" id="myForm">
            <div style={{ padding: '24px' }}>
              Are you sure you want to delete the resource{' '}
              <span style={{ color: '#2C6DF9', fontWeight: 500 }}>
                {removingPackage?.generalInfo?.legalName}
              </span>
              ?
            </div>
          </Form>
        }
      />
    </div>
  );
};
export default connect(({ projectDetails, loading }) => ({
  projectDetails,
  loadingFetchList: loading.effects['projectDetails/fetchResourceOfProjectEffect'],
  loadingRemove: loading.effects['projectDetails/removeResourceOfProjectEffect'],
}))(ResourcesCard);
