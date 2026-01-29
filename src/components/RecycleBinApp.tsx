import React from 'react';

interface RecycledProgram {
  id: string;
  title: string;
  type: 'about' | 'achievements' | 'art' | 'game';
  deletedAt: Date;
}

interface RecycleBinAppProps {
  recycledPrograms: RecycledProgram[];
  onRestore: (id: string) => void;
  onEmptyRecycleBin: () => void;
}

export default function RecycleBinApp({ recycledPrograms, onRestore, onEmptyRecycleBin }: RecycleBinAppProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'about':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 13.5C14.8 13.8 14.4 14 14 14H10L11.8 16L13 15L11.2 17L15 21H17V19L13.2 15L15 13.5L17 15.5H19V13.5L21 9Z"/>
          </svg>
        );
      case 'achievements':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'art':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-purple-500">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      case 'game':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
            <path d="M21.58 16.09l-1.09-7.66A3.996 3.996 0 0016.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-0.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
          </svg>
        );
    }
  };

  return (
    <div className="h-full bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-medium">Recycle Bin</h1>
            <p className="text-sm text-gray-200">Deleted items from your desktop</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {recycledPrograms.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recycle Bin is empty</h3>
            <p className="text-gray-600">Deleted items will appear here</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Deleted Items ({recycledPrograms.length})
              </h2>
              {recycledPrograms.length > 0 && (
                <button
                  onClick={onEmptyRecycleBin}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Empty Recycle Bin
                </button>
              )}
            </div>
            <div className="space-y-2">
              {recycledPrograms.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(program.type)}
                    <div>
                      <h3 className="font-medium text-gray-900">{program.title}</h3>
                      <p className="text-sm text-gray-600">
                        Deleted on {formatDate(program.deletedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRestore(program.id)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
