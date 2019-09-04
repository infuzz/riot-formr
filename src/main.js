/*import * as riot from 'riot'*/
import App from './app.riot'

import * as exports from './formr.js'
Object.entries(exports).forEach(([name, exported]) => window[name] = exported)



window.data = {
    mydatetimepicker: 1488136398547,
    checboxTransport: {
        car: false,
        bus: true
    },
    emailInrRow: "emailInrRow changed",
    fallDescription: {
        fr: "fallDescription fr",
        en: "fallDescription en"
    },
    mayrange: 10,
    flyDescription: {
        fr: "flyDescriptionf fr",
        en: "flyDescription en"
    },
    genre: "boy",
    music: ["piano"],
    mycolor: "blue",
    mydate: "date changed",
    mypassword: "mypassword changrd",
    mytextarea: {
        fr: "mytextarea fr",
        en: "mytextarea en"
    },
    mytextedit: {
        fr: "mytextedit fr",
        en: "mytextedit en"
    },
    mytextwithbuttons: "mytextwithbuttons changed",
    passwordInRow: "passwordInRow changed",
    radioAnimal: "cat",
    switchTest: {
        bird: "fall",
        snake: false,
        elephant: true
    },
    switchTestAlone: "fall_alone"
}





window.fields = {
    form1: {
        attr: {
            lang: 'fr',
            langs: ['fr', 'en'],
            proposeTranslate: true
        },
        desc: [
            {
                type: 'title',
                title: 'Hello',
                icon: 'fas fa-skull-crossbones',
                help: 'Help Please verify your info before',
            },
            {
                type: 'alert',
                color: 'danger',
                message: "Ceci est un message d'alerte",
                icon: 'fas fa-exclamation-triangle',
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
            },
            {
                type: 'datetimepicker',
                id: 'mydatetimepicker',
                label: 'Date de naissance',
                enableTime:true,
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
                value:56564415
            },
            {
                id: 'genre',
                type: 'select',
                label: 'Genre',
                value: 'girl',
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
                opts: [
                    {
                        label: 'Garcon',
                        value: 'boy'
                    },
                    {
                        label: 'Fille',
                        value: 'girl'
                    }
                ]
            },
            {
                id: 'music',
                type: 'select',
                multiple: true,
                tag: true,
                userAddOption: true,
                label: 'Musique',
                required: true,
                value: ['guitar'],
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
                opts: [
                    {
                        label: 'Piano',
                        value: 'piano'
                    },
                    {
                        label: 'Guitare',
                        value: 'guitar',
                        aaaselected: true
                    }
                ]
            },
            {
                id: 'mycolor',
                label: 'Couleur principale',
                type: 'colorpicker',
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
                value: 'red'
            },
            {
                id: 'mytextedit',
                label: 'Texte principal',
                type: 'texteditor',
                multilang: true,
                proposeTranslate: true,
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
                value: '<p><strong><s><u>Mon premier text    </u></s></strong><strong style="color: rgb(240, 102, 102);"><s><u>hkgkghkghkgh</u></s></strong><sup style="color: rgb(240, 102, 102);"><strong><s><u>ghkghkghk</u></s><em><u>kghkghkg</u></em></strong></sup></p>'
            },
            {
                id: 'mytextarea',
                type: 'textarea',
                rows: 8,
                value: 'Eheh l\'ami quoi de neuf c\'est long tout ce tete sinon <h2>ca va? la fa</h2>mille? les amis? la santé? bonsoir enfin au revoir anticonstitutionnelement ;) bisous',
                label: 'Lettre pour chirac',
                multilang: true,
                required: true,
                icon: 'fas fa-running',
                tip: 'Il faut bien écrire vous avez affaire avec un président',
                help: 'Help Please verify your info before'
            },
            {
                id: 'mayrange',
                icon: 'fas fa-running',
                type: 'range',
                label: 'Zoom',
                tip: 'select the right zoom',
                help: 'select the right zoom',
                onchange: 'alert("zoom")',
                oninput: 'alert("zoom")',
            },
            {
                id: 'mytextwithbuttons',
                type: 'text',
                required: true,
                size: 10,
                value: 'First item',
                label: 'Id de l\'ambulance',
                icon: 'fas fa-ambulance',
                minlength: 4,
                buttons: [
                    {
                        icon: 'fas fa-running',
                        onclick: 'dosomething'
                    },
                    {
                        title: 'do it',
                        onclick: 'dosomething'
                    }
                ],
                tip: 'Il faut bien écrire vous avez affaire avec un président',
                help: 'Help Please verify your info before',
            },
            {
                id: 'row0',
                type: 'row',
                desc: [
                    {
                        id: 'emailInrRow',
                        type: 'email',
                        size: 10,
                        value: 'First item',
                        label: 'Id de l\'ambulance',
                        buttons: [
                            {
                                icon: 'fas fa-running',
                                onclick: 'dosomething'
                            },
                            {
                                title: 'test',
                                onclick: 'dosomething'
                            }
                        ]
                    },
                    {
                        id: 'passwordInRow',
                        type: 'password',
                        //pattern:'(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}',
                        //required:true,
                        value: 'Second item',
                        label: 'Mot de passe'
                    },
                ]
            },
            {
                id: 'mypassword',
                type: 'password',
                pattern: '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}',
                patternInfo: '8 characters, 1 upper, 1 number',
                //required:true,
                value: 'Second item',
                label: 'Mot de passe secure',
                buttons: [
                    {
                        icon: 'fas fa-running',
                        onclick: 'dosomething'
                    },
                    {
                        title: 'Do it',
                        onclick: 'dosomething'
                    }
                ],
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
            },
            {
                id: 'mydate',
                type: 'datetime',
                size: 10,
                value: 'Third item',
                label: 'date',
                buttons: [
                    {
                        icon: 'fas fa-running',
                        onclick: 'dosomething'
                    },
                    {
                        title: 'Do it',
                        onclick: 'dosomething'
                    }
                ],
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
            },
            {
                id: 'radioAnimal',
                type: 'radio',
                label: 'Choix animal',
                value: 'dog',
                opts: [
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
            {
                id: 'checboxTransport',
                type: 'checkbox',
                label: 'Choix transport',
                opts: [
                    {
                        label: 'Voiture',
                        id: 'car',
                        help: 'Il faut bien écrire vous avez affaire avec un président'
                    },
                    {
                        label: 'Bus',
                        id: 'bus',
                        tip: 'ça pique',
                        value: true
                    }
                ]
            },
            {
                id: 'switchTest',
                type: 'switch',
                label: 'Choix animal',
                opts: [
                    {
                        checkedLabel: 'vole',
                        uncheckedLabel: 'tombe',
                        checkedValue: 'fly',
                        uncheckedValue: 'fall',
                        value: 'fly',
                        label: 'Oiseau',
                        id: 'bird',
                        help: 'Il faut bien écrire vous avez affaire avec un président',
                        ctrl: {
                            checked: ["flyDescription"],
                            unchecked: ["fallDescription"]
                        }
                    },
                    {
                        label: 'Serpent',
                        id: 'snake',
                        tip: 'ça pique',
                        checked: true
                    },
                    {
                        label: 'Elephant',
                        id: 'elephant',
                        tip: 'ça pique',
                        value: 'yes'
                    }
                ]
            },
            {
                id: 'switchTestAlone',
                type: 'switch',
                label: 'Choix animal alone',
                opts: [
                    {
                        checkedLabel: 'vole alone',
                        uncheckedLabel: 'tombe alone',
                        checkedValue: 'fly_alone',
                        uncheckedValue: 'fall_alone',
                        value: 'fly_alone',
                        label: 'Oiseau alone',
                        help: 'Il faut bien écrire vous avez affaire avec un président',
                        ctrl: {
                            checked: ["flyDescription"],
                            unchecked: ["fallDescription"]
                        }
                    }
                ]
            },
            {
                type: 'textarea',
                id: "flyDescription",
                rows: 10,
                value: 'Un très beau vol que nous avons la, tout à fait aérodynamique cette chouette!',
                label: 'Description du vol',
                multilang: true,
                required: true,
                icon: 'fas fa-kiwi-bird',
                tip: 'Précisez l\'oiseau svp',
                help: 'Help Please verify your info before',
            },
            {
                type: 'textarea',
                id: "fallDescription",
                rows: 10,
                value: 'Quelle chute c\'est fantastique l\'oiseau a littéralement EXPLOSé wow!',
                label: 'Description de la chute',
                multilang: true,
                required: true,
                icon: 'fas fa-bomb',
                tip: 'Précisez l\'oiseau svp',
                help: 'Help Please verify your info before',
            },
            {
                type: 'hr',
                icon: 'fas fa-plane',
                label: 'Take your plane',
                help: 'Please verify your info before'
            },
            {
                icon: 'fas fa-running',
                type: 'button',
                color: 'danger',
                class: 'btn-block btn-lg',
                title: 'GO !',
                onclick: 'dosomething',
                waitValid: true,
                tip: 'Tip Please verify your info before',
                help: 'Help Please verify your info before',
            },
            {
                id: 'i4',
                type: 'button',
                size: 23,
                title: 'Fourth item',
                icon: 'fas fa-restroom',
                onclick: 'dosomething'
            },
        ]
    },
    form2: {
        attr: {
            lang: 'fr',
            langs: ['fr', 'en'],
            proposeTranslate: true
        },
        desc: [
            {
                id: 'switchTestAlone',
                type: 'switch',
                label: 'Choix animal alone',
                opts: [
                    {
                        checkedLabel: 'vole alone',
                        uncheckedLabel: 'tombe alone',
                        checkedValue: 'fly_alone',
                        uncheckedValue: 'fall_alone',
                        value: 'fly_alone',
                        label: 'Oiseau alone',
                        help: 'Il faut bien écrire vous avez affaire avec un président',
                        ctrl: {
                            checked: ["flyDescription"],
                            unchecked: ["fallDescription"]
                        }
                    }
                ]
            },
            {
                type: 'textarea',
                id: "flyDescription",
                rows: 10,
                value: 'Un très beau vol que nous avons la, tout à fait aérodynamique cette chouette!',
                label: 'Description du vol',
                multilang: true,
                required: true,
                icon: 'fas fa-kiwi-bird',
                tip: 'Précisez l\'oiseau svp',
                help: 'Help Please verify your info before',
            },
            {
                type: 'textarea',
                id: "fallDescription",
                rows: 10,
                value: 'Quelle chute c\'est fantastique l\'oiseau a littéralement EXPLOSé wow!',
                label: 'Description de la chute',
                multilang: true,
                required: true,
                icon: 'fas fa-bomb',
                tip: 'Précisez l\'oiseau svp',
                help: 'Help Please verify your info before',
            }
        ]
    }
}

riot.register('app', App)
riot.mount('app')
