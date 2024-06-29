import { Server } from "./dist/Server.js";



/**
 * Process Execution
 * Initializes an instance of the server and runs it.
 * If successful, the process will terminate with a status of 0. 
 * Otherwise, prints the error and terminates with a status of 1.
 */
console.clear();
console.log("EPOCA SERVER\n");
new Server()
.run()
.then(() => {
    process.exit(0);
}).catch(e => { 
    console.error(e); 
    process.exit(1); 
})