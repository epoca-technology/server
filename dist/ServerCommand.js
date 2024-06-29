import { spawn } from "child_process";



/**
 * Server Command
 * This class handles all the SSH related actions that are executed 
 * on the server.
 * 
 * Class Properties:
 *  ...
 * 
 * Instance Properties:
 * ssh_addr: string
 * ssh_private_key_path: string
 */
class ServerCommand {



	/**
	 * Initializes the ServerCommand Instance
	 * @param server: object
	 * @param ssh_private_key_path: string
	 */
    constructor(server, ssh_private_key_path) {
        // Init the server's ssh address
        this.ssh_addr = `${server.name}@${server.ip}`;

        // Init the private key's path
        this.ssh_private_key_path = ssh_private_key_path;
    }









    /* General Commands */





    /**
     * Extracts the general server status (landscape-sysinfo), as well as the 
     * currently running containers.
     * @returns Promise<string>
     */
     async get_status() {
        // Retrieve the current status
        let status = await this.execute("ssh", this.ssh_args([this.ssh_addr, "landscape-sysinfo", "&&", "docker", "ps"]), "pipe");

        // Add the status heading
        status = "Landscape Sysinfo:\n" + status;

        // Add the docker containers heading
        status = status.replace("CONTAINER ID", "\nRunning Containers:\nCONTAINER ID");

        // Finally, return the status
		return status;
    }











    /* Server Specific */



	/**
	 * Establishes a SSH Connection with the server.
	 * @returns Promise<void>
	 */
    async connect() { await this.execute("ssh", this.ssh_args([this.ssh_addr]), "inherit") }




	/**
	 * Reboots the server as sudo.
	 * @returns Promise<void>
	 */
	async reboot() { await this.execute("ssh", this.ssh_args([this.ssh_addr, "reboot"]), "inherit") }




	/**
	 * Shutsdown the server as sudo.
	 * @returns Promise<void>
	 */
    async shutdown() { await this.execute("ssh", this.ssh_args([this.ssh_addr, "poweroff"]), "inherit") }











    /* Compose Specific */




	/**
	 * Starts all the platform containers in default mode.
	 * @returns Promise<void>
	 */
    async up_prod() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "up-prod"
        ]), "inherit");
    }



	/**
	 * Builds & starts all the platform containers in default mode.
	 * @returns Promise<void>
	 */
    async build_prod() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "build-prod"
        ]), "inherit");
    }



	/**
	 * Builds & starts all the platform containers in debug mode.
	 * @returns Promise<void>
	 */
    async debug_mode_prod() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "debug-mode-prod"
        ]), "inherit");
    }


	/**
	 * Builds & starts all the platform containers in restore mode.
	 * @returns Promise<void>
	 */
    async restore_mode_prod() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "restore-mode-prod"
        ]), "inherit");
    }




	/**
	 * Stops all the running platform containers.
	 * @returns Promise<void>
	 */
    async down() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "down"
        ]), "inherit");
    }



	/**
	 * Restarts all the platform containers in the latest mode.
	 * @returns Promise<void>
	 */
    async restart() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "restart"
        ]), "inherit");
    }



	/**
	 * Prunes all the dangling containers and images
	 * @returns Promise<void>
	 */
    async prune() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "prune"
        ]), "inherit");
    }






	/**
	 * Creates and updates a database backup.
	 * @returns Promise<void>
	 */
    async database_backup() {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "database-backup"
        ]), "inherit");
    }





	/**
	 * Downloads and restores a provided backup name
     * @param backupName
	 * @returns Promise<void>
	 */
     async database_restore(backupName) {
        await this.execute("ssh", this.ssh_args([
            this.ssh_addr,
            "cd", "compose", "&&",
            "npm", "run", "database-restore", backupName
        ]), "inherit");
    }













    /* Server File System */






	/**
	 * Pushes a file from the localhost machine to the server.
	 * @param origin_path: string
	 * @param destination_path: string
	 * @returns Promise<void>
	 */
    async push_file(origin_path, destination_path) {
		await this.execute("scp", this.ssh_args([origin_path, `${this.ssh_addr}:${destination_path}`]), "inherit");
	}




    
	/**
	 * Removes a file from the server.
	 * @param server: object
	 * @param path: string
	 * @param as_sudo?: boolean
	 * @returns Promise<void>
	 */
	async remove_server_file(path) {
		await this.execute("ssh", this.ssh_args([this.ssh_addr, "rm", path]), "pipe");
	}





	/**
	 * Pushes a directory and its contents from the localhost machine to the server.
	 * @param origin_path: string
	 * @param destination_path: string
	 * @returns Promise<void>
	 */
    async push_dir(origin_path, destination_path) {
		await this.execute("scp", this.ssh_args(["-r", origin_path, `${this.ssh_addr}:${destination_path}`]), "inherit");
	}






	/**
	 * Forces the removal of a given directory and then creates a fresh one.
	 * @param path: string
	 * @returns Promise<void>
	 */
    async clean_server_dir(path) {
		// Remove the entire directory
		await this.remove_server_dir(path);
		
		// Create a brand new directory
		await this.make_server_dir(path);
	}





    /**
     * Creates a directory in the server in a safe way.
     * @param path: string
     * @returns Promise<void>
     */
    async make_server_dir(path) {
        try {
            await this.execute("ssh", this.ssh_args([this.ssh_addr, "mkdir", path]), "pipe")
        } catch (e) { }
    }





	/**
	 * Removes a directory from the server.
	 * @param path: string
	 * @returns Promise<void>
	 */
    async remove_server_dir(path) {
		await this.execute("ssh", this.ssh_args([this.ssh_addr, "rm", "-r", path]), "pipe");
	}








	





	/* SSH Helpers */





	 /**
	  * Given a list of arguments, it adds them to the base ssh args.
	  * IMPORTANT: The args must be provided in the correct order.
	  * @param partial_args: Array<string>
	  * @returns string[]
	  */
	ssh_args(partial_args) { return [ "-i", this.ssh_private_key_path ].concat(partial_args) }

















	/* Command Execution */






	/**
	 * Executes a given command and subscribes to its events. The promise is 
	 * resolved once the process indicates it and all the accumulated data is
	 * returned (if any). In case no data is accumulated, undefined will be returned.
	 * @param command: string
	 * @param args: string[]
	 * @param mode: string "inherit"|"pipe"
	 * @returns Promise<string|undefined>
	 */
	execute(command, args, mode) {
		return new Promise((resolve, reject) => {
			// Init the options based on the provided mode
			var options = {};
			if (mode == "inherit") { options.stdio = "inherit" }
			else if (mode == "pipe") { options.stdio = [null, null, null, "pipe"] }
			else { throw new Error(`An invalid command execution mode was provided: ${mode}`) }

			// Start the process
			const ls = spawn(command, args, options);

			// Init the data
			let data = "";

			// Subscribe to the stdout data event if possible
			if (ls.stdout) ls.stdout.on("data", stdout_data => { data += stdout_data});
			
			// Subscribe to the stdeer data event if possible
			if (ls.stderr) ls.stderr.on("data", stderr_data => { data += stderr_data});
			
			// Subscribe to the error event
			ls.on("error", (error) => { reject(error) });
			
			// Subscribe to the close event
			ls.on("close", code => {
				// Make sure the process exited with code 0
				if (code == 0) { resolve(data.length > 0 ? data: undefined) } 
				
				// Otherwise, handle the error
				else { reject(`The ${command} process exited with the error code: ${code}`) }
			});
		})
	}
}





// Export the class
export { ServerCommand };