import REACT_APP_TINYMCE_KEY from '@/utils/editor';
import { Editor } from '@tinymce/tinymce-react';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import styles from './index.less';

@connect(({ employeeSetting, loading }) => ({
  employeeSetting,
  loading: loading.effects['employeeSetting/addCustomTemplate'],
}))
class EditForm extends Component {
  constructor(props) {
    super(props);
    this.mapValues = {};
  }

  handleEditorChange = (content) => {
    const { handleHtmlContent = () => {} } = this.props;
    handleHtmlContent(content);
  };

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

  uploadImageHandle = (blobInfo, success, failure) => {
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

  render() {
    const { currentTemplate: { settings = [] } = {} } = this.props;
    return (
      <div className={styles.EditForm}>
        <Editor
          apiKey={REACT_APP_TINYMCE_KEY}
          init={{
            height: '100%',
            menubar: true,
            plugins: [
              'save advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks fullscreen',
              'insertdatetime media table paste help wordcount variable',
            ],
            toolbar:
              'undo redo formatselect bold italic backcolor  alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat help variable',
            content_style: 'body { margin: 1rem; max-width: 900px; }',
            setup(ed) {
              window.tester = ed;
              ed.ui.registry.addMenuButton('variable', {
                text: 'Insert auto-text',
                fetch(callback) {
                  const menuItems = settings.map((item) => ({
                    type: 'menuitem',
                    text: item.description,
                    onAction() {
                      ed.plugins.variable.addVariable(item.key);
                    },
                  }));
                  callback(menuItems);
                },
              });
            },

            variable_mapper: this.mapValues,
            variable_style:
              'background-color: #ffa100; color: #fff; border-radius: 4px; padding: 4px;',
            external_plugins: {
              variable: window.location.href.replace(
                history.location.pathname,
                '/tinymce/plugins/auto_text/plugin.js',
              ),
            },
            images_upload_handler: this.uploadImageHandle,
          }}
          onEditorChange={this.handleEditorChange}
          outputFormat="raw"
        />
      </div>
    );
  }
}

export default EditForm;
