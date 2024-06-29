import { CONFIGURATION } from "./Configuration.js";
import { ServerInput } from "./ServerInput.js";
import { ServerCommand } from "./ServerCommand.js";



 /**
  * Server
  * This class initializes all the requirements and runs any server process.
  * 
  * Constant Properties:
  * 	...
  * 
  * Instance Properties
  * 	config: object
  * 	input: ServerInput
  */
class Server {


    constructor() {
        // Init the configuration
        this.config = CONFIGURATION;

        // Init the input instance
        this.input = new ServerInput();

        // Init the command instance
        this.command = new ServerCommand(this.config.server, this.config.ssh_private_key_path);
    }





	/**
	 * Runs the Server Manager. Firstly, asks the user for a process to
	 * execute, followed by any additional required or optional params.
	 * @returns Promise<void>
	 */
    async run() {
        // Print the server status
        const status = await this.command.get_status();
        console.log(status);
        
        // Ask the user for the process to execute
        const process_id = await this.input.process_id(this.config.processes);

        // Finally, execute it
        await this[process_id]();
    }









	/*****************************************************************************
     * SERVER												   					 *
     * Server stands for the general server actions that can be performed on the * 
	 * production machine.					                                     *
	 * 																		     *
	 * Processes:															     *
	 * 	connect_to_server													     *
	 * 	reboot_server											                 *
	 * 	shutdown_server											                 *
     *****************************************************************************/




	/**
	 * Establishes a ssh connection with the server.
	 * @returns Promise<void>
	 */
    async connect_to_server() { await this.command.connect() }



	/**
	 * Reboots the server.
	 * @returns Promise<void>
	 */
    async reboot_server() { 
        console.log("Rebooting...");
        await this.command.reboot();
    }



	/**
	 * Reboots the server.
	 * @returns Promise<void>
	 */
    async shutdown_server() { 
        console.log("Shutting down...");
        await this.command.shutdown();
    }








	/*****************************************************************************
     * COMPOSE												   					 *
     * Compose stands for process that are executed by the compose currently	 *
	 * orchestrating the containers.										     *
	 * Processes:															     *
	 * 	up_prod													                 *
	 * 	build_prod											                     *
	 * 	debug_mode_prod											                 *
	 * 	restore_mode_prod											             *
	 * 	down											                         *
	 * 	restart											                         *
	 * 	prune											                         *
	 * 	database_backup											                 *
	 * 	database_restore											             *
     *****************************************************************************/




	/**
	 * Starts all the platform containers in default mode.
	 * @returns Promise<void>
	 */
    async up_prod() { await this.command.up_prod() }



	/**
	 * Builds & starts all the platform containers in default mode.
	 * @returns Promise<void>
	 */
    async build_prod() { await this.command.build_prod() }



	/**
	 * Builds & starts all the platform containers in debug mode.
	 * @returns Promise<void>
	 */
    async debug_mode_prod() { await this.command.debug_mode_prod() }



	/**
	 * Builds & starts all the platform containers in restore mode.
	 * @returns Promise<void>
	 */
    async restore_mode_prod() { await this.command.restore_mode_prod() }



	/**
	 * Stops all the running platform containers.
	 * @returns Promise<void>
	 */
    async down() { await this.command.down() }



	/**
	 * Restarts all the platform containers in the latest mode.
	 * @returns Promise<void>
	 */
    async restart() { await this.command.restart() }



	/**
	 * Prunes all the dangling containers and images
	 * @returns Promise<void>
	 */
    async prune() { await this.command.prune() }



	/**
	 * Creates and updates a database backup.
	 * @returns Promise<void>
	 */
    async database_backup() { await this.command.database_backup() }



	/**
	 * Prompts the user to enter the name of the backup file that will be restored.
     * Once provided, it downloads and restores a provided backup name.
	 * @returns Promise<void>
	 */
    async database_restore() {
        // Ask for the backup input
        const backupName = await this.input.databaseBackupName();
        
        // Finally, restore the db
        await this.command.database_restore(backupName);
    }






	/*****************************************************************************
     * PUSH												   					     *
     * Push stands for the transfer of data from the local machine to the server *
     * that can be hosted by any service provider.                               *
     * In a push action, the directories/files are completely removed from the   *
     * server (if exist) prior to pushing in order to guarantee the server is    *
     * always running on the latest data.                                        *
	 * 																		     *
	 * Processes:															     *
	 * 	push_compose													         *
	 * 	push_api											                     *
	 * 	push_gui											                     *
	 * 	push_all_source_code											         *
	 * 	push_env											                     *
     *****************************************************************************/






    /* Source Code Push */



    /**
     * Pushes the compose's source code to the server.
     * @returns Promise<void>
     */
    push_compose() { return this.push_source_code(this.config.source_code.compose) }





    /**
     * Pushes the api's source code to the server.
     * @returns Promise<void>
     */
    push_api() { return this.push_source_code(this.config.source_code.api) }





    /**
     * Pushes the gui's source code to the server.
     * @returns Promise<void>
     */
    push_gui() { return this.push_source_code(this.config.source_code.gui) }




    /**
     * Pushes all the source code to the server project by project.
     * @returns Promise<void>
     */
    async push_all_source_code() {
        // Push compose
        console.log("COMPOSE:\n");
        await this.push_compose();

        // Push the api
        console.log("\n\nAPI:\n");
        await this.push_api();

        // Push the gui
        console.log("\n\nGUI:\n");
        await this.push_gui();
    }





    /**
     * Given a source code object, it will make the root directory if it doesn't 
     * already exist. Then will push all files and directories.
     * @param source_code: object
     * @returns Promise<void>
     */
    async push_source_code(source_code) {
        // Create the root directory
        await this.command.make_server_dir(source_code.dir_name);

        // Push all the directories
        for (let dir_name of source_code.directories) {
            await this.push_dir(
                `${this.config.local_path}/${source_code.dir_name}/${dir_name}`, 
                `${source_code.dir_name}/${dir_name}`
            );
        }

        // Push all the files
        for (let file_name of source_code.files) {
            await this.push_file(
                `${this.config.local_path}/${source_code.dir_name}/${file_name}`, 
                `${source_code.dir_name}/${file_name}`
            );
        }
    }





    


    /* Environment Variables File Push */



    /**
     * Prompts the user for the env file path and pushes it
     * to the server.
     * @returns Promise<void>
     */
    async push_env() {
        // Init the destination path
        const dest = `${this.config.source_code.compose.dir_name}/.env`;

        // Ask the user for the path
        const path = await this.input.environmentFilePath();

        // Push the new file to the server
        await this.push_file(path, dest);
    }










    /* General Push Helpers */




	/**
	 * Executes a push action on a file based on the provided parameters.
	 * @param origin: string 
	 * @param destination: string 
	 * @returns Promise<void>
	 */
     async push_file(origin, destination) {
		// Removing the file on the server if exists
		try { await this.command.remove_server_file(destination) } catch (e) { }
		
		// Push the file
		console.log(`Pushing ${origin}...`);
		await this.command.push_file(origin, destination);
	}






	/**
	 * Executes a push action on a directory based on the provided parameters.
	 * @param origin: string 
	 * @param destination: string 
	 * @returns Promise<void>
	 */
	async push_dir(origin, destination) {
		// Removing the directory on the server if exists
		try { await this.command.remove_server_dir(destination) } catch (e) { }
		
		// Push the directory
		console.log(`Pushing ${origin}...`);
		await this.command.push_dir(origin, destination);
	}
}







// Export the class
export { Server };