import React from "react";

const ChatEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white">
      <h2 className="text-3xl font-serif text-gray-900 mb-2">
        Start your chat
      </h2>
      <p className="text-gray-500 max-w-sm font-sans">
        Stay in touch with your doctor for easier follow-up
      </p>
    </div>
  );
};

export default ChatEmptyState;
