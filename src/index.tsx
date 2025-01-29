import React, { useCallback, useRef, useState } from 'react';
import fileExtension from './utils/fileExtension';
import fileSizeReadable from './utils/fileSizeReadable';
import fileTypeAcceptable from './utils/fileTypeAcceptable';

interface FilePreview {
  type: 'image' | 'file';
  url?: string;
}

export interface ExtendedFile extends File {
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
  onError?: (error: { code: number; message: string }, file?: ExtendedFile) => void;
  style?: React.CSSProperties;
}

const Files: React.FC<FilesProps> = ({
  accepts = null,
  children,
  className,
  clickable = true,
  dragActiveClassName,
  inputProps = {},
  multiple = true,
  maxFiles = Infinity,
  maxFileSize = Infinity,
  minFileSize = 0,
  name = 'file',
  onChange = (files) => console.log(files),
  onDragEnter,
  onDragLeave,
  onError = (err) => console.log(`error code ${err.code}: ${err.message}`),
  style,
}) => {
  const idCounter = useRef(1);
  const dropzoneElement = useRef<HTMLDivElement>(null);
  const inputElement = useRef<HTMLInputElement>(null);
  const [isDragging, setDragging] = useState(false);

  const handleError = (error: { code: number; message: string }, file?: ExtendedFile) => {
    onError(error, file);
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    const el = dropzoneElement.current;
    if (dragActiveClassName && el && !el.className.includes(dragActiveClassName)) {
      el.className = `${el.className} ${dragActiveClassName}`;
    }

    if (typeof children === 'function') {
      setDragging(true);
    }

    if (onDragEnter) {
      onDragEnter(event);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    const el = dropzoneElement.current;
    if (dragActiveClassName && el) {
      el.className = el.className.replace(` ${dragActiveClassName}`, '');
    }

    if (typeof children === 'function') {
      setDragging(false);
    }

    if (onDragLeave) {
      onDragLeave(event);
    }
  };

  const openFileChooser = () => {
    if (inputElement.current) {
      inputElement.current.value = '';
      inputElement.current.click();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    handleDragLeave(event as React.DragEvent<HTMLDivElement>);

    let filesAdded = event instanceof DragEvent && event.dataTransfer
      ? event.dataTransfer.files
      : (event.target as HTMLInputElement).files;

    if (!filesAdded) return;

    if (!multiple && filesAdded.length > 1) {
      filesAdded = [filesAdded[0]] as any;
    }

    const fileResults: ExtendedFile[] = [];
    if (filesAdded){
      for (let i = 0; i < filesAdded.length || 0; i += 1) {
        const file = filesAdded[i] as ExtendedFile;
  
        file.id = `files-${idCounter.current}`;
        idCounter.current += 1;
  
        file.extension = fileExtension(file);
        file.sizeReadable = fileSizeReadable(file.size);
  
        file.preview = file.type && file.type.split('/')[0] === 'image'
          ? { type: 'image', url: URL.createObjectURL(file) }
          : { type: 'file' };
  
        if (fileResults.length >= maxFiles) {
          handleError({ code: 4, message: 'maximum file count reached' }, file);
          break;
        }
  
        if (file.size > maxFileSize) {
          handleError({ code: 2, message: `${file.name} is too large` }, file);
          break;
        }
  
        if (file.size < minFileSize) {
          handleError({ code: 3, message: `${file.name} is too small` }, file);
          break;
        }
  
        if (!fileTypeAcceptable(accepts, file)) {
          handleError({ code: 1, message: `${file.name} is not a valid file type` }, file);
          break;
        }
  
        fileResults.push(file);
      }
    }
   

    onChange(fileResults);
  };

  return (
    <>
      <input
        accept={accepts ? accepts.join(',') : ''}
        style={{ display: 'none' }}
        {...inputProps}
        ref={inputElement}
        type="file"
        multiple={multiple}
        name={name}
        onChange={handleDrop}
      />
      <div
        ref={dropzoneElement}
        className={className}
        onClick={clickable ? openFileChooser : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        style={style}
      >
        {typeof children === 'function' ? children(isDragging) : children}
      </div>
    </>
  );
};

export default Files;
