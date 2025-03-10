import { create } from "zustand";

interface VideoResponse {
  id: string;
  categoryName: string;
  transcription: string;
}

interface VideoStore {
  videos: VideoResponse[];
  setVideos: (videos: VideoResponse[]) => void; // Set all videos
  addVideo: (video: VideoResponse) => void;
  updateVideo: (id: string, updatedData: Partial<VideoResponse>) => void;
  clearVideos: () => void; // Clears all videos
}

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  setVideos: (videos) => set(() => ({ videos })), // Set all videos at once
  addVideo: (video) =>
    set((state) =>
      state.videos.some((v) => v.id === video.id)
        ? state // If video exists, don't add duplicate
        : { videos: [...state.videos, video] }
    ),
  updateVideo: (id, updatedData) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id ? { ...video, ...updatedData } : video
      ),
    })),
  clearVideos: () => set({ videos: [] }), // Clear all videos
}));
