import React from 'react';
interface FilePreview {
    type: 'image' | 'file';
    url?: string;
}
interface ExtendedFile extends File {
    id: string;
    extension: string;
    sizeReadable: string;
    preview: FilePreview;
}
interface FilesProps {
    accepts?: string[] | null;
    children?: React.ReactNode | ((isDragging: boolean) => React.ReactNode);
    className?: string;
    clickable?: boolean;
    dragActiveClassName?: string;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    minFileSize?: number;
    name?: string;
    onChange?: (files: ExtendedFile[]) => void;
    onDragEnter?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
    onError?: (error: {
        code: number;
        message: string;
    }, file?: ExtendedFile) => void;
    style?: React.CSSProperties;
}
declare const Files: React.FC<FilesProps>;
export default Files;
