import React from 'react';
import s from './index.less';

const FileContent = (props) => {
  const { url = '' } = props;

  return (
    <div className={s.viewFile}>
      <object width="100%" height="560" data={url} type="application/pdf">
        <iframe
          width="100%"
          height="560"
          src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
          title="pdf-viewer"
        />
      </object>
    </div>
  );
};

export default FileContent;
