import {
    install
} from 'riot'

install(function (component) {
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


export function getFormValues(formId) {
    var data = {}
    let inputs = document.getElementsByName(formId)[0].querySelectorAll('.form-control')
    inputs.forEach(function (input) {
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
    })
    return data
}

export function setFormValues(formId, data) {
    let inputs = document.getElementsByName(formId)[0].querySelectorAll('.form-control')
    inputs.forEach(function (input) {
        let type = input.type
        let val = field(data, input.name)
        switch (type) {
            case 'checkbox':
                input.checked = (input.checkedValue == val && input.uncheckedValue != val) || val
                break
            case 'select-multiple':
                Array.prototype.forEach.call(input.options, function (opt) {
                    opt.selected = (val.indexOf(opt.value) > -1)
                })
                break
            default: //radio, select-one' text, password, hidden, email, tel, textarea...... all others
                input.value = val

                //console.log(input.closest(".form-group").querySelector(".pcr-button").setColor(val,true))
                var setColorEvent = new CustomEvent(formId + '_setColor_' + input.name, {
                    detail: {
                        color: val
                    }
                })
                document.dispatchEvent(setColorEvent)
                //+color, editor, image
        }
    })
    return data
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
