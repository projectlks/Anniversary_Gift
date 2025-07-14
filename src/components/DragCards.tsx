"use client";

import React, { MutableRefObject, useRef, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import img1 from "../imgs/1.jpg";
import img2 from "../imgs/2.jpg";
import img3 from "../imgs/3.jpg";
import img4 from "../imgs/4.jpg";
import img5 from "../imgs/5.jpg";
import img6 from "../imgs/6.jpg";
import img7 from "../imgs/7.jpg";
import img8 from "../imgs/8.jpg";
import img9 from "../imgs/9.jpg";
import img10 from "../imgs/10.jpg";
import img11 from "../imgs/11.jpg";
import img12 from "../imgs/12.jpg";


export const DragCards = () => {
    return (
        <section className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950">
            <h2 className="relative z-0 text-[20vw] font-black text-neutral-800 md:text-[200px]">
                LOVE<span className="text-[#ffafcc]">.</span>
            </h2>
            <Cards />
        </section>
    );
};

const Cards = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div className="absolute inset-0 z-10" ref={containerRef}>
            <Card containerRef={containerRef} src={img1.src} alt="Example image" rotate="6deg" top="20%" left="25%" className="w-28 md:w-44" />
            <Card containerRef={containerRef} src={img2.src} alt="Example image" rotate="12deg" top="45%" left="60%" className="w-20 md:w-40" />
            <Card containerRef={containerRef} src={img3.src} alt="Example image" rotate="-6deg" top="20%" left="40%" className="w-40 md:w-64" />
            <Card containerRef={containerRef} src={img4.src} alt="Example image" rotate="8deg" top="50%" left="40%" className="w-36 md:w-56" />
            <Card containerRef={containerRef} src={img5.src} alt="Example image" rotate="18deg" top="20%" left="65%" className="w-32 md:w-52" />
            <Card containerRef={containerRef} src={img6.src} alt="Example image" rotate="-3deg" top="35%" left="55%" className="w-20 md:w-40" />
            <Card containerRef={containerRef} src={img7.src} alt="Example image" rotate="-12deg" top="60%" left="30%" className="w-28 md:w-44" />
            <Card containerRef={containerRef} src={img8.src} alt="Example image" rotate="15deg" top="10%" left="20%" className="w-28 md:w-48" />
            <Card containerRef={containerRef} src={img9.src} alt="Example image" rotate="-8deg" top="70%" left="50%" className="w-24 md:w-40" />
            <Card containerRef={containerRef} src={img10.src} alt="Example image" rotate="10deg" top="30%" left="70%" className="w-36 md:w-56" />
            <Card containerRef={containerRef} src={img11.src} alt="Example image" rotate="5deg" top="80%" left="10%" className="w-24 md:w-40" />
            <Card containerRef={containerRef} src={img12.src} alt="Example image" rotate="-12deg" top="60%" left="30%" className="w-28 md:w-44" />
        </div>

    );
};


interface Props {
    containerRef: MutableRefObject<HTMLDivElement | null>;
    src: string;
    alt: string;
    top: string;
    left: string;
    rotate: string;
    className?: string;
}

const Card = ({
    containerRef,
    src,
    alt,
    top,
    left,
    rotate,
    className,
}: Props) => {
    const [zIndex, setZIndex] = useState(0);

    const updateZIndex = () => {
        const els = document.querySelectorAll(".drag-elements");

        let maxZIndex = -Infinity;

        els.forEach((el) => {
            const zIndex = parseInt(
                window.getComputedStyle(el).getPropertyValue("z-index")
            );

            if (!isNaN(zIndex) && zIndex > maxZIndex) {
                maxZIndex = zIndex;
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
                "drag-elements absolute w-48 bg-neutral-200 p-1 pb-4 hover:cursor-grab active:cursor-grabbing",
                className
            )}
            src={src}
            alt={alt}
            drag
            dragConstraints={containerRef}
            // Uncomment below and remove dragElastic to remove movement after release
            //   dragMomentum={false}
            dragElastic={0.65}
        />
    );
};