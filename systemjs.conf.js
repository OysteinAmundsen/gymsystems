System.config({
    baseURL: "../",
    defaultJSExtensions: true,
    transpiler: "typescript",
    typescriptOptions: {
        "module": "system",
        "sourceMap": true
    },
    paths: {
        "awayjs-core/*": "awayjs-core/*"
    },

    packages: {
        "awayjs-core": {
            "defaultExtension": "ts"
        },
        "awayjs-core/node_modules": {
            "defaultExtension": "js"
        }
    },

    map: {
        "typescript": "./node_modules/typescript/lib/typescript"
    }
});
