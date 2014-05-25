Module logic is placed in `models/`
Module view logic is placed in `views/`
General purpose code is placed in the `framework/`

Additional misc code is placed in `helpers/` unless it's overused pattern in
which case simply create another directory on the root (eg. svg code goes
into `svgs/`)

## Modules

Each module has it's own directory unless it is a special component (such as
an about page, the application component, etc) in which case it's located
on the root (unless otherwise specified).

Modules are located in views and their logic is located in models. Two
different directories are used to make it intuitive to determine if code isn't
nonsense (ie. view logic in models, or model logic in views).

Each module directory follows the same pattern:

 - *Entry* - component as it appears in a listing (may or may not be partial)
 - *View* - component as it appears as the single complete entity on a page
 - *Form* - component form if applicable

A component may have some, all of the above, or even additional entries.

In react the name used is always "[Module][Pattern]" unless it's View in
which case it's just "[Module]". This doesn't really affect the code name,
which is always "app.[Module].[Pattern]". If it's redundant to have both View
and Entry then always ommit Entry.

## Sanity Checklist

 - DO NOT add ajax calls or any other sort of model logic in the views section
 - DO NOT add view logic in the model section (ie. calls to react components)
 - DO NOT pass react components as "parent" or some other prop; if a child
   needs to update a listing somewhere (that might or might not be in the
   parent) then the parent should pass a refreshListing prop to the child which
   would be a callback he can call to get the job done; same for other cases
 - DO NOT attempt to do anything more then very basic state logic in
   the render method of react components
 - DO NOT think in anything other then "changing state" via setState; if you're
   thinking of "adding a div here" then you're doing it wrong, you should
   only think of that in the render method based on state you have; everywhere
   else inside the react component you think only in "changing state"
