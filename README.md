# Companion file switcher

This VSCode extension let you easily switch between **companion files**.


![Commands](images/screenshoot1.png)


## Features
Companion files share the same name, but use different extensions:
- my-component.**component.ts**
- my-component.**component.html**
- my-component.**component.scss**
- my-component.**service.ts**
- my-component.**route.ts**
- ...

You can associate a user friendly name to each companion type:
- **component.ts** => 'Component' 
- **component.html** => 'Component view' 
- **component.scss** => 'Component Style'
- **service.ts** => 'Service'
- **route.ts** => 'Route'
- ...

When called, a list of companion files of the active document will popup,
listing every companion with their friendly name if any. 

## Keybindings

Activating this extension can be done by binding the following command:

```
"command": "extension.companionFiles"
```

By default this command is binded to **ctrl+shift+c ctrl+shift+f**

## Extension Settings

This extension use the following settings:

* `companionFiles.friendlyName`: an object where key map to an extension 
and value map to the corresponding friendly name.  
If not specified, the default value is:
```
{
    'component.ts': 'Component',
    'service.ts': 'Service',
    'pipe.ts': 'Pipe',
    'test.ts': 'Test',
    'directive.ts': 'Directive',
    'routes.ts': 'Routes',
    'guard.ts': 'Guard',
    'component.html': 'Component view',
    'component.scss': 'Component style',
}
``` 
