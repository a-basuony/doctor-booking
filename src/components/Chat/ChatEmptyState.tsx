import React from "react";

const ChatEmptyState: React.FC = () => {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center text-center p-6">
      <h2 className="text-3xl font-serif text-gray-900 mb-2">
        Start your chat
      </h2>
      <p className="text-gray-500 max-w-sm font-sans mx-auto">
        Stay in touch with your doctor for easier follow-up
      </p>
    </div>
  );
};

export default ChatEmptyState;
