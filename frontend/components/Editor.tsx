'use client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // Updated CSS import

// Load ReactQuill dynamically (client-side only)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="bg-white">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules} 
        className="h-64 mb-12" // mb-12 to account for toolbar height
      />
    </div>
  );
}