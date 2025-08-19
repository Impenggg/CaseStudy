import { useQuery } from '@tanstack/react-query'

export interface Story {
  id: number
  title: string
  content: string
  media_url: string
  author: string
  date: string
  category: string
  fullContent: string
  tags: string[]
}

// Temporary mocked fetch function. Replace with real API call later.
async function fetchStory(id: number): Promise<Story> {
  // Simulate API latency
  await new Promise((r) => setTimeout(r, 200))
  return {
    id,
    title: "Master Weaver Maria's Journey",
    content: 'Discover how Maria preserves 300-year-old weaving techniques...',
    media_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    author: 'Maria Santos',
    date: 'December 15, 2024',
    category: 'Artisan Profile',
    fullContent: `
        <p>In the misty mountains of Bontoc, where clouds kiss the rice terraces and ancient traditions flow like the mountain streams, Maria Santos sits at her traditional loom, her weathered hands moving with the precision of a master craftsperson who has dedicated over four decades to preserving the sacred art of Cordillera weaving.</p>
        <p>Maria's story begins in 1965, when she was just eight years old. Her grandmother, Aling Rosa, first placed the wooden shuttle in her small hands and taught her the sacred patterns that have been passed down through generations of women in their family. "Each thread tells a story," Aling Rosa would say, "and each pattern holds the wisdom of our ancestors."</p>
        <p>The traditional Ikat weaving technique that Maria practices is far more than a craft—it's a spiritual practice that connects her to the land, her ancestors, and the cosmic order that governs mountain life. The geometric patterns she weaves represent mountains, rivers, rice fields, and the eternal cycle of planting and harvest that has sustained her people for centuries.</p>
        <p>Today, at 67, Maria has become one of the most respected master weavers in the region. Her works are not merely textiles but repositories of cultural memory, each piece carrying within its fibers the stories, beliefs, and artistic vision of the Cordillera people. Through her dedication, she ensures that these ancient techniques will not be lost to time.</p>
        <p>"When I weave," Maria explains, her eyes twinkling with the wisdom of years, "I am not just creating cloth. I am continuing a conversation that began with my great-great-grandmothers, and I am ensuring that my granddaughters will have voices in that conversation too."</p>
        <p>Her workshop, nestled in a traditional Ifugao house overlooking the famous Banaue rice terraces, has become a pilgrimage site for young people eager to learn traditional weaving techniques. Maria teaches not just the technical aspects of the craft, but also the cultural significance, the proper prayers to say while working, and the respect that must be shown to the materials and the process.</p>
      `,
    tags: ['Traditional Craft', 'Master Weaver', 'Cultural Heritage', 'Bontoc', 'Ikat Weaving'],
  }
}

export function useStory(id?: string) {
  const storyId = Number(id)
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: () => fetchStory(storyId),
    enabled: Number.isFinite(storyId) && storyId > 0,
  })
}
