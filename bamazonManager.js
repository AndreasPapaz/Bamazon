var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require('./config.js');
var connection = mysql.createConnection(config);
require("console.table");

connection.connect(function(err) {
	if (err) throw err;
	// console.log("CONNECTION NUMBER : " connection.threadId);
	managerStart();
});

function managerStart() {
	inquirer.prompt([{
		name: "managerOption",
		message: "MANAGER OPTIONS",
		type: "list",
		choices: [{
			name: "View Products"
		}, {
			name: "View Low Invetory Products"
		}, {
			name: "Add to Inventory"
		}, {
			name: "Add New Product"
		}]
	}]).then(function(answer) {

		var selectOption = answer.managerOption;

		if (selectOption === "View Low Invetory Products"){ 
			viewLow();
		}

		if (selectOption === "View Products") {
			viewProduct();
		}

		if (selectOption === "Add to Inventory") {
			addInventory();
		}

		if (selectOption === "Add New Product") {
			newProduct();
		}
	})
}

// function showStock() {

// 	connection.query("SELECT * FROM products", function(err, result) {

// 		if (err) throw err;
// 		console.log("==============================================================");
// 		console.table(result);
// 		console.log("==============================================================");
// 		console.log('');
// 		// startBamazonPurchase();
// 	});
// }

function viewProduct(){

	connection.query("SELECT * FROM products", function(err, result) {

		if(err) throw err;

		console.table(result);
		enterExit();

	});
}


function enterExit(){

	inquirer.prompt([{
		name: "option",
		message: "Would you like to go back to Manager Options?",
		type: "list",
		choices: [{
			name: "YES"
		}, {
			name: "NO"
		}]
	}]).then(function(answer) {

		if (answer.option === "YES") {
			managerStart();
		}
		else{
			connection.end();
		}

	});

}

function viewLow() {

	connection.query("SELECT * FROM products WHERE stock < 5", function(err, result) {
		if (err) throw err;

		if (result.length === 0) {
			console.log("The Inventory looks great!");
			enterExit();
		}
		else {
			console.table(result);
			enterExit();
		}

	});

}

function addInventory() {

	var productName = [];

	connection.query("SELECT product_name FROM products", function(err, results) {
		if (err) throw err;

		for (var i = 0; i < results.length; i++) {
			productName.push(results[i].product_name)
		}

		inquirer.prompt([{
			name: "addItem",
			message: "Pick an item to add Inventory to.....",
			type: "list",
			choices: productName
		}, {
			name: "addAmount",
			message: "How much inventory would you like to add?",
			validate: function(response) {
					if(isNaN(parseInt(response))) {
						console.log("enter a number please...");
						return false;
					}
					else {
						return true;
					}
				}
		}]).then(function(answer) {
			var addChoice = answer.addItem;
			var addAmount = answer.addAmount;

			console.log("Item : " + addChoice + " Amount : " + addAmount);

			connection.query("UPDATE products SET ? WHERE ?", [{
				stock: 
			}])
		});
	});

}












