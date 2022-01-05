import React, { Fragment, useEffect, useState } from 'react';
import { Input, Row, Col, Upload, message, Popconfirm, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import BlueAddIcon from '@/assets/dashboard/blueAdd.svg';
import s from './index.less';

const CertificationInput = ({
  value = [{}],
  onChange,
  handleRemoveCertification = () => {},
  dispatch,
  loading = false,
}) => {
  const [list, setList] = useState(value);
  const [currentIndex, setCurrentIndex] = useState('');
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

  // upload

  const beforeUpload = (file) => {
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return checkType && isLt2M;
  };

  const triggerChangeUpload = (resp, i) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      handleFieldChange(i, 'urlFile', first.url);
    }
  };

  const handleUpload = (file, i) => {
    setCurrentIndex(i);
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      triggerChangeUpload(resp, i);
    });
  };

  const handleDeleteBtn = (i) => {
    handleFieldChange(i, 'urlFile', '');
  };

  return (
    <div key={idInput} className={s.root}>
      <Row gutter={[0, 24]} align="middle">
        {list.map((item, i) => {
          const nameFile = item.urlFile ? item.urlFile.split('/').pop() : '';
          return (
            <>
              <Col span={6}>{i === 0 && 'Certification'}</Col>
              <Col span={12}>
                <div className={s.viewRemoveField}>
                  <Input
                    defaultValue={item.name}
                    onChange={(event) => {
                      const { value: fieldValue } = event.target;
                      handleFieldChange(i, 'name', fieldValue);
                    }}
                    placeholder="Enter name"
                  />
                  {list.length > 1 ? (
                    <Popconfirm onConfirm={() => handleRemoveBtn(i)}>
                      <MinusCircleOutlined className={s.iconRemove} />
                    </Popconfirm>
                  ) : null}
                </div>
              </Col>
              <Col span={6}>
                <Upload
                  name="file"
                  multiple={false}
                  beforeUpload={beforeUpload}
                  action={(file) => handleUpload(file, i)}
                  showUploadList={false}
                >
                  <Button
                    className={s.addAttachmentButton}
                    icon={<img src={BlueAddIcon} alt="blueAddIcon" />}
                    loading={loading && currentIndex === i}
                  >
                    Add attachments
                  </Button>
                </Upload>
              </Col>
              {item.urlFile && (
                <>
                  <Col span={6} />
                  <Col span={12}>
                    <div className={s.attachmentList}>
                      <span className={s.nameCertification}>{nameFile}</span>
                      <img
                        src="/assets/images/iconFilePNG.svg"
                        alt="iconFilePNG"
                        className={s.iconCertification}
                      />
                      <img
                        src="/assets/images/remove.svg"
                        alt="remove"
                        className={s.iconDelete}
                        onClick={() => handleDeleteBtn(i)}
                      />
                    </div>
                  </Col>
                  <Col span={6} />
                </>
              )}
            </>
          );
        })}
      </Row>

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

export default connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))(CertificationInput);
