

/**
 * Server Configuration
 * This file holds the main configuration values that are used by the program
 * to interact with the server.
 */
const CONFIGURATION = {
    // The path in which the production platform resides
    local_path: "/home/jessdotjs/Documents/projects/epoca/platform/production",

    // The path in which the ssh keypair resides
    ssh_private_key_path: "/home/jessdotjs/.ssh/id_rsa",

    // The configuration of the production server
    server: { name: "root", ip: "139.59.15.146" },

    // Processes by category
    processes: {
        Server: [
            "connect_to_server",
            "reboot_server",
            "shutdown_server"
        ],
        Compose: [
            "up_prod",
            "build_prod",
            "debug_mode_prod",
            "restore_mode_prod",
            "down",
            "restart",
            "prune",
            "database_backup",
            "database_restore",
        ],
        Push: [
            "push_compose",
            "push_api",
            "push_gui",
            "push_all_source_code",
            "push_env",
        ]
    },

    // Source Code by project outlining the structure of the data to be pushed
    source_code: {
        compose: {
            dir_name: "compose",
            directories: [
                "docker-compose",
                "src"
            ],
            files: [
                "gulpfile.js",
                "package.json",
                "tsconfig.json"
            ]
        },
        api: {
            dir_name: "api-production",
            directories: [
                "src",
            ],
            files: [
                ".dockerignore",
                "docker-compose.yml",
                "Dockerfile",
                "gulpfile.js",
                "package-lock.json",
                "package.json",
                "tsconfig.json"
            ]
        },
        gui: {
            dir_name: "gui-production",
            directories: [
                "service-worker",
                "src"
            ],
            files: [
                ".browserslistrc",
                ".dockerignore",
                "angular.json",
                "docker-compose.yml",
                "Dockerfile",
                "gulpfile.js",
                "karma.conf.js",
                "nginx.conf",
                "ngsw-config.json",
                "package-lock.json",
                "package.json",
                "tsconfig.app.json",
                "tsconfig.json",
                "tsconfig.spec.json"
            ]
        }
    }
}


// Export the module
export { CONFIGURATION }