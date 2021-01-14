import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { history, connect } from 'umi';
import { Button, notification } from 'antd';
import styles from './index.less';

@connect(({ employeeSetting }) => ({
  employeeSetting,
}))
class EditForm extends Component {
  constructor(props) {
    super(props);
    this.mapValues = {};
    const { currentTemplate } = this.props;
    currentTemplate.settings.map((item) =>
      Object.assign(this.mapValues, { [item.key]: item.description }),
    );
    this.state = {
      editorContent: currentTemplate.htmlContent,
    };
  }

  handleSubmit = () => {
    const { editorContent } = this.state;
    const {
      currentTemplate: { title, settings = [] },
      dispatch,
    } = this.props;
    dispatch({
      type: 'employeeSetting/addCustomTemplate',
      payload: {
        html: editorContent,
        settings,
        type: 'ON_BOARDING',
        title,
      },
    });
  };

  handleEditorChange = (content) => {
    this.setState({
      editorContent: content,
    });
  };

  render() {
    const {
      currentTemplate: { settings = [] },
      currentTemplate,
    } = this.props;
    return (
      <div className={styles.EditForm}>
        <Editor
          initialValue={currentTemplate.htmlContent}
          // apiKey={process.env.REACT_APP_TINYMCE_KEY}
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
            content_style: 'body { margin: 1rem auto; max-width: 900px; }',
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

              ed.on('variableClick', (e) => {
                notification.info({
                  message: `You clicked on ${e.value}!`,
                  description:
                    'You are selecting this field. You can change this field by inserting another one or delete it! Made with <3 by Quan',
                });
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
          }}
          onEditorChange={this.handleEditorChange}
          outputFormat="raw"
        />
        <Button variant="contained" color="secondary" onClick={this.handleSubmit}>
          Click me to save
        </Button>
      </div>
    );
  }
}

export default EditForm;
