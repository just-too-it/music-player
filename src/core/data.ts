import { Track } from 'components/Player/Player.types';
import track1 from '../assets/tracks/bensound-nightandday.mp3';
import track2 from '../assets/tracks/bensound-league.mp3';
import track3 from '../assets/tracks/bensound-truehero.mp3';
import cover1 from '../assets/img/soyb.webp'
import cover2 from '../assets/img/risian.webp'
import cover3 from '../assets/img/dpmusic.webp'


export const playList: Track[] = [
    {
      id: 1,
      name: '#1.Night and Day',
      src: track1,
      musician: 'Soyb',
      cover: cover1
    },
    {
      id: 2,
      name: '#2.League',
      src: track2,
      musician: 'Risian',
      cover: cover2
    },
    {
      id: 3,
      name: '#3.True Hero',
      src: track3,
      musician: 'DPMusic',
      cover: cover3
    }
  ]