export type ExternalStory = {
  id: number;
  title: string;
  excerpt: string;
  content: string; // HTML or plain text
  media_url: string;
  author: string;
  created_at: string; // ISO date
  category: string;
  reading_time: number;
  featured: boolean;
  tags: string[];
  source_url: string;
  source_text?: string | null;
};

export const externalStories: ExternalStory[] = [
  {
    id: 101,
    title: "The Untold Sacred Weaving of Ifugaos",
    excerpt:
      "Mythic elements in Ifugao weaving — bayawak and serpent patterns, ancestral rituals, and the evolving craft.",
    content:
      "<p>Mythic elements in Ifugao weaving — bayawak and serpent patterns, ancestral rituals, the spiritual role of weavers, and contemporary design evolution.</p>",
    media_url: "https://images.unsplash.com/photo-1594736797933-d0051ba0ff29?w=1200",
    author: "Tatler Asia",
    created_at: "2021-01-01T00:00:00Z",
    category: "Cultural Heritage",
    reading_time: 6,
    featured: true,
    tags: ["Ifugao", "Mythic Patterns", "Rituals"],
    source_url:
      "https://www.tatlerasia.com/culture/arts/the-untold-sacred-weaving-of-ifugaos",
    source_text: null,
  },
  {
    id: 102,
    title: "Eliza Chawi and the Art of Cordillera Weaving",
    excerpt:
      "Profile of Manay Eliza Chawi of Easter Weaving — decades of artistry, teaching, and heritage advocacy.",
    content:
      "<p>An intimate profile of senior Kankanaey weaver Eliza Chawi — her journey at Easter Weaving, teaching, artistry, and advocacy for education and heritage.</p>",
    media_url: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?w=1200",
    author: "BusinessMirror",
    created_at: "2019-11-30T00:00:00Z",
    category: "Artisan Profile",
    reading_time: 7,
    featured: false,
    tags: ["Kankanaey", "Easter Weaving", "Heritage"],
    source_url:
      "https://businessmirror.com.ph/2019/11/30/eliza-chawi-and-the-art-of-cordillera-weaving/",
    source_text: null,
  },
  {
    id: 103,
    title: "Age-old Flair of Great Weaving in Ifugao",
    excerpt:
      "Meet “Mother Gayen,” a master weaver in Asipulo, practicing strap-on cotton weaving and calling for support.",
    content:
      "<p>A portrait of Mother Gayen of Asipulo, Ifugao — dedication to strap-on weaving, intricate processes, and a call for community/institutional support.</p>",
    media_url: "https://images.unsplash.com/photo-1558618666-fcd25b9cd7db?w=1200",
    author: "Zigzag Weekly",
    created_at: "2020-01-01T00:00:00Z",
    category: "Artisan Profile",
    reading_time: 5,
    featured: false,
    tags: ["Ifugao", "Strap-on Weaving", "Community Support"],
    source_url: "https://www.zigzagweekly.net/age-old-flair-of-great-weaving-in-ifugao/",
    source_text: null,
  },
  {
    id: 104,
    title:
      "Keeping the Heritage Alive: DOT Opens Bazaar, Exhibit of Cordillera Weaves",
    excerpt:
      "DOT exhibit and bazaar spotlight Cordillera textiles and support artisans during the pandemic.",
    content:
      "<p>Department of Tourism initiative that paired a weaving exhibit and bazaar to spotlight Cordillera textiles and sustain artisan livelihoods.</p>",
    media_url: "https://images.unsplash.com/photo-1582582494881-41e67beece72?w=1200",
    author: "Manila Bulletin",
    created_at: "2021-11-29T00:00:00Z",
    category: "Event",
    reading_time: 4,
    featured: false,
    tags: ["Exhibit", "DOT", "Pandemic Response"],
    source_url:
      "https://mb.com.ph/2021/11/29/keeping-the-heritage-alive-dot-opens-bazaar-exhibit-of-cordillera-weaves",
    source_text: null,
  },
  {
    id: 105,
    title: "Weaving Together the Past and the Future",
    excerpt:
      "Challenges in Cordillera weaving and efforts to address them via digitization, education, and IP protection.",
    content:
      "<p>Addresses health risks, cultural appropriation, digitization, education, and IP protection to sustain Cordillera weaving.</p>",
    media_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
    author: "BusinessWorld",
    created_at: "2021-07-26T00:00:00Z",
    category: "Cultural Heritage",
    reading_time: 6,
    featured: false,
    tags: ["Policy", "Education", "Digitization"],
    source_url:
      "https://www.bworldonline.com/arts-and-leisure/2021/07/26/384571/weaving-together-the-past-and-the-future/",
    source_text: null,
  },
  {
    id: 106,
    title:
      "Cordillera Weaves: Continuity of Tradition in Handwoven Fabrics",
    excerpt:
      "Celebrating weaving as cultural identity; recap of the Cordillera Weaves Exhibit and Bazaar across six provinces.",
    content:
      "<p>Feature celebrating weaving as identity; exhibit and bazaar brought together weaving communities to inspire the next generation.</p>",
    media_url: "https://images.unsplash.com/photo-1502412430771-4a9c5b4bedd7?w=1200",
    author: "Lakwatsero",
    created_at: "2022-01-01T00:00:00Z",
    category: "Event",
    reading_time: 5,
    featured: false,
    tags: ["Exhibit", "Youth", "Six Provinces"],
    source_url:
      "https://www.lakwatsero.com/info/events/cordillera-weaves-continuity-of-tradition-in-handwoven-fabrics/",
    source_text: null,
  },
];
