import { Environment } from './Environment'
import { Experience } from '../Experience'
import { Floor } from './Floor'
import { Fox } from './Fox'

class World {
    constructor() {
        // Options
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            //setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }
    update() {
        if (this.fox) {
            this.fox.update()
        }
    }
}

export { World }