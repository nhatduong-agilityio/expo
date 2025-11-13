import { storageService } from '@/services/storage';
import { supabase } from '@/services/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

jest.mock('@/services/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn(),
    },
  },
}));

jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: 'base64',
  },
}));

jest.mock('base64-arraybuffer', () => ({
  decode: jest.fn(),
}));

describe('storageService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload an image and return the public URL', async () => {
      const file = { uri: 'file:///test.jpg', type: 'image/jpeg' };
      const bucket = 'news-images';
      const base64 = 'base64string';
      const arrayBuffer = new ArrayBuffer(1);
      const uploadData = { path: 'test.jpg' };
      const publicUrl =
        'https://supabase.co/storage/v1/object/public/news-images/test.jpg';

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(base64);
      (decode as jest.Mock).mockReturnValue(arrayBuffer);
      (supabase.storage.from(bucket).upload as jest.Mock).mockResolvedValue({
        data: uploadData,
        error: null,
      });
      (supabase.storage.from(bucket).getPublicUrl as jest.Mock).mockReturnValue(
        {
          data: { publicUrl },
        },
      );

      const result = await storageService.uploadImage(file, bucket);

      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      expect(decode).toHaveBeenCalledWith(base64);
      expect(supabase.storage.from).toHaveBeenCalledWith(bucket);
      expect(supabase.storage.from(bucket).upload).toHaveBeenCalledWith(
        expect.any(String),
        arrayBuffer,
        {
          contentType: file.type,
          upsert: false,
        },
      );
      expect(supabase.storage.from(bucket).getPublicUrl).toHaveBeenCalledWith(
        uploadData.path,
      );
      expect(result).toBe(publicUrl);
    });

    it('should throw an error if upload fails', async () => {
      const file = { uri: 'file:///test.jpg', type: 'image/jpeg' };
      const bucket = 'news-images';
      const base64 = 'base64string';
      const arrayBuffer = new ArrayBuffer(1);
      const error = new Error('Upload failed');

      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(base64);
      (decode as jest.Mock).mockReturnValue(arrayBuffer);
      (supabase.storage.from(bucket).upload as jest.Mock).mockResolvedValue({
        data: null,
        error,
      });

      await expect(storageService.uploadImage(file, bucket)).rejects.toThrow(
        'Failed to upload image',
      );
    });
  });

  describe('deleteImage', () => {
    it('should delete an image', async () => {
      const url =
        'https://supabase.co/storage/v1/object/public/news-images/test.jpg';
      const bucket = 'news-images';
      const filePath = 'test.jpg';

      (supabase.storage.from(bucket).remove as jest.Mock).mockResolvedValue({
        error: null,
      });

      await storageService.deleteImage(url, bucket);

      expect(supabase.storage.from).toHaveBeenCalledWith(bucket);
      expect(supabase.storage.from(bucket).remove).toHaveBeenCalledWith([
        filePath,
      ]);
    });

    it('should throw an error if deletion fails', async () => {
      const url =
        'https://supabase.co/storage/v1/object/public/news-images/test.jpg';
      const bucket = 'news-images';
      const error = new Error('Delete failed');

      (supabase.storage.from(bucket).remove as jest.Mock).mockResolvedValue({
        error,
      });

      await expect(storageService.deleteImage(url, bucket)).rejects.toThrow(
        'Failed to delete image',
      );
    });
  });
});
