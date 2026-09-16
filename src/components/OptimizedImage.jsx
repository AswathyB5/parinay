import React, { useEffect, useMemo, useState } from 'react';
import { optimizedMediaURL, resolveMediaURL } from '../context/ContentContext';

export default function OptimizedImage({
    src,
    alt = '',
    variant = 'card',
    className,
    priority = false,
    style,
    ...props
}) {
    const optimized = useMemo(() => optimizedMediaURL(src, variant), [src, variant]);
    const original = useMemo(() => resolveMediaURL(src), [src]);
    const [current, setCurrent] = useState(optimized || original);

    useEffect(() => {
        setCurrent(optimized || original);
    }, [optimized, original]);

    return (
        <img
            src={current}
            alt={alt}
            className={className}
            style={style}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            onError={() => {
                if (current !== original && original) setCurrent(original);
            }}
            {...props}
        />
    );
}

export function ProgressiveGallery({
    images = [],
    alt = '',
    variant = 'gallery',
    initialCount = 9,
    step = 8,
    itemClassName = '',
    imgClassName = '',
    wrapClassName = '',
}) {
    const [visibleCount, setVisibleCount] = useState(initialCount);
    const signature = images.join('\n');

    useEffect(() => {
        setVisibleCount(initialCount);
    }, [signature, initialCount]);

    const shown = images.slice(0, visibleCount);
    const remaining = images.length - shown.length;

    return (
        <>
            <div className={wrapClassName}>
                {shown.map((url, idx) => (
                    <div key={`${url}-${idx}`} className={itemClassName}>
                        <OptimizedImage
                            src={url}
                            alt={`${alt} ${idx + 1}`}
                            variant={variant}
                            className={imgClassName}
                            priority={idx < 2}
                        />
                    </div>
                ))}
            </div>
            {remaining > 0 && (
                <div style={{ textAlign: 'center', marginTop: '36px' }}>
                    <button
                        type="button"
                        className="pw-btn pw-btn--outline"
                        onClick={() => setVisibleCount((count) => count + step)}
                    >
                        Load more photos ({remaining} remaining)
                    </button>
                </div>
            )}
        </>
    );
}
