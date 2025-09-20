import EventEmitter from "./EventEmitter"
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

class Resources extends EventEmitter {
    constructor(sources) {
        super()

        this.sources = sources

        // setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()

        this.startLoading()
    }

    startLoading() {
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(source.path, (file) => {
                    this.items[source.name] = file
                    this.progressLoading()
                })
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) => {
                    this.items[source.name] = file
                    this.progressLoading()
                })
            }
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    this.items[source.name] = file
                    this.progressLoading()
                })
            }
        }
    }

    progressLoading() {
        this.loaded++
        if (this.loaded === this.toLoad) {
            this.trigger('ready', this.items)
        }
    }
}

export { Resources }