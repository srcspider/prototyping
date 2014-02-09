You'll need nodejs (`npm` utility comes with nodejs).

http://nodejs.org/

You'll also need ruby (`gem` utility comes with `ruby`)

https://www.ruby-lang.org/

And finally optionally you'll need [sublime text](http://www.sublimetext.com/)
along with the [EditorConfig plugin](https://github.com/sindresorhus/editorconfig-sublime#readme).

**getting project files**
```sh
cd /path/to/projects
git clone git@github.com:srcspider/grunt-template.git
cd grunt-template
```

**getting grunt dependencies**
```sh
npm install
```

**getting ruby dependencies**
```sh
gem install bundler
bundle install
```

You now have all the dependencies sorted and the project is now up and ready.

To open the project in sublime please use:

```sh
edit this.sublime-project
```

Where `edit` is your command line alias/link for sublime's executable (2.x
and 3.x have been tested and known to work).

This will open the project with files sorted, irrelevant files hidden and
various other goodies such as project tab settings, build systems, ruler
settings, etc; it will also mean sublime text will persist unsaved files when
you close/switch projects or the editor itself.

For more on workflow see: https://gist.github.com/srcspider/8618334

The project is designed to be worked on and best viewed in sublime text but you
may use any editor you wish.

To run the build system,
```sh
grunt
```

Or alternatively use the "Grunt" build system in sublime
(see: `Tools / Build Systems`) via `F7`


## Tips / Troubleshooting

### Annoying beep

If you're on windows running `grunt` and getting an error may result in an
annoying beep. To stop it either in a console with admin privilages run:
`net stop beep` or follow the following instructions:
https://superuser.com/questions/10575/turning-off-the-cmd-window-beep-sound

### Problems building style

If you encounter problems with the `--sourcemap` flag in the sass, make sure
you have 3.3.0 or greater, at the time of this writing sass 3.3.0 is still in
rc status so you need to run `gem install sass -v '>=3.3.0alpha' --pre`
