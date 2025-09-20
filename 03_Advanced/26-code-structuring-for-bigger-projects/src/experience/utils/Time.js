import EventEmitter from "./EventEmitter"

class Time extends EventEmitter {
    constructor() {
        super()
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        const current = Date.now()
        this.delta = current - this.current
        this.current = current
        this.elapsed = this.current - this.start

        this.trigger('tick')
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}

export { Time }