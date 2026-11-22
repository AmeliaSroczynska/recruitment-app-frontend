import { useLayoutEffect } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  type LinkProps,
} from 'react-router-dom'

let finishNavigation: (() => void) | null = null

function ViewTransitionListener() {
  const location = useLocation()

  useLayoutEffect(() => {
    finishNavigation?.()
    finishNavigation = null
  }, [location])

  return null
}

function TransitionLink({ to, onClick, ...props }: LinkProps) {
  const navigate = useNavigate()

  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event)
        const isPlainClick =
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        if (
          event.defaultPrevented ||
          !isPlainClick ||
          !('startViewTransition' in document)
        ) {
          return
        }
        event.preventDefault()
        document.startViewTransition(
          () =>
            new Promise<void>((resolve) => {
              finishNavigation = resolve
              navigate(to)
            }),
        )
      }}
      {...props}
    />
  )
}

export { TransitionLink, ViewTransitionListener }
