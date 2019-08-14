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
                    id: 'myText1'
                    type: 'text',
                    label: 'Name'
                }
      ]
```
You can also add any HTML's attributes in your field.

```javascript
desc: [
                {
                    id: myText
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
                    id: myTextArea
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
                    id: 'myPassword'           
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

#### Check box

To add check boxes, you have to specify the different options givens by your check boxes. You can also specify the values of each checkbox by adding the *value* attribute :
```javascript
{
                    id: 'checboxTransport',
                    type: 'checkbox',
                    label: 'Transport choices',
                    options: [
                        {
                            label: 'Car',
                            id: 'car'
                    },
                        {
                            label: 'Bus',
                            id: 'bus',
                            value: true
                    }
                ]
 }
 ```

#### Switch

A switch button is a checkbox who retuen a value when it is checked and when it is not. Furthermore it can control other items by showing or hiding them. To do this you have to specify the id of the element that you want to be controlled by the switch button in the checked or the unchecked array.

```javascript
{
                    id: 'switchTest',
                    type: 'switch',
                    label: 'Animal',
                    options: [
                        {
                            checkedLabel: 'He fly',
                            uncheckedLabel: 'He fall',
                            checkedValue: 'fly',
                            uncheckedValue: 'fall',
                            value: 'fly',
                            ctrl: {
                                checked: ["flyDescription"],
                                unchecked: ["fallDescription"]
                            }
}
```

### radio

Check  boxes and radios are really similar. The only diference is that you can check only one radio.

```javascript
{
                    id: 'radioAnimal',
                    type: 'radio',
                    label: 'Choix animal',
                    value: 'dog',
                    options: [
                        {
                            label: 'chien',
                            id: 'dog',
                            tip: 'Il faut bien écrire vous avez affaire avec un président'
                    },
                        {
                            label: 'chat',
                            achecked: true,
                            id: 'cat',
                            help: 'Help Please verify your info before'
                    }
                ]
},
```
### Select input

```javascript

{
                    id: 'genre',
                    type: 'select',
                    label: 'Genre',
                    value: 'girl',
                    options: [
                        {
                            label: 'I'm a boy',
                            value: 'boy'
                    },
                        {
                            label: 'I'm a girl',
                            value: 'girl'
                    }
                ]
            }

```
- If you want to turn it into a __multiselect input__ just change the _type_ as _multiselect_.

### Tag selector

We are using the [Mobius1 selector](https://github.com/Mobius1/Selectr) which is very complete for the tag selection. To incorporate it in your form you need to set the _type_ as _multiselect_ and set _tag_ as _true_. In order to add a tag that wasn't in _options_ you need to set the attribute _userAddOption_ as _true_.

```javascript
{
                    id: 'music',
                    type: 'select',
                    multiple: true,
                    tag: true,
                    userAddOption: true,
                    label: 'Music',
                    value: ['guitar'],
                    options: [
                        {
                            label: 'Piano',
                            value: 'piano'
                    },
                        {
                            label: 'Guitar',
                            value: 'guitar',
                    }
                ]
},
```

### Date / time picker

 For the date time picker we are using [Flatpickr](https://github.com/Mobius1/Selectr).
 
 By default this picker allow you to choose the date if you want to add time, just set _enableTime_ as _true_.
 
 ```javascript
 {
                    type: 'datetimepicker',
                    id: 'mydatetimepicker',
                    label: 'Date de naissance',
                    enableTime: true,
                    tip: 'Tip Please verify your info before',
                    help: 'Help Please verify your info before',
                    value: 56564415
 },
 ```
- __Note__ : The format of the returned value is Unix timestamp.

### Color picker

For the color picker we are using [Simonwep/pickr](https://github.com/Simonwep/pickr) wich is a color and opacity picker.

```javascript
{
                    id: 'mycolor',
                    label: 'First color',
                    type: 'colorpicker',
                    value: 'red'
},
```

### image picker 

à compléter

### Range input

