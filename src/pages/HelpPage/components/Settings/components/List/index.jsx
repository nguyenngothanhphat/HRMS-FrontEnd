// import { debounce } from 'lodash';
import { Skeleton } from 'antd';
import { debounce } from 'lodash';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import CustomAddButton from '@/components/CustomAddButton';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { HELP_TYPO } from '@/constants/helpPage';
import AddQuestionModalContent from './components/AddQuestionModalContent';
import FilterContent from './components/FilterContent';
import ListTable from './components/ListTable';
import styles from './index.less';

const List = (props) => {
  const {
    loadingGetList = false,
    loadingAdd = false,
    loadingUpload = false,
    dispatch,
    helpPage: { selectedCountry, helpData = [], totalHelpData = 0, helpType = '' } = {},
  } = props;

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [pageSelected, setPageSelected] = useState(1);
  const [size, setSize] = useState(10);
  const [filter, setFilter] = useState({});
  const [searchValue, setSearchValue] = useState('');

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 500);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const fetchData = () => {
    dispatch({
      type: 'helpPage/fetchHelpData',
      payload: {
        country: [selectedCountry],
        type: helpType,
        page: pageSelected,
        limit: size,
        nameSearch: searchValue,
        ...filter,
      },
    });
  };

  const getPageAndSize = (p, l) => {
    setPageSelected(p);
    setSize(l);
  };

  const handleClearFilter = () => {
    setFilter({});
  };

  useEffect(() => {
    fetchData();
  }, [selectedCountry, JSON.stringify(filter), pageSelected, size, searchValue]);

  return (
    <div className={styles.List}>
      <div className={styles.headerPolicy}>
        <div className={styles.title}>{HELP_TYPO[helpType].SETTINGS.QUESTION_TOPIC.TABLE_NAME}</div>
        <div className={styles.options}>
          <FilterCountTag count={Object.keys(filter).length} onClearFilter={handleClearFilter} />
          <CustomAddButton onClick={() => setAddModalVisible(true)}>
            Add {HELP_TYPO[helpType].SETTINGS.QUESTION_TOPIC.NAME}
          </CustomAddButton>
          <div className={styles.filterButton}>
            <FilterPopover
              placement="bottomRight"
              content={
                <Suspense fallback={<Skeleton active />}>
                  <FilterContent filter={filter} setFilter={setFilter} />
                </Suspense>
              }
              realTime
            >
              <CustomOrangeButton />
            </FilterPopover>
          </div>
          <CustomSearchBox
            placeholder={HELP_TYPO[helpType].SETTINGS.QUESTION_TOPIC.SEARCH_PLACEHOLDER}
            onSearch={(e) => onSearch(e)}
          />
        </div>
      </div>
      <div className={styles.container}>
        <ListTable
          pageSelected={pageSelected}
          size={size}
          totalHelpData={totalHelpData}
          getPageAndSize={getPageAndSize}
          selectedCountry={selectedCountry}
          helpData={helpData}
          loadingGetList={loadingGetList}
          fetchData={fetchData}
        />
      </div>
      <CommonModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        firstText="Add"
        formName="addForm"
        title={`Add ${HELP_TYPO[helpType].SETTINGS.QUESTION_TOPIC.NAME}`}
        loading={loadingAdd || loadingUpload}
        content={
          <AddQuestionModalContent
            mode="multiple"
            onClose={() => setAddModalVisible(false)}
            selectedCountry={selectedCountry}
            refreshData={fetchData}
            visible={addModalVisible}
          />
        }
      />
    </div>
  );
};
export default connect(({ loading, helpPage = {} }) => ({
  helpPage,
  loadingGetList: loading.effects['helpPage/fetchHelpData'],
  loadingAdd: loading.effects['helpPage/addQuestion'],
  loadingUpload: loading.effects['upload/addAttachment'],
}))(List);
