import { Card, Form, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import checkIcon from '@/assets/projectManagement/approveCheck.svg';
import cancelIcon from '@/assets/projectManagement/cancelX.svg';
import editIcon from '@/assets/projectManagement/edit2.svg';
import CommonTable from '@/components/CommonTable';
import styles from '../../index.less';

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
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Action = ({ record, isEditing, save, cancel, edit }) => {
  const editable = isEditing(record);

  return (
    <Space size={4} className={styles.groupBtn}>
      {editable ? (
        <>
          <img src={checkIcon} alt="checkIcon" onClick={() => save(record._id)} />
          <img src={cancelIcon} alt="cancelIcon" onClick={cancel} />
        </>
      ) : (
        <img src={editIcon} alt="editIcon" onClick={() => edit(record)} />
      )}
    </Space>
  );
};

const RegionsTable = (props) => {
  const {
    dispatch,
    loadingList,
    employeeIdList,
    locationTotal: total,
    loadingUpdate = false,
  } = props;
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState();

  const fetchData = (p, l) => {
    dispatch({
      type: 'onboard/getEmployeeIdFormatList',
      payload: {
        page: p,
        limit: l,
      },
    });
  };

  const formatData = (originData = []) => {
    const tempData = JSON.parse(JSON.stringify(originData));
    return tempData.map((item) => {
      const { employeeIdList: a = {} } = item;
      if (a.length > 0) {
        return {
          ...item,
          prefix: a.prefix,
          start: a.start,
        };
      }
      return item;
    });
  };

  useEffect(() => {
    const formattedData = formatData(employeeIdList);
    setData(formattedData);
  }, [JSON.stringify(employeeIdList)]);

  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l || limit);
  };

  const updateEmployeeFormatByLocation = async (record, key) => {
    const findRecord = data.find((x) => x._id === key);
    if (findRecord) {
      const res = await dispatch({
        type: 'onboard/updateEmployeeFormatByLocation',
        payload: {
          location: {
            _id: findRecord._id,
            prefix: record.prefix,
            start: record.start,
          },
        },
      });
      if (res.statusCode === 200) {
        setEditingKey('');
        fetchData(page, limit);
      }
    }
  };

  const isEditing = (record) => record._id === editingKey;

  const edit = (record = {}) => {
    form.setFieldsValue({
      prefix: record.idGenerate?.prefix || null,
      start: record.idGenerate?.start || null,
    });
    setEditingKey(record?._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      updateEmployeeFormatByLocation(row, key);
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log('Validate Failed:', errInfo);
    }
  };

  const generateColumns = [
    {
      title: <div style={{ marginLeft: '10px' }}>Location</div>,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (lo) => <div style={{ marginLeft: '10px' }}>{lo}</div>,
    },
    {
      title: 'Prefix (Optional)',
      dataIndex: 'prefix',
      key: 'prefix',
      editable: true,
      width: '25%',
      render: (_, row) => row?.idGenerate?.prefix,
    },
    {
      title: 'User ID Sequence Start',
      dataIndex: 'start',
      key: 'start',
      editable: true,
      width: '25%',
      render: (_, row) => row?.idGenerate?.start,
    },
    {
      title: <div style={{ marginRight: '10px' }}>Action</div>,
      key: 'action',
      dataIndex: 'action',
      width: '20%',
      align: 'right',
      render: (_, record) => (
        <Action record={record} isEditing={isEditing} cancel={cancel} save={save} edit={edit} />
      ),
    },
  ];

  const mergedColumns = generateColumns.map((col) => {
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

  return (
    <Card className={styles.region} title="Regions">
      <Form form={form} component={false}>
        <CommonTable
          page={page}
          limit={limit}
          onChangePage={onChangePage}
          list={data}
          columns={mergedColumns}
          total={total}
          loading={loadingList || loadingUpdate}
          isBackendPaging
          components={{
            body: {
              cell: EditableCell,
            },
          }}
        />
      </Form>
    </Card>
  );
};
export default connect(
  ({
    loading,
    user: { currentUser: { location = '' } } = {},
    onboard: {
      joiningFormalities: {
        listJoiningFormalities = [],
        generatedId = '',
        prefix = '',
        idItem = '',
        employeeIdList = [],
        locationTotal = '',
      } = {},
    },
  }) => ({
    loadingList: loading.effects['onboard/getEmployeeIdFormatList'],
    loadingAdd: loading.effects['onboard/addJoiningFormalities'],
    loadingUpdate: loading.effects['onboard/updateEmployeeFormatByLocation'],
    loadingRemove: loading.effects['onboard/removeJoiningFormalities'],
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
    employeeIdList,
    location,
    locationTotal,
  }),
)(RegionsTable);
