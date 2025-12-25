/*
export {}
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

  const shouldShow = (!isView || isInView) && active

  const resolveDarkMode = (): boolean => {
    if (typeof window === "undefined") return false
    const root = document.documentElement
    const dataTheme = root.getAttribute('data-theme')
    if (dataTheme === 'dark') return true
    if (dataTheme === 'light') return false
    if (root.classList.contains("dark")) return true
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
  }

  useEffect(() => {
    if (!shouldShow) return

    const element = elementRef.current
    if (!element) return

    const purgeSiblings = () => {
      const el = elementRef.current
      if (!el) return
      let sib = el.nextSibling as (Element | null)
      let guard = 0
      while (sib && guard < 10) {
        const cls = (sib as Element).classList as DOMTokenList | undefined
        const isRough = !!cls && cls.contains('rough-annotation')
        if (!isRough) break
        const next = sib.nextSibling as (Element | null)
        ;(sib.parentNode as Node | null)?.removeChild(sib)
        sib = next
        export {}
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    }

    const updateSiblingColor = (colorValue: string) => {
      const el = elementRef.current
      if (!el) return
      const sib = el.nextSibling as Element | null
      if (!sib || !(sib as Element).classList?.contains('rough-annotation')) return
      const targets = (sib as Element).querySelectorAll('path, rect, ellipse, circle, polygon, polyline')
      targets.forEach((node) => {
        ;(node as SVGElement).style.stroke = colorValue
        ;(node as SVGElement).style.fill = colorValue
      })
    }

    if (annotationRef.current) {
      updateSiblingColor(actualColor)
    } else {
      purgeSiblings()
      const annotation = annotate(element, annotationConfig)
      annotationRef.current = annotation
      annotationRef.current.show()
      updateSiblingColor(actualColor)
    }

    element.style.transition = "opacity 220ms ease"
    element.style.opacity = "1"

    const resizeObserver = new ResizeObserver(() => {
      if (annotationRef.current) {
        annotationRef.current.hide()
        annotationRef.current.show()
      }
    })

    resizeObserver.observe(element)
    resizeObserver.observe(document.body)
    resizeObserverRef.current = resizeObserver

    return () => {
      resizeObserver.disconnect()
      resizeObserverRef.current = null
    }
  }, [
    shouldShow,
    action,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    const handleThemeChange = () => {
      if (!shouldShow || !elementRef.current) return
      const rebuild = () => {
        const isDark = root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        const cssVar = (name: string, fallback: string) => {
          try {
            const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
            return v || fallback
          } catch { return fallback }
        }
        const resolveColorInput = (val: string | undefined, fallback: string) => {
          if (!val) return fallback
          const trimmed = val.trim()
          if (trimmed.startsWith('var(')) {
            const m = trimmed.match(/var\((--[a-zA-Z0-9-_]+)\)/)
            if (m && m[1]) {
              return cssVar(m[1], fallback)
            }
          }
          return trimmed
        }
        const mapLightByAction = () => {
          if (colorLight) return resolveColorInput(colorLight, '#476EAE')
          if (action === 'highlight') return cssVar('--brand-primary', '#476EAE')
          if (action === 'underline') return cssVar('--brand-tertiary', '#FF6B6B')
          return resolveColorInput(color, '#ffd1dc')
        }
        const actualColor = isDark ? resolveColorInput(colorDark, (action === 'highlight' ? '#fde68a' : '#f59e0b')) : mapLightByAction()
        const el = elementRef.current as HTMLElement
        const updateSiblingColor = (colorValue: string) => {
          const sib = el.nextSibling as Element | null
          if (!sib || !(sib as Element).classList?.contains('rough-annotation')) return
          const targets = (sib as Element).querySelectorAll('path, rect, ellipse, circle, polygon, polyline')
          targets.forEach((node) => {
            ;(node as SVGElement).style.stroke = colorValue
            ;(node as SVGElement).style.fill = colorValue
          })
        }
        if (annotationRef.current) {
          updateSiblingColor(actualColor)
        } else {
          const ann = annotate(el, {
            type: action,
            color: actualColor,
            strokeWidth,
            animationDuration,
            iterations,
            padding,
            multiline,
          })
          annotationRef.current = ann
          ann.show()
          updateSiblingColor(actualColor)
        }
        try { (elementRef.current as HTMLElement).style.opacity = '1' } catch {}
      }
      if (typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => rebuild())
      } else {
        setTimeout(rebuild, 0)
      }
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class' || m.attributeName === 'data-theme') {
          handleThemeChange()
          break
        }
      }
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] })

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const mqHandler = () => handleThemeChange()
    try {
      mq.addEventListener('change', mqHandler)
    } catch {
      // Safari
      // @ts-ignore
      mq.addListener(mqHandler)
    }

    const customHandler = () => handleThemeChange()
    window.addEventListener('theme-changed', customHandler as EventListener)

    return () => {
      observer.disconnect()
      try {
        mq.removeEventListener('change', mqHandler)
      } catch {
        // @ts-ignore
        mq.removeListener(mqHandler)
      }
      window.removeEventListener('theme-changed', customHandler as EventListener)
    }
  }, [shouldShow, action, color, colorLight, colorDark, strokeWidth, animationDuration, iterations, padding, multiline])

  useEffect(() => {
    if (!shouldShow && annotationRef.current) {
      const el = elementRef.current
      if (el) {
        el.style.opacity = "0"
        const id = window.setTimeout(() => {
          try {
            annotationRef.current?.hide()
            annotationRef.current?.remove()
          } catch {}
          annotationRef.current = null
          try {
            let sib = el.nextSibling as (Element | null)
            let guard = 0
            while (sib && guard < 10) {
              const cls = (sib as Element).classList as DOMTokenList | undefined
              const isRough = !!cls && cls.contains('rough-annotation')
              if (!isRough) break
              const next = sib.nextSibling as (Element | null)
              ;(sib.parentNode as Node | null)?.removeChild(sib)
              sib = next
              guard++
            }
          } catch {}
          window.clearTimeout(id)
        }, 200)
      } else {
        try {
          annotationRef.current.hide()
          annotationRef.current.remove()
        } catch {}
        annotationRef.current = null
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [shouldShow])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent opacity-0">
      {children}
    </span>
  )
}

*/
export {}
