import { Button, Input } from 'antd';
import React from 'react';
import styles from './index.less';
import CustomSecondaryButton from '@/components/CustomSecondaryButton';

const CommentBox = ({
  placeholder = 'Add a comment...',
  disabled = false,
  onChange = () => {},
  value = '',
  submitText = 'Submit',
  editText = 'Update',
  onSubmit = () => {},
  isEdit = false,
  onCancel = () => {},
}) => {
  return (
    <div className={styles.CommentBox}>
      <Input.TextArea
        placeholder={placeholder}
        autoFocus
        onFocus={(e) => {
          const tempValue = e.target.value;
          e.target.value = '';
          e.target.value = tempValue;
        }}
        autoSize={{
          minRows: isEdit ? 2 : 1,
          maxRows: 4,
        }}
        maxLength={144}
        onChange={(e) => onChange(e.target.value)}
        className={styles.commentInput}
        value={value}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onCancel();
          }
          if (e.key === 'Enter' && !e.shiftKey) {
            if (e.preventDefault) {
              e.preventDefault();
            }
            onSubmit();
          }
        }}
        style={{
          borderRadius: isEdit ? 8 : 23,
          paddingRight: isEdit ? 11 : 90,
        }}
        disabled={disabled}
      />
      <div className={styles.buttons} style={{ marginBottom: isEdit ? '-54px' : '0px' }}>
        {isEdit && (
          <CustomSecondaryButton paddingInline={4} onClick={onCancel}>
            Cancel
          </CustomSecondaryButton>
        )}
        <Button className={styles.commentBtn} onClick={onSubmit} disabled={disabled}>
          {isEdit ? editText : submitText}
        </Button>
      </div>
    </div>
  );
};

export default CommentBox;
