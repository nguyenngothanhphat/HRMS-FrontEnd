import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { history, connect } from 'umi';
import { Button, notification } from 'antd';
import { getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

@connect(({ employeeSetting, loading }) => ({
  employeeSetting,
  loading: loading.effects['employeeSetting/addCustomTemplate'],
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
      onClose = () => {},
    } = this.props;
    const tenantId = getCurrentTenant();
    dispatch({
      type: 'employeeSetting/addCustomTemplate',
      payload: {
        html: editorContent,
        settings,
        type: 'ON_BOARDING',
        title,
        tenantId,
      },
    }).then((res) => {
      if (res.statusCode === 200) {
        onClose();
        history.push({
          pathname: '/employee-onboarding/settings',
        });
      }
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
      loading,
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

              // ed.on('variableClick', (e) => {
              //   notification.info({
              //     message: `You clicked on ${e.value}!`,
              //     description:
              //       'You are selecting this field. You can change this field by inserting another one or delete it! Made with <3 by Quan',
              //   });
              // });
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
        <div className={styles.buttonArea}>
          <Button variant="contained" onClick={this.handleSubmit} loading={loading}>
            Save as new template
          </Button>
        </div>
      </div>
    );
  }
}

export default EditForm;
