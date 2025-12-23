import React from "react";

const ChatEmptyState: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-white">
      <h2 className="text-3xl font-bold font-serif text-gray-900 mb-4">
        Start your chat
      </h2>
      <p className="text-gray-500 max-w-sm font-sans mx-auto text-lg leading-relaxed">
        Stay in touch with your doctor for easier follow-up
      </p>
    </div>
  );
};

export default ChatEmptyState;
