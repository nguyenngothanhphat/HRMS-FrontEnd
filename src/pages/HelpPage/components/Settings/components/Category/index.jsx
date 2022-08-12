import React, { useEffect } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import CustomAddButton from '@/components/CustomAddButton';
import AddCategoryModalContent from './components/AddCategoryModalContent';
import CategoryTable from './components/CategoryTable';
import styles from './index.less';
import { HELP_TYPE, HELP_TYPO } from '@/constants/helpPage';

const Category = (props) => {
  const { dispatch, selectedCountry = '', loadingAdd = false, helpType = '' } = props;

  const [addModalVisible, setAddModalVisible] = React.useState(false);

  console.log('🚀  ~ helpType', helpType);

  const fetchData = () => {
    dispatch({
      type: 'helpPage/fetchHelpCategoryList',
      payload: {
        country: [selectedCountry],
        type: helpType,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  return (
    <div className={styles.Category}>
      <div className={styles.headerCategory}>
        <div className={styles.title}>{HELP_TYPO[helpType].SETTINGS.CATEGORY.TABLE_NAME}</div>
        <div className={styles.options}>
          <CustomAddButton onClick={() => setAddModalVisible(true)}>
            Add {HELP_TYPO[helpType].SETTINGS.CATEGORY.NAME}
          </CustomAddButton>
        </div>
      </div>
      <div className={styles.container}>
        <CategoryTable fetchData={fetchData} />
      </div>
      <CommonModal
        title={`Add ${HELP_TYPO[helpType].SETTINGS.CATEGORY.NAME}`}
        visible={addModalVisible}
        firstText="Add"
        onClose={() => setAddModalVisible(false)}
        width={500}
        loading={loadingAdd}
        formName="addForm"
        content={
          <AddCategoryModalContent
            visible={addModalVisible}
            onClose={() => setAddModalVisible(false)}
            mode="multiple"
            refreshData={fetchData}
          />
        }
      />
    </div>
  );
};

export default connect(({ helpPage: { selectedCountry, helpType = '' } = {}, loading }) => ({
  selectedCountry,
  helpType,
  loadingAdd: loading.effects['helpPage/addHelpCategory'],
}))(Category);
