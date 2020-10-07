import React, { Fragment, useEffect, useState } from 'react';
import { Input, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import UploadCertification from '../Upload';
import s from './index.less';

const CertificationInput = ({ value = [{}], onChange }) => {
  const [list, setList] = useState(value);
  // console.log(list);
  const [idInput, setIdInput] = useState(Date.now());

  const handleAddBtn = () => {
    const newList = [...list, {}];
    setList(newList);
  };

  const handleRemoveBtn = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
    setIdInput(Date.now());
  };

  const handleFieldChange = (index, nameField, fieldValue) => {
    const item = list[index];
    const newItem = { ...item, [nameField]: fieldValue };
    const newList = [...list];
    newList.splice(index, 1, newItem);
    console.log(newList);
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
                      onClick={() => handleRemoveBtn(index)}
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
