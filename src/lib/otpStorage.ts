export interface OtpEntry {
  otp: string;
  phoneNumber: string;
  countryCode: string;
  createdAt: number;
}

// Create a singleton storage instance
export class OtpStorageService {
  private static instance: OtpStorageService;
  private storage: Map<string, OtpEntry>;

  private constructor() {
    this.storage = new Map();
  }

  public static getInstance(): OtpStorageService {
    if (!OtpStorageService.instance) {
      OtpStorageService.instance = new OtpStorageService();
    }
    return OtpStorageService.instance;
  }

  setOtp(countryCode: string, phoneNumber: string, otp: string): void {
    const userKey = `${countryCode}-${phoneNumber}`;
    this.storage.set(userKey, {
      otp,
      phoneNumber,
      countryCode,
      createdAt: Date.now()
    });
  }

  getOtp(countryCode: string, phoneNumber: string): OtpEntry | undefined {
    const userKey = `${countryCode}-${phoneNumber}`;
    return this.storage.get(userKey);
  }

  deleteOtp(countryCode: string, phoneNumber: string): void {
    const userKey = `${countryCode}-${phoneNumber}`;
    this.storage.delete(userKey);
  }
}
