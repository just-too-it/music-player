import { Player } from 'components/Player/Player';
import { playList } from 'core/data';

import styles from './Home.module.scss';

export const Home = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Player playList={playList} />
      </div>
    </div>
  );
};
