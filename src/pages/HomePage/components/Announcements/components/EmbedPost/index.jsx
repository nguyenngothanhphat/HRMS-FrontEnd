import ReactIframeResizer from 'react-iframe-resizer-super';
import React from 'react';

const EmbedPost = (props) => {
  const { embedLink = '' } = props;

  return (
    <div style={{ height: '730px' }}>
      <ReactIframeResizer
        title="Embed Post"
        src={embedLink}
        style={{
          minWidth: '100%',
          minHeight: '100%',
        }}
        frameBorder="0"
      />
    </div>
  );
};

export default EmbedPost;
