// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');



// see https://code.visualstudio.com/api/references/vscode-api#StatusBarItem
let statusBarItem;

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
	let lineCounter = vscode.commands.registerCommand('cricket.showSelectionCount', () => {
		const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
		vscode.window.showInformationMessage(`Yeah, ${n} line(s) selected... Keep going!`);
	});

	context.subscriptions.push(infoMsg, warningMsg, lineCounter,
		// change of text editor
		vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem),
		// change of selection in active editor
		vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
	);
	updateStatusBarItem();
}

function updateStatusBarItem() {
	const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
	if (n > 0) {
		statusBarItem.text = `$(megaphone) ${n} line(s) selected`;
		statusBarItem.show();
		if (n > 4) {
			testSend()
		}
	} else {
		statusBarItem.hide();		
	}
}

function getNumberOfSelectedLines(editor) {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}

function testSend() {
	fetch("http://localhost/")
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
