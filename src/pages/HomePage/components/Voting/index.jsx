import React, { useState } from 'react';
import BarGraph from './components/BarGraph';
import styles from './index.less';
import Options from './components/Options';

const mockOptions = [
  {
    id: 1,
    text: '🤩 Wayyy too excited, cannot wait!!',
    percent: 54,
  },
  {
    id: 2,
    text: '😇 Ready for the change, I guess!',
    percent: 42,
  },
  {
    id: 3,
    text: '🥱 Meh, want some more time',
    percent: 4,
  },
];

const Voting = () => {
  const [isVoted, setIsVoted] = useState(false);

  return (
    <div className={styles.Voting}>
      {isVoted ? (
        <BarGraph options={mockOptions} />
      ) : (
        <Options setIsVoted={setIsVoted} options={mockOptions} />
      )}
    </div>
  );
};

export default Voting;
