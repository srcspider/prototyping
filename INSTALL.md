What you'll need installed:

 - nodejs: http://nodejs.org/
 - ruby: https://www.ruby-lang.org/
 - mongodb: http://www.mongodb.org/

Optionally you'll need [sublime text](http://www.sublimetext.com/) along with the [EditorConfig plugin](https://github.com/sindresorhus/editorconfig-sublime#readme).
If you're not familiar with sublime text here is a quick cheat sheet: https://gist.github.com/srcspider/8618334

**getting project files**
```sh
cd /path/to/projects
git clone git@github.com:srcspider/grunt-template.git
cd grunt-template
```

## Install

```sh
./INSTALL.sh
```

## Post-Install

You now have all the dependencies sorted and the project is now up and ready.

To run the build system,
```sh
grunt
```

To have the build system watch for file changes and also autoupdate,
```sh
grunt watch
```

To have the build system do everything above and also start servers,
```sh
grunt server
```

If you like syncing files to the server just run,
```sh
grunt stage
```
A clean copy of the files ready for syncing will now be available in `staging/`

To have the build system create a release archive versions,
```sh
grunt release
```

## Tips / Troubleshooting

### Annoying beep

If you're on windows running `grunt` and getting an error may result in an
annoying beep. To stop it either in a console with admin privilages run:
`net stop beep` or follow the following instructions:
https://superuser.com/questions/10575/turning-off-the-cmd-window-beep-sound

### Fast ruby gem installs and updates

99% of the time it takes to get gems is in generating the docs. If you use only
online docs then you can just skip this step by adding the following in your
`~/.gemrc` this will affect both `gem install` as well as `bundle install`
making them almost instant.

	install: --no-rdoc --no-ri
	update:  --no-rdoc --no-ri
