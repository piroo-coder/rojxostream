
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MediaItem } from '@/app/types/media';

interface MediaContextType {
  library: MediaItem[];
  currentlyPlaying: MediaItem | null;
  setCurrentlyPlaying: (item: MediaItem | null) => void;
  addToLibrary: (item: MediaItem) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
}

const initialData: MediaItem[] = [
  {
    id: 'a1',
    type: 'anime',
    title: 'Suzume',
    thumbnailUrl: 'https://wallpapers.com/images/hd/suzume-anime-movie-poster-69doru0ca93nyhwn.jpg',
    mediaUrl: 'https://www.dailymotion.com/video/x9te5vk',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=_KFk8FVr4mk',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Koichiro Ito, Genki Kawamura',
    theme: 'Coming of age, Disaster, Fantasy',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Suzume_(film)',
    mangaUrl: 'https://mangamirai.com/product_collections/a573a65b-6a2a-468e-8783-3bf3fa6e395f',
    imdbRating: '7.7',
    summary: 'A 17-year-old girl named Suzume helps a mysterious young man close doors from the other side that are releasing disasters all over Japan.',
    fullPlot: 'Suzume Iwato is a 17-year-old high school girl who lives with her aunt in a quiet town in Kyushu. One day, she meets a mysterious young man named Sota who is looking for a door.',
    moral: 'Coming to terms with past trauma is essential for moving forward.',
    genre: ['Adventure', 'Fantasy'],
    relatedShortIds: ['sh10'],
    characters: [
      {
        name: "Suzume Iwato",
        role: "Main Protagonist",
        description: "A determined 17-year-old girl living in a quiet town in Kyushu. After a chance encounter with Souta, she embarks on a journey across Japan to close the 'doors' that release disasters. Her bravery stems from a hidden past and her desire to protect the beauty of the world she inhabits.",
        image_url: "https://cdn.anisearch.com/images/character/cover/121/121822_400.webp",
        background_url: "https://images.wallpapersden.com/image/download/suzume-iwato-by-shijo-art_bmZmZWeUmZqaraWkpJRobWllrWZrZmw.jpg"
      },
      {
        name: "Souta Munakata",
        role: "The Closer",
        description: "A mysterious young man who travels Japan as a 'Closer,' shutting doors that threaten the safety of the human world. He is a teacher-in-training with a deep sense of responsibility. During the story, he is cursed and transformed into a three-legged wooden chair, relying on Suzume to help him fulfill his duty.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJb7HiZNRg5og-WOFj1kdoacn2WZuN9Z3qseWZxbuyjVpbhrLIjSPSOi2eZWn7sLb2jck7L4dwLTC-1BOz73C_1CIOOzYah-rbnomjLigUg&s=10",
        background_url: "https://images6.alphacoders.com/137/1375520.jpg"
      }
    ],
    criticalAnalysis: {
      characterMotivations: [
        { topic: "Suzume's Drive", explanation: "Her obsession with the 'doors' is a subconscious attempt to process the unresolved grief of losing her mother." },
        { topic: "Souta's Duty", explanation: "As a 'Closer', Souta views his role as a spiritual stewardship of the land's forgotten history." }
      ],
      narrativeEvents: [
        { event: "The Worm and the Doors", explanation: "Disasters manifest in abandoned ruins where the 'weight' of human emotion and memory has faded." },
        { event: "Closing the Past", explanation: "Each door closed represents Suzume acknowledging a piece of history that was abandoned." }
      ],
      writersMessage: "Shinkai suggests that we cannot simply abandon the places of our past; we must acknowledge their history with gratitude to move forward.",
      realLifeRelation: "The film is a direct dialogue with the 2011 Great East Japan Earthquake, reflecting collective trauma and healing.",
      importanceToUs: "It teaches us that resilience isn't about forgetting, but about the courage to face our deepest fears."
    }
  },
  {
    id: 'a2',
    type: 'anime',
    title: 'I Want to Eat Your Pancreas',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5496669.jpg',
    mediaUrl: 'https://app.videas.fr/embed/media/69469d2b-d21b-4636-94d2-b6613c005089/',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=vYqD3PEFRno',
    creator: 'Shin\'ichirō Ushijima',
    writers: 'Shin\'ichirō Ushijima',
    producers: 'Keisuke Konishi',
    theme: 'Life and Death, Friendship, Romance',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/I_Want_to_Eat_Your_Pancreas_(film)',
    mangaUrl: 'https://www.scribd.com/document/672961829/I-Want-to-Eat-Your-Pancreas-Omnibus-2019-Digital-Danke-Empire-1',
    imdbRating: '8.0',
    summary: 'An aloof high student student finds the diary of his popular classmate and learns she is dying from a pancreatic disease.',
    moral: 'Live every day to the fullest, for life is fragile and beautiful.',
    genre: ['Drama', 'Romance'],
    relatedShortIds: ['sh8', 'sh9', 'sh5', 'sh7', 'sh14'],
    characters: [
      {
        name: "Haruki Shiga",
        role: "Protagonist",
        description: "An introverted and socially detached high school student who prefers books over people. He believes that others have no interest in him, so he has no interest in them. His life changes when he finds Sakura's 'Living with Dying' journal, forcing him to engage with the reality of human connection.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjUzF9ookHnecPPfp3i10_dZWsynMm06-5CjCeJ-PFiA2GLtiNWASabYTkJ8WwV6JAHZ4pwqzDwPCZ1mGaHXx9w8rqlSXmVLRfdByV6PVZ&s=10",
        background_url: "https://images.alphacoders.com/137/thumb-1920-1373558.png"
      },
      {
        name: "Sakura Yamauchi",
        role: "Female Lead",
        description: "A cheerful and popular girl who suffers from a terminal pancreatic illness. Despite her grim prognosis, she remains vibrant and chooses to live her remaining days to the fullest. She seeks out Haruki's companionship because he is the only person outside her family who knows her secret and treats her normally.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyIgIc88ZiIvCSPRK2Y__7CRgve5MQXLoqhJpJSuuzINoPax28tF6xohYYqxTVSTbmZf9R_-cXEQCgicaRBCzsOUAL5AIQX3Py-kKenxQL&s=10",
        background_url: "https://wallpapercave.com/wp/wp4089781.png"
      }
    ],
    criticalAnalysis: {
      characterMotivations: [
        { topic: "Sakura's Choice", explanation: "She chooses Haruki precisely because he doesn't pity her; he provides the 'normality' she craves." },
        { topic: "Haruki's Distance", explanation: "His stoicism is a defense mechanism to avoid the vulnerability of loss." }
      ],
      narrativeEvents: [
        { event: "The Library Scenes", explanation: "Represent the preservation of stories and the building of an emotional archive." },
        { event: "The Sudden Ending", explanation: "A brutal reminder that death is often unexpected and doesn't wait for a 'natural' end." }
      ],
      writersMessage: "Life isn't measured by time, but by the connections we make. To 'live' is to be acknowledged by others.",
      realLifeRelation: "Speaks to the universal struggle of finding meaning when faced with the finitude of life.",
      importanceToUs: "It serves as a profound call to express love for others while we still have the chance."
    }
  },
  {
    id: 'a3',
    type: 'anime',
    title: 'The Garden of Words',
    thumbnailUrl: 'https://wallpaperaccess.com/full/970464.jpg',
    mediaUrl: 'https://vimeo.com/855974784?fl=pl&fe=sh',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=q9KLjQJ_ZYc',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Noritaka Kawaguchi',
    theme: 'Isolation, Growth, Melancholy',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/The_Garden_of_Words',
    mangaUrl: 'https://mangamirai.com/product_collections/0b42561f-0f02-4606-9f49-f15c2f58d3f9',
    imdbRating: '7.4',
    summary: 'A 15-year-old boy training to be a shoemaker skips school on rainy days and meets a mysterious older woman in a Japanese garden.',
    moral: 'Sometimes, a brief connection can give us the strength to keep walking.',
    genre: ['Drama', 'Romance'],
    relatedShortIds: ['sh15'],
    characters: [
      {
        name: "Takao Akizuki",
        role: "Student / Aspiring Shoemaker",
        description: "A mature and hardworking 15-year-old high schooler who feels out of place among his peers. He skips morning classes on rainy days to design shoes in Shinjuku Gyoen National Garden. His passion for shoemaking is a metaphor for his desire to help people walk forward in life.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvSfJY6gPhuAoD_krTYcVI3TFL4PWNpooNgr3PCt0JB5h3H29PEmHRcQTtzmrNiPrs4uNoOUsGyWr5S83wbPn9ViW4-D6XsBmGo7FQqYpH&s=10",
        background_url: "https://wallpapercat.com/w/full/a/6/6/33019-1920x1080-desktop-full-hd-the-garden-of-words-background-photo.jpg"
      },
      {
        name: "Yukari Yukino",
        role: "Literature Teacher",
        description: "A 27-year-old literature teacher who has become emotionally paralyzed by professional bullying and personal isolation. She has lost her sense of taste—except for chocolate and beer—and spends rainy mornings in the garden to avoid the pain of her reality.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIbS1zOmnpnPkUJlslhgA1KogTnAADPCkNfw&s",
        background_url: "https://wallpapers.com/images/hd/yukari-yukino-the-elegant-literature-teacher-in-the-autumn-setting-70atccva2q6f522v.jpg"
      }
    ],
    criticalAnalysis: {
      characterMotivations: [
        { topic: "Takao's Shoes", explanation: "Shoemaking is a metaphor for his desire to stand on his own feet and walk into a meaningful future." },
        { topic: "Yukari's Stagnation", explanation: "Paralyzed by professional bullying, the garden is a sanctuary where she doesn't have to follow society's rules." }
      ],
      narrativeEvents: [
        { event: "The Rainy Season", explanation: "The rain acts as a physical and emotional boundary that separates them from harsh expectations." },
        { event: "The Final Confrontation", explanation: "An explosive release of repressed loneliness, forcing them to finally step out of the shadows." }
      ],
      writersMessage: "Even unconventional and brief relationships can provide the essential emotional footing needed to overcome major hurdles.",
      realLifeRelation: "Relates to urban loneliness and the difficulty of finding emotional support in rigid social structures.",
      importanceToUs: "It validates the small, quiet connections that save us when the world feels overwhelming."
    }
  },
  {
    id: 'a4',
    type: 'anime',
    title: 'A Silent Voice',
    thumbnailUrl: 'https://wallpapercave.com/wp/wp5165277.jpg',
    mediaUrl: 'https://www.dropbox.com/scl/fi/wo0nqqg27jckoym42v8hc/a-silent-voice.mp4?rlkey=nl6cmtjct02abzjtebje4ouy2&st=z3n2evlg&dl=0',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=NgqzkrvdIo0',
    creator: 'Naoko Yamada',
    writers: 'Reiko Yoshida',
    producers: 'Kyoto Animation',
    theme: 'Bullying, Forgiveness, Redemption',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/A_Silent_Voice_(film)',
    mangaUrl: 'https://globalcomix.com/globalcomix/a-silent-voice/chapters/en/1/',
    imdbRating: '8.1',
    summary: 'A young man who bullied a deaf classmate tries to make amends years later after meeting her again.',
    moral: 'Forgiveness, both for others and oneself, is the path to redemption.',
    genre: ['Drama', 'Romance'],
    relatedShortIds: ['sh16'],
    characters: [
      {
        name: "Shoya Ishida",
        role: "Redemption Seeker",
        description: "A young man carrying the heavy burden of his elementary school days when he was a cruel bully. After being ostracized himself, he becomes socially anxious and suicidal. He spends his high school years trying to redeem himself by learning sign language and seeking out Shoko to apologize.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd9IugSfXH5tvuUP0rL3S2R3-9eniMsVr-Ka3CuYMLn1_BYL4OY34C0jAjMRBYum9uNqlK47dF5dRQA2Zv-idqHvjmwzZAF60iFjtgr4yT8g&s=10",
        background_url: "https://wallpapercave.com/wp/wp9065446.jpg"
      },
      {
        name: "Shoko Nishimiya",
        role: "Deaf Protagonist",
        description: "A compassionate and resilient girl who was bullied in childhood due to her hearing impairment. She struggles with deep-seated feelings of self-hatred and worthlessness, believing her existence is a burden to those around her. Her journey is one of learning to love herself and accept help.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTduf3cc61Q1zWeRhXeUVnxa4zU2sTpLegMvXxoIPUYTrzieoSdiZEEQUQdlkovNJTElGQXkd_hIXxGCVsKf_NgliRTOsaQbfhZEVSeVq9y&s=10",
        background_url: "https://a.storyblok.com/f/178900/1777x958/1694fb88f5/f97bccfb6867da83702656437fa37f951596235047_main.jpg/m/filters:quality(95)format(webp)"
      }
    ],
    criticalAnalysis: {
      characterMotivations: [
        { topic: "Shoya's Guilt", explanation: "His self-isolation is self-punishment; he believes he has lost the right to connect with others." },
        { topic: "Shoko's Self-Blame", explanation: "She internalizes the trouble her disability causes, leading to a belief that she shouldn't exist." }
      ],
      narrativeEvents: [
        { event: "The 'X' on Faces", explanation: "A powerful visual metaphor for social anxiety and Shoya's refusal to see the humanity in others." },
        { event: "The Bridge Scene", explanation: "The focal point where communication fails and then finally, painfully, begins to succeed." }
      ],
      writersMessage: "True listening goes beyond sound. Redemption requires the courage to face one's past honestly.",
      realLifeRelation: "A searingly accurate portrayal of the long-term impact of bullying and living with a disability.",
      importanceToUs: "Reminds us that everyone has a voice worth hearing, and connection is always possible."
    }
  },
  {
    id: 'a5',
    type: 'anime',
    title: 'Your Name',
    thumbnailUrl: 'https://4kwallpapers.com/images/walls/thumbs_3t/14943.jpg',
    mediaUrl: 'https://www.youtube.com/watch?v=vAEc_DMNz00',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=4KhPxND5x1E',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Genki Kawamura',
    theme: 'Fate, Time, Connection',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Your_Name',
    mangaUrl: 'https://mangamirai.com/product_collections/6f3fc5a7-18c3-437a-94e4-de43b3929db3',
    imdbRating: '8.4',
    summary: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    moral: 'Destiny is real, but it requires effort and memory to fulfill.',
    genre: ['Fantasy', 'Romance'],
    relatedShortIds: ['sh17'],
    characters: [
      {
        name: "Taki Tachibana",
        role: "Tokyo High Schooler",
        description: "A hardworking and impulsive high school boy living in the bustling city of Tokyo. He spends his days at school and his nights working at an Italian restaurant. When he starts swapping bodies with Mitsuha, he develops a protective and deep-rooted bond with a girl he has never physically met.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8JKCdjiJ0iXhi2WC7yOrE5q8yCyA66HZxH9QcwQNdK7snLkmoNU7iy4OzkiOVkg5HXtugGgX2jvrO8Ye30-B8-H419GBJojRP_ZvTKI2u&s=10",
        background_url: "https://images4.alphacoders.com/773/thumb-1920-773256.png"
      },
      {
        name: "Mitsuha Miyamizu",
        role: "Shrine Maiden",
        description: "A teenage girl living in the rural town of Itomori. As part of a traditional family, she serves as a shrine maiden, though she longs for the life of a boy in Tokyo. She is responsible and deeply connected to her family's heritage, which plays a crucial role in the supernatural events of the film.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4CkuUsXgYLlB420EJvf8b9pZSE-fbob-2kjRSO97t17M8LvlqBYfZPJWR-Ig1_o0yNqlSNDb3iQIcY9BXGO-KyoL7DjfT7pdu8u_kCOCl&s=10",
        background_url: "https://images2.alphacoders.com/829/thumb-1920-829298.png"
      }
    ],
    criticalAnalysis: {
      characterMotivations: [
        { topic: "Empathy via Swapping", explanation: "Living each other's lives forces an absolute level of empathy that transcends typical romance." },
        { topic: "The Search", explanation: "Driven by a fading memory of the heart that refuses to be ignored." }
      ],
      narrativeEvents: [
        { event: "The Comet Tiamat", explanation: "Symbolizes both the beauty and the terrifying unpredictability of fate." },
        { event: "Musubi", explanation: "The philosophy of 'twisting and tangling' threads representing time and relationships." }
      ],
      writersMessage: "True connection can bridge even the widest gaps of time and space if we fight to remember it.",
      realLifeRelation: "Speaks to the modern feeling of loss—traditions, places, and lost connections.",
      importanceToUs: "It gives hope that the people we are meant to find are searching for us too."
    }
  },
  {
    id: 'a6',
    type: 'anime',
    title: 'Weathering with You',
    thumbnailUrl: 'https://m.gettywallpapers.com/wp-content/uploads/2021/09/Weathering-With-You-Background-Images.png',
    mediaUrl: 'https://www.dailymotion.com/video/x9fne28',
    hindiExplanationUrl: 'http://www.youtube.com/watch?v=KN1B7CN574g',
    creator: 'Makoto Shinkai',
    writers: 'Makoto Shinkai',
    producers: 'Genki Kawamura',
    theme: 'Love vs. The World, Climate, Sacrifice',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Weathering_with_You',
    mangaUrl: 'https://kmanga.kodansha.com/title/10233/episode/337946',
    imdbRating: '7.5',
    summary: 'A high-school boy who has run away to Tokyo befriends a girl who appears to be able to manipulate the weather.',
    moral: 'Sometimes the world\'s balance matters less than the person you love.',
    genre: ['Fantasy', 'Drama'],
    relatedShortIds: ['sh18'],
    characters: [
      {
        name: "Hodaka Morishima",
        role: "Runaway Teenager",
        description: "A 16-year-old high school student who runs away from his isolated island home to the rain-soaked streets of Tokyo. He is determined to find a sense of freedom and belonging, eventually finding it with Hina and a small publishing company. His love for Hina drives him to challenge the laws of nature itself.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkL8svqXCyX9peFJkQgPmBWQeRVNIvOqd0iruYOU8o_OPFwLlDlI_TV2zYitbFrRlMkyjHIpYQGFRfC-Y4vFFq4eABGioqbW4FA4c2HguD7g&s=10",
        background_url: "https://wallpapercave.com/wp/wp7123135.png"
      },
      {
        name: "Hina Amano",
        role: "The Sunshine Girl",
        description: "A kind and resilient young girl living alone with her younger brother in Tokyo. She possesses the supernatural ability to stop the rain and bring out the sun through prayer. Despite the physical toll her powers take on her, she uses them to bring happiness to others until the cost becomes too great to ignore.",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS67Vz5hpqaOf-r51CBaKFkX-PxGrUZ49VfUTBFrk631sMAPbCTXwWw6_nm34gSnH3I0vlcRsEYE3QqfGQ7941LZBQaw6nXo7WJEeiMkL5ouQ&s=10",
        background_url: "https://gdm-universal-media.b-cdn.net/epicstream/848008dd6c31cc64bda73f738edd43729ceffcf7-1280x720.jpg?width=1600&height=840"
      }
    ],
    criticalAnalysis: {
      characterMotivations: [
        { topic: "Hodaka's Rebellion", explanation: "He runs away to find agency in a world where adults feel suffocating and rigid." },
        { topic: "Hina's Sacrifice", explanation: "She accepts her fate as the 'Sunshine Girl' because it gives her purpose and supports her brother." }
      ],
      narrativeEvents: [
        { event: "The Gun", explanation: "Symbolizes the dangerous and messy power of youthful desperation in a world that doesn't listen." },
        { event: "The Submerged Tokyo", explanation: "A radical choice that validates individual happiness over the status quo." }
      ],
      writersMessage: "We should not sacrifice the happiness of individuals to fix a world broken by previous generations.",
      realLifeRelation: "A poignant commentary on climate change anxiety and the weight placed on young people.",
      importanceToUs: "Choosing love and joy in a darkening world is a valid and powerful act of rebellion."
    }
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
    genre: ['Bollywood', 'Romantic']
  },
  {
    id: 'sh1',
    type: 'short',
    title: 'Multiverse Explorer 01',
    thumbnailUrl: 'https://picsum.photos/seed/sh1/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/_wHs0P8Pk04',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh2',
    type: 'short',
    title: 'Multiverse Explorer 02',
    thumbnailUrl: 'https://picsum.photos/seed/sh2/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/0Ra8W_ppRhA',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh3',
    type: 'short',
    title: 'Multiverse Explorer 03',
    thumbnailUrl: 'https://picsum.photos/seed/sh3/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/UoeLg6pzgEw',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh4',
    type: 'short',
    title: 'Multiverse Explorer 04',
    thumbnailUrl: 'https://picsum.photos/seed/sh4/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/EdhaSFvY42s',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh5',
    type: 'short',
    title: 'Multiverse Explorer 05',
    thumbnailUrl: 'https://picsum.photos/seed/sh5/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/DDswrlId7_I',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh6',
    type: 'short',
    title: 'Multiverse Explorer 06',
    thumbnailUrl: 'https://picsum.photos/seed/sh6/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/XbXRxPulY5o',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh7',
    type: 'short',
    title: 'Multiverse Explorer 07',
    thumbnailUrl: 'https://picsum.photos/seed/sh7/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/PlpSDr_5Roc',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh8',
    type: 'short',
    title: 'Multiverse Explorer 08',
    thumbnailUrl: 'https://picsum.photos/seed/sh8/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/CdyaALQHMj8',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh9',
    type: 'short',
    title: 'Multiverse Explorer 09',
    thumbnailUrl: 'https://picsum.photos/seed/sh9/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/WZiw_ICBf7c',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh10',
    type: 'short',
    title: 'Multiverse Explorer 10',
    thumbnailUrl: 'https://picsum.photos/seed/sh10/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/5F3aj-m-OVQ',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh11',
    type: 'short',
    title: 'Multiverse Explorer 11',
    thumbnailUrl: 'https://picsum.photos/seed/sh11/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/bPyKxKlmYpk',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh12',
    type: 'short',
    title: 'Multiverse Explorer 12',
    thumbnailUrl: 'https://picsum.photos/seed/sh12/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/lbvv1sVBHJw',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh13',
    type: 'short',
    title: 'Multiverse Explorer 13',
    thumbnailUrl: 'https://picsum.photos/seed/sh13/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/9d1N4c5tHxQ',
    creator: 'RojXO Creator'
  },
  {
    id: 'sh14',
    type: 'short',
    title: 'I Want to Eat Your Pancreas Special',
    thumbnailUrl: 'https://picsum.photos/seed/sh14/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/CyjfAZxLdt8',
    creator: 'Anime Archive'
  },
  {
    id: 'sh15',
    type: 'short',
    title: 'Garden of Words Moments',
    thumbnailUrl: 'https://picsum.photos/seed/sh15/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/nm0kCdfOT8Y',
    creator: 'Anime Archive'
  },
  {
    id: 'sh16',
    type: 'short',
    title: 'A Silent Voice Emotional',
    thumbnailUrl: 'https://picsum.photos/seed/sh16/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/8OvZrHf2CG0',
    creator: 'Anime Archive'
  },
  {
    id: 'sh17',
    type: 'short',
    title: 'Your Name Fantasy',
    thumbnailUrl: 'https://picsum.photos/seed/sh17/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/wVWIdoXI6Qk',
    creator: 'Anime Archive'
  },
  {
    id: 'sh18',
    type: 'short',
    title: 'Weathering with You Sky',
    thumbnailUrl: 'https://picsum.photos/seed/sh18/400/600',
    mediaUrl: 'https://www.youtube.com/shorts/M9XEXSKq25c',
    creator: 'Anime Archive'
  }
];

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<MediaItem[]>(initialData);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('rojxo_user');
    if (stored) setUserNameState(stored);
  }, []);

  const setUserName = (name: string | null) => {
    if (name) {
      localStorage.setItem('rojxo_user', name);
    } else {
      localStorage.removeItem('rojxo_user');
    }
    setUserNameState(name);
  };

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
      setSearchTerm,
      userName,
      setUserName
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
