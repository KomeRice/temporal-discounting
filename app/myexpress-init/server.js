/**
* Initialize the server with the Express module to listen on port TCP/80 
* Returns the Express instance
**/

module.exports = function () {

	const express = require('express')
	const app = express()
	const port = 80
	app.listen(port, () => {
	  console.log(`app listening on port ${port}`)
	})
	return app;
}

