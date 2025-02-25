import React from 'react';

const HighlightedText = ({ text, highlight }) => {
    if (!highlight) return <span>{text}</span>;

    const parts = text?.split(new RegExp(`(${highlight})`, 'gi'));
    return (
        <span>
            {parts?.map((part, index) =>
                part?.toLowerCase() === highlight.toLowerCase() ? (
                    <span key={index} className="text-orange-500 font-medium">{part}</span>
                ) : (
                    part
                )
            )}
        </span>
    );
};

export default HighlightedText;
