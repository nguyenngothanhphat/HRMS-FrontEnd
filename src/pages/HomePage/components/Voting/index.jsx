import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import BarGraph from './components/BarGraph';
import styles from './index.less';
import Options from './components/Options';
import { TAB_IDS } from '@/utils/homePage';

const Voting = (props) => {
  const { dispatch } = props;

  // redux
  const {
    homePage: { postsByType = [], pollResult = [], selectedPollOption = {} } = {},
    loadingFetchPollResult = '',
    loadingFetchPostList = false,
    user: { currentUser: { employee = {} } = {} } = {},
  } = props;

  const [isVoted, setIsVoted] = useState(false);
  const [options, setOptions] = useState([]);
  const [activePoll, setActivePoll] = useState({});
  const [votedOption, setVotedOption] = useState('');

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchPostListByTypeEffect',
      payload: {
        postType: TAB_IDS.POLL,
      },
    });
  };

  const fetchSelectedPollOptionByEmployee = (pollId) => {
    dispatch({
      type: 'homePage/fetchSelectedPollOptionByEmployeeEffect',
      payload: {
        pollId,
        employee: employee._id,
      },
    });
  };

  const fetchPollResult = (pollId) => {
    return dispatch({
      type: 'homePage/fetchPollResultEffect',
      payload: {
        pollId,
      },
    });
  };

  useEffect(() => {
    if (activePoll?._id) {
      const pollId = activePoll._id;
      fetchPollResult(pollId);
      fetchSelectedPollOptionByEmployee(pollId);
    }
  }, [JSON.stringify(activePoll)]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (postsByType.length > 0) {
      const [firstPoll] = postsByType;
      setActivePoll(firstPoll);
    }
  }, [JSON.stringify(postsByType)]);

  useEffect(() => {
    const temp = [
      {
        id: 'response1',
        text: activePoll?.pollDetail?.response1,
        percent: pollResult.find((x) => x._id === 'response1')?.percent || 0,
      },
      {
        id: 'response2',
        text: activePoll?.pollDetail?.response2,
        percent: pollResult.find((x) => x._id === 'response2')?.percent || 0,
      },
      {
        id: 'response3',
        text: activePoll?.pollDetail?.response3,
        percent: pollResult.find((x) => x._id === 'response3')?.percent || 0,
      },
    ];
    setOptions(temp);
  }, [JSON.stringify(pollResult), JSON.stringify(activePoll)]);

  useEffect(() => {
    if (selectedPollOption?.choice) {
      setIsVoted(true);
      setVotedOption(selectedPollOption?.choice);
    }
  }, [JSON.stringify(selectedPollOption)]);

  const countVotes = () => {
    return pollResult.reduce((acc, obj) => {
      return acc + obj.count;
    }, 0);
  };

  if (loadingFetchPollResult || loadingFetchPostList) {
    return (
      <div className={styles.Voting}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.Voting}>
      {isVoted ? (
        <BarGraph
          options={options}
          activePoll={activePoll}
          votedOption={votedOption}
          countVotes={countVotes}
        />
      ) : (
        <Options
          setIsVoted={setIsVoted}
          options={options}
          activePoll={activePoll}
          refreshPoll={fetchPollResult}
          countVotes={countVotes}
          setVotedOption={setVotedOption}
        />
      )}
    </div>
  );
};

export default connect(({ loading, homePage, user }) => ({
  homePage,
  user,
  loadingFetchPostList: loading.effects['homePage/fetchPostListByTypeEffect'],
  loadingFetchPollResult: loading.effects['homePage/fetchPollResultEffect'],
}))(Voting);
