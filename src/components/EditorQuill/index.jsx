import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { history, connect } from 'umi';
import styles from './index.less';

@connect(({ employeeSetting }) => ({
  employeeSetting,
}))
class EditorQuill extends Component {
  constructor(props) {
    super(props);
    this.mapValues = {};
  }

  render() {
    const { messages = '', handleChangeEmail = () => {}, listAutoText = [] } = this.props;

    return (
      <div className={styles.EditorQuill}>
        <Editor
          initialValue={messages}
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
              'undo redo formatselect bold italic size backcolor  alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat help variable',
            content_style: 'body { margin: 1rem auto; max-width: 900px; padding: 0 13px; }',
            setup(ed) {
              window.tester = ed;
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

              // ed.on('variableClick', (e) => {
              //   notification.info({
              //     message: `You clicked on ${e.value}!`,
              //     description:
              //       'You are selecting this field. You can change this field by inserting another one or delete it! Made with <3 by Quan',
              //   });
              // });
            },
            variable_prefix: '@',
            variable_suffix: '',

            variable_style:
              'background-color: #ffa100; color: #fff; border-radius: 4px; padding: 4px; margin: 0 2px; font-weight: 500',
            external_plugins: {
              variable: window.location.href.replace(
                history.location.pathname,
                '/tinymce/plugins/auto_text/plugin.js',
              ),
            },
          }}
          onEditorChange={handleChangeEmail}
          outputFormat="raw"
        />
      </div>
    );
  }
}

export default EditorQuill;
