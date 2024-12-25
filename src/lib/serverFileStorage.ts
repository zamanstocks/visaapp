import fs from 'fs/promises';
import path from 'path';

const UPLOAD_BASE = path.join(process.cwd(), 'uploads');
const PASSPORT_DIR = path.join(UPLOAD_BASE, 'passports');
const PHOTO_DIR = path.join(UPLOAD_BASE, 'photos');

export const ServerFileStorage = {
  async init() {
    await fs.mkdir(PASSPORT_DIR, { recursive: true });
    await fs.mkdir(PHOTO_DIR, { recursive: true });
  },

  async savePassport(buffer: Buffer, originalFilename: string): Promise<string> {
    await this.init();
    const timestamp = new Date().getTime();
    const sanitizedFilename = this.sanitizeFilename(originalFilename);
    const filename = `passport_${timestamp}_${Math.random().toString(36).substring(2, 15)}${path.extname(sanitizedFilename)}`;
    const filepath = path.join(PASSPORT_DIR, filename);
    await fs.writeFile(filepath, buffer);
    return filename;
  },

  async savePhoto(buffer: Buffer, originalFilename: string): Promise<string> {
    await this.init();
    const timestamp = new Date().getTime();
    const sanitizedFilename = this.sanitizeFilename(originalFilename);
    const filename = `photo_${timestamp}_${Math.random().toString(36).substring(2, 15)}${path.extname(sanitizedFilename)}`;
    const filepath = path.join(PHOTO_DIR, filename);
    await fs.writeFile(filepath, buffer);
    return filename;
  },

  async getFile(type: 'passport' | 'photo', filename: string): Promise<Buffer> {
    const dir = type === 'passport' ? PASSPORT_DIR : PHOTO_DIR;
    return fs.readFile(path.join(dir, filename));
  },

  async deleteFile(type: 'passport' | 'photo', filename: string): Promise<void> {
    const dir = type === 'passport' ? PASSPORT_DIR : PHOTO_DIR;
    try {
      await fs.unlink(path.join(dir, filename));
    } catch (error) {
      console.error(`Failed to delete ${type} file:`, error);
    }
  },

  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
  }
};
