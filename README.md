# VSC-Cricket

An extension that regularly uploads contents of VSC buffers to a server. To be used to gain insight into how students learn to program.

Includes 2 parts:
* A [client](https://github.com/manuel-freire/vsc-cricket/tree/main/client) (vs code extension) that sends the data. The extension is entirely controlled by comments in the code: it is only activated if valid comments are detected, and the comments identify both where to send the data, and how to identify their author.
* A [server](https://github.com/manuel-freire/vsc-cricket/tree/main/server) (using flask) that receives the data
