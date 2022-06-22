import React from 'react';
import CheckboxMenu from '../CheckboxMenu';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import styles from './index.less';

const CustomDropdownSelector = ({
  options = [],
  onChange = () => {},
  disabled = false,
  label = '',
  selectedList = [],
}) => {
  const getSelectedLocationName = () => {
    if (selectedList.length === 1) {
      return options.find((x) => x._id === selectedList[0])?.name || '';
    }
    if (selectedList.length > 0 && selectedList.length < options.length) {
      return `${selectedList.length} ${label.toLowerCase()}s selected`;
    }
    if (selectedList.length === options.length) {
      return 'All';
    }
    return 'None';
  };

  return (
    <div className={styles.CustomDropdownSelector}>
      <span className={styles.label}>{label}</span>

      <CheckboxMenu
        options={options}
        onChange={onChange}
        default={selectedList}
        disabled={disabled}
      >
        <div
          className={`${options.length < 2 ? styles.noDropdown : styles.dropdown}`}
          onClick={(e) => e.preventDefault()}
        >
          <span>{getSelectedLocationName()}</span>
          {options.length < 2 ? null : <img src={SmallDownArrow} alt="" />}
        </div>
      </CheckboxMenu>
    </div>
  );
};
export default CustomDropdownSelector;
