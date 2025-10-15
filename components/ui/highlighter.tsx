"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  colorLight?: string
  colorDark?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  active?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  colorLight,
  colorDark,
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  active = true,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = (!isView || isInView) && active

  const resolveDarkMode = (): boolean => {
    if (typeof window === "undefined") return false
    const root = document.documentElement
    if (root.classList.contains("dark")) return true
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  useEffect(() => {
    if (!shouldShow) return

    const element = elementRef.current
    if (!element) return

    const isDark = resolveDarkMode()
    const actualColor = isDark ? (colorDark ?? color) : (colorLight ?? color)

    const annotationConfig = {
      type: action,
      color: actualColor,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    }

    const annotation = annotate(element, annotationConfig)

    annotationRef.current = annotation
    annotationRef.current.show()

    const resizeObserver = new ResizeObserver(() => {
      annotation.hide()
      annotation.show()
    })

    resizeObserver.observe(element)
    resizeObserver.observe(document.body)
    resizeObserverRef.current = resizeObserver

    return () => {
      if (element) {
        annotate(element, { type: action }).remove()
        resizeObserver.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [
    shouldShow,
    action,
    color,
    colorLight,
    colorDark,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ])

  useEffect(() => {
    if (!shouldShow && annotationRef.current) {
      try {
        annotationRef.current.hide()
        annotationRef.current.remove()
      } catch {}
      annotationRef.current = null
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [shouldShow])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}
