import restart from 'vite-plugin-restart'
import glsl from 'vite-plugin-glsl'

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
    plugins:
        [
            restart({ restart: ['../static/**',] }), // Restart server on static file change
            glsl({
                include: [                      // Glob pattern, or array of glob patterns to import
                    '**/*.glsl', '**/*.wgsl',
                    '**/*.vert', '**/*.frag',
                    '**/*.vs', '**/*.fs'
                ],
                exclude: undefined,             // Glob pattern, or array of glob patterns to ignore
                defaultExtension: 'glsl',       // Shader suffix to use when no extension is specified
                warnDuplicatedImports: true,    // Warn if the same chunk was imported multiple times
                removeDuplicatedImports: false, // Automatically remove an already imported chunk
                importKeyword: '#include',      // Keyword used to import shader chunks
                minify: false,                  // Minify/optimize output shader code
                watch: true,                    // Recompile shader on change
                root: '/'
            }) // Handle shader files
        ]
}