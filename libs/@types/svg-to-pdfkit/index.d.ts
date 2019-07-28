declare module 'svg-to-pdfkit' {
    import pdfkit_doc from 'pdfkit';

    export interface SVGToPDFKitOptions {
        height?: number;
        width?: number;
        preserveAspectRatio?: string;
        useCSS?: boolean;
        precision?: number;
        assumePt?: boolean;

        fontCallback?: any;
        imageCallback?: any;
        documentCallback?: any;
        colorCallback?: any;
        warningCallback?: any;
    }

    type PDFDocument = typeof pdfkit_doc;
    export default function SVGtoPDF(doc: PDFDocument, svg: SVGElement, x?: number, y?: number, opts?: SVGToPDFKitOptions): void;
}
