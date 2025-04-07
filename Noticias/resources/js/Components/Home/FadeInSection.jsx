import React, { useEffect, useState, useRef } from "react";

// Hook personalizado para detectar elementos en el viewport
function useOnScreen(ref, rootMargin = "0px") {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting);
            },
            { rootMargin, threshold: 0.1 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [ref, rootMargin]);

    return isIntersecting;
}

const FadeInSection = ({
    children,
    direction = "up",
    delay = 0,
    className = "",
}) => {
    const ref = useRef(null);
    const isVisible = useOnScreen(ref);

    const directionClass = {
        up: "translate-y-10",
        down: "-translate-y-10",
        left: "translate-x-10",
        right: "-translate-x-10",
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-in-out ${
                isVisible
                    ? "opacity-100 transform translate-x-0 translate-y-0"
                    : `opacity-0 transform ${directionClass[direction]}`
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default FadeInSection;
