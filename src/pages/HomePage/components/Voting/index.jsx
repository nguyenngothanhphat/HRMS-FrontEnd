import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import moment from 'moment';
import BarGraph from './components/BarGraph';
import styles from './index.less';
import Options from './components/Options';
import EmptyComponent from '@/components/Empty';
import { TAB_IDS } from '@/utils/homePage';

const Voting = (props) => {
  const { dispatch } = props;

  // redux
  const {
    homePage: {
      postsByType = [],
      selectedPollOption: { choiceSummary = [], choice = {} } = {},
    } = {},
    loadingFetchPollResult = '',
    loadingFetchPostList = false,
    user: { currentUser: { employee = {} } = {} } = {},
  } = props;

  const [isVoted, setIsVoted] = useState(false);
  const [options, setOptions] = useState([]);
  const [activePoll, setActivePoll] = useState('');
  const [votedOption, setVotedOption] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchPostListByTypeEffect',
      payload: {
        postType: TAB_IDS.POLL,
      },
    });
  };

  const fetchSelectedPollOptionByEmployee = () => {
    if (activePoll?._id) {
      dispatch({
        type: 'homePage/fetchSelectedPollOptionByEmployeeEffect',
        payload: {
          pollId: activePoll?._id,
          employee: employee._id,
        },
      });
    }
  };

  useEffect(() => {
    if (activePoll) {
      const { endDate } = activePoll.pollDetail || {};
      if (endDate) {
        moment.locale('en', {
          relativeTime: {
            future: '%s left',
            past: 'Expired',
            s: 'seconds',
            ss: '%ss',
            m: 'a minute',
            mm: '%dm',
            h: 'an hour',
            hh: '%dh',
            d: 'a day',
            dd: '%dd',
            M: 'a month',
            MM: '%dM',
            y: 'a year',
            yy: '%dY',
          },
        });
        const timeLeftTemp = moment(endDate).fromNow();
        setTimeLeft(timeLeftTemp);
      }
    }
  }, [JSON.stringify(activePoll)]);

  useEffect(() => {
    fetchSelectedPollOptionByEmployee();
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
    if (choiceSummary) {
      const temp = [
        {
          id: 'response1',
          text: activePoll?.pollDetail?.response1,
          percent: choiceSummary.find((x) => x._id === 'response1')?.percent || 0,
        },
        {
          id: 'response2',
          text: activePoll?.pollDetail?.response2,
          percent: choiceSummary.find((x) => x._id === 'response2')?.percent || 0,
        },
        {
          id: 'response3',
          text: activePoll?.pollDetail?.response3,
          percent: choiceSummary.find((x) => x._id === 'response3')?.percent || 0,
        },
      ];
      setOptions(temp);
    }
  }, [JSON.stringify(choiceSummary), JSON.stringify(activePoll)]);

  useEffect(() => {
    if (choice?.choice) {
      setIsVoted(true);
      setVotedOption(choice.choice);
    }
  }, [JSON.stringify(choice)]);

  const countVotes = () => {
    if (choiceSummary) {
      return choiceSummary.reduce((acc, obj) => {
        return acc + obj.count;
      }, 0);
    }
    return 0;
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
  if (!activePoll) {
    return (
      <div className={styles.Voting}>
        <EmptyComponent description="No poll available" />
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
          timeLeft={timeLeft}
        />
      ) : (
        <Options
          setIsVoted={setIsVoted}
          options={options}
          activePoll={activePoll}
          refreshPoll={fetchSelectedPollOptionByEmployee}
          countVotes={countVotes}
          setVotedOption={setVotedOption}
          timeLeft={timeLeft}
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
