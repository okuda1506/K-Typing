import { useEffect } from 'react'

export function useScrollReveal(refreshKey: string) {
    useEffect(() => {
        const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            targets.forEach((target) => target.classList.add('is-visible'))
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return
                    }

                    entry.target.classList.add('is-visible')
                    observer.unobserve(entry.target)
                })
            },
            {
                rootMargin: '0px 0px -12% 0px',
                threshold: 0.12,
            },
        )

        targets.forEach((target) => {
            target.classList.remove('is-visible')
            observer.observe(target)
        })

        return () => observer.disconnect()
    }, [refreshKey])
}
