// components/SeasonList.tsx
import React from 'react';
import SeasonCard from '@/components/season-card';
import { Season } from '@/types';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; 
interface SeasonListProps {
  seasons: Season[];
}

const SeasonList: React.FC<SeasonListProps> = ({ seasons }) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {seasons.map((season) => (
          <div key={season.id} className="w-[300px] shrink-0">
            <SeasonCard season={season} />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default SeasonList;