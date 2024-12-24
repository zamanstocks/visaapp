export async function compressImage(file: File): Promise<string> {
 const img = new Image();
 const canvas = document.createElement('canvas');
 const ctx = canvas.getContext('2d')!;
 
 return new Promise((resolve, reject) => {
   img.onload = () => {
     let width = img.width;
     let height = img.height;
     let quality = 0.7;

     // Max dimensions
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

     // Compress until under 100KB
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
