# cricket client README

An extension that regularly uploads contents of VSC c++ files to a server. To be used to gain insight into how students program.

## Installation

This extension has not been uploaded to any online extension repository (excluding this source repository). To install, use

~~~
    vsce package
~~~

from a command-line to create a `.vsix` package, and install that package via

~~~
    code --install-extension cricket-0.0.1.vsix
~~~

## Features

The extension activates itself if it detects either .h or .cpp files in the current workspace.

Whenever a workspace file is saved, the extension reads its source to look for comments that start with `// cricket-url: ` and `// cricket-id: `. If these comments are found, and no traces had been sent for more than a specified time interval, it will send the contents of the file to the value of _cricket-url_, including _cricket-id_ as an identifier. It will also send the current filename.

## Requirements

No special requirements 

## Extension Settings

No settings. Everything either from comments (see above) or hard-coded.

## Known Issues

None yet.
