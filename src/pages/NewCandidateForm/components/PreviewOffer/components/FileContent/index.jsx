import React from 'react';
import s from './index.less';

const FileContent = (props) => {
  const { url = '' } = props;

  return (
    <div className={s.viewFile}>
      <iframe width="100%" height="500" src={url} title="pdf" />
    </div>
  );
};

export default FileContent;
