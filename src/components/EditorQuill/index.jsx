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
    const { messages = '', handleChangeEmail, listAutoText = [] } = this.props;

    return (
      <div className={styles.EditorQuill}>
        <Editor
          initialValue={messages}
          // apiKey={process.env.REACT_APP_TINYMCE_KEY}
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
          }}
          onEditorChange={handleChangeEmail}
          outputFormat="raw"
        />
      </div>
    );
  }
}

export default EditorQuill;
