import React from 'react';

export const Card = ({ children, className = '', ...props }) => (
    <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`} {...props}>
        {children}
    </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
    <div className={`flex flex-col space-y-1.5 p-4 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '', as = 'h3', ...props }) => {
    const Tag = as;
    return <Tag className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</Tag>;
};

export const CardDescription = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>{children}</p>
);

export const CardContent = ({ children, className = '', ...props }) => (
    <div className={`p-4 pt-0 ${className}`} {...props}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
    <div className={`flex items-center p-4 pt-0 ${className}`} {...props}>
        {children}
    </div>
);