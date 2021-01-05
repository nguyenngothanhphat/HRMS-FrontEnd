/* eslint-disable no-console */
/* eslint-disable no-bitwise */
/* eslint-disable no-return-assign */
import React from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import QuillMention from 'quill-mention';
import './index.less';

Quill.register('modules/mentions', QuillMention);

class EditorQuill extends React.Component {
    
    modules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], 

        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], 
        [{ indent: '-1' }, { indent: '+1' }], 
        [{ direction: 'rtl' }], 

        [{ size: ['small', false, 'large', 'huge'] }], 
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], 
        [{ font: [] }],
        [{ align: [] }],

        ['clean'],
        [{ placeholder: this.props.listAutoText }],
      ],
      handlers: {
        placeholder (value) {
          if (value) {
            const cursorPosition = this.quill.getSelection().index;
            this.quill.insertText(cursorPosition, value);
            this.quill.setSelection(cursorPosition + value.length);
          }
        },
      },
    },
  };

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() { 
    const placeholderPickerItems = Array.prototype.slice.call(
      document.querySelectorAll('.ql-placeholder .ql-picker-item'),
    );

    placeholderPickerItems.forEach((item) => (item.textContent = item.dataset.value));

    document.querySelector('.ql-placeholder .ql-picker-label').innerHTML =
      `Auto text${  document.querySelector('.ql-placeholder .ql-picker-label').innerHTML}`;
  }

  render() {
    const { handleChangeEmail, messages} = this.props;

    return (
      <div className="text-editor">
        <ReactQuill
          theme="snow"
          onChange={handleChangeEmail}
          value={messages}
          modules={this.modules}
          placeholder={this.placeholder}
        />
      </div>
    );
  }
}

export default EditorQuill;
