import { useQuery } from '@tanstack/react-query'
import { storiesAPI } from '@/services/api'

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
  /** Optional: URL of the external reference for this story */
  sourceUrl?: string
  /** Optional: Cleaned text/content extracted from the sourceUrl */
  sourceText?: string
}

// Fetch a story by ID solely from backend API
async function fetchStory(id: number): Promise<Story> {
  try {
    const apiStory = await storiesAPI.getById(id as number)
    const authorName = (apiStory as any)?.author?.name || (apiStory as any)?.author || 'Unknown'
    const cover = (apiStory as any)?.media_url || ''
    const created = (apiStory as any)?.created_at
    const html = (apiStory as any)?.fullContent || (apiStory as any)?.content || ''
    const tags: string[] = (apiStory as any)?.tags || []
    const sourceUrl: string | undefined = (apiStory as any)?.source_url
    const sourceText: string | undefined = (apiStory as any)?.source_text

    return {
      id: (apiStory as any).id ?? id,
      title: (apiStory as any).title ?? 'Story',
      content: (apiStory as any).excerpt || (apiStory as any).content || 'No content available.',
      media_url: cover,
      author: authorName,
      date: created ? new Date(created).toLocaleDateString() : '',
      category: (apiStory as any).category || 'community',
      fullContent: (sourceText ?? html) || 'No content available.',
      tags,
      sourceUrl,
      sourceText,
    }
  } catch (err) {
    // Final safe fallback to avoid UI crash
    return {
      id,
      title: 'Story',
      content: 'No content available.',
      media_url: '',
      author: 'Unknown',
      date: '',
      category: 'community',
      fullContent: 'No content available.',
      tags: [],
    }
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
