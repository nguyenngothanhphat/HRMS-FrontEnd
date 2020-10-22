import React, { Fragment, useEffect, useState } from 'react';
import { Input, Row, Col, Modal } from 'antd';
import { MinusCircleOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UploadCertification from '../Upload';
import s from './index.less';

const { confirm } = Modal;

const CertificationInput = ({
  value = [{}],
  onChange,
  notValid,
  handleRemoveCertification = () => {},
}) => {
  const [list, setList] = useState(value);
  const [idInput, setIdInput] = useState(Date.now());

  const handleAddBtn = () => {
    const newList = [...list, {}];
    setList(newList);
  };

  const handleRemoveBtn = (index) => {
    const newList = [...list];
    const itemRemoved = newList[index];
    if (itemRemoved._id) {
      handleRemoveCertification(itemRemoved);
    }
    newList.splice(index, 1);
    setList(newList);
    setIdInput(Date.now());
  };

  const showConfirm = (index) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        handleRemoveBtn(index);
      },
      onCancel() {},
    });
  };

  const handleFieldChange = (index, nameField, fieldValue) => {
    const item = list[index];
    const newItem = { ...item, [nameField]: fieldValue };
    const newList = [...list];
    newList.splice(index, 1, newItem);
    setList(newList);
  };

  useEffect(() => {
    onChange(list);
  }, [list]);

  return (
    <div key={idInput} className={s.root}>
      {list.map((item, index) => {
        return (
          <Fragment key={`certification${index + 1}`}>
            <Row gutter={[0, 16]}>
              <Col span={6}>Certification</Col>
              <Col span={9}>
                <div className={s.viewRemoveField}>
                  <Input
                    defaultValue={item.name}
                    onChange={(event) => {
                      const { value: fieldValue } = event.target;
                      handleFieldChange(index, 'name', fieldValue);
                    }}
                  />
                  {list.length > 1 ? (
                    <MinusCircleOutlined
                      className={s.iconRemove}
                      onClick={() => showConfirm(index)}
                    />
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row gutter={[0, 16]}>
              <Col span={6}>Upload File</Col>
              <Col span={9}>
                <UploadCertification
                  item={item}
                  index={index}
                  handleFieldChange={handleFieldChange}
                />
              </Col>
            </Row>
          </Fragment>
        );
      })}
      {notValid && list.length > 1 && (
        <div style={{ color: 'red' }}>Name certification is required.</div>
      )}
      <Row>
        <Col span={9} offset={6}>
          <div className={s.viewAddMore} onClick={handleAddBtn}>
            <PlusOutlined className={s.viewAddMore__iconAdd} />
            Add more
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CertificationInput;
