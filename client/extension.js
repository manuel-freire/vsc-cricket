// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');



// see https://code.visualstudio.com/api/references/vscode-api#StatusBarItem
let statusBarItem
let totalUpdates = 0
let lastSave = new Date()

const baseUrl = "http://localhost:5000"
const minSecondsBetweenUpdates = 10

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cricket" is now active!');

	// The command has been defined in the package.json file
	let infoMsg = vscode.commands.registerCommand('cricket.showInfo', function () {
		vscode.window.showInformationMessage('Hello World from cricket!');
	});

	let warningMsg = vscode.commands.registerCommand('cricket.showWarning', () => {
		vscode.window.showWarningMessage('Warning Notification');
	});

	
	// from https://github.com/microsoft/vscode-extension-samples/blob/main/statusbar-sample/src/extension.ts
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);	

	context.subscriptions.push(infoMsg, warningMsg, 
		vscode.workspace.onDidSaveTextDocument(updateStatusBarItem));
	updateStatusBarItem();
}

	/*
		other triggers
		// change of text editor
		vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem),
		// change of selection in active editor
		vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
	*/


function updateStatusBarItem(textEvent) {
	console.log("update!")

	if ( ! textEvent) {
		statusBarItem.hide()
		return
	}

	const secondsSinceLastSuccess = 
		((new Date()).getTime() - lastSave.getTime())/1000;
	
	if (secondsSinceLastSuccess < minSecondsBetweenUpdates) {
		console.log(`not spamming: ${secondsSinceLastSuccess} < ${minSecondsBetweenUpdates}`)
		return;
	}

	post(vscode.window.activeTextEditor.document.getText())
}

function post(code) {
	const url = `${baseUrl}/log`

	const opts = {
		method: 'POST',
  		headers: {
    		'Accept': 'application/json, text/plain, */*',
    		'Content-Type': 'application/json'
  		},
		body: JSON.stringify({id:42, code})
	}

	console.log("post-fetch to ", url)
	fetch(url, opts)
		.then(d => {
			lastSave = new Date()
			statusBarItem.text = `$(megaphone) OK ${totalUpdates++}`
			statusBarItem.show();
		})
		.then(undefined, err => {
			console.error('strange API error', err);
		 })
		.catch(e => {
			console.log('fetch error', e)
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
