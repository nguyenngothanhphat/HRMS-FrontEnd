import { Button, Card, Col, Form, Input, Row, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import checkIcon from '@/assets/projectManagement/approveCheck.svg';
import cancelIcon from '@/assets/projectManagement/cancelX.svg';
import editIcon from '@/assets/projectManagement/edit2.svg';
import TooltipIcon from '@/assets/tooltip.svg';
import CommonTable from '@/components/CommonTable';
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
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const JoiningFormalities = (props) => {
  const {
    // generatedId,
    // prefix,
    dispatch,
    loadingUpdateEmployeeId,
    loadingList,
    idGenerate,
    location,
    settingId = {},
    locationTotal: total,
  } = props;
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
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

  const fetchSettingEmpolyeeId = (locationId) => {
    dispatch({
      type: 'onboard/fetchIdbyLocation',
      payload: {
        location: locationId,
      },
    });
  };

  const formatData = (originData) => {
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
    fetchSettingEmpolyeeId(location._id);
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      generatedId: settingId?.idGenerate?.start,
      prefix: settingId?.idGenerate?.prefix,
    });
  }, [JSON.stringify(settingId)]);

  useEffect(() => {
    const formattedData = formatData(idGenerate);
    setData(formattedData);
    console.log(formattedData);
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

  const onFinish = async (value) => {
    // const response = await dispatch({
    //   type: 'onboard/updateSettingEmployeeId',
    //   payload: {
    //     _id: idItem,
    //     ...value,
    //   },
    // });
    // const { statusCode = 0 } = response;
    // if (statusCode === 200) setIsEdit(false);
    const { prefix, generatedId: start } = value;
    const response = await dispatch({
      type: 'onboard/updateIdGenerate',
      payload: {
        location: {
          _id: location._id,
          prefix,
          start,
        },
      },
    });
    const { statusCode = 0 } = response;
    if (statusCode === 200) {
      setIsEdit(false);
      fetchTable();
    }
  };

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      prefix: record.idGenerate.prefix || null,
      start: record.idGenerate.start || null,
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
      render: (_, record) => {
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
      },
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
    <div className={styles.employeeId}>
      <Card className={styles.content}>
        <Form form={form} name="employeeId" layout="vertical" onFinish={onFinish}>
          <Row gutter={[100, 24]}>
            <Col xs={24} lg={8} span={12}>
              {/* Would you like to include a string infront of the auto generated Employee ID? */}
              <Form.Item
                label={
                  <div>
                    <>Prefix (Optional) </>{' '}
                    <Tooltip
                      title={
                        <div className={styles.contentTooltip}>
                          Would you like to include a string infront of the auto generated ID?
                        </div>
                      }
                      color="#fff"
                      placement="right"
                      overlayClassName={styles.tooltipOverlay}
                    >
                      <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
                    </Tooltip>
                  </div>
                }
                name="prefix"
              >
                <Input disabled={!isEdit} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8} span={12}>
              {/* From where would you like to start the Auto generated ID? */}
              <Form.Item
                label={
                  <div>
                    <> User ID Sequence Start</>{' '}
                    <Tooltip
                      title={
                        <div className={styles.contentTooltip}>
                          From where would you like to start the Auto generated ID?
                        </div>
                      }
                      color="#fff"
                      placement="right"
                      overlayClassName={styles.tooltipOverlay}
                    >
                      <img className={styles.tooltip} alt="tool-tip" src={TooltipIcon} />
                    </Tooltip>
                  </div>
                }
                name="generatedId"
              >
                <Input disabled={!isEdit} loading />
              </Form.Item>
            </Col>
          </Row>

          {isEdit ? (
            <Form.Item>
              <Space size={24}>
                <Button
                  className={styles.btnCancel}
                  onClick={() => {
                    setIsEdit(false);
                    // form.setFieldsValue({ prefix, generatedId });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  form="employeeId"
                  loading={loadingUpdateEmployeeId}
                >
                  Save Changes
                </Button>
              </Space>
            </Form.Item>
          ) : (
            <Form.Item>
              <Button type="primary" onClick={() => setIsEdit(true)}>
                Edit
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>

      <Card className={styles.checkList} title="Regions">
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
    </div>
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
        settingId = {},
        locationTotal = '',
      } = {},
    },
  }) => ({
    loadingList: loading.effects['onboard/fetchIdGenerate'],
    loadingAdd: loading.effects['onboard/addJoiningFormalities'],
    loadingUpdate: loading.effects['onboard/updateJoiningFormalities'],
    loadingRemove: loading.effects['onboard/removeJoiningFormalities'],
    loadingUpdateEmployeeId: loading.effects['onboard/updateIdGenerate'],
    loadingGetEmployeeId: loading.effects['onboard/getSettingEmployeeId'],
    listJoiningFormalities,
    generatedId,
    prefix,
    idItem,
    idGenerate,
    location,
    settingId,
    locationTotal,
  }),
)(JoiningFormalities);
