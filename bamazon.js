var mysql = require("mysql");
var inquirer = require("inquirer");
var config = require('./config.js');
var connection = mysql.createConnection(config);
require("console.table");


connection.connect(function(err) {
	if (err) throw err;
	// console.log("CONNECTION NUMBER : " connection.threadId);
	showStock();
});



function showStock() {

	connection.query("SELECT * FROM products", function(err, result) {

		if (err) throw err;
		console.log("==============================================================");
		console.table(result);
		console.log("==============================================================");
		console.log('');
		startBamazonPurchase();
	});
}


function startBamazonPurchase() {
	
	inquirer.prompt([{
		name: "productID",
		message: "what is the item id of the product you would like to buy?",

		validate: function(value) {
			if(isNaN(value) === false) {
				return true;
			}
				return false;
		}
	}, {
		name: "qNum",
		message: "how much of this product would you like to buy?",

		validate: function(value) {
			if(isNaN(value) === false) {
				return true;
			}
				return false;
		}
	}]).then(function(answer) {

		var productID = parseInt(answer.productID);
		var qNum = parseInt(answer.qNum);
		var isAvailable = false;
		var stockId = null;


		connection.query("SELECT * FROM products", function(err, result) {

			for (var i = 0; i < result.length; i++) {
				// console.log(result[i].item_id + " " + productID);
				
				if (productID === result[i].item_id) {
						stockId = i;
						isAvailable = true;
					if(qNum > result[stockId].stock){
						isAvailable = false;
					}
				}
			}

			if (isAvailable) {
				connection.query("SELECT * FROM products WHERE item_id = ?", [productID], function(err, result) {
					// if(err) throw err;

					var total = result[0].price * qNum;
					var inventory = result[0].stock - qNum;
					var productName = result[0].product_name;

					//this works 
					// console.log(inventory);
					// console.log(total);
					console.log("=================================================");
					console.log("PRODUCT : " + productName);
					console.log("AMOUNT : " + qNum);
					console.log("-------------------------------------");
					console.log("TOTAL : $" + total);
					console.log("=================================================");

					// confirmPurchase();

					inquirer.prompt([{
						name: "total",
						message: "Is your order correct?",
						type: "list",

						choices: [{
							name: "YES"
						}, {
							name: "NO"
						}]
					}]).then(function(answer) {


						if (answer.total === "YES"){
							connection.query("UPDATE products SET ? WHERE ?", [{
								stock: inventory
							}, {
								item_id: productID
							}], function(err) {
								if(err) throw err;
									console.log('');
									console.log("=====================================\n");
									console.log("you have placed the order!\n");
									console.log("=====================================");
									console.log('');
									showStock();
								});
						}
						else {
							showStock();
						}

					});
					});
			}
			else{
				console.log("\n");
				console.log("product doesnt exist or not enough quantity!");
				console.log("\n");
				showStock();
			}
		});
	});
};







