You'll need node (along with npm which comes with node).

http://nodejs.org/

```sh
cd /path/to/projects
git clone git@github.com:srcspider/grunt-template.git
cd grunt-template
npm install
```

You now have all the dependencies sorted and the project is now up and ready.

To open the project in sublime please use:

```sh
edit this.sublime-project
```

Where `edit` is your command line alias/link for sublime's executable.

This will open the project with files sorted, irrelevant files hidden and
various other goodies such as project tab settings, build systems, ruler
settings, etc; it will also mean sublime text will persist unsaved files when
you close/switch projects or the editor itself.

The project is designed to be worked on and best viewed in sublime text but you
may use any editor you wish.

To run the build system,
```sh
grunt
```

Or alternatively use the "Grunt" build system in sublime
(see: Tools / Build Systems) via F7


## Tips / Troubleshooting

If you're on windows running `grunt` and getting an error may result in an
annoying beep. To stop it either in a console with admin privilages run:
`net stop beep` or follow the following instructions:
https://superuser.com/questions/10575/turning-off-the-cmd-window-beep-sound
