import { Card } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'umi';
import AddButton from '../AddButton';
import FilterButton from '../FilterButton';
import FilterPopover from '../FilterPopover';
import SearchBar from '../SearchBar';
import CommonModal from '../CommonModal';
import AddContent from './components/AddContent';
import FilterContent from './components/FilterContent';
import styles from './index.less';

const Documents = (props) => {
  const [addDocumentModalVisible, setAddDocumentModalVisible] = useState(false);

  const onSearchDebounce = debounce((value) => {
    console.log('value', value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const renderOption = () => {
    const content = <FilterContent />;
    return (
      <div className={styles.options}>
        <AddButton text="Add new Document" onClick={() => setAddDocumentModalVisible(true)} />
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <SearchBar onSearch={onSearch} placeholder="Search by Document Type" />
      </div>
    );
  };

  return (
    <div className={styles.Documents}>
      <Card title="Documents" extra={renderOption()}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
      <CommonModal
        visible={addDocumentModalVisible}
        onClose={() => setAddDocumentModalVisible(false)}
        firstText="Add Document"
        content={<AddContent />}
        title="Add Document"
      />
    </div>
  );
};
export default connect(() => ({}))(Documents);
