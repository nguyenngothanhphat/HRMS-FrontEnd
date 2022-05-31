import { Button, Col, message, Row, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import BlueAddIcon from '@/assets/dashboard/blueAdd.svg';
import s from './index.less';

const AddAttachments = ({ onChange, dispatch, loading = false }) => {
  const [list, setList] = useState([]);

  const handleFieldChange = (fieldValue) => {
    const newItem = {
      attachmentId: fieldValue.id,
      attachmentName: fieldValue.name,
      attachmentUrl: fieldValue.url,
    };
    setList([...list, newItem]);
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

  const triggerChangeUpload = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      handleFieldChange(first);
    }
  };

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      triggerChangeUpload(resp);
    });
  };

  const handleDeleteBtn = (id) => {
    const newList = list.filter((item) => item.id !== id);
    setList([...newList]);
  };

  return (
    <div className={s.root}>
      <Row>
        <Col span={24}>
          <Upload
            name="file"
            // multiple
            beforeUpload={beforeUpload}
            action={(file) => handleUpload(file)}
            showUploadList={false}
          >
            <Button
              className={`${s.addAttachmentButton} ${list.length === 2 && s.disableUpload} `}
              icon={<img src={BlueAddIcon} alt="blueAddIcon" />}
              loading={loading}
              disabled={list.length === 2}
            >
              Add attachments
            </Button>
          </Upload>
          <span style={{ opacity: 0.5 }}>
            (You can optionally attach upto 2 supporting documents of 2MB each)
          </span>
        </Col>
        {list.map((item) => (
          <>
            <Col span={24}>
              <div className={s.attachmentList}>
                <span className={s.nameFile}>{item.attachmentName}</span>
                <img
                  src="/assets/images/iconFilePNG.svg"
                  alt="iconFilePNG"
                  className={s.iconFile}
                />
                <img
                  src="/assets/images/remove.svg"
                  alt="remove"
                  className={s.iconDelete}
                  onClick={() => {
                    handleDeleteBtn(item.id);
                  }}
                />
              </div>
            </Col>
          </>
        ))}
      </Row>
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['upload/uploadFile'],
}))(AddAttachments);
