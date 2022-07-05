import { Button, Card, Form, Input, Space } from 'antd';
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
    <Space size={12} className={styles.groupBtn}>
      {editable ? (
        <div>
          <Button type="link" shape="circle" onClick={save(record._id)}>
            <img src={checkIcon} alt="checkIcon" />
          </Button>
          <Button type="link" shape="circle" onClick={cancel}>
            <img src={cancelIcon} alt="cancelIcon" />
          </Button>
        </div>
      ) : (
        <Button type="link" shape="circle" onClick={() => edit(record)}>
          <img src={editIcon} alt="editIcon" />
        </Button>
      )}
    </Space>
  );
};

const RegionsTable = (props) => {
  const { dispatch, loadingList, idGenerate, locationTotal: total } = props;
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editingKey, setEditingKey] = useState('');
  const [data, setData] = useState();

  const fetchTable = (p, l) => {
    dispatch({
      type: 'onboard/fetchIdGenerate',
      payload: {
        page: p,
        limit: l,
      },
    });
  };

  const formatData = (originData = []) => {
    const tempData = JSON.parse(JSON.stringify(originData));
    return tempData.map((item) => {
      const { idGenerate: a = {} } = item;
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
    console.log('id', idGenerate);
    const formattedData = formatData(idGenerate);
    setData(formattedData);
    // console.log(formattedData);
  }, [JSON.stringify(idGenerate)]);

  useEffect(() => {
    fetchTable(page, limit);
  }, [page, limit]);

  const onChangePage = (p, l) => {
    setPage(p);
    setLimit(l || limit);
  };

  const updateIdGenerate = (record, key) => {
    const findRecord = data.find((x) => x._id === key);
    if (findRecord) {
      dispatch({
        type: 'onboard/updateIdGenerate',
        payload: {
          location: {
            _id: findRecord._id,
            prefix: findRecord.prefix,
            start: findRecord.start,
          },
        },
      });
    }
  };

  const isEditing = (record) => record._id === editingKey;

  const edit = (record = {}) => {
    console.log('🚀 ~ record', record);
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

      updateIdGenerate(row, key);
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
      width: '25%',
      render: (_, row) => row?.idGenerate?.prefix,
    },
    {
      title: 'User ID Sequence Start',
      dataIndex: 'start',
      key: 'start',
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
      <CommonTable
        page={page}
        limit={limit}
        onChangePage={onChangePage}
        list={data}
        columns={mergedColumns}
        total={total}
        loading={loadingList}
        isBackendPaging
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
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
        idGenerate = [],
        locationTotal = '',
      } = {},
    },
  }) => ({
    loadingList: loading.effects['onboard/fetchIdGenerate'],
    loadingAdd: loading.effects['onboard/addJoiningFormalities'],
    loadingUpdate: loading.effects['onboard/updateJoiningFormalities'],
    loadingRemove: loading.effects['onboard/removeJoiningFormalities'],
    loadingGetEmployeeId: loading.effects['onboard/getSettingEmployeeId'],
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
    idGenerate,
    location,
    locationTotal,
  }),
)(RegionsTable);
