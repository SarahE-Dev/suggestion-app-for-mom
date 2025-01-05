'use client'
import React, { useState, useEffect } from 'react';
import { SuggestionCard } from './suggestion-card';
import { Suggestion } from '@prisma/client'; // Import the Suggestion type from your Prisma schema

// Define a more specific type for the serialized suggestion
type SerializedSuggestion = Omit<Suggestion, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
  type: 'movie' | 'tv';
};

const AllSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SerializedSuggestion[]>([]); 

  useEffect(() => {
    const fetchExistingSuggestions = async () => {
      try {
        const response = await fetch('/api/suggestions');
        const data: Suggestion[] = await response.json();
  
        const serializedSuggestions: SerializedSuggestion[] = data.map(suggestion => ({
          ...suggestion,
          createdAt: new Date(suggestion.createdAt).toISOString(),
          updatedAt: new Date(suggestion.updatedAt).toISOString(), 
          type: suggestion.type as 'movie' | 'tv', 
        }));
  
        setSuggestions(serializedSuggestions);
      } catch (error) {
        console.error('Failed to fetch existing suggestions:', error);
      }
    };
  
    fetchExistingSuggestions();
  }, []);

  const handleSuggestionDeleted = (suggestionId: number) => {
    setSuggestions(prevSuggestions => 
      prevSuggestions.filter(suggestion => suggestion.id !== suggestionId)
    );
  };

  return (
    <> {/* Wrap the content in a fragment */}
      {suggestions.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {suggestions.map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              id={suggestion.id}
              title={suggestion.title}
              type={suggestion.type}
              posterPath={suggestion.posterPath}
              releaseDate={suggestion.releaseDate}
              overview={suggestion.overview}
              onSuggestionDelete={handleSuggestionDeleted}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No suggestions found. Add some movies or shows to get started!
        </p>
      )}
    </>
  );
};

export default AllSuggestions;