import GUI from 'lil-gui'

class Debug {
    constructor() {
        this.active = window.location.hash === '#debug'
        if (this.active) {
            this.ui = new GUI()
        }
    }
}

export { Debug }