import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { sampleStories } from '../data/placeholders';

export const StorytellingPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-yellow-100 mb-4">
            Stories of Tradition
          </h1>
          <p className="text-xl text-yellow-200 max-w-2xl mx-auto">
            Discover the rich heritage and techniques behind Cordillera weaving
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleStories.map((story) => (
            <Card key={story.id} className="bg-white border-none shadow-lg hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full">
              <div className="relative overflow-hidden">
                <img
                  src={story.media_url || 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?w=800&h=600&fit=crop'}
                  alt={story.title || 'Story image'}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {story.featured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-400 text-green-900">
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-5 flex flex-col flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <Badge variant="outline" className="border-yellow-400 text-yellow-600 text-[11px]">
                    {story.category || 'General'}
                  </Badge>
                  <span className="text-[11px] text-gray-600">
                    {(story.reading_time ?? 0)} min read
                  </span>
                </div>
                <h3 className="text-lg font-serif font-semibold text-gray-900 mb-1.5 leading-snug">
                  {story.title || 'Untitled Story'}
                </h3>
                <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2 flex-grow text-[13px]">
                  {story.excerpt || ''}
                </p>
                <div className="mt-auto flex flex-col items-center gap-2.5">
                  <span className="text-[12px] text-gray-500">By {story.author?.name || 'Unknown'}</span>
                  <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-white px-4 py-2">
                    Read Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-yellow-500 text-green-900 hover:bg-yellow-400">
            View All Stories
          </Button>
        </div>
      </div>
    </div>
  );
};