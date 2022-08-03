import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/services/firebase';
import { UPLOAD } from '@/utils/upload';

const UploadProcess = (props) => {
  const { file, typeFile, info, dispatch } = props;
  const [status, setStatus] = useState('');
  const [process, setProcess] = useState(0);
  const [url, setUrl] = useState('');
  const fileName = [uuidv4(), file.name.split('.').pop()].join('.');
  const path = `${UPLOAD.PATH[typeFile]}${fileName}`;
  const category = UPLOAD.TYPE_FILE[typeFile];
  const handleUploadFirebase = async () => {
    if (!file) return;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 95);
        setProcess(prog);
      },
      (error) => {
        setStatus('exception');
        info.description = error;
      },
      async () => {
        const newUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(newUrl);
        const payload = {
          name: file.name,
          fileName,
          path,
          type: file.type,
          size: file.size,
          category,
          url,
        };
        const response = await dispatch({
          type: 'upload/addAttachment',
          payload,
        });
        console.log('response :', response);
      },
    );
  };

  useEffect(() => {
    handleUploadFirebase();
  }, []);

  return <Progress type="circle" percent={process} width={35} status={status} />;
};

export default UploadProcess;
