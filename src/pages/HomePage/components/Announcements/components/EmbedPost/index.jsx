import ReactIframeResizer from 'react-iframe-resizer-super';
import React, { useState, useEffect } from 'react';

const EmbedPost = (props) => {
  const { embedLink = '' } = props;

  return (
    <ReactIframeResizer
      title="Embed Post"
      src={embedLink}
      style={{
        minWidth: '100%',
        // minHeight: '100%',
      }}
      frameBorder="0"
      iframeResizerOptions={{
        height: '100%',
        scrolling: 'no',
        heightCalculationMethod: 'documentElementScroll',
      }}
    />
  );
};

export default EmbedPost;
