import React, { useEffect } from 'react';
import { connect } from 'umi';
import CommonModal from '@/components/CommonModal';
import CustomAddButton from '@/components/CustomAddButton';
import AddCategoryModalContent from './components/AddCategoryModalContent';
import CategoryTable from './components/CategoryTable';
import styles from './index.less';

const Category = (props) => {
  const { dispatch, selectedCountry = '', loadingAdd = false } = props;

  const [addModalVisible, setAddModalVisible] = React.useState(false);

  const fetchData = () => {
    dispatch({
      type: 'helpPage/fetchHelpCategoryList',
      payload: {
        country: [selectedCountry],
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, [selectedCountry]);

  return (
    <div className={styles.Category}>
      <div className={styles.headerCategory}>
        <div className={styles.title}>Categories</div>
        <div className={styles.options}>
          <CustomAddButton onClick={() => setAddModalVisible(true)}>Add Category</CustomAddButton>
        </div>
      </div>
      <div className={styles.container}>
        <CategoryTable fetchData={fetchData} />
      </div>
      <CommonModal
        title="Add Category"
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

export default connect(({ helpPage: { selectedCountry } = {}, loading }) => ({
  selectedCountry,
  loadingAdd: loading.effects['helpPage/addHelpCategory'],
}))(Category);
