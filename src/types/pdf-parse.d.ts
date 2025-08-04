declare module "pdf-parse" {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  const pdf: (dataBuffer: Buffer, options?: any) => Promise<PDFData>;

  export default pdf;
}
