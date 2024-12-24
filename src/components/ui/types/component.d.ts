declare module "next/image" {
 interface StaticImageData {
   src: string;
   height: number;
   width: number;
   placeholder?: string;
 }
}
