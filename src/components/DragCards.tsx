"use client";

import React, { MutableRefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

// ---------- Types ----------
interface DragCardsProps {
    images: { src: string }[];
}

interface CardProps {
    containerRef: MutableRefObject<HTMLDivElement | null>;
    src: string;
    alt: string;
    top: string;
    left: string;
    rotate: string;
    className?: string;
}

// ---------- Main Component ----------
export const DragCards = ({ images }: DragCardsProps) => {
    return (
        <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950">
            <h2 className="relative z-0 text-[20vw] font-black text-neutral-800 md:text-[200px]">
                LOVE<span className="text-[#ffafcc]">.</span>
            </h2>
            <Cards images={images} />
        </section>
    );
};

// ---------- Cards Container ----------
const Cards = ({ images }: { images: { src: string }[] }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Helper to generate random position and rotation
    const getRandomStyle = () => {
        const rotate = `${Math.floor(Math.random() * 30 - 15)}deg`;
        const top = `${Math.floor(Math.random() * 80 + 10)}%`;
        const left = `${Math.floor(Math.random() * 80 + 10)}%`;
        return { rotate, top, left };
    };

    return (
        <div className="absolute inset-0 z-10" ref={containerRef}>
            {images.map((img, index) => {
                const { rotate, top, left } = getRandomStyle();

                return (
                    <Card
                        key={index}
                        containerRef={containerRef}
                        src={img.src}
                        alt={`Image ${index + 1}`}
                        rotate={rotate}
                        top={top}
                        left={left}
                        className="w-32 md:w-48"
                    />
                );
            })}
        </div>
    );
};

// ---------- Individual Card ----------
const Card = ({
    containerRef,
    src,
    alt,
    top,
    left,
    rotate,
    className,
}: CardProps) => {
    const [zIndex, setZIndex] = useState(0);

    const updateZIndex = () => {
        const els = document.querySelectorAll(".drag-elements");

        let maxZIndex = -Infinity;

        els.forEach((el) => {
            const currentZ = parseInt(window.getComputedStyle(el).getPropertyValue("z-index"));
            if (!isNaN(currentZ) && currentZ > maxZIndex) {
                maxZIndex = currentZ;
            }
        });

        setZIndex(maxZIndex + 1);
    };

    return (
        <motion.img
            onMouseDown={updateZIndex}
            style={{
                top,
                left,
                rotate,
                zIndex,
            }}
            className={twMerge(
                "drag-elements absolute bg-neutral-200 p-1 pb-4 rounded-xl shadow-lg hover:cursor-grab active:cursor-grabbing",
                className
            )}
            src={src}
            alt={alt}
            drag
            dragConstraints={containerRef}
            dragElastic={0.65}
        />
    );
};
