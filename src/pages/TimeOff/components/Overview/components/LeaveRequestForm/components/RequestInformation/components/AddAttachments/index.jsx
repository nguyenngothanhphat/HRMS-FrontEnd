import { Button, Col, Row, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import BlueAddIcon from '@/assets/dashboard/blueAdd.svg';
import RemoveIcon from '@/assets/timeSheet/recycleBin.svg';
import { beforeUpload, compressImage, FILE_TYPE } from '@/utils/upload';
import s from './index.less';

const AddAttachments = ({
  onChange,
  dispatch,
  loading = false,
  selectedTypeName = '',
  viewingAttachmentList = [],
}) => {
  const [list, setList] = useState([...viewingAttachmentList]);

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
  const triggerChangeUpload = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      handleFieldChange(first);
    }
  };

  const handleUpload = async (file) => {
    const compressedFile = await compressImage(file);
    const formData = new FormData();
    formData.append('blob', compressedFile, file.name);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      triggerChangeUpload(resp);
    });
  };

  const handleDeleteBtn = (id) => {
    const newList = list.filter((item) => item.attachmentId !== id);
    setList([...newList]);
  };

  return (
    <div className={s.root}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Upload
            name="file"
            // multiple
            beforeUpload={(file) => beforeUpload(file, [FILE_TYPE.IMAGE, FILE_TYPE.PDF], 2)}
            action={(file) => handleUpload(file)}
            showUploadList={false}
            disabled={list.length === 2 || !selectedTypeName}
          >
            <Button
              className={[
                s.addAttachmentButton,
                (list.length === 2 || !selectedTypeName) && s.disableUpload,
              ]}
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
                <img
                  src="/assets/images/iconFilePNG.svg"
                  alt="iconFilePNG"
                  className={s.iconFile}
                />
                <span className={s.nameFile}>{item.attachmentName}</span>

                <img
                  src={RemoveIcon}
                  alt="remove"
                  className={s.iconDelete}
                  onClick={() => {
                    handleDeleteBtn(item.attachmentId);
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
