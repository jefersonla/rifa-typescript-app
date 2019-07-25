declare module 'svg-to-pdfkit' {
    import PDFDocument from 'pdfkit';
    import svg_to_pdf from "svg-to-pdfkit";

    export function SVGtoPDF(): PDFDocument.PDFDocument;
}
