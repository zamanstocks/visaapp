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

 setDocuments: (formId: string, documents: any) => {
   if (typeof window !== 'undefined') {
     sessionStorage.setItem(`docs_${formId}`, JSON.stringify(documents));
   }
 },

 getDocuments: (formId: string) => {
   if (typeof window === 'undefined') return null;
   const data = sessionStorage.getItem(`docs_${formId}`);
   return data ? JSON.parse(data) : null;
 }
};
