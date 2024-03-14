// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');



// see https://code.visualstudio.com/api/references/vscode-api#StatusBarItem
let statusBarItem
let totalUpdates = 0
let lastPost = new Date()
let lastError = new Date()

// avoids hammering a server with updates
const minSecondsBetweenUpdates = 120
// avoids hammering an un-responding server
const minSecondsBetweenErrors = 30

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, extension "cricket" is now active!');

	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);	

	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument(updateStatusBarItem));
	updateStatusBarItem();
}

function updateStatusBarItem(textEvent) {
	console.log("update!")

	if ( ! textEvent) {
		statusBarItem.hide()
		return
	}

	const secondsSinceLastPost =
		((new Date()).getTime() - lastPost.getTime())/1000;
	const secondsSinceLastError = 
		((new Date()).getTime() - lastError.getTime())/1000;		

	if ((secondsSinceLastPost < minSecondsBetweenUpdates) ||
		(secondsSinceLastError < minSecondsBetweenErrors)) {
		console.log(`not spamming: ${secondsSinceLastPost} since last ok, ${secondsSinceLastError} since last error`)
		return;
	}

	const doc = vscode.window.activeTextEditor.document
	const code = doc.getText()
	const urlMatch = code.match(/^\/\/ cricket-url: (.*)$/m)
	const idMatch = code.match(/^\/\/ cricket-id: (.*)$/m)
	if ( ! urlMatch || ! idMatch) {
		console.log(`not cricket-enabled`)
		statusBarItem.hide()
		return;
	}
	const url = urlMatch[1].trim()
	const id = idMatch[1].trim()

	post(url, id, doc.fileName, code)
}

function post(baseUrl, id, filename, code) {
	const url = `${baseUrl}/log`

	const opts = {
		method: 'POST',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
		body: JSON.stringify({id, filename, code})
	}

	console.log(`post-fetch to ${url} with ${id} ${filename}: ${code.length} chars`)
	fetch(url, opts)
		.then(d => {
			lastPost = new Date()
			statusBarItem.text = `$(megaphone) OK ${++totalUpdates}`
			statusBarItem.show();
		})
		.then(undefined, err => {
			lastError = new Date()
			console.log('fetch error', err)
			statusBarItem.text = `$(megaphone) ERR ${totalUpdates}`
			statusBarItem.show();
		})
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
