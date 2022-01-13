import ReactIframeResizer from 'react-iframe-resizer-super';
import React from 'react';

const EmbedPost = (props) => {
  const { embedLink = '' } = props;

  return (
    <ReactIframeResizer
      title="Embed Post"
      src={embedLink}
      loading="lazy"
      style={{
        minWidth: '100%',
        minHeight: '100%',
      }}
      frameBorder="0"
    />
  );
};

export default EmbedPost;
