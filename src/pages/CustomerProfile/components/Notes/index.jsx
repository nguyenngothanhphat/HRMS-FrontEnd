import { Form, Spin } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'umi';
import CommentBox from '@/components/CommentBox';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterPopover from '@/components/FilterPopover';
import { DATE_FORMAT_MDY } from '@/constants/dateFormat';
import FilterContent from './components/FilterContent';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';

const Notes = (props) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const {
    dispatch,
    info: { customerId = '' } = {},
    notes = [],
    reId,
    employeeList = [],
    loadingFetchNotes = false,
    loadingAddNote = false,
    employee = {},
  } = props;

  const [searchValue, setSearchValue] = useState('');
  const [noteValue, setNoteValue] = useState('');
  const [filter, setFilter] = useState({});

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: messagesEndRef.current?.offsetTop,
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  }, [notes]);

  const fetchNotes = () => {
    dispatch({
      type: 'customerProfile/fetchNotes',
      payload: {
        id: customerId,
      },
    });
  };

  const filterNotes = () => {
    dispatch({
      type: 'customerProfile/filterNotes',
      payload: {
        customerId,
        author: filter?.byAuthor,
        fromDate: filter?.fromDate,
        toDate: filter?.toDate,
      },
    });
  };

  useEffect(() => {
    fetchNotes();
  }, [customerId]);

  useEffect(() => {
    filterNotes();
  }, [JSON.stringify(filter)]);

  const renderNotes = () => {
    if (!notes || notes.length === 0) {
      return <EmptyComponent />;
    }
    return (
      <div className={styles.documentBody} ref={containerRef}>
        {notes.map((note, i) => {
          const { owner = '', text = '' } = note;
          const time = moment(note.created_at).locale('en').format(DATE_FORMAT_MDY);
          return (
            <div className={styles.note} ref={i + 1 === notes.length ? messagesEndRef : null}>
              <p>{text}</p>
              <div className={styles.smallText}>
                <span className={styles.author}>{owner}</span>
                <span className={styles.time}>{time}</span>
              </div>
            </div>
          );
        })}
        {/* <div ref={messagesEndRef} /> */}
      </div>
    );
  };

  const addNote = () => {
    dispatch({
      type: 'customerProfile/addNote',
      payload: {
        text: noteValue,
        owner: employee?.generalInfo?.legalName,
        owner_id: employee?._id,
        customerId: reId,
      },
    }).then(() => {
      setNoteValue('');
    });
  };

  const onFilter = (values) => {
    setFilter(values);
  };

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  return (
    <div className={styles.Notes}>
      <div className={styles.documentHeader}>
        <div className={styles.documentHeaderTitle}>
          <span>Notes</span>
        </div>
        <div className={styles.documentHeaderFunction}>
          <FilterPopover
            placement="bottomRight"
            content={<FilterContent employeeList={employeeList} onFilter={onFilter} />}
          >
            <CustomOrangeButton />
          </FilterPopover>
          <CustomSearchBox placeholder="Search by Key Words" onSearch={onSearch} />
        </div>
      </div>

      <Spin spinning={loadingFetchNotes}>{renderNotes()}</Spin>

      <div className={styles.notesFooter}>
        <CommentBox
          placeholder="Add a note for reference"
          submitText="Add notes"
          onChange={(val) => setNoteValue(val)}
          onSubmit={addNote}
          value={noteValue}
          disabled={loadingAddNote}
        />
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    location: { companyLocationList = [] } = {},
    user: { companiesOfUser = [], currentUser: { employee = {} } = {} } = {},
    customerProfile: { info: { customerId = '' } = {}, notes = [] } = {},
    customerManagement: { employeeList = [] } = {},
  }) => ({
    loadingFetchNotes:
      loading.effects['customerProfile/fetchNotes'] ||
      loading.effects['customerProfile/filterNotes'],
    loadingAddNote: loading.effects['customerProfile/addNote'],
    notes,
    customerId,
    employee,
    companyLocationList,
    companiesOfUser,
    employeeList,
  }),
)(Notes);
