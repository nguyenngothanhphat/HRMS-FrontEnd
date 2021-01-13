import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { history } from 'umi';
import styles from './index.less';

class EditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: '1',
    };
  }

  onNext = () => {
    const { onNext = {} } = this.props;
    onNext();
  };

  onSwitchTabs = () => {
    const { currentTab } = this.state;

    this.setState(
      {
        currentTab: '2',
      },
      () => {
        console.log(currentTab);
      },
    );
  };

  onTabClick = () => {
    const { currentTab } = this.state;

    this.setState({
      currentTab: currentTab === '1' ? '2' : '1',
    });
  };

  render() {
    const { currentTemplate } = this.props;
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
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount variable',
            ],
            toolbar:
              'undo redo formatselect bold italic backcolor  alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat help variable',
            content_style: 'body { margin: 1rem auto; max-width: 900px; }',
            setup(ed) {
              window.tester = ed;
              ed.ui.registry.addButton('variable', {
                text: 'Insert auto-text',
                onAction() {
                  ed.plugins.variable.addVariable('account_id');
                },
              });

              ed.on('variableClick', function (e) {
                console.log('click', e);
                console.log(history);
              });
            },

            external_plugins: {
              variable: window.location.href.replace(
                history.location.pathname,
                '/tinymce/plugins/auto_text/plugin.js',
              ),
            },
          }}
        />
      </div>
    );
  }
}

export default EditForm;
