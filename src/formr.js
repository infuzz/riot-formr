/*import * as riot from 'riot'*/

riot.install(function (component) {
    window.addEventListener('updateAll', () => {
        component.update()
    })
    component.updateAll = function () {
        window.dispatchEvent(new Event('updateAll'))
    }
    component.i18n = function (id) {
        return id
    }
    component.langName = function (id) {
        const langs = {
            fr: 'français',
            en: 'English'
        }
        return langs[id] || id
    }
    component.selectIcon = function (field) {
        var ret, id = '',
            subType = '',
            type = ''
        if (field.icon && field.icon != 'none') return field.icon
        if (field.id) id = field.id.toLowerCase()
        if (field.type) type = field.type
        if (field.onclick && !type) type = 'button'
        let autoIcons = {
            tags: 'fas fa-tags',
            logon: 'fas fa-user',
            address: 'fas fa-map-marker-alt',
            name: 'fas fa-user',
            url: 'fas fa-user',
            lang: 'fas fa-language',
            google: 'fab fa-google',
            twitter: 'twitter',
            facebook: 'fab fa-facebook',
            datetimepicker: 'fas fa-calendar-alt',
            date: 'fas fa-calendar-alt',
            month: 'fas fa-calendar-alt',
            datetime: 'fas fa-calendar-alt',
            tel: 'fas fa-phone',
            mail: 'fas fa-envelope',
            email: 'fas fa-envelope',
            password: 'fas fa-key',
            number: 'fas fa-list-ol',
            button: 'fas fa-mouse-pointer'
        }
        for (var possibleId in autoIcons) {
            if (id.indexOf(possibleId) != -1 ||
                type.indexOf(possibleId) != -1
            ) return autoIcons[possibleId]
        }
        if (!ret) ret = 'fas fa-greater-than';
        return ret
    }
    component.callType = function (type) {
        let types = {
            text: ['text', 'textarea', 'date', 'color', 'datetime', 'datetime-local', 'email', 'month', 'number', 'tel', 'time', 'url', 'week'],
            checkbox: ['checkbox', 'switch']
        }
        if (types.text.indexOf(type) > -1) return 'text'
        if (types.checkbox.indexOf(type) > -1) return 'checkbox'
        return type
    }
    component.translate = function (ev) {
        let elt = ev.target.closest(".input-group").querySelector(".form-control")
        let defaultLang = elt.getAttribute('defaultLang')
        let lang = elt.getAttribute('lang')
        let eltFromId = elt.getAttribute('baseId') + '.' + defaultLang
        console.log(eltFromId, defaultLang, lang)
        let eltFromValue = ev.target.closest(".form-group").querySelector('[name="' + eltFromId + '"]').value
        //console.log(ev.target.closest(".form-group").querySelector('[name="'+eltFromId+'"]').getAttribute('name'))
        elt.value = 'Transalion : ' + defaultLang + ' to ' + lang + ':' + eltFromValue
    }
})


export function getFormValues(formName) {
    var data = {}
    let inputs = document.getElementsByName(formName)[0].querySelectorAll('.form-control')
    inputs.forEach(function (input) {
        if (input.name) {
            let type = input.type
            switch (type) {
                case 'checkbox':
                    if (input.checked) field(data, input.name, input.getAttribute('checkedValue') || true)
                    else field(data, input.name, input.getAttribute('uncheckedValue') || false)
                    break
                case 'select-multiple': //this is a special type property of dom  : https://www.w3schools.com/jsref/prop_select_type.asp
                    field(data, input.name, [...input.options].filter((x) => x.selected).map((x) => x.value))
                    break
                case 'radio':
                    if (input.checked) field(data, input.name, input.value)
                    if (!field(data, input.name)) field(data, input.name, null)
                    break
                default: //text, select-one, password, hidden, email, tel, textarea...... all others
                    field(data, input.name, input.value)
            }
        }
    })
    return data
}

export function setFormValues(formName, data) {
    let inputs = document.getElementsByName(formName)[0].querySelectorAll('.form-control[name]') //find all form-control with a name
    inputs.forEach(function (input) {
        let type = input.type

        if (input.getAttribute('colorpicker')) type = 'colorpicker'
        if (input.getAttribute('datetimepicker')) type = 'datetimepicker'
        if (input.getAttribute('texteditor')) type = 'texteditor'

        let val = field(data, input.name)
        switch (type) {
            case 'checkbox':
                input.checked = (input.checkedValue == val && input.uncheckedValue != val) || val
                break
            case 'select-multiple':
                if (input.selectr) { //selectr tag
                    var setSelectrEvent = new CustomEvent(formName + '_setSelectr_' + input.name, {
                        detail: {
                            values: val
                        }
                    })
                    document.dispatchEvent(setSelectrEvent)
                } else Array.prototype.forEach.call(input.options, function (opt) {
                    opt.selected = (val && val.indexOf(opt.value) > -1)
                })
                break
            case 'colorpicker':
                var setColorEvent = new CustomEvent(formName + '_setColor_' + input.name, {
                    detail: {
                        color: val
                    }
                })
                document.dispatchEvent(setColorEvent)
                break
            case 'datetimepicker':
            console.log('typeA',type,input.name)
                var setDatetimeEvent = new CustomEvent(formName + '_setDatetime_' + input.name, {
                    detail: {
                        epoch: val
                    }
                })
                document.dispatchEvent(setDatetimeEvent)
                break
            case 'texteditor':
                var setTexteditorEvent = new CustomEvent(formName + '_setTexteditor_' + input.name, {
                    detail: {
                        content: val
                    }
                })
                document.dispatchEvent(setTexteditorEvent)
                break
            default: //radio, select-one' text, password, hidden, email, tel, textarea...... all others
            console.log('type',type,input.name,input)
                input.value = val
                //image
        }
    })
    return data
}

function setSelectOptions(formName, selectName, values) {
    let select = document.getElementsByName(formName)[0].querySelectorAll('[name="' + selectName + '"]')


    $('#' + id).children('option').remove();
    /*if(values) for ( var i = 0; i < values.length; i++ ) {
    	$('#'+id).append(new Option(values[i].label, values[i].id, false, false));
    }*/
    $.each(values, function (key, value) {
        $('#' + id).append(new Option(value, key, false, false));
    })
    $('#' + id).trigger('change');
}

export function field(obj, fieldPath, value) {
    // split the field into tokens
    if (obj === undefined || fieldPath === undefined || obj === null) return
    var tokens = fieldPath.split('.');
    // if there's more than one token, this field is an object
    if (tokens.length > 1) {
        var subObj = tokens[0];
        // define the object
        if (!obj[subObj]) obj[subObj] = {};
        // call field again on the embedded object
        var firstDot = fieldPath.indexOf('.');
        return field(obj[subObj], fieldPath.substr(firstDot + 1), value);
    } else {
        var arr = fieldPath.split('[');
        if (arr.length > 1) {
            if (!obj[arr[0]]) obj[arr[0]] = [];
            if (value !== undefined) obj[arr[0]].push(value)
            else return obj[arr[0]][arr[1].slice(0, -1)] //remove last char or arr[1] that must be a ']'
        } else {
            if (value !== undefined) obj[fieldPath] = value; // no embedded objects, just fieldPath assignment
            else return obj[fieldPath]
        }
    }
}

import formr from './formr.riot'
import ialert from './ialert.riot'
import ibutton from './ibutton.riot'
import icheckbox from './icheckbox.riot'
import icolorpicker from './icolorpicker.riot'
import idatetimepicker from './idatetimepicker.riot'
import iimagepicker from './iimagepicker.riot'
import ihidden from './ihidden.riot'
import ihr from './ihr.riot'
import ipassword from './ipassword.riot'
import iradio from './iradio.riot'
import irange from './irange.riot'
import irow from './irow.riot'
import iselect from './iselect.riot'
import itext from './itext.riot'
import itexteditor from './itexteditor.riot'
import ititle from './ititle.riot'
import jaddon from './jaddon.riot'
import jhelp from './jhelp.riot'
import jicon from './jicon.riot'
import jlabel from './jlabel.riot'
import jtooltip from './jtooltip.riot'


riot.register('formr', formr)
riot.register('ialert', ialert)
riot.register('ibutton', ibutton)
riot.register('icheckbox', icheckbox)
riot.register('icolorpicker', icolorpicker)
riot.register('idatetimepicker', idatetimepicker)
riot.register('iimagepicker', iimagepicker)
riot.register('ihidden', ihidden)
riot.register('ihr', ihr)
riot.register('ipassword', ipassword)
riot.register('iradio', iradio)
riot.register('irange', irange)
riot.register('irow', irow)
riot.register('iselect', iselect)
riot.register('itext', itext)
riot.register('itexteditor', itexteditor)
riot.register('jaddon', jaddon)
riot.register('jhelp', jhelp)
riot.register('jicon', jicon)
riot.register('jlabel', jlabel)
riot.register('jtooltip', jtooltip)
