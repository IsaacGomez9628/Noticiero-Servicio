import React from "react";

export default function InputLabel({
    htmlFor,
    value,
    className = "",
    children,
    required = false,
}) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block font-medium text-sm text-gray-700 ` + className}
        >
            {value || children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}

// export default function InputLabel({
//     value,
//     className = '',
//     children,
//     ...props
// }) {
//     return (
//         <label
//             {...props}
//             className={
//                 `block text-sm font-medium text-gray-700 ` +
//                 className
//             }
//         >
//             {value ? value : children}
//         </label>
//     );
// }
