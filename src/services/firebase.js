import { ref, getDownloadURL, uploadBytesResumable, getStorage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '@/utils/firebase';
import { UPLOAD } from '@/utils/upload';

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const uploadFirebase = ({ file = {}, typeFile = 'IMAGE' }, callback) => {
  // eslint-disable-next-line compat/compat
  return new Promise((resolve) => {
    const fileName = [uuidv4(), file.name.split('.').pop()].join('.');
    const path = `${UPLOAD.PATH[typeFile]}${fileName}`;
    const category = UPLOAD.TYPE_FILE[typeFile];
    if (!file) resolve({});
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 95);
        if (callback) {
          callback(prog);
        }
      },
      () => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve({
            name: file.name,
            fileName,
            path,
            type: file.type,
            size: file.size,
            category,
            url: downloadURL,
          });
        });
      },
    );
  });
};

export default uploadFirebase;
