'use client';

import React, { createContext, useContext, useState } from 'react';
import { MediaItem } from '@/app/types/media';

interface MediaContextType {
  library: MediaItem[];
  currentlyPlaying: MediaItem | null;
  setCurrentlyPlaying: (item: MediaItem | null) => void;
  addToLibrary: (item: MediaItem) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const initialData: MediaItem[] = [
  {
    id: 'a1',
    type: 'anime',
    title: 'Suzume',
    thumbnailUrl: 'https://wallpapers.com/images/hd/suzume-anime-movie-poster-69doru0ca93nyhwn.jpg',
    mediaUrl: 'https://www.dailymotion.com/video/x9te5vk',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Koichiro Ito, Genki Kawamura',
    theme: 'Coming of age, Disaster, Fantasy',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Suzume_(film)',
    mangaUrl: 'https://mangamirai.com/product_collections/a573a65b-6a2a-468e-8783-3bf3fa6e395f',
    imdbRating: '7.7',
    summary: 'A 17-year-old girl named Suzume helps a mysterious young man close doors from the other side that are releasing disasters all over Japan.',
    fullPlot: 'Suzume Iwato is a 17-year-old high school girl who lives with her aunt in a quiet town in Kyushu. One day, she meets a mysterious young man named Sota who is looking for a door. Suzume follows him into the mountains and finds an old, weathered door standing alone in the middle of some ruins. When she reaches out and opens it, she is drawn into a series of events that lead her across Japan, closing "doors" that are releasing supernatural disasters. Along the way, she confronts her own past and the trauma of the 2011 earthquake.',
    moral: 'Coming to terms with past trauma is essential for moving forward.',
    genre: ['Adventure', 'Fantasy'],
    characters: [
      {
        name: "Suzume Iwato",
        image_url: "https://cdn.anisearch.com/images/character/cover/121/121822_400.webp"
      },
      {
        name: "Souta Munakata",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJb7HiZNRg5og-WOFj1kdoacn2WZuN9Z3qseWZxbuyjVpbhrLIjSPSOi2eZWn7sLb2jck7L4dwLTC-1BOz73C_1CIOOzYah-rbnomjLigUg&s=10"
      }
    ]
  },
  {
    id: 'a2',
    type: 'anime',
    title: 'I Want to Eat Your Pancreas',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5496669.jpg',
    mediaUrl: 'https://app.videas.fr/embed/media/69469d2b-d21b-4636-94d2-b6613c005089/',
    creator: 'Shin\'ichirō Ushijima',
    writers: 'Shin\'ichirō Ushijima',
    producers: 'Keisuke Konishi',
    theme: 'Life and Death, Friendship, Romance',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/I_Want_to_Eat_Your_Pancreas_(film)',
    mangaUrl: 'https://www.scribd.com/document/672961829/I-Want-to-Eat-Your-Pancreas-Omnibus-2019-Digital-Danke-Empire-1',
    imdbRating: '8.0',
    summary: 'An aloof high school student finds the diary of his popular classmate and learns she is dying from a pancreatic disease.',
    fullPlot: 'An unnamed high school student finds a diary in a hospital waiting room. It belongs to his popular classmate, Sakura Yamauchi, who reveals she is suffering from a terminal pancreatic illness. Despite their vastly different personalities, they form an unlikely bond as Sakura tries to live her remaining days to the fullest. The story explores the meaning of life, the impact we have on others, and the beauty of human connection.',
    moral: 'Live every day to the fullest, for life is fragile and beautiful.',
    genre: ['Drama', 'Romance'],
    characters: [
      {
        name: "Haruki Shiga",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjUzF9ookHnecPPfp3i10_dZWsynMm06-5CjCeJ-PFiA2GLtiNWASabYTkJ8WwV6JAHZ4pwqzDwPCZ1mGaHXx9w8rqlSXmVLRfdByV6PVZ&s=10"
      },
      {
        name: "Sakura Yamauchi",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyIgIc88ZiIvCSPRK2Y__7CRgve5MQXLoqhJpJSuuzINoPax28tF6xohYYqxTVSTbmZf9R_-cXEQCgicaRBCzsOUAL5AIQX3Py-kKenxQL&s=10"
      }
    ]
  },
  {
    id: 'a3',
    type: 'anime',
    title: 'The Garden of Words',
    thumbnailUrl: 'https://wallpaperaccess.com/full/970464.jpg',
    mediaUrl: 'https://vimeo.com/855974784?fl=pl&fe=sh',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Noritaka Kawaguchi',
    theme: 'Isolation, Growth, Melancholy',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/The_Garden_of_Words',
    mangaUrl: 'https://mangamirai.com/product_collections/0b42561f-0f02-4606-9f49-f15c2f58d3f9',
    imdbRating: '7.4',
    summary: 'A 15-year-old boy training to be a shoemaker skips school on rainy days to sketch shoes in a Japanese garden and meets a mysterious older woman.',
    fullPlot: 'Takao Akizuki, a 15-year-old aspiring shoemaker, skips school on rainy mornings to sketch shoe designs in Shinjuku Gyoen National Garden. There he meets Yukari Yukino, a 27-year-old woman who is also skipping work. Without knowing each other\'s names or backgrounds, they begin to meet every rainy morning, finding solace in each other\'s company as they deal with their own personal struggles and the feeling of being "stuck" in life.',
    moral: 'Sometimes, a brief connection can give us the strength to keep walking.',
    genre: ['Drama', 'Romance'],
    characters: [
      {
        name: "Takao Akizuki",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvSfJY6gPhuAoD_krTYcVI3TFL4PWNpooNgr3PCt0JB5h3H29PEmHRcQTtzmrNiPrs4uNoOUsGyWr5S83wbPn9ViW4-D6XsBmGo7FQqYpH&s=10"
      },
      {
        name: "Yukari Yukino",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIbS1zOmnpnPkUJlslhgA1KogTnAADPCkNfw&s"
      }
    ]
  },
  {
    id: 'a4',
    type: 'anime',
    title: 'A Silent Voice',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5165277.jpg',
    mediaUrl: 'https://www.dropbox.com/scl/fi/wo0nqqg27jckoym42v8hc/a-silent-voice.mp4?rlkey=nl6cmtjct02abzjtebje4ouy2&st=z3n2evlg&dl=0',
    creator: 'Naoko Yamada',
    writers: 'Reiko Yoshida',
    producers: 'Kyoto Animation',
    theme: 'Bullying, Forgiveness, Redemption',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/A_Silent_Voice_(film)',
    mangaUrl: 'https://globalcomix.com/c/a-silent-voice/chapters/en/1/',
    imdbRating: '8.1',
    summary: 'A young man who bullied a deaf classmate in elementary school tries to make amends years later after meeting her again.',
    fullPlot: 'Shoya Ishida is a high school student who is isolated and suicidal. Years earlier, in elementary school, he led the bullying of a deaf girl named Shoko Nishimiya until she transferred schools. The bullying backfired on him, and he became the outcast. Haunted by his actions, Shoya seeks out Shoko to apologize and make amends, beginning a difficult journey of self-forgiveness and learning to connect with others.',
    moral: 'Forgiveness, both for others and oneself, is the path to redemption.',
    genre: ['Drama', 'Romance'],
    characters: [
      {
        name: "Shoya Ishida",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd9IugSfXH5tvuUP0rL3S2R3-9eniMsVr-Ka3CuYMLn1_BYL4OY34C0jAjMRBYum9uNqlK47dF5dRQA2Zv-idqHvjmwzZAF60iFjtgr4yT8g&s=10"
      },
      {
        name: "Shoko Nishimiya",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTduf3cc61Q1zWeRhXeUVnxa4zU2sTpLegMvXxoIPUYTrzieoSdiZEEQUQdlkovNJTElGQXkd_hIXxGCVsKf_NgliRTOsaQbfhZEVSeVq9y&s=10"
      }
    ]
  },
  {
    id: 'a5',
    type: 'anime',
    title: 'Your Name',
    thumbnailUrl: 'https://4kwallpapers.com/images/walls/thumbs_3t/14943.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=vAEc_DMNz00',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Genki Kawamura',
    theme: 'Fate, Time, Connection',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Your_Name',
    mangaUrl: 'https://mangamirai.com/product_collections/6f3fc5a7-18c3-437a-94e4-de43b3929db3',
    imdbRating: '8.4',
    summary: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    fullPlot: 'Mitsuha Miyamizu, a high school girl living in the rural town of Itomori, and Taki Tachibana, a high school boy in Tokyo, suddenly begin to swap bodies periodically. They start communicating by leaving notes on their phones. As they learn about each other\'s lives and help one another, they form a deep bond. However, when the swaps stop, Taki sets out to find Mitsuha, only to discover a devastating truth about Itomori and the role of a comet that passed years ago.',
    moral: 'Destiny is real, but it requires effort and memory to fulfill.',
    genre: ['Fantasy', 'Romance'],
    characters: [
      {
        name: "Taki Tachibana",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8JKCdjiJ0iXhi2WC7yOrE5q8yCyA66HZxH9QcwQNdK7snLkmoNU7iy4OzkiOVkg5HXtugGgX2jvrO8Ye30-B8-H419GBJojRP_ZvTKI2u&s=10"
      },
      {
        name: "Mitsuha Miyamizu",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4CkuUsXgYLlB420EJvf8b9pZSE-fbob-2kjRSO97t17M8LvlqBYfZPJWR-Ig1_o0yNqlSNDb3iQIcY9BXGO-KyoL7DjfT7pdu8u_kCOCl&s=10"
      }
    ]
  },
  {
    id: 'a6',
    type: 'anime',
    title: 'Weathering with You',
    thumbnailUrl: 'https://m.gettywallpapers.com/wp-content/uploads/2021/09/Weathering-With-You-Background-Images.png',
    mediaUrl: 'https://www.dailymotion.com/video/x9fne28',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Genki Kawamura',
    theme: 'Love vs. The World, Climate, Sacrifice',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Weathering_with_You',
    mangaUrl: 'https://kmanga.kodansha.com/title/10233/episode/337946',
    imdbRating: '7.5',
    summary: 'A high-school boy who has run away to Tokyo befriends a girl who appears to be able to manipulate the weather.',
    fullPlot: 'Hodaka Morishima, a high school freshman who runs away from his remote island home to Tokyo, meets Hina Amano, a girl with the mysterious ability to stop the rain and clear the sky. They start a business as "Sunshine Girls," bringing clear weather for special events in a city plagued by endless rain. But Hina\'s power comes with a heavy price, forcing Hodaka to choose between the safety of the world and the girl he loves.',
    moral: 'Sometimes the world\'s balance matters less than the person you love.',
    genre: ['Fantasy', 'Drama'],
    characters: [
      {
        name: "Hodaka Morishima",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkL8svqXCyX9peFJkQgPmBWQeRVNIvOqd0iruYOU8o_OPFwLlDlI_TV2zYitbFrRlMkyjHIpYQGFRfC-Y4vFFq4eABGioqbW4FA4c2HguD7g&s=10"
      },
      {
        name: "Hina Amano",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS67Vz5hpqaOf-r51CBaKFkX-PxGrUZ49VfUTBFrk631sMAPbCTXwWw6_nm34gSnH3I0vlcRsEYE3QqfGQ7941LZBQaw6nXo7WJEeiMkL5ouQ&s=10"
      }
    ]
  },
  {
    id: 'm1',
    type: 'movie',
    title: 'Chhichhore',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp6319679.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=3Q1yTBHjwXc',
    creator: 'Nitesh Tiwari',
    writers: 'Nitesh Tiwari, Piyush Gupta, Nikhil Mehrotra',
    producers: 'Sajid Nadiadwala',
    theme: 'Failure, Friendship, Campus Life',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Chhichhore',
    imdbRating: '8.3',
    summary: 'A group of college friends reunite after a tragic incident involving one of their children, recalling their days as "losers".',
    fullPlot: 'Anni and Maya are a divorced couple whose son attempts suicide after failing the entrance exams. To help him recover, Anni gathers his old college friends—a group once known as "The Losers." They recount their experiences at an engineering college, their participation in an inter-hostel sports championship, and how they learned that the effort put into a journey is more important than the final result.',
    moral: 'Success is not the destination; the effort we put in is what truly counts.',
    genre: ['Comedy', 'Drama']
  },
  {
    id: 'm2',
    type: 'movie',
    title: 'Half Girlfriend',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp8276890.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=AI9r3XjyOXs',
    creator: 'Mohit Suri',
    writers: 'Tushar Hiranandani',
    producers: 'Shobha Kapoor, Ekta Kapoor',
    theme: 'Class Divide, Persistence, Love',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Half_Girlfriend_(film)',
    imdbRating: '4.5',
    summary: 'A young man from a rural area falls in love with a wealthy girl at college, leading to a complex relationship.',
    fullPlot: 'Madhav Jha, a boy from Bihar with poor English skills, gets into a prestigious college in Delhi on a sports quota. He falls in love with Riya Somani, an affluent girl from the city. Riya, hesitant to commit to a full relationship, suggests she be his "Half Girlfriend." The story follows their tumultuous relationship across different cities and years, exploring Madhav\'s unwavering persistence.',
    moral: 'Persistence in love can bridge any gap.',
    genre: ['Romance', 'Drama']
  },
  {
    id: 'm3',
    type: 'movie',
    title: 'Oh My God',
    thumbnailUrl: 'https://i.ytimg.com/vi/1d3WlZAgZ7o/maxresdefault.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=MWxBbTtjmXg',
    creator: 'Umesh Shukla',
    writers: 'Umesh Shukla, Bhavesh Mandalia',
    producers: 'Akshay Kumar, Paresh Rawal',
    theme: 'Religion, Skepticism, Social Commentary',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Oh_My_God!',
    imdbRating: '8.1',
    summary: 'A shopkeeper sues God after his shop is destroyed in an earthquake, leading to a trial that challenges religious norms.',
    fullPlot: 'Kanji Lalji Mehta is an atheist who runs an antique shop. When his shop is destroyed by a minor earthquake—the only shop damaged in the area—the insurance company denies his claim, calling it an "Act of God." Kanji decides to sue God in court, challenging self-proclaimed godmen and religious institutions, eventually meeting Lord Krishna himself in a modern avatar.',
    moral: 'True spirituality is found in humanity, not just in rituals.',
    genre: ['Comedy', 'Fantasy']
  },
  {
    id: 's1',
    type: 'song',
    title: 'Suzume Theme Song',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp12664354.jpg',
    audioBackgroundUrl: 'https://images5.alphacoders.com/131/thumb-1920-1311599.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=m3w1mUXtCj0',
    creator: 'Radwimps',
    description: 'The hauntingly beautiful main theme from the movie Suzume.',
    genre: ['J-Pop', 'Soundtrack']
  },
  {
    id: 's2',
    type: 'song',
    title: 'Fir Bhi Tumko Chahunga',
    thumbnailUrl: 'https://wallpapers.com/images/hd/a-silent-voice-crying-couple-2hrblheq4u5w4q8c.jpg',
    audioBackgroundUrl: 'https://wallpapercat.com/w/full/0/2/d/874883-1920x1080-desktop-1080p-a-silent-voice-anime-wallpaper-photo.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=jQdDpRTVe9k',
    creator: 'Arijit Singh',
    description: 'A soulful ballad about eternal love from the movie Half Girlfriend.',
    genre: ['Bollywood', 'Romantic']
  },
  {
    id: 's3',
    type: 'song',
    title: 'Zara Zara Behekta Hai',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp9190577.jpg',
    audioBackgroundUrl: 'https://wallpaperaccess.com/full/970464.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=NeXbmEnpSz0',
    creator: 'Bombay Jayashri',
    description: 'A timeless romantic classic from Rehnaa Hai Terre Dil Mein.',
    genre: ['Bollywood', 'Romantic']
  },
  {
    id: 'sh1',
    type: 'short',
    title: 'True Love Never Ends',
    thumbnailUrl: 'https://picsum.photos/seed/truelove/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/9d1N4c5tHxQ',
    creator: 'LoveStories',
    description: 'A short visual poem about the enduring nature of love.'
  },
  {
    id: 'sh2',
    type: 'short',
    title: 'Life in Perspective',
    thumbnailUrl: 'https://picsum.photos/seed/perspective/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/wXpvE2QLgio',
    creator: 'DailyInsights',
    description: 'A profound look at life through a different lens.'
  }
];

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<MediaItem[]>(initialData);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const addToLibrary = (item: MediaItem) => {
    setLibrary((prev) => [item, ...prev]);
  };

  return (
    <MediaContext.Provider value={{ 
      library, 
      currentlyPlaying, 
      setCurrentlyPlaying, 
      addToLibrary,
      searchTerm,
      setSearchTerm
    }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error('useMedia must be used within a MediaProvider');
  return context;
};
