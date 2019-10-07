(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    var formr = {
      'css': `formr .out,[is="formr"] .out{ -webkit-transition: height 1s; -moz-transition: height 1s; -ms-transition: height 1s; -o-transition: height 1s; transition: height 1s; height: 0; } formr .hide,[is="formr"] .hide,formr .form-inline .hide,[is="formr"] .form-inline .hide{ display: none; } formr .form-group,[is="formr"] .form-group{ margin-bottom: 1.5rem; } formr label,[is="formr"] label{ font-size: 1.1rem; font-weight: 500; } formr button:disabled,[is="formr"] button:disabled{ cursor: not-allowed; } formr button:focus,[is="formr"] button:focus,formr input:focus,[is="formr"] input:focus,formr textarea:focus,[is="formr"] textarea:focus{ outline: none !important; border-color: #719ECE !important; box-shadow: 0 0 10px #719ECE !important; } formr .fucfirst:first-letter,[is="formr"] .fucfirst:first-letter{ text-transform: capitalize; } formr .input-group .input-group-append:last-child .btn:not(:last-child):not(.dropdown-toggle),[is="formr"] .input-group .input-group-append:last-child .btn:not(:last-child):not(.dropdown-toggle),formr .input-group .input-group-append:last-child .input-group-text:not(:last-child),[is="formr"] .input-group .input-group-append:last-child .input-group-text:not(:last-child),formr .input-group .input-group-append:not(:last-child) .btn,[is="formr"] .input-group .input-group-append:not(:last-child) .btn,formr .input-group .input-group-append:not(:last-child) .input-group-text,[is="formr"] .input-group .input-group-append:not(:last-child) .input-group-text,formr .input-group .input-group-prepend .btn,[is="formr"] .input-group .input-group-prepend .btn,formr .input-group .input-group-prepend .input-group-text,[is="formr"] .input-group .input-group-prepend .input-group-text{ border-top-right-radius: 0; border-bottom-right-radius: 0; } formr .input-group .input-group-append .btn,[is="formr"] .input-group .input-group-append .btn,formr .input-group .input-group-append .input-group-text,[is="formr"] .input-group .input-group-append .input-group-text,formr .input-group .input-group-prepend:first-child .btn:not(:first-child),[is="formr"] .input-group .input-group-prepend:first-child .btn:not(:first-child),formr .input-group .input-group-prepend:first-child .input-group-text:not(:first-child),[is="formr"] .input-group .input-group-prepend:first-child .input-group-text:not(:first-child),formr .input-group .input-group-prepend:not(:first-child) .btn,[is="formr"] .input-group .input-group-prepend:not(:first-child) .btn,formr .input-group .input-group-prepend:not(:first-child) .input-group-text,[is="formr"] .input-group .input-group-prepend:not(:first-child) .input-group-text{ border-top-left-radius: 0; border-bottom-left-radius: 0; } formr .input-group .input-group-append:last-child .btn:not(:last-child):not(.dropdown-toggle),[is="formr"] .input-group .input-group-append:last-child .btn:not(:last-child):not(.dropdown-toggle),formr .input-group .input-group-append:last-child .input-group-text:not(:last-child),[is="formr"] .input-group .input-group-append:last-child .input-group-text:not(:last-child),formr .input-group .input-group-append:not(:last-child) .btn,[is="formr"] .input-group .input-group-append:not(:last-child) .btn,formr .input-group .input-group-append:not(:last-child) .input-group-text,[is="formr"] .input-group .input-group-append:not(:last-child) .input-group-text,formr .input-group .input-group-prepend .btn,[is="formr"] .input-group .input-group-prepend .btn,formr .input-group .input-group-prepend .input-group-text,[is="formr"] .input-group .input-group-prepend .input-group-text{ border-top-right-radius: 0; border-bottom-right-radius: 0; }`,

      'exports': {
        checkField(field, i) {
            field.id = field.id || 'ffield' + i;
            return field
        },

        onBeforeMount() {
            //console.log(window)
            this.state.desc = window.fields[this.props.id].desc;
            this.state.attr = window.fields[this.props.id].attr;
            this.state.attr.id = this.props.id;
        },

        onMounted() {
            this.ctrlRun(this.props.id);
        },

        callType(type) {
            let types = ['textarea', 'date', 'color', 'datetime', 'datetime-local', 'email', 'month', 'number', 'tel', 'time', 'url', 'week'];
            if (types.indexOf(type) > -1) return 'text'
            else return type
        },

        click() {
            this.fields.push({
                type: 'text',
                size: 10,
                value: 'First item'
            });
            this.update();
        },

        validate(ev) {
            //console.log('validation', ev)
            let targetForm = ev.target.closest("form");
            this.ctrlRun(targetForm.name);
            let invalidFeedback = '<i class="text-danger fas fa-times fa-fw mx-2" aria-hidden="true"></i>';
            let invalidFeedbackMsg = '<i class="text-danger fas fa-exclamation-triangle fa-fw mx-2" aria-hidden="true"></i>';
            let validFeedback = '<i class="text-success fas fa-check fa-fw mx-2" aria-hidden="true"></i>';
            let feedBackElt = ev.target.closest(".form-group").querySelector(".inputFeedback");
            let feedBackMsgElt = ev.target.closest(".form-group").querySelector(".inputFeedbackMsg");
            let field = ev.target;
            let validity = ev.target.validity;
            if (!validity) return
            let isValid = validity.valid;

            let msgs = [];
            let msg = '';
            if (field.disabled || field.type == 'file') return
            if (validity.valueMissing) msgs.push('valueMissing');
            if (validity.typeMismatch && field.type == 'email') msgs.push('invalid email');
            if (validity.typeMismatch && field.type == 'url') msgs.push('invalid URL');
            if (validity.tooShort) msgs.push('Lengthen this text to ' + field.minLength + ' characters or more. You are currently using ' + field.value.length + ' characters');
            if (validity.tooLong) msgs.push('Shorten this text to no more than ' + field.maxLength + ' characters. You are currently using ' + field.value.length + ' characters');
            if (validity.badInput) msgs.push('invalid number');
            if (validity.stepMismatch) msgs.push('invalid step');
            if (validity.rangeOverflow) msgs.push('Select a value that is no more than ' + field.max);
            if (validity.rangeUnderflow) msgs.push('Select a value that is no less than ' + field.min);
            if (validity.patternMismatch && field.getAttribute('patternInfo')) msgs.push(field.getAttribute('patternInfo')); // If pattern info is included, return custom error
            if (validity.patternMismatch && !field.getAttribute('patternInfo')) msgs.push("Didn't the requested format");
            let self = this;
            msgs.forEach(function(m) {
                msg += invalidFeedbackMsg + self.i18n(m) + '. ';
            });
            // If all else fails, msg is a generic catchall error
            if (!isValid && !msg) msg = 'The value you entered for this field is invalid. ';
            feedBackElt.innerHTML = (isValid ? validFeedback : invalidFeedback);
            feedBackMsgElt.innerHTML = isValid ? '' : msg;

            //enable buttons with attributes 'waitValid' if all fields in the form is valid
            let nbInvalidFields = targetForm.querySelectorAll('.form-control:invalid');
            console.log(nbInvalidFields);
            let nwaitValid = targetForm.querySelectorAll('[waitvalid]');
            nwaitValid.forEach(function(e) {
                e.disabled = nbInvalidFields.length;
            });
        },

        ctrlRun(formName) {
            let formElt, selector, node;
            formElt = document.getElementsByName(formName)[0];
            formElt.querySelectorAll("input[ctrlChecked][ctrlUnchecked]").forEach(function(elt) {
                elt.getAttribute("ctrlChecked").split(',').forEach(function(name) {
                    selector = '[name=fgroup_' + name + ']';
                    node = formElt.querySelector(selector);
                    if (elt.checked) node.classList.remove('hide');
                    else node.classList.add('hide');
                });
                elt.getAttribute("ctrlUnchecked").split(',').forEach(function(name) {
                    selector = '[name=fgroup_' + name + ']';
                    node = formElt.querySelector(selector);
                    if (elt.checked) node.classList.add('hide');
                    else node.classList.remove('hide');
                });
            });
        },

        er() {
            console.log(getFormValues('form1'));
        },

        seter() {
            console.log(setFormValues('form1', data));
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<form expr345="expr345" novalidate><button expr346="expr346" type="button">Go</button><button expr347="expr347" type="button">set</button><div expr348="expr348"></div></form>',
          [{
            'redundantAttribute': 'expr345',
            'selector': '[expr345]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.id;
              }
            }, {
              'type': expressionTypes.EVENT,
              'name': 'onchange',

              'evaluate': function(scope) {
                return scope.validate;
              }
            }, {
              'type': expressionTypes.EVENT,
              'name': 'oninput',

              'evaluate': function(scope) {
                return scope.validate;
              }
            }]
          }, {
            'redundantAttribute': 'expr346',
            'selector': '[expr346]',

            'expressions': [{
              'type': expressionTypes.EVENT,
              'name': 'onclick',

              'evaluate': function(scope) {
                return scope.er;
              }
            }]
          }, {
            'redundantAttribute': 'expr347',
            'selector': '[expr347]',

            'expressions': [{
              'type': expressionTypes.EVENT,
              'name': 'onclick',

              'evaluate': function(scope) {
                return scope.seter;
              }
            }]
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,
            'condition': null,

            'template': template(
              '<div expr349="expr349" class="form-group"><div expr350="expr350"></div></div>',
              [{
                'redundantAttribute': 'expr349',
                'selector': '[expr349]',

                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'name',

                  'evaluate': function(scope) {
                    return ['fgroup_', scope.field.id || scope.i].join('');
                  }
                }]
              }, {
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'i'+scope.callType(scope.field.type);
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'field',

                  'evaluate': function(scope) {
                    return scope.checkField(scope.field,scope.i);
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'attr',

                  'evaluate': function(scope) {
                    return scope.state.attr;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'index',

                  'evaluate': function(scope) {
                    return scope.i;
                  }
                }],

                'redundantAttribute': 'expr350',
                'selector': '[expr350]'
              }]
            ),

            'redundantAttribute': 'expr348',
            'selector': '[expr348]',
            'itemName': 'field',
            'indexName': 'i',

            'evaluate': function(scope) {
              return scope.state.desc;
            }
          }]
        );
      },

      'name': 'formr'
    };

    var ialert = {
      'css': `ialert .alert div,[is="ialert"] .alert div{ font-size: 2rem; }`,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<div expr236="expr236" role="alert"><div expr237="expr237"><jicon expr238="expr238"></jicon> <jtooltip expr239="expr239"></jtooltip></div><jhelp expr240="expr240"></jhelp></div>',
          [{
            'redundantAttribute': 'expr236',
            'selector': '[expr236]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return [
                  'alert alert-',
                  scope.props.field.color||'info',
                  ' ',
                  scope.props.field.class
                ].join('');
              }
            }]
          }, {
            'redundantAttribute': 'expr237',
            'selector': '[expr237]',

            'expressions': [{
              'type': expressionTypes.TEXT,
              'childNodeIndex': 1,

              'evaluate': function(scope) {
                return [' ', scope.i18n(scope.props.field.message), '\r\n            '].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jicon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr238',
            'selector': '[expr238]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr239',
            'selector': '[expr239]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr240',
            'selector': '[expr240]'
          }]
        );
      },

      'name': 'ialert'
    };

    var ibutton = {
      'css': null,

      'exports': {
        click(ev) { //not used
            action = ev.target.getAttribute('action');
            param = ev.target.getAttribute('param');
            console.log(action, param, this);
            if (typeof action == "function") action(event, param);
            if (typeof this[action] == "function") this[action](event, param);
        },

        dosomething(ev, param) //test action
        {
            alert('dosomething');
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<button expr241="expr241" type="button" style="text-transform: capitalize;"><jicon expr242="expr242"></jicon> <jtooltip expr243="expr243"></jtooltip></button><jhelp expr244="expr244"></jhelp>',
          [{
            'redundantAttribute': 'expr241',
            'selector': '[expr241]',

            'expressions': [{
              'type': expressionTypes.TEXT,
              'childNodeIndex': 1,

              'evaluate': function(scope) {
                return [' ', scope.i18n(scope.props.field.title), '\r\n        '].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': null,

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return [
                  'btn btn-',
                  scope.props.field.color?scope.props.field.color:'outline-primary',
                  ' ',
                  scope.props.field.class
                ].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }, {
              'type': expressionTypes.EVENT,
              'name': 'onclick',

              'evaluate': function(scope) {
                return scope[scope.props.field.onclick];
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'id',

              'evaluate': function(scope) {
                return [].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'disabled',

              'evaluate': function(scope) {
                return scope.props.field.waitValid || scope.props.field.disabled;
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jicon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr242',
            'selector': '[expr242]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr243',
            'selector': '[expr243]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr244',
            'selector': '[expr244]'
          }]
        );
      },

      'name': 'ibutton'
    };

    var icheckbox = {
      'css': `icheckbox .fswitch,[is="icheckbox"] .fswitch{ display: block; position: relative; padding-left: 3.2rem; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } icheckbox .fswitch input,[is="icheckbox"] .fswitch input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } icheckbox .fswitchslider,[is="icheckbox"] .fswitchslider{ position: absolute; top: 3px; left: 0; height: 1.5rem; width: 2.75rem; background-color: #eee; -webkit-transition: .4s; transition: .4s; } icheckbox .fswitch:hover input~.fswitchslider,[is="icheckbox"] .fswitch:hover input~.fswitchslider{ background-color: #ccc; } icheckbox .fswitch input:checked~.fswitchslider,[is="icheckbox"] .fswitch input:checked~.fswitchslider{ background-color: #2196F3; } icheckbox .fswitchslider:before,[is="icheckbox"] .fswitchslider:before{ position: absolute; content: ""; height: 1.35rem; width: 1.35rem; left: 0.1rem; bottom: 0.1rem; background-color: white; -webkit-transition: .4s; transition: .4s; } icheckbox .fswitch input:checked~.fswitchslider,[is="icheckbox"] .fswitch input:checked~.fswitchslider{ background-color: blue; } icheckbox .fswitch input:checked~.fswitchslider:before,[is="icheckbox"] .fswitch input:checked~.fswitchslider:before{ background-image: radial-gradient(#ffffff, rgb(210, 210, 210)); } icheckbox .fswitch input:focus~.fswitchslider,[is="icheckbox"] .fswitch input:focus~.fswitchslider{ --box-shadow: 0 0 1px var(--navBarBg-backgroundColor); box-shadow: 0 0 4px blue; } icheckbox .fswitch input:checked~.fswitchslider:before,[is="icheckbox"] .fswitch input:checked~.fswitchslider:before{ -webkit-transform: translateX(1.25rem); -ms-transform: translateX(1.25rem); transform: translateX(1.25rem); } icheckbox .fswitch input[disabled]~.fswitchslider,[is="icheckbox"] .fswitch input[disabled]~.fswitchslider{ opacity: 0.5; cursor: not-allowed; } icheckbox .fswitchround,[is="icheckbox"] .fswitchround{ border-radius: 3.4rem; } icheckbox .fswitchround:before,[is="icheckbox"] .fswitchround:before{ border-radius: 50%; } icheckbox .fcheck,[is="icheckbox"] .fcheck{ display: block; position: relative; padding-left: 35px; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } icheckbox .fcheck input,[is="icheckbox"] .fcheck input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } icheckbox .fcheckmark,[is="icheckbox"] .fcheckmark{ position: absolute; top: 0; left: 0; height: 25px; width: 25px; background-color: #eee; -webkit-transition: .4s; transition: .4s; } icheckbox .fcheck:hover input~.fcheckmark,[is="icheckbox"] .fcheck:hover input~.fcheckmark{ background-color: #ccc; } icheckbox .fcheck input:checked~.fcheckmark,[is="icheckbox"] .fcheck input:checked~.fcheckmark{ background-color: #2196F3; } icheckbox .fcheckmark:after,[is="icheckbox"] .fcheckmark:after{ content: ""; position: absolute; display: none; } icheckbox .fcheck input:checked~.fcheckmark:after,[is="icheckbox"] .fcheck input:checked~.fcheckmark:after{ display: block; } icheckbox .fcheck .fcheckmark:after,[is="icheckbox"] .fcheck .fcheckmark:after{ left: 9px; top: 5px; width: 6px; height: 12px; border: solid white; border-width: 0 3px 3px 0; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg); }`,

      'exports': {
        isChecked(option) {
            return (option.checked || option.value == option.checkedValue || option.value == true)
        },

        ctrlToString(option, which) {
            if (option.ctrl && option.ctrl[which]) return option.ctrl[which].join()
            else return false
        },

        buildId(option) {
            if (option.id) return this.props.field.id + '.' + option.id
            else return this.props.field.id
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr262="expr262"></jlabel><jtooltip expr263="expr263"></jtooltip><jhelp expr264="expr264"></jhelp><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="aaad-inline"><template expr265="expr265"></template></div>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr262',
            'selector': '[expr262]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr263',
            'selector': '[expr263]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr264',
            'selector': '[expr264]'
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,
            'condition': null,

            'template': template(
              '<div class="row"><div expr266="expr266" class="fucfirst col-auto mb-2"></div><div class="col-auto"><label expr267="expr267"><span expr268="expr268" class="mr-1"></span><jtooltip expr269="expr269"></jtooltip><jhelp expr270="expr270"></jhelp><input expr271="expr271" class="form-control"/><span expr272="expr272"></span></label></div><div expr273="expr273" class="fucfirst col-auto mb-2"></div><div class="fucfirst col-auto mb-2"><jtooltip expr274="expr274"></jtooltip><jhelp expr275="expr275"></jhelp></div></div>',
              [{
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.option.uncheckedLabel;
                },

                'redundantAttribute': 'expr266',
                'selector': '[expr266]',

                'template': template(' ', [{
                  'expressions': [{
                    'type': expressionTypes.TEXT,
                    'childNodeIndex': 0,

                    'evaluate': function(scope) {
                      return scope.i18n(scope.option.uncheckedLabel);
                    }
                  }]
                }])
              }, {
                'redundantAttribute': 'expr267',
                'selector': '[expr267]',

                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return ['ucfirst ', scope.props.field.type=='switch' ?'fswitch':'fcheck'].join('');
                  }
                }]
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return !scope.option.checkedLabel;
                },

                'redundantAttribute': 'expr268',
                'selector': '[expr268]',

                'template': template(' ', [{
                  'expressions': [{
                    'type': expressionTypes.TEXT,
                    'childNodeIndex': 0,

                    'evaluate': function(scope) {
                      return [' ', scope.i18n(scope.option.label)].join('');
                    }
                  }]
                }])
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return !scope.option.checkedLabel;
                },

                'redundantAttribute': 'expr269',
                'selector': '[expr269]',

                'template': template(null, [{
                  'type': bindingTypes.TAG,
                  'getComponent': getComponent,

                  'evaluate': function(scope) {
                    return 'jtooltip';
                  },

                  'slots': [],

                  'attributes': [{
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'tip',

                    'evaluate': function(scope) {
                      return scope.option.tip;
                    }
                  }]
                }])
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return !scope.option.checkedLabel;
                },

                'redundantAttribute': 'expr270',
                'selector': '[expr270]',

                'template': template(null, [{
                  'type': bindingTypes.TAG,
                  'getComponent': getComponent,

                  'evaluate': function(scope) {
                    return 'jhelp';
                  },

                  'slots': [],

                  'attributes': [{
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'help',

                    'evaluate': function(scope) {
                      return scope.option.help;
                    }
                  }]
                }])
              }, {
                'redundantAttribute': 'expr271',
                'selector': '[expr271]',

                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': null,

                  'evaluate': function(scope) {
                    return scope.props.field;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'type',

                  'evaluate': function(scope) {
                    return "checkbox";
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'checkedValue',

                  'evaluate': function(scope) {
                    return scope.option.checkedValue;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'unCheckedValue',

                  'evaluate': function(scope) {
                    return scope.option.uncheckedValue;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'checked',

                  'evaluate': function(scope) {
                    return scope.isChecked(scope.option);
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'ctrlChecked',

                  'evaluate': function(scope) {
                    return scope.ctrlToString(scope.option,'checked');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'ctrlUnchecked',

                  'evaluate': function(scope) {
                    return scope.ctrlToString(scope.option,'unchecked');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'name',

                  'evaluate': function(scope) {
                    return scope.buildId(scope.option);
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'id',

                  'evaluate': function(scope) {
                    return [].join('');
                  }
                }]
              }, {
                'redundantAttribute': 'expr272',
                'selector': '[expr272]',

                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return scope.props.field.type=='switch' ?'fswitchslider fswitchround':'fcheckmark';
                  }
                }]
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.option.checkedLabel;
                },

                'redundantAttribute': 'expr273',
                'selector': '[expr273]',

                'template': template(' ', [{
                  'expressions': [{
                    'type': expressionTypes.TEXT,
                    'childNodeIndex': 0,

                    'evaluate': function(scope) {
                      return [
                        '\r\n                    ',
                        scope.i18n(scope.option.checkedLabel),
                        '\r\n                '
                      ].join('');
                    }
                  }]
                }])
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.option.checkedLabel;
                },

                'redundantAttribute': 'expr274',
                'selector': '[expr274]',

                'template': template(null, [{
                  'type': bindingTypes.TAG,
                  'getComponent': getComponent,

                  'evaluate': function(scope) {
                    return 'jtooltip';
                  },

                  'slots': [],

                  'attributes': [{
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'tip',

                    'evaluate': function(scope) {
                      return scope.option.tip;
                    }
                  }]
                }])
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.option.checkedLabel;
                },

                'redundantAttribute': 'expr275',
                'selector': '[expr275]',

                'template': template(null, [{
                  'type': bindingTypes.TAG,
                  'getComponent': getComponent,

                  'evaluate': function(scope) {
                    return 'jhelp';
                  },

                  'slots': [],

                  'attributes': [{
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'help',

                    'evaluate': function(scope) {
                      return scope.option.help;
                    }
                  }]
                }])
              }]
            ),

            'redundantAttribute': 'expr265',
            'selector': '[expr265]',
            'itemName': 'option',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.props.field.opts;
            }
          }]
        );
      },

      'name': 'icheckbox'
    };

    var icolorpicker = {
      'css': `icolorpicker .pickr .pcr-button,[is="icolorpicker"] .pickr .pcr-button{ height: 4em; width: 4em; border: 1px solid grey; }`,

      'exports': {
        onMounted() {
            let formId = this.props.attr.id;
            //https://github.com/Simonwep/pickr
            const pickr = Pickr.create({
                el: '[name="' + formId + '_colorpicker_' + this.props.field.id + '"]',
                theme: 'nano', // or 'monolith', or 'nano'
                //default:'rgba(239, 1, 5, 1)',
                // default:'#16D92A',

                comparison: false,

                swatches: [
                    'rgba(244, 67, 54, 1)',
                    'rgba(233, 30, 99, 0.95)',
                    'rgba(156, 39, 176, 0.9)',
                    'rgba(103, 58, 183, 0.85)',
                    'rgba(63, 81, 181, 0.8)',
                    'rgba(33, 150, 243, 0.75)',
                    'rgba(3, 169, 244, 0.7)',
                    'rgba(0, 188, 212, 0.7)',
                    'rgba(0, 150, 136, 0.75)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(139, 195, 74, 0.85)',
                    'rgba(205, 220, 57, 0.9)',
                    'rgba(255, 235, 59, 0.95)',
                    'rgba(255, 193, 7, 1)'
                ],

                components: {

                    // Main components
                    preview: true,
                    opacity: true,
                    hue: true,

                    // Input / output Options
                    interaction: {
                        hex: true,
                        rgba: true,
                        hsla: false,
                        hsva: false,
                        cmyk: false,
                        input: true,
                        clear: false,
                        save: true,
                        cancel: true
                    }
                },
                strings: {
                    save: 'Select', // Default for save button
                    clear: 'Clear', // Default for clear button
                    cancel: 'Cancel' // Default for cancel button
                }
            });

            pickr.on('init', instance => {
                //console.log(instance)
                let setColor = instance._root.root.closest(".form-group").querySelector("[type='hidden']").value;
                pickr.setColor(setColor, true);
            });

            pickr.on('save', (color, instance) => {
                let rgba = color.toRGBA().toString();
                instance._root.root.closest(".form-group").querySelector("[type='hidden']").value = rgba;
            }).on('cancel', () => {
                pickr.hide();
            });

            document.addEventListener(this.props.attr.id + '_setColor_' + this.props.field.id, function(ev) {
                pickr.setColor(ev.detail.color, true);
            });
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr245="expr245"></jlabel><jtooltip expr246="expr246"></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><jhelp expr247="expr247"></jhelp><div expr248="expr248"></div><input expr249="expr249" type="hidden" class="form-control" colorpicker="true"/>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr245',
            'selector': '[expr245]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr246',
            'selector': '[expr246]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr247',
            'selector': '[expr247]'
          }, {
            'redundantAttribute': 'expr248',
            'selector': '[expr248]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.attr.id +"_colorpicker_" + scope.props.field.id;
              }
            }]
          }, {
            'redundantAttribute': 'expr249',
            'selector': '[expr249]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }, {
              'type': expressionTypes.VALUE,

              'evaluate': function(scope) {
                return scope.props.field.value;
              }
            }]
          }]
        );
      },

      'name': 'icolorpicker'
    };

    var idatetimepicker = {
      'css': null,

      'exports': {
        onMounted() {
            let formId = this.props.attr.id;
            const elt = document.getElementsByName(formId)[0].querySelector('[name="' + this.props.field.id + '"]');
            const datetimepicker=flatpickr(elt,{
                allowInput:true,
                enableTime: this.props.field.enableTime,
                dateFormat: "U",
                altInput : true,
                altFormat: "l j F Y  H:i",
                defaultDate : this.props.field.value,
                locale : this.props.attr.lang
            });
            document.addEventListener(this.props.attr.id + '_setDatetime_' + this.props.field.id, function(ev) {
                datetimepicker.setDate(ev.detail.epoch);
            });
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr250="expr250"></jlabel><jtooltip expr251="expr251"></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><jaddon expr252="expr252" placement="left"></jaddon><input expr253="expr253" type="text" datetimepicker="true"/><jaddon expr254="expr254" placement="right"></jaddon></div><jhelp expr255="expr255"></jhelp>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr250',
            'selector': '[expr250]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr251',
            'selector': '[expr251]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jaddon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'placement',

              'evaluate': function() {
                return 'left';
              }
            }],

            'redundantAttribute': 'expr252',
            'selector': '[expr252]'
          }, {
            'redundantAttribute': 'expr253',
            'selector': '[expr253]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': null,

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return ['form-control ', scope.props.field.class].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }, {
              'type': expressionTypes.VALUE,

              'evaluate': function(scope) {
                return scope.props.field.value;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'id',

              'evaluate': function(scope) {
                return [].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jaddon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'placement',

              'evaluate': function() {
                return 'right';
              }
            }],

            'redundantAttribute': 'expr254',
            'selector': '[expr254]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr255',
            'selector': '[expr255]'
          }]
        );
      },

      'name': 'idatetimepicker'
    };

    var iimagepicker = {
      'css': null,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr256="expr256"></jlabel><jtooltip expr257="expr257"></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small>\r\n    IIMAGEPICKER TODO\r\n    <div class="input-group"><jaddon expr258="expr258" placement="left"></jaddon><input expr259="expr259" type="text" autocomplete="on"/><jaddon expr260="expr260" placement="right"></jaddon></div><jhelp expr261="expr261"></jhelp>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr256',
            'selector': '[expr256]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr257',
            'selector': '[expr257]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jaddon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'placement',

              'evaluate': function() {
                return 'left';
              }
            }],

            'redundantAttribute': 'expr258',
            'selector': '[expr258]'
          }, {
            'redundantAttribute': 'expr259',
            'selector': '[expr259]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': null,

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return ['form-control ', scope.props.field.class].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }, {
              'type': expressionTypes.VALUE,

              'evaluate': function(scope) {
                return scope.props.field.value;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'id',

              'evaluate': function(scope) {
                return [].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jaddon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'placement',

              'evaluate': function() {
                return 'right';
              }
            }],

            'redundantAttribute': 'expr260',
            'selector': '[expr260]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr261',
            'selector': '[expr261]'
          }]
        );
      },

      'name': 'iimagepicker'
    };

    var ihidden = {
      'css': null,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template('<input expr289="expr289" type="hidden"/>', [{
          'redundantAttribute': 'expr289',
          'selector': '[expr289]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': null,

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return ['form-control ', scope.props.field.class].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }, {
            'type': expressionTypes.VALUE,

            'evaluate': function(scope) {
              return scope.props.field.value;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'id',

            'evaluate': function(scope) {
              return [].join('');
            }
          }]
        }]);
      },

      'name': 'ihidden'
    };

    var ihr = {
      'css': `ihr .fhrlabel,[is="ihr"] .fhrlabel{ font-size: 1.3rem; } ihr hr,[is="ihr"] hr{ margin: 0; }`,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<div expr284="expr284"><jicon expr285="expr285"></jicon><span expr286="expr286"> </span><jtooltip expr287="expr287"></jtooltip><hr/><jhelp expr288="expr288"></jhelp></div>',
          [{
            'redundantAttribute': 'expr284',
            'selector': '[expr284]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jicon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr285',
            'selector': '[expr285]'
          }, {
            'redundantAttribute': 'expr286',
            'selector': '[expr286]',

            'expressions': [{
              'type': expressionTypes.TEXT,
              'childNodeIndex': 0,

              'evaluate': function(scope) {
                return [' ', scope.i18n(scope.props.field.label)].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return ['fhrlabel ', scope.props.field.class].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr287',
            'selector': '[expr287]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr288',
            'selector': '[expr288]'
          }]
        );
      },

      'name': 'ihr'
    };

    var ipassword = {
      'css': null,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr305="expr305"></jlabel><jtooltip expr306="expr306"></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><jaddon expr307="expr307" placement="left"></jaddon><input expr308="expr308" type="password" autocomplete="on"/><jaddon expr309="expr309" placement="right"></jaddon></div><jhelp expr310="expr310"></jhelp>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr305',
            'selector': '[expr305]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr306',
            'selector': '[expr306]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jaddon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'placement',

              'evaluate': function() {
                return 'left';
              }
            }],

            'redundantAttribute': 'expr307',
            'selector': '[expr307]'
          }, {
            'redundantAttribute': 'expr308',
            'selector': '[expr308]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': null,

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return ['form-control ', scope.props.field.class].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }, {
              'type': expressionTypes.VALUE,

              'evaluate': function(scope) {
                return scope.props.field.value;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'id',

              'evaluate': function(scope) {
                return [].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jaddon';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'placement',

              'evaluate': function() {
                return 'right';
              }
            }],

            'redundantAttribute': 'expr309',
            'selector': '[expr309]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr310',
            'selector': '[expr310]'
          }]
        );
      },

      'name': 'ipassword'
    };

    var iradio = {
      'css': `iradio .fradio,[is="iradio"] .fradio{ display: block; position: relative; padding-left: 35px; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } iradio .fradio input,[is="iradio"] .fradio input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } iradio .fradiomark,[is="iradio"] .fradiomark{ position: absolute; top: 0; left: 0; height: 25px; width: 25px; background-color: #eee; border-radius: 50%; -webkit-transition: .4s; transition: .4s; } iradio .fradio:hover input~.fradiomark,[is="iradio"] .fradio:hover input~.fradiomark{ background-color: #ccc; } iradio .fradio input:checked~.fradiomark,[is="iradio"] .fradio input:checked~.fradiomark{ background-color: #2196F3; } iradio .fradiomark:after,[is="iradio"] .fradiomark:after{ content: ""; position: absolute; display: none; } iradio .fradio input:checked~.fradiomark:after,[is="iradio"] .fradio input:checked~.fradiomark:after{ display: block; } iradio .fradio .fradiomark:after,[is="iradio"] .fradio .fradiomark:after{ top: 8px; left: 8px; width: 9px; height: 9px; border-radius: 50%; background: white; }`,

      'exports': {
        isChecked(option) {
            return (option.checked || option.id == this.props.field.value)
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr276="expr276"></jlabel><jtooltip expr277="expr277"></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><jhelp expr278="expr278"></jhelp><div class="aaad-inline"><template expr279="expr279"></template></div>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr276',
            'selector': '[expr276]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr277',
            'selector': '[expr277]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr278',
            'selector': '[expr278]'
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,
            'condition': null,

            'template': template(
              '<label expr280="expr280" class="fradio"> <jtooltip expr281="expr281"></jtooltip><jhelp expr282="expr282"></jhelp><input expr283="expr283" type="radio" class="form-control"/><span class="fradiomark"></span></label>',
              [{
                'redundantAttribute': 'expr280',
                'selector': '[expr280]',

                'expressions': [{
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(scope) {
                    return [scope.i18n(scope.option.label), '\r\n                '].join('');
                  }
                }]
              }, {
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jtooltip';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'tip',

                  'evaluate': function(scope) {
                    return scope.option.tip;
                  }
                }],

                'redundantAttribute': 'expr281',
                'selector': '[expr281]'
              }, {
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jhelp';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'help',

                  'evaluate': function(scope) {
                    return scope.option.help;
                  }
                }],

                'redundantAttribute': 'expr282',
                'selector': '[expr282]'
              }, {
                'redundantAttribute': 'expr283',
                'selector': '[expr283]',

                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': null,

                  'evaluate': function(scope) {
                    return scope.props.field;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'checked',

                  'evaluate': function(scope) {
                    return scope.isChecked(scope.option);
                  }
                }, {
                  'type': expressionTypes.VALUE,

                  'evaluate': function(scope) {
                    return scope.option.id;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'name',

                  'evaluate': function(scope) {
                    return scope.props.field.id;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'id',

                  'evaluate': function(scope) {
                    return [].join('');
                  }
                }]
              }]
            ),

            'redundantAttribute': 'expr279',
            'selector': '[expr279]',
            'itemName': 'option',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.props.field.opts;
            }
          }]
        );
      },

      'name': 'iradio'
    };

    var irange = {
      'css': `irange input[type=range]::-webkit-slider-thumb,[is="irange"] input[type=range]::-webkit-slider-thumb{ background: red; } irange input[type=range]::-moz-range-thumb,[is="irange"] input[type=range]::-moz-range-thumb{ background: red; } irange input[type=range]::-ms-thumb,[is="irange"] input[type=range]::-ms-thumb{ background: red; }`,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr290="expr290"></jlabel><jtooltip expr291="expr291"></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><input expr292="expr292" type="range"/></div><jhelp expr293="expr293"></jhelp>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr290',
            'selector': '[expr290]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr291',
            'selector': '[expr291]'
          }, {
            'redundantAttribute': 'expr292',
            'selector': '[expr292]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': null,

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return ['form-control custom-range ', scope.props.field.class].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'min',

              'evaluate': function(scope) {
                return scope.props.field.min;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'max',

              'evaluate': function(scope) {
                return scope.props.field.max;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'step',

              'evaluate': function(scope) {
                return scope.props.field.step;
              }
            }, {
              'type': expressionTypes.VALUE,

              'evaluate': function(scope) {
                return scope.props.field.value;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'id',

              'evaluate': function(scope) {
                return [].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr293',
            'selector': '[expr293]'
          }]
        );
      },

      'name': 'irange'
    };

    var irow = {
      'css': null,

      'exports': {
        checkField(field,i){
        field.id = field.id || 'ffield'+i;
        return field
    }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template('<div class="row"><template expr302="expr302"></template></div>', [{
          'type': bindingTypes.EACH,
          'getKey': null,
          'condition': null,

          'template': template('<div expr303="expr303"><div expr304="expr304"></div></div>', [{
            'redundantAttribute': 'expr303',
            'selector': '[expr303]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return ['col form-group ', scope.field.class].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return ['fgroup_', scope.field.id || scope.i].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'i'+scope.callType(scope.field.type);
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.checkField(scope.field,scope.i);
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'attr',

              'evaluate': function(scope) {
                return scope.props.attr;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'index',

              'evaluate': function(scope) {
                return scope.i;
              }
            }],

            'redundantAttribute': 'expr304',
            'selector': '[expr304]'
          }]),

          'redundantAttribute': 'expr302',
          'selector': '[expr302]',
          'itemName': 'field',
          'indexName': 'i',

          'evaluate': function(scope) {
            return scope.props.field.desc;
          }
        }]);
      },

      'name': 'irow'
    };

    var iselect = {
      'css': `iselect .choices__list--multiple .choices__item,[is="iselect"] .choices__list--multiple .choices__item{ border-radius: 20px; background-color: grey; border: 1px solid grey; color: #fff; } iselect .choices__button,[is="iselect"] .choices__button{ border-left: 0px !important; } iselect .choices,[is="iselect"] .choices{ width: 100%; }`,

      'exports': {
        onMounted() {
            if (this.props.field.multiple && this.props.field.tag) {
                // https://github.com/Mobius1/Selectr
                let elt = document.getElementsByName(this.props.attr.id)[0].querySelector('[name="' + this.props.field.id + '"]');
                const selectr = new Selectr(elt, {
                    taggable: this.props.field.userAddOption
                });
                document.addEventListener(this.props.attr.id + '_setSelectr_' + this.props.field.id, function(ev) {
                    //console.log(selectr.getValue(false)) 
                    selectr.clear();
                    selectr.setValue(ev.detail.values);                      
                });
            }
        },

        isSelected(option) {
            //console.log(option)
            return (option.selected || option.value == this.props.field.value || (Array.isArray(this.props.field.value) && this.props.field.value.indexOf(option.value) > -1))
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr294="expr294"></jlabel><jtooltip expr295="expr295"></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><jaddon expr296="expr296" placement="left"></jaddon><select expr297="expr297" selectr="true"><template expr298="expr298"></template></select><jaddon expr300="expr300" placement="right"></jaddon></div><jhelp expr301="expr301"></jhelp>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr294',
            'selector': '[expr294]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr295',
            'selector': '[expr295]'
          }, {
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return !scope.props.field.tag;
            },

            'redundantAttribute': 'expr296',
            'selector': '[expr296]',

            'template': template(null, [{
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'jaddon';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'field',

                'evaluate': function(scope) {
                  return scope.props.field;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'placement',

                'evaluate': function() {
                  return 'left';
                }
              }]
            }])
          }, {
            'redundantAttribute': 'expr297',
            'selector': '[expr297]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': null,

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'multiple',

              'evaluate': function(scope) {
                return scope.props.field.multiple;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'class',

              'evaluate': function(scope) {
                return ['form-control ', scope.props.field.class].join('');
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'id',

              'evaluate': function(scope) {
                return [].join('');
              }
            }]
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,
            'condition': null,

            'template': template('<option expr299="expr299"> </option>', [{
              'redundantAttribute': 'expr299',
              'selector': '[expr299]',

              'expressions': [{
                'type': expressionTypes.TEXT,
                'childNodeIndex': 0,

                'evaluate': function(scope) {
                  return [
                    '\r\n                    ',
                    scope.i18n(scope.option.label),
                    '\r\n                '
                  ].join('');
                }
              }, {
                'type': expressionTypes.VALUE,

                'evaluate': function(scope) {
                  return scope.option.value;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'selected',

                'evaluate': function(scope) {
                  return scope.isSelected(scope.option);
                }
              }]
            }]),

            'redundantAttribute': 'expr298',
            'selector': '[expr298]',
            'itemName': 'option',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.props.field.opts;
            }
          }, {
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return !scope.props.field.tag;
            },

            'redundantAttribute': 'expr300',
            'selector': '[expr300]',

            'template': template(null, [{
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'jaddon';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'field',

                'evaluate': function(scope) {
                  return scope.props.field;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'placement',

                'evaluate': function() {
                  return 'right';
                }
              }]
            }])
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr301',
            'selector': '[expr301]'
          }]
        );
      },

      'name': 'iselect'
    };

    var itext = {
      'css': null,

      'exports': {
        onBeforeMount() {
            this.state.currentLang = this.props.attr.langs[0];
            this.state.defaultLang = this.props.attr.langs[0];
            if (this.props.field.multilang) {
                this.state.langs = this.props.attr.langs;
            } else {
                this.state.langs = [''];
            }
            if (this.props.type == 'datetime') this.state.type = 'datetime-local';
            else this.state.type = this.props.field.type;
        },

        btnLangColor(lang) {
            return lang == this.state.currentLang ? 'btn-secondary' : 'btn-light'
        },

        buildId(lang) {
            return this.props.field.multilang ? this.props.field.id + '.' + lang : this.props.field.id
        },

        defaultValue() {
            if (this.state.currentLang == this.props.attr.langs[0]) return this.props.field.value
            else return null
        },

        selectLang(ev) {
            this.state.currentLang = ev.target.attributes.idLang.value;
            this.update();
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr311="expr311"></jlabel><jtooltip expr312="expr312"></jtooltip><template expr313="expr313"></template><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div expr315="expr315"></div><jhelp expr322="expr322"></jhelp>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr311',
            'selector': '[expr311]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr312',
            'selector': '[expr312]'
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,

            'condition': function(scope) {
              return scope.props.field.multilang;
            },

            'template': template(
              '<button expr314="expr314" type="button" style="text-transform: capitalize;"> <span class="aaainputFeedback"></span></button>',
              [{
                'redundantAttribute': 'expr314',
                'selector': '[expr314]',

                'expressions': [{
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(scope) {
                    return [scope.langName(scope.lang), ' '].join('');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return ['btn ', scope.btnLangColor(scope.lang), ' btn-sm ml-1'].join('');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'idLang',

                  'evaluate': function(scope) {
                    return scope.lang;
                  }
                }, {
                  'type': expressionTypes.EVENT,
                  'name': 'onclick',

                  'evaluate': function(scope) {
                    return scope.selectLang;
                  }
                }]
              }]
            ),

            'redundantAttribute': 'expr313',
            'selector': '[expr313]',
            'itemName': 'lang',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.props.attr.langs;
            }
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,
            'condition': null,

            'template': template(
              '<jaddon expr316="expr316" placement="left"></jaddon><input expr317="expr317" autocomplete="on"/><textarea expr318="expr318"></textarea><div expr319="expr319" class="h-100 input-group-append"></div><jaddon expr321="expr321" placement="right"></jaddon>',
              [{
                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return [
                      'input-group ',
                      scope.lang==scope.state.currentLang || !scope.lang?'':'hide'
                    ].join('');
                  }
                }]
              }, {
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jaddon';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'field',

                  'evaluate': function(scope) {
                    return scope.props.field;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'placement',

                  'evaluate': function() {
                    return 'left';
                  }
                }],

                'redundantAttribute': 'expr316',
                'selector': '[expr316]'
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.props.field.type!='textarea';
                },

                'redundantAttribute': 'expr317',
                'selector': '[expr317]',

                'template': template(null, [{
                  'expressions': [{
                    'type': expressionTypes.ATTRIBUTE,
                    'name': null,

                    'evaluate': function(scope) {
                      return scope.props.field;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'aaatabindex',

                    'evaluate': function(scope) {
                      return scope.props.index;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'type',

                    'evaluate': function(scope) {
                      return scope.state.type;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'class',

                    'evaluate': function(scope) {
                      return ['form-control ', scope.props.field.class].join('');
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'defaultLang',

                    'evaluate': function(scope) {
                      return scope.state.defaultLang;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'lang',

                    'evaluate': function(scope) {
                      return scope.lang;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'baseId',

                    'evaluate': function(scope) {
                      return scope.props.field.id;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'name',

                    'evaluate': function(scope) {
                      return scope.buildId(scope.lang);
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'value',

                    'evaluate': function(scope) {
                      return scope.props.field.value;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'id',

                    'evaluate': function(scope) {
                      return [].join('');
                    }
                  }]
                }])
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.props.field.type=='textarea';
                },

                'redundantAttribute': 'expr318',
                'selector': '[expr318]',

                'template': template(' ', [{
                  'expressions': [{
                    'type': expressionTypes.TEXT,
                    'childNodeIndex': 0,

                    'evaluate': function(scope) {
                      return scope.props.field.value;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': null,

                    'evaluate': function(scope) {
                      return scope.props.field;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'aaatabindex',

                    'evaluate': function(scope) {
                      return scope.props.index;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'class',

                    'evaluate': function(scope) {
                      return ['form-control ', scope.props.field.class].join('');
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'rows',

                    'evaluate': function(scope) {
                      return scope.props.field.rows || 8;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'defaultLang',

                    'evaluate': function(scope) {
                      return scope.state.defaultLang;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'lang',

                    'evaluate': function(scope) {
                      return scope.lang;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'baseId',

                    'evaluate': function(scope) {
                      return scope.props.field.id;
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'name',

                    'evaluate': function(scope) {
                      return scope.buildId(scope.lang);
                    }
                  }, {
                    'type': expressionTypes.ATTRIBUTE,
                    'name': 'id',

                    'evaluate': function(scope) {
                      return [].join('');
                    }
                  }]
                }])
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.props.field.multilang && scope.props.attr.proposeTranslate && scope.state.defaultLang !=scope.lang;
                },

                'redundantAttribute': 'expr319',
                'selector': '[expr319]',

                'template': template(
                  '<button expr320="expr320" type="button" class="btn btn-info"><i class="fas fa-language"></i></button>',
                  [{
                    'redundantAttribute': 'expr320',
                    'selector': '[expr320]',

                    'expressions': [{
                      'type': expressionTypes.EVENT,
                      'name': 'onclick',

                      'evaluate': function(scope) {
                        return scope.translate;
                      }
                    }]
                  }]
                )
              }, {
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jaddon';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'field',

                  'evaluate': function(scope) {
                    return scope.props.field;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'placement',

                  'evaluate': function() {
                    return 'right';
                  }
                }],

                'redundantAttribute': 'expr321',
                'selector': '[expr321]'
              }]
            ),

            'redundantAttribute': 'expr315',
            'selector': '[expr315]',
            'itemName': 'lang',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.state.langs;
            }
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr322',
            'selector': '[expr322]'
          }]
        );
      },

      'name': 'itext'
    };

    var itexteditor = {
      'css': null,

      'exports': {
        onBeforeMount() {
            this.state.currentLang = this.props.attr.langs[0];
            this.state.defaultLang = this.props.attr.langs[0];
            if (this.props.field.multilang) {
                this.state.langs = this.props.attr.langs;
            } else {
                this.state.langs = [''];
            }
        },

        onMounted() {
            //https://quilljs.com/
            //see https://codepen.io/viT-1/pen/GQVaoB for html fill
            const self = this;
            let formId = this.props.attr.id;
            this.state.langs.forEach(function(lang) {
                let container = document.getElementsByName(formId)[0].querySelector('[name="' + self.buildId(lang, '_') + '"]');
                let input = document.getElementsByName(formId)[0].querySelector('[name="' + self.buildId(lang) + '"]');
                var editor = new Quill(container, {
                    modules: {
                        toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                            //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
                            ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
                            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                            [{ 'align': [] }],                                
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['video', 'image'],
                            ['blockquote', 'code-block'],
                            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                            [{ 'direction': 'rtl' }],                       // text direction
                            [{ 'font': [] }],
                            ['clean'],
                            ['translate']
                        ]
                    },
                    theme: 'snow'
                });
                editor.root.innerHTML=self.props.field.value;
                //editor.clipboard.dangerouslyPasteHTML(self.props.field.value)
                
                editor.on('text-change', function() {
                    var delta = editor.getContents();
                    var text = editor.getText();
                    var html = editor.root.innerHTML;
                    input.value=editor.root.innerHTML;
                });
                document.addEventListener(formId + '_setTexteditor_' + self.buildId(lang), function(ev) {
                    //editor.clipboard.dangerouslyPasteHTML(ev.detail.content)
                    editor.root.innerHTML=ev.detail.content;
                });
            });
        },

        btnLangColor(lang) {
            return lang == this.state.currentLang ? 'btn-secondary' : 'btn-light'
        },

        buildId(lang, separator) {
            return this.props.field.multilang ? this.props.field.id + (separator || '.') + lang : this.props.field.id
        },

        defaultValue() {
            if (this.state.currentLang == this.props.attr.langs[0]) return this.props.field.value
            else return null
        },

        selectLang(ev) {
            this.state.currentLang = ev.target.attributes.idLang.value;
            this.update();
        }
      },

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<jlabel expr331="expr331"></jlabel><jtooltip expr332="expr332"></jtooltip><template expr333="expr333"></template><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div expr335="expr335"></div><jhelp expr340="expr340"></jhelp>',
          [{
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jlabel';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.props.field;
              }
            }],

            'redundantAttribute': 'expr331',
            'selector': '[expr331]'
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jtooltip';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'tip',

              'evaluate': function(scope) {
                return scope.props.field.tip;
              }
            }],

            'redundantAttribute': 'expr332',
            'selector': '[expr332]'
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,

            'condition': function(scope) {
              return scope.props.field.multilang;
            },

            'template': template(
              '<button expr334="expr334" type="button" style="text-transform: capitalize;"> <span class="aaainputFeedback"></span></button>',
              [{
                'redundantAttribute': 'expr334',
                'selector': '[expr334]',

                'expressions': [{
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(scope) {
                    return [scope.langName(scope.lang), ' '].join('');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return ['btn ', scope.btnLangColor(scope.lang), ' btn-sm ml-1'].join('');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'idLang',

                  'evaluate': function(scope) {
                    return scope.lang;
                  }
                }, {
                  'type': expressionTypes.EVENT,
                  'name': 'onclick',

                  'evaluate': function(scope) {
                    return scope.selectLang;
                  }
                }]
              }]
            ),

            'redundantAttribute': 'expr333',
            'selector': '[expr333]',
            'itemName': 'lang',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.props.attr.langs;
            }
          }, {
            'type': bindingTypes.EACH,
            'getKey': null,
            'condition': null,

            'template': template(
              '<span expr336="expr336" class="h-100 input-group-append"></span><div expr338="expr338"></div><input expr339="expr339" type="hidden" class="form-control" texteditor="true"/>',
              [{
                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return [
                      'ianput-group ',
                      scope.lang==scope.state.currentLang || !scope.lang?'':'hide'
                    ].join('');
                  }
                }]
              }, {
                'type': bindingTypes.IF,

                'evaluate': function(scope) {
                  return scope.props.field.multilang && scope.props.attr.proposeTranslate && scope.state.defaultLang !=scope.lang;
                },

                'redundantAttribute': 'expr336',
                'selector': '[expr336]',

                'template': template(
                  '<button expr337="expr337" type="button" class="btn btn-info"><i class="fas fa-language"></i></button>',
                  [{
                    'redundantAttribute': 'expr337',
                    'selector': '[expr337]',

                    'expressions': [{
                      'type': expressionTypes.EVENT,
                      'name': 'onclick',

                      'evaluate': function(scope) {
                        return scope.translate;
                      }
                    }]
                  }]
                )
              }, {
                'redundantAttribute': 'expr338',
                'selector': '[expr338]',

                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'name',

                  'evaluate': function(scope) {
                    return scope.buildId(scope.lang,'_');
                  }
                }]
              }, {
                'redundantAttribute': 'expr339',
                'selector': '[expr339]',

                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'defaultLang',

                  'evaluate': function(scope) {
                    return scope.state.defaultLang;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'lang',

                  'evaluate': function(scope) {
                    return scope.lang;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'baseId',

                  'evaluate': function(scope) {
                    return scope.props.field.id;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'name',

                  'evaluate': function(scope) {
                    return scope.buildId(scope.lang);
                  }
                }, {
                  'type': expressionTypes.VALUE,

                  'evaluate': function(scope) {
                    return scope.props.field.value;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'id',

                  'evaluate': function(scope) {
                    return [].join('');
                  }
                }]
              }]
            ),

            'redundantAttribute': 'expr335',
            'selector': '[expr335]',
            'itemName': 'lang',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.state.langs;
            }
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'jhelp';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'help',

              'evaluate': function(scope) {
                return scope.props.field.help;
              }
            }],

            'redundantAttribute': 'expr340',
            'selector': '[expr340]'
          }]
        );
      },

      'name': 'itexteditor'
    };

    var jaddon = {
      'css': null,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<div expr323="expr323" class="h-100 input-group-prepend"></div><div expr325="expr325" class="h-100 input-group-append"></div>',
          [{
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return scope.props.placement=='left' && scope.props.field.icon!='none';
            },

            'redundantAttribute': 'expr323',
            'selector': '[expr323]',

            'template': template(
              '<span class="input-group-text"><jicon expr324="expr324"></jicon></span>',
              [{
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jicon';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'field',

                  'evaluate': function(scope) {
                    return scope.props.field;
                  }
                }],

                'redundantAttribute': 'expr324',
                'selector': '[expr324]'
              }]
            )
          }, {
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return scope.props.placement=='right' && scope.props.field.buttons;
            },

            'redundantAttribute': 'expr325',
            'selector': '[expr325]',

            'template': template('<ibutton expr326="expr326"></ibutton>', [{
              'type': bindingTypes.EACH,
              'getKey': null,
              'condition': null,

              'template': template(null, [{
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'ibutton';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'field',

                  'evaluate': function(scope) {
                    return scope.button;
                  }
                }]
              }]),

              'redundantAttribute': 'expr326',
              'selector': '[expr326]',
              'itemName': 'button',
              'indexName': null,

              'evaluate': function(scope) {
                return scope.props.field.buttons;
              }
            }])
          }]
        );
      },

      'name': 'jaddon'
    };

    var jhelp = {
      'css': null,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template('<small expr341="expr341" class="text-muted mb-1 mr-1"></small>', [{
          'type': bindingTypes.IF,

          'evaluate': function(scope) {
            return scope.props.help;
          },

          'redundantAttribute': 'expr341',
          'selector': '[expr341]',

          'template': template(' ', [{
            'expressions': [{
              'type': expressionTypes.TEXT,
              'childNodeIndex': 0,

              'evaluate': function(scope) {
                return scope.i18n(scope.props.help);
              }
            }]
          }])
        }]);
      },

      'name': 'jhelp'
    };

    var jicon = {
      'css': null,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template('<i expr342="expr342"></i>', [{
          'redundantAttribute': 'expr342',
          'selector': '[expr342]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return [scope.selectIcon(scope.props.field), ' fa-fw'].join('');
            }
          }]
        }]);
      },

      'name': 'jicon'
    };

    var jlabel = {
      'css': `jlabel .label,[is="jlabel"] .label{ font-size:1.3rem; } jlabel .inputRequired,[is="jlabel"] .inputRequired{ color: red; }`,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template(
          '<label expr343="expr343" class="label fucfirst"> </label><span expr344="expr344" class="inputRequired mx-1"></span>',
          [{
            'redundantAttribute': 'expr343',
            'selector': '[expr343]',

            'expressions': [{
              'type': expressionTypes.TEXT,
              'childNodeIndex': 0,

              'evaluate': function(scope) {
                return scope.i18n(scope.props.field.label);
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'for',

              'evaluate': function(scope) {
                return scope.props.field.id;
              }
            }]
          }, {
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return scope.props.field.required;
            },

            'redundantAttribute': 'expr344',
            'selector': '[expr344]',
            'template': template('<i class="fas fa-asterisk fa-fw" aria-hidden="true"></i>', [])
          }]
        );
      },

      'name': 'jlabel'
    };

    var jtooltip = {
      'css': `jtooltip .ftooltip,[is="jtooltip"] .ftooltip{ position: relative; display: inline-block; } jtooltip .ftooltip .ftooltipText,[is="jtooltip"] .ftooltip .ftooltipText{ font-size:1rem!important; visibility: hidden; width: 12rem; background-color: #ffc107; color: white; text-align: center; border: thin solid lightgray; border-radius: 6px; padding: 5px 0; position: absolute; z-index: 10; bottom: 125%; left: 0%; margin-left: -60px; } jtooltip .ftooltip:hover .ftooltipText,[is="jtooltip"] .ftooltip:hover .ftooltipText{ visibility: visible; }`,
      'exports': null,

      'template': function(template, expressionTypes, bindingTypes, getComponent) {
        return template('<div expr351="expr351" class="ftooltip"></div>', [{
          'type': bindingTypes.IF,

          'evaluate': function(scope) {
            return scope.props.tip;
          },

          'redundantAttribute': 'expr351',
          'selector': '[expr351]',

          'template': template(
            '<i class="far fa-question-circle mx-1"></i><div expr352="expr352" class="ftooltipText"> </div>',
            [{
              'redundantAttribute': 'expr352',
              'selector': '[expr352]',

              'expressions': [{
                'type': expressionTypes.TEXT,
                'childNodeIndex': 0,

                'evaluate': function(scope) {
                  return scope.i18n(scope.props.tip);
                }
              }]
            }]
          )
        }]);
      },

      'name': 'jtooltip'
    };

    /*import * as riot from 'riot'*/

    riot.install(function (component) {
        window.addEventListener('updateAll', () => {
            component.update();
        });
        component.updateAll = function () {
            window.dispatchEvent(new Event('updateAll'));
        };
        component.i18n = function (id) {
            return id
        };
        component.langName = function (id) {
            const langs = {
                fr: 'français',
                en: 'English'
            };
            return langs[id] || id
        };
        component.selectIcon = function (field) {
            var ret, id = '',
                type = '';
            if (field.icon && field.icon != 'none') return field.icon
            if (field.id) id = field.id.toLowerCase();
            if (field.type) type = field.type;
            if (field.onclick && !type) type = 'button';
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
            };
            for (var possibleId in autoIcons) {
                if (id.indexOf(possibleId) != -1 ||
                    type.indexOf(possibleId) != -1
                ) return autoIcons[possibleId]
            }
            if (!ret) ret = 'fas fa-greater-than';
            return ret
        };
        component.callType = function (type) {
            let types = {
                text: ['text', 'textarea', 'date', 'color', 'datetime', 'datetime-local', 'email', 'month', 'number', 'tel', 'time', 'url', 'week'],
                checkbox: ['checkbox', 'switch']
            };
            if (types.text.indexOf(type) > -1) return 'text'
            if (types.checkbox.indexOf(type) > -1) return 'checkbox'
            return type
        };
        component.translate = function (ev) {
            let elt = ev.target.closest(".input-group").querySelector(".form-control");
            let defaultLang = elt.getAttribute('defaultLang');
            let lang = elt.getAttribute('lang');
            let eltFromId = elt.getAttribute('baseId') + '.' + defaultLang;
            console.log(eltFromId, defaultLang, lang);
            let eltFromValue = ev.target.closest(".form-group").querySelector('[name="' + eltFromId + '"]').value;
            //console.log(ev.target.closest(".form-group").querySelector('[name="'+eltFromId+'"]').getAttribute('name'))
            elt.value = 'Transalion : ' + defaultLang + ' to ' + lang + ':' + eltFromValue;
        };
    });


    function getFormValues$1(formName) {
        var data = {};
        let inputs = document.getElementsByName(formName)[0].querySelectorAll('.form-control');
        inputs.forEach(function (input) {
            if (input.name) {
                let type = input.type;
                switch (type) {
                    case 'checkbox':
                        if (input.checked) field(data, input.name, input.getAttribute('checkedValue') || true);
                        else field(data, input.name, input.getAttribute('uncheckedValue') || false);
                        break
                    case 'select-multiple': //this is a special type property of dom  : https://www.w3schools.com/jsref/prop_select_type.asp
                        field(data, input.name, [...input.options].filter((x) => x.selected).map((x) => x.value));
                        break
                    case 'radio':
                        if (input.checked) field(data, input.name, input.value);
                        if (!field(data, input.name)) field(data, input.name, null);
                        break
                    default: //text, select-one, password, hidden, email, tel, textarea...... all others
                        field(data, input.name, input.value);
                }
            }
        });
        return data
    }

    function setFormValues$1(formName, data) {
        let inputs = document.getElementsByName(formName)[0].querySelectorAll('.form-control[name]'); //find all form-control with a name
        inputs.forEach(function (input) {
            let type = input.type;

            if (input.getAttribute('colorpicker')) type = 'colorpicker';
            if (input.getAttribute('datetimepicker')) type = 'datetimepicker';
            if (input.getAttribute('texteditor')) type = 'texteditor';

            let val = field(data, input.name);
            switch (type) {
                case 'checkbox':
                    input.checked = (input.checkedValue == val && input.uncheckedValue != val) || val;
                    break
                case 'select-multiple':
                    if (input.selectr) { //selectr tag
                        var setSelectrEvent = new CustomEvent(formName + '_setSelectr_' + input.name, {
                            detail: {
                                values: val
                            }
                        });
                        document.dispatchEvent(setSelectrEvent);
                    } else Array.prototype.forEach.call(input.options, function (opt) {
                        opt.selected = (val && val.indexOf(opt.value) > -1);
                    });
                    break
                case 'colorpicker':
                    var setColorEvent = new CustomEvent(formName + '_setColor_' + input.name, {
                        detail: {
                            color: val
                        }
                    });
                    document.dispatchEvent(setColorEvent);
                    break
                case 'datetimepicker':
                console.log('typeA',type,input.name);
                    var setDatetimeEvent = new CustomEvent(formName + '_setDatetime_' + input.name, {
                        detail: {
                            epoch: val
                        }
                    });
                    document.dispatchEvent(setDatetimeEvent);
                    break
                case 'texteditor':
                    var setTexteditorEvent = new CustomEvent(formName + '_setTexteditor_' + input.name, {
                        detail: {
                            content: val
                        }
                    });
                    document.dispatchEvent(setTexteditorEvent);
                    break
                default: //radio, select-one' text, password, hidden, email, tel, textarea...... all others
                console.log('type',type,input.name,input);
                    input.value = val;
                    //image
            }
        });
        return data
    }

    function field(obj, fieldPath, value) {
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
                if (value !== undefined) obj[arr[0]].push(value);
                else return obj[arr[0]][arr[1].slice(0, -1)] //remove last char or arr[1] that must be a ']'
            } else {
                if (value !== undefined) obj[fieldPath] = value; // no embedded objects, just fieldPath assignment
                else return obj[fieldPath]
            }
        }
    }


    riot.register('formr', formr);
    riot.register('ialert', ialert);
    riot.register('ibutton', ibutton);
    riot.register('icheckbox', icheckbox);
    riot.register('icolorpicker', icolorpicker);
    riot.register('idatetimepicker', idatetimepicker);
    riot.register('iimagepicker', iimagepicker);
    riot.register('ihidden', ihidden);
    riot.register('ihr', ihr);
    riot.register('ipassword', ipassword);
    riot.register('iradio', iradio);
    riot.register('irange', irange);
    riot.register('irow', irow);
    riot.register('iselect', iselect);
    riot.register('itext', itext);
    riot.register('itexteditor', itexteditor);
    riot.register('jaddon', jaddon);
    riot.register('jhelp', jhelp);
    riot.register('jicon', jicon);
    riot.register('jlabel', jlabel);
    riot.register('jtooltip', jtooltip);

    var exports$1 = /*#__PURE__*/Object.freeze({
        getFormValues: getFormValues$1,
        setFormValues: setFormValues$1,
        field: field
    });

    //import App from './app.riot'
    Object.entries(exports$1).forEach(([name, exported]) => window[name] = exported);

    /*

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
    */

}));
//# sourceMappingURL=riot-formr.js.map
