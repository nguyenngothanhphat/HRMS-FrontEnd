import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// import { debounce } from 'lodash';
import { history, connect } from 'umi';
import REACT_APP_TINYMCE_KEY from '@/utils/editor';

import styles from './index.less';

@connect(({ employeeSetting }) => ({
  employeeSetting,
}))
class EditorQuill extends Component {
  constructor(props) {
    super(props);
    this.mapValues = {};
    // this.handleChangeContent = debounce(this.handleChangeContent.bind(this), 100);
  }

  imageType = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'webp':
      case 'tiff':
      case 'png':
        return true;
      default:
        return false;
    }
  };

  beforeUpload = (file) => {
    const checkType = this.imageType(file.name);
    const isLt5M = file.size / 1024 / 1024 < 5;
    return checkType && isLt5M;
  };

  uploadImageHandle = (blobInfo, success, failure, progress) => {
    const { dispatch } = this.props;
    const check = this.beforeUpload(blobInfo.blob());
    if (check) {
      const formData = new FormData();
      // formData.append('uri', file);
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      dispatch({
        type: 'upload/uploadFile',
        payload: formData,
      }).then((resp = {}) => {
        const { statusCode, data = [] } = resp;
        if (statusCode === 200) {
          const uploadedFile = data.length > 0 ? data[0] : {};
          success(uploadedFile.url);
        }
        if (statusCode === 403) {
          failure(`HTTP Error: ${statusCode}`, { remove: true });
          return;
        }

        if (statusCode < 200 || statusCode >= 300) {
          failure(`HTTP Error: ${statusCode}`);
        }
      });
    } else {
      failure('Invalid file. Only images to be accepted and must smaller than 5MB!');
    }
  };

  handleChangeContent = (value) => {
    const { handleChangeEmail = () => {} } = this.props;
    handleChangeEmail(value);
  };

  render() {
    const { messages = '', listAutoText = [] } = this.props;

    return (
      <div className={styles.EditorQuill}>
        <Editor
          value={messages}
          apiKey={REACT_APP_TINYMCE_KEY}
          init={{
            height: '100%',
            menubar: true,
            extended_valid_elements: '*[*]',
            valid_children: '+*[*]',
            plugins: [
              'save advlist autolink lists link image charmap print anchor',
              'searchreplace visualblocks fullscreen',
              'insertdatetime media table paste help wordcount variable',
            ],
            toolbar:
              'undo redo formatselect bold italic size backcolor  alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat help variable custom-preview',
            content_style: 'body { margin: 1rem; max-width: 900px; padding: 0 13px; }',
            setup(ed) {
              window.tester = ed;
              ed.ui.registry.addButton('custom-preview', {
                text: 'Preview',
                onAction() {
                  ed.windowManager.open({
                    title: '',
                    body: {
                      type: 'panel',
                      items: [
                        {
                          type: 'htmlpanel',
                          html: ed.getContent({ format: 'raw' }),
                        },
                      ],
                    },
                    buttons: [
                      {
                        text: 'OK',
                        type: 'cancel',
                      },
                    ],
                    size: 'large',
                  });
                },
              });
              ed.ui.registry.addMenuButton('variable', {
                text: 'Insert auto-text',
                fetch(callback) {
                  const menuItems = listAutoText.map((item) => {
                    return {
                      type: 'menuitem',
                      text: item,
                      onAction() {
                        ed.plugins.variable.addVariable(item);
                      },
                    };
                  });
                  callback(menuItems);
                },
              });
            },
            variable_style:
              'background-color: #ffa100; color: #fff; border-radius: 4px; padding: 4px; margin: 0 2px; font-weight: 500',
            external_plugins: {
              variable: window.location.href.replace(
                history.location.pathname,
                '/tinymce/plugins/auto_text/plugin.js',
              ),
            },
            images_upload_handler: this.uploadImageHandle,
          }}
          onEditorChange={this.handleChangeContent}
          outputFormat="raw"
        />
      </div>
    );
  }
}

export default EditorQuill;
