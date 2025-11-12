import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';

export const storageService = {
  // Upload image to Supabase Storage
  uploadImage: async (
    file: { uri: string; type?: string; name?: string },
    bucket: 'avatars' | 'news-images' = 'news-images',
  ): Promise<string> => {
    try {
      // Generate unique filename
      const fileExt = file.uri.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, arrayBuffer, {
          contentType: file.type || 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  },

  // Delete image from Supabase Storage
  deleteImage: async (
    url: string,
    bucket: 'avatars' | 'news-images' = 'news-images',
  ): Promise<void> => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const filePath = urlParts[urlParts.length - 1];

      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete image');
    }
  },
};
