import React from 'react';

export default function Button({
    children,
    type = "button",
    bgColor = "bg-orange-500",
    textColor = "text-white",
    className = "",
    ...props
}) {
    // Define the base styles for the button
    const baseStyle = `px-3 py-2 focus:outline-none ${textColor} ${bgColor}`;

    return (
        <button
            type={type}
            className={`${baseStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
