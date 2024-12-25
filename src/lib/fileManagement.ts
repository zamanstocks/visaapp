// Types
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface DocumentData {
  dataUrl: string;
  fileName: string;
  extractedData?: any;
  timestamp: string;
}

export interface Documents {
  passport: DocumentData | null;
  photo: DocumentData | null;
}

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// Validation utilities
export const FileValidator = {
  validateFile(file: File): FileValidationResult {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    return { isValid: true };
  }
};

// Image Processing
export const ImageProcessor = {
  async compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        let width = img.width;
        let height = img.height;
        let quality = 0.7;

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl: string;
        do {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          quality *= 0.8;
        } while (dataUrl.length > 100 * 1024 && quality > 0.1);

        resolve(dataUrl);
      };

      img.onerror = reject;
      const reader = new FileReader();
      reader.onload = (e) => img.src = e.target?.result as string;
      reader.readAsDataURL(file);
    });
  }
};

// Session Storage Management
export const Store = {
  setForm: (id: string, data: any) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`form_${id}`, JSON.stringify(data));
    }
  },

  getForm: (id: string) => {
    if (typeof window === 'undefined') return null;
    const data = sessionStorage.getItem(`form_${id}`);
    return data ? JSON.parse(data) : null;
  },

  clearForm: (id: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`form_${id}`);
    }
  },

  generateId: () => `${Date.now()}_${Math.random().toString(36).slice(2)}`,

  setDocuments: (formId: string, documents: Documents) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`docs_${formId}`, JSON.stringify(documents));
    }
  },

  getDocuments: (formId: string): Documents | null => {
    if (typeof window === 'undefined') return null;
    const data = sessionStorage.getItem(`docs_${formId}`);
    return data ? JSON.parse(data) : null;
  },

  clearDocuments: (formId: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`docs_${formId}`);
    }
  }
};
