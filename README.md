# Form generator with riot 4
Use with riot.js 4

- Site: https://riot.js.org/

## Install 
Then run these commands:

```bash
$ npm install @klicat/riot-formr
```

## Create a form

```javascript
form2: {
            attr: {
                lang: 'fr',
                langs: ['fr', 'en'],
                proposeTranslate: true
            },
            desc: [

                {
                    type: 'title',
                    title: 'Hello',
                },
                {
                    type: 'text',
                    label: 'Name'
                }
            ]
        }
```
## Add fields

### Text input
To add a text input just add a field with "text" as type in your *desc* array. You can add a label like that :

```javascript
desc: [
                {
                    type: 'text',
                    label: 'Name'
                }
      ]
```
You can also add any HTML's attributes in your field.

```javascript
desc: [
                {
                    type: 'text',
                    label: 'Name',
                    placeHolder: 'Smith',
                    size: 8
                }
      ]
```

### Text area

Text area works just the same as a text input except that the *type* is *'textarea'* and you need to add the *rows* attribute :

```javascript
desc: [
                {
                    type: 'textarea',
                    label: 'Review',
                    placeHolder: 'Type your review here...',
                    rows: 8
                }
      ]
```

### Password

Here, you need to set the type as *password* :

```javascript
desc: [
                {
                    type: 'password',
                    label: 'Please type your password :'
                }
      ]
```

### Text editor

This text editor is from [quill.js](https://quilljs.com/). It works the same as text area except that it handle html input.

```javascript
{
                    id: 'mytextedit',
                    label: 'Article',
                    type: 'texteditor',
                    value: '<p><strong><s><u>My first text    </u></s></strong></p>'
},
```





