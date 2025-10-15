"use client";
import React, { useRef, useEffect, useCallback } from "react";

interface ClickSparkProps {
  sparkColor?: string;
  sparkColorLight?: string;
  sparkColorDark?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  extraScale?: number;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

const FULL_CIRCLE = Math.PI * 2;
const DEFAULT_SPARK_COLOR_LIGHT = "#111111";
const DEFAULT_SPARK_COLOR_DARK = "#ffffff";
const DEFAULT_SPARK_SIZE = 10;
const DEFAULT_SPARK_RADIUS = 15;
const DEFAULT_SPARK_COUNT = 8;
const DEFAULT_DURATION = 400;
const DEFAULT_EXTRA_SCALE = 1;
const DEFAULT_CANVAS_POSITION = "fixed";
const DEFAULT_Z_INDEX_CLASS = "z-50";

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor,
  sparkColorLight = DEFAULT_SPARK_COLOR_LIGHT,
  sparkColorDark = DEFAULT_SPARK_COLOR_DARK,
  sparkSize = DEFAULT_SPARK_SIZE,
  sparkRadius = DEFAULT_SPARK_RADIUS,
  sparkCount = DEFAULT_SPARK_COUNT,
  duration = DEFAULT_DURATION,
  easing = "ease-out",
  extraScale = DEFAULT_EXTRA_SCALE,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(devicePixelRatio, devicePixelRatio);
  }, []);

  useEffect(() => {
    setCanvasSize();
    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCanvasSize]);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        const isDark =
          document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark";
        const resolvedColor = sparkColor || (isDark ? sparkColorDark : sparkColorLight);

        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [
    sparkColor,
    sparkColorLight,
    sparkColorDark,
    sparkSize,
    sparkRadius,
    sparkCount,
    duration,
    easeFunc,
    extraScale,
  ]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const now = performance.now();
      const newSparks: Spark[] = Array.from(
        { length: sparkCount },
        (_, index) => ({
          x,
          y,
          angle: (FULL_CIRCLE * index) / sparkCount,
          startTime: now,
        })
      );
      sparksRef.current.push(...newSparks);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [sparkCount]);

  return (
    <>
      {children}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none inset-0 ${DEFAULT_Z_INDEX_CLASS}`}
        style={{ position: DEFAULT_CANVAS_POSITION }}
      />
    </>
  );
};

export default ClickSpark;
