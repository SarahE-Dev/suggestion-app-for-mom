'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye, Check, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SuggestionCardProps {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  posterPath: string | null;
  releaseDate: string | null;
  overview: string;
  onSuggestionDelete: (suggestionId: number) => void;
}

const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export function SuggestionCard({
  id,
  title,
  type,
  posterPath,
  releaseDate,
  overview,
  onSuggestionDelete
}: SuggestionCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [initials, setInitials] = useState('');
  const expectedInitials = 'SATE';

  const handleMarkAsWatched = useCallback(async () => {
    if (initials.toUpperCase() !== expectedInitials) {
      toast({
        variant: "destructive",
        title: "Invalid Initials",
        description: "Please enter the correct initials",
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/suggestions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to mark as watched');
      }

      toast({
        title: "Success!",
        description: "Successfully marked as watched.",
        duration: 3000,
      });
      setShowConfirmDialog(false);
      setInitials('');
      onSuggestionDelete(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
        duration: 5000,
      });
      console.error('Error marking as watched:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, initials, toast, onSuggestionDelete]);

  const WatchButton = useCallback(() => (
    <Button
      variant="secondary"
      size="icon"
      className={`h-8 w-8 bg-background/80 backdrop-blur-sm transition-colors
        ${error ? 'hover:bg-red-100' : 'hover:bg-background/90 hover:text-primary'}
      `}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirmDialog(true);
      }}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : error ? (
        <AlertCircle className="h-4 w-4 text-red-500" />
      ) : (
        isHovered ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isLoading
          ? 'Marking as watched...'
          : error
            ? 'Error marking as watched'
            : 'Mark as watched'}
      </span>
    </Button>
  ), [isLoading, isHovered, error]);

  return (
    <TooltipProvider>
      <div className="group relative">
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark as Watched?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark "{title}" as watched and delete this suggestion?
                Please enter your initials to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Label htmlFor="initials">Enter Initials</Label>
              <Input
                id="initials"
                value={initials}
                onChange={(e) => setInitials(e.target.value)}
                placeholder="Enter initials"
                className="mt-2"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setInitials('');
                setShowConfirmDialog(false);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMarkAsWatched}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/suggestions/${id}`}
              className="block transition-transform hover:scale-[1.02] duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            >
              <Card className="h-full rounded-lg hover:shadow-lg transition-shadow">
                <div className="absolute top-2 right-2 z-10">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <WatchButton />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="bg-background/90 backdrop-blur-sm"
                    >
                      {error ? error : 'Mark as watched'}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardHeader className="p-4">
                  <div>
                    <CardTitle className="text-lg truncate">{title}</CardTitle>
                    <CardDescription className="text-xs capitalize">
                      {type === 'movie' ? 'Movie' : 'TV Show'}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {posterPath && (
                    <div className="relative aspect-[2/3] mb-2">
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${posterPath}`}
                        alt={title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 15vw"
                        priority
                        onError={(e) => {
                          e.currentTarget.src = '/poster-placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mb-1">
                    {releaseDate ? formatDate(releaseDate) : 'Release date unknown'}
                  </p>
                  <p className="line-clamp-2 text-xs text-gray-400">{overview}</p>
                </CardContent>
              </Card>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="max-w-[300px] p-4"
            sideOffset={-20}
          >
            <div className="space-y-2">
              <p className="font-semibold">{title}</p>
              <p className="text-sm">{overview}</p>
              {releaseDate && (
                <p className="text-sm text-gray-400">
                  Released: {formatDate(releaseDate)}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}