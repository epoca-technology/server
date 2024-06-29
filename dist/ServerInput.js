import inquirer from "inquirer";
import { lstatSync } from "fs";


/**
 * Server Input
 * This class handles all the neccessary user input in order to interact
 * with the server.
 */
class ServerInput {


    constructor() {}



	/**
	 * Displays the process menu and takes the user through the selection of 
	 * a process id to run.
	 * @param process_menu: object
	 * @returns Promise<string>
	 */
	async process_id(process_menu) {
		// Retrieve the category of the process
		const category = await inquirer.prompt([
			{ type: "list", name: "value", message: "Select the type of process", choices: Object.keys(process_menu), loop: false }
		]);

		// Retrieve the list of processes within the category
		const process = await inquirer.prompt([
			{ type: "list", name: "value", message: "Select a process", choices: process_menu[category["value"]], loop: false }
		]);

		// Finally, return the process id
		return process["value"];
	}







	/**
	 * Displays the form that collects backup name for a database that will
	 * be restored.
	 * @returns Promise<string>
	 */
	async databaseBackupName() {
		const args = await inquirer.prompt(
			[
				{
					type: "input", name: "backupName", message: "Enter the backup file name. F.e: 1646678127337.dump", 
					validate(value) {
						if (typeof value == "string" && value.length >= 15 && value.includes(".dump")) {
							return true
						} else {
							return "Please enter a valid backup file name.";
						}
					}
				}
			]
		);

		// Finally, return the answer
		return args["backupName"]
	}





	

	/**
	 * Displays the form that collects the absolute path of the environment
	 * file that will be pushed to the server
	 * @returns Promise<string>
	 */
	async environmentFilePath() {
		const args = await inquirer.prompt(
			[
				{
					type: "input", name: "path", message: "Enter the absolute path to the environment file", 
					validate(value) {
						if (typeof value == "string" && lstatSync(value).isFile() && value.includes(".env")) {
							return true
						} else {
							return "Please enter a valid path.";
						}
					}
				}
			]
		);

		// Finally, return the answer
		return args["path"]
	}

}



export { ServerInput }