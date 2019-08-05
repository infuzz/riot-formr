// Version: 1564853229023
// Auto-generated code. Do not touch.
riot.register('formr',{
  'css': `formr .out,[is="formr"] .out{ -webkit-transition: height 1s; -moz-transition: height 1s; -ms-transition: height 1s; -o-transition: height 1s; transition: height 1s; height: 0; } formr .hide,[is="formr"] .hide,formr .form-inline .hide,[is="formr"] .form-inline .hide{ display: none; } formr .form-group,[is="formr"] .form-group{ margin-bottom: 1.5rem; } formr label,[is="formr"] label{ font-size: 1.1rem; font-weight: 500; } formr button:disabled,[is="formr"] button:disabled{ cursor: not-allowed; } formr button:focus,[is="formr"] button:focus,formr input:focus,[is="formr"] input:focus,formr textarea:focus,[is="formr"] textarea:focus{ outline: none !important; border-color: #719ECE !important; box-shadow: 0 0 10px #719ECE !important; } formr .fucfirst:first-letter,[is="formr"] .fucfirst:first-letter{ text-transform: capitalize; }`,

  'exports': {
    checkField(field, i) {
        field.id = field.id || 'ffield' + i
        return field
    },

    onBeforeMount() {
        this.state.desc = window.fields[this.props.id].desc
        this.state.attr = window.fields[this.props.id].attr
        this.state.attr.id = this.props.id
    },

    onMounted(){
        this.ctrlRun(this.props.id)
    },

    callType(type) {
        let types = ['textarea', 'date', 'color', 'datetime', 'datetime-local', 'email', 'month', 'number', 'tel', 'time', 'url', 'week']
        if (types.indexOf(type) > -1) return 'text'
        else return type
    },

    click() {
        this.fields.push({
            type: 'text',
            size: 10,
            value: 'First item'
        })
        this.update()
    },

    validate(ev) {
        let targetForm=ev.target.closest("form")
        this.ctrlRun(targetForm.name)
        let invalidFeedback = '<i class="text-danger fas fa-times fa-fw mx-2" aria-hidden="true"></i>'
        let invalidFeedbackMsg = '<i class="text-danger fas fa-exclamation-triangle fa-fw mx-2" aria-hidden="true"></i>'
        let validFeedback = '<i class="text-success fas fa-check fa-fw mx-2" aria-hidden="true"></i>'
        let feedBackElt = ev.target.closest(".form-group").querySelector(".inputFeedback")
        let feedBackMsgElt = ev.target.closest(".form-group").querySelector(".inputFeedbackMsg")
        let field = ev.target
        let validity = ev.target.validity
        if (!validity) return
        let isValid = validity.valid

        let msgs = []
        let msg = ''
        if (field.disabled || field.type == 'file') return
        if (validity.valueMissing) msgs.push('valueMissing')
        if (validity.typeMismatch && field.type == 'email') msgs.push('invalid email')
        if (validity.typeMismatch && field.type == 'url') msgs.push('invalid URL')
        if (validity.tooShort) msgs.push('Lengthen this text to ' + field.minLength + ' characters or more. You are currently using ' + field.value.length + ' characters')
        if (validity.tooLong) msgs.push('Shorten this text to no more than ' + field.maxLength + ' characters. You are currently using ' + field.value.length + ' characters')
        if (validity.badInput) msgs.push('invalid number')
        if (validity.stepMismatch) msgs.push('invalid step')
        if (validity.rangeOverflow) msgs.push('Select a value that is no more than ' + field.max)
        if (validity.rangeUnderflow) msgs.push('Select a value that is no less than ' + field.min)
        if (validity.patternMismatch && field.getAttribute('patternInfo')) msgs.push(field.getAttribute('patternInfo')) // If pattern info is included, return custom error
        if (validity.patternMismatch && !field.getAttribute('patternInfo')) msgs.push("Didn't the requested format")
        let self = this
        msgs.forEach(function(m) {
            msg += invalidFeedbackMsg + self.i18n(m) + '. '
        })
        // If all else fails, msg is a generic catchall error
        if (!isValid && !msg) msg = 'The value you entered for this field is invalid. '
        feedBackElt.innerHTML = (isValid ? validFeedback : invalidFeedback)
        feedBackMsgElt.innerHTML = isValid ? '' : msg

        //enable buttons with attributes 'waitValid' if all fields in the form is valid
        nbInvalidFields = targetForm.querySelectorAll('.form-control:invalid')
        waitValid = targetForm.querySelectorAll('[waitvalid]')
        waitValid.forEach(function(e) {
            e.disabled = nbInvalidFields.length
        })
    },

    ctrlRun(formName) {
        document.getElementsByName(formName)[0].querySelectorAll("input[ctrlChecked][ctrlUnchecked]").forEach(function(elt) {
            elt.getAttribute("ctrlChecked").split(',').forEach(function(name) {
                //node = '[name=fgroup_' + name+']'
                name = 'fgroup_' + name
                node = document.getElementsByName(name)[0]
                if (elt.checked) node.classList.remove('hide')
                else node.classList.add('hide')
            })
            elt.getAttribute("ctrlUnchecked").split(',').forEach(function(name) {
                name = 'fgroup_' + name
                node = document.getElementsByName(name)[0]
                if (elt.checked) node.classList.add('hide')
                else node.classList.remove('hide')
            })
        })
    },

    er() {
        console.log(getFormValues('form1'))
    },

    seter() {
        console.log(setFormValues('form1',data))
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<form expr109 novalidate><button expr110 type="button">Go</button><button expr111 type="button">set</button><div expr112></div></form>',
      [{
        'redundantAttribute': 'expr109',
        'selector': '[expr109]',

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
        'redundantAttribute': 'expr110',
        'selector': '[expr110]',

        'expressions': [{
          'type': expressionTypes.EVENT,
          'name': 'onclick',

          'evaluate': function(scope) {
            return scope.er;
          }
        }]
      }, {
        'redundantAttribute': 'expr111',
        'selector': '[expr111]',

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

        'template': template('<div expr113 class="form-group"><div expr114></div></div>', [{
          'redundantAttribute': 'expr113',
          'selector': '[expr113]',

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

          'redundantAttribute': 'expr114',
          'selector': '[expr114]'
        }]),

        'redundantAttribute': 'expr112',
        'selector': '[expr112]',
        'itemName': 'field',
        'indexName': 'i',

        'evaluate': function(scope) {
          return scope.state.desc;
        }
      }]
    );
  },

  'name': 'formr'
});

riot.register('ihr',{
  'css': `ihr .fhrlabel,[is="ihr"] .fhrlabel{ font-size:1.3rem; } ihr hr,[is="ihr"] hr{margin:0;}`,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<div expr132><jicon expr133></jicon><span expr134><!----></span><jtooltip expr135></jtooltip><hr/><jhelp expr136></jhelp></div>',
      [{
        'redundantAttribute': 'expr132',
        'selector': '[expr132]',

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

        'redundantAttribute': 'expr133',
        'selector': '[expr133]'
      }, {
        'redundantAttribute': 'expr134',
        'selector': '[expr134]',

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

        'redundantAttribute': 'expr135',
        'selector': '[expr135]'
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

        'redundantAttribute': 'expr136',
        'selector': '[expr136]'
      }]
    );
  },

  'name': 'ihr'
});

riot.register('ialert',{
  'css': `ialert .alert div,[is="ialert"] .alert div{font-size:2rem;}`,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<div expr137 role="alert"><div expr138><jicon expr139></jicon><!----><jtooltip expr140></jtooltip></div><jhelp expr141></jhelp></div>',
      [{
        'redundantAttribute': 'expr137',
        'selector': '[expr137]',

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
        'redundantAttribute': 'expr138',
        'selector': '[expr138]',

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

        'redundantAttribute': 'expr139',
        'selector': '[expr139]'
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

        'redundantAttribute': 'expr140',
        'selector': '[expr140]'
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

        'redundantAttribute': 'expr141',
        'selector': '[expr141]'
      }]
    );
  },

  'name': 'ialert'
});

riot.register('itext',{
  'css': null,

  'exports': {
    onBeforeMount() {
        this.state.currentLang = this.props.attr.langs[0]
        this.state.defaultLang = this.props.attr.langs[0]
        if (this.props.field.multilang) {
            this.state.langs = this.props.attr.langs
        } else {
            this.state.langs = ['']
        }
        if (this.props.type == 'datetime') this.state.type = 'datetime-local'
        else this.state.type = this.props.field.type
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
        this.state.currentLang = ev.target.attributes.idLang.value
        this.update()
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr142></jlabel><jtooltip expr143></jtooltip><template expr144></template><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div expr146></div><jhelp expr153></jhelp>',
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

        'redundantAttribute': 'expr142',
        'selector': '[expr142]'
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

        'redundantAttribute': 'expr143',
        'selector': '[expr143]'
      }, {
        'type': bindingTypes.EACH,
        'getKey': null,

        'condition': function(scope) {
          return scope.props.field.multilang;
        },

        'template': template(
          '<button expr145 type="button" style="text-transform: capitalize;"><!----><span class="aaainputFeedback"></span></button>',
          [{
            'redundantAttribute': 'expr145',
            'selector': '[expr145]',

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

        'redundantAttribute': 'expr144',
        'selector': '[expr144]',
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
          '<jaddon expr147 placement="left"></jaddon><input expr148/><textarea expr149></textarea><div expr150 class="h-100 input-group-append"></div><jaddon expr152 placement="right"></jaddon>',
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

            'redundantAttribute': 'expr147',
            'selector': '[expr147]'
          }, {
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return scope.props.field.type!='textarea';
            },

            'redundantAttribute': 'expr148',
            'selector': '[expr148]',

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
            }])
          }, {
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return scope.props.field.type=='textarea';
            },

            'redundantAttribute': 'expr149',
            'selector': '[expr149]',

            'template': template('<!---->', [{
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

            'redundantAttribute': 'expr150',
            'selector': '[expr150]',

            'template': template(
              '<button expr151 type="button" class="btn btn-info"><i class="fas fa-language"></i></button>',
              [{
                'redundantAttribute': 'expr151',
                'selector': '[expr151]',

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

            'redundantAttribute': 'expr152',
            'selector': '[expr152]'
          }]
        ),

        'redundantAttribute': 'expr146',
        'selector': '[expr146]',
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

        'redundantAttribute': 'expr153',
        'selector': '[expr153]'
      }]
    );
  },

  'name': 'itext'
});

riot.register('ihidden',{
  'css': null,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<input expr154 type="hidden"/>', [{
      'redundantAttribute': 'expr154',
      'selector': '[expr154]',

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
});

riot.register('ipassword',{
  'css': null,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr155></jlabel><jtooltip expr156></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><jaddon expr157 placement="left"></jaddon><input expr158 type="password" placeholder="Password"/><jaddon expr159 placement="right"></jaddon></div><jhelp expr160></jhelp>',
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

        'redundantAttribute': 'expr155',
        'selector': '[expr155]'
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

        'redundantAttribute': 'expr156',
        'selector': '[expr156]'
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

        'redundantAttribute': 'expr157',
        'selector': '[expr157]'
      }, {
        'redundantAttribute': 'expr158',
        'selector': '[expr158]',

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
          'name': 'size',

          'evaluate': function(scope) {
            return scope.props.field.size;
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

        'redundantAttribute': 'expr159',
        'selector': '[expr159]'
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

        'redundantAttribute': 'expr160',
        'selector': '[expr160]'
      }]
    );
  },

  'name': 'ipassword'
});

riot.register('ibutton',{
  'css': null,

  'exports': {
    click(ev) {//not used
        action=ev.target.getAttribute('action')
        param=ev.target.getAttribute('param')
        console.log(action,param,this)
        if(typeof action == "function") action(event,param)
        if(typeof this[action] == "function") this[action](event,param)
    },

    dosomething(ev,param) //test action
    {
        alert('dosomething')
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<button expr161 type="button" style="text-transform: capitalize;"><jicon expr162></jicon><!----><jtooltip expr163></jtooltip></button><jhelp expr164></jhelp>',
      [{
        'redundantAttribute': 'expr161',
        'selector': '[expr161]',

        'expressions': [{
          'type': expressionTypes.TEXT,
          'childNodeIndex': 1,

          'evaluate': function(scope) {
            return [' ', scope.i18n(scope.props.field.title), '\r\n         '].join('');
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

        'redundantAttribute': 'expr162',
        'selector': '[expr162]'
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

        'redundantAttribute': 'expr163',
        'selector': '[expr163]'
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

        'redundantAttribute': 'expr164',
        'selector': '[expr164]'
      }]
    );
  },

  'name': 'ibutton'
});

riot.register('jlabel',{
  'css': `jlabel .label,[is="jlabel"] .label{ font-size:1.3rem; } jlabel .inputRequired,[is="jlabel"] .inputRequired{ color: red; }`,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<label expr165 class="label fucfirst"><!----></label><span expr166 class="inputRequired mx-1"></span>',
      [{
        'redundantAttribute': 'expr165',
        'selector': '[expr165]',

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

        'redundantAttribute': 'expr166',
        'selector': '[expr166]',
        'template': template('<i class="fas fa-asterisk fa-fw" aria-hidden="true"></i>', [])
      }]
    );
  },

  'name': 'jlabel'
});

riot.register('jicon',{
  'css': null,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<i expr167></i>', [{
      'redundantAttribute': 'expr167',
      'selector': '[expr167]',

      'expressions': [{
        'type': expressionTypes.ATTRIBUTE,
        'name': 'class',

        'evaluate': function(scope) {
          return scope.selectIcon(scope.props.field);
        }
      }]
    }]);
  },

  'name': 'jicon'
});

riot.register('icheckbox',{
  'css': `icheckbox .fswitch,[is="icheckbox"] .fswitch{ display: block; position: relative; padding-left: 3.2rem; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } icheckbox .fswitch input,[is="icheckbox"] .fswitch input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } icheckbox .fswitchslider,[is="icheckbox"] .fswitchslider{ position: absolute; top: 3px; left: 0; height: 1.5rem; width: 2.75rem; background-color: #eee; -webkit-transition: .4s; transition: .4s; } icheckbox .fswitch:hover input~.fswitchslider,[is="icheckbox"] .fswitch:hover input~.fswitchslider{ background-color: #ccc; } icheckbox .fswitch input:checked~.fswitchslider,[is="icheckbox"] .fswitch input:checked~.fswitchslider{ background-color: #2196F3; } icheckbox .fswitchslider:before,[is="icheckbox"] .fswitchslider:before{ position: absolute; content: ""; height: 1.35rem; width: 1.35rem; left: 0.1rem; bottom: 0.1rem; background-color: white; -webkit-transition: .4s; transition: .4s; } icheckbox .fswitch input:checked~.fswitchslider,[is="icheckbox"] .fswitch input:checked~.fswitchslider{ background-color: blue; } icheckbox .fswitch input:checked~.fswitchslider:before,[is="icheckbox"] .fswitch input:checked~.fswitchslider:before{ background-image: radial-gradient(#ffffff, rgb(210, 210, 210)); } icheckbox .fswitch input:focus~.fswitchslider,[is="icheckbox"] .fswitch input:focus~.fswitchslider{ --box-shadow: 0 0 1px var(--navBarBg-backgroundColor); box-shadow: 0 0 4px blue; } icheckbox .fswitch input:checked~.fswitchslider:before,[is="icheckbox"] .fswitch input:checked~.fswitchslider:before{ -webkit-transform: translateX(1.25rem); -ms-transform: translateX(1.25rem); transform: translateX(1.25rem); } icheckbox .fswitch input[disabled]~.fswitchslider,[is="icheckbox"] .fswitch input[disabled]~.fswitchslider{ opacity: 0.5; cursor: not-allowed; } icheckbox .fswitchround,[is="icheckbox"] .fswitchround{ border-radius: 3.4rem; } icheckbox .fswitchround:before,[is="icheckbox"] .fswitchround:before{ border-radius: 50%; } icheckbox .fcheck,[is="icheckbox"] .fcheck{ display: block; position: relative; padding-left: 35px; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } icheckbox .fcheck input,[is="icheckbox"] .fcheck input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } icheckbox .fcheckmark,[is="icheckbox"] .fcheckmark{ position: absolute; top: 0; left: 0; height: 25px; width: 25px; background-color: #eee; -webkit-transition: .4s; transition: .4s; } icheckbox .fcheck:hover input~.fcheckmark,[is="icheckbox"] .fcheck:hover input~.fcheckmark{ background-color: #ccc; } icheckbox .fcheck input:checked~.fcheckmark,[is="icheckbox"] .fcheck input:checked~.fcheckmark{ background-color: #2196F3; } icheckbox .fcheckmark:after,[is="icheckbox"] .fcheckmark:after{ content: ""; position: absolute; display: none; } icheckbox .fcheck input:checked~.fcheckmark:after,[is="icheckbox"] .fcheck input:checked~.fcheckmark:after{ display: block; } icheckbox .fcheck .fcheckmark:after,[is="icheckbox"] .fcheck .fcheckmark:after{ left: 9px; top: 5px; width: 6px; height: 12px; border: solid white; border-width: 0 3px 3px 0; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg); }`,

  'exports': {
    isChecked(option) {
        return (option.checked || option.value == option.checkedValue || option.value == true)
    },

    ctrlToString(option,which) {
        if (option.ctrl && option.ctrl[which]) return option.ctrl[which].join()
        else return false
    },

    buildId(option) {
        if(option.id) return this.props.field.id + '.' + option.id
        else return this.props.field.id
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr168></jlabel><jtooltip expr169></jtooltip><jhelp expr170></jhelp><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="aaad-inline"><template expr171></template></div>',
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

        'redundantAttribute': 'expr168',
        'selector': '[expr168]'
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

        'redundantAttribute': 'expr169',
        'selector': '[expr169]'
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

        'redundantAttribute': 'expr170',
        'selector': '[expr170]'
      }, {
        'type': bindingTypes.EACH,
        'getKey': null,
        'condition': null,

        'template': template(
          '<div class="row"><div expr172 class="fucfirst col-auto mb-2"></div><div class="col-auto"><label expr173><span expr174 class="mr-1"></span><jtooltip expr175></jtooltip><jhelp expr176></jhelp><input expr177 class="form-control"/><span expr178></span></label></div><div expr179 class="fucfirst col-auto mb-2"></div><div class="fucfirst col-auto mb-2"><jtooltip expr180></jtooltip><jhelp expr181></jhelp></div></div>',
          [{
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return scope.option.uncheckedLabel;
            },

            'redundantAttribute': 'expr172',
            'selector': '[expr172]',

            'template': template('<!---->', [{
              'expressions': [{
                'type': expressionTypes.TEXT,
                'childNodeIndex': 0,

                'evaluate': function(scope) {
                  return scope.i18n(scope.option.uncheckedLabel);
                }
              }]
            }])
          }, {
            'redundantAttribute': 'expr173',
            'selector': '[expr173]',

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

            'redundantAttribute': 'expr174',
            'selector': '[expr174]',

            'template': template('<!---->', [{
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

            'redundantAttribute': 'expr175',
            'selector': '[expr175]',

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

            'redundantAttribute': 'expr176',
            'selector': '[expr176]',

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
            'redundantAttribute': 'expr177',
            'selector': '[expr177]',

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
            'redundantAttribute': 'expr178',
            'selector': '[expr178]',

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

            'redundantAttribute': 'expr179',
            'selector': '[expr179]',

            'template': template('<!---->', [{
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

            'redundantAttribute': 'expr180',
            'selector': '[expr180]',

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

            'redundantAttribute': 'expr181',
            'selector': '[expr181]',

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

        'redundantAttribute': 'expr171',
        'selector': '[expr171]',
        'itemName': 'option',
        'indexName': null,

        'evaluate': function(scope) {
          return scope.props.field.options;
        }
      }]
    );
  },

  'name': 'icheckbox'
});

riot.register('iradio',{
  'css': `iradio .fradio,[is="iradio"] .fradio{ display: block; position: relative; padding-left: 35px; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } iradio .fradio input,[is="iradio"] .fradio input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } iradio .fradiomark,[is="iradio"] .fradiomark{ position: absolute; top: 0; left: 0; height: 25px; width: 25px; background-color: #eee; border-radius: 50%; -webkit-transition: .4s; transition: .4s; } iradio .fradio:hover input~.fradiomark,[is="iradio"] .fradio:hover input~.fradiomark{ background-color: #ccc; } iradio .fradio input:checked~.fradiomark,[is="iradio"] .fradio input:checked~.fradiomark{ background-color: #2196F3; } iradio .fradiomark:after,[is="iradio"] .fradiomark:after{ content: ""; position: absolute; display: none; } iradio .fradio input:checked~.fradiomark:after,[is="iradio"] .fradio input:checked~.fradiomark:after{ display: block; } iradio .fradio .fradiomark:after,[is="iradio"] .fradio .fradiomark:after{ top: 8px; left: 8px; width: 9px; height: 9px; border-radius: 50%; background: white; }`,

  'exports': {
    isChecked(option) {
        return (option.checked || option.id==this.props.field.value)
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr182></jlabel><jtooltip expr183></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><jhelp expr184></jhelp><div class="aaad-inline"><template expr185></template></div>',
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

        'redundantAttribute': 'expr182',
        'selector': '[expr182]'
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

        'redundantAttribute': 'expr183',
        'selector': '[expr183]'
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

        'redundantAttribute': 'expr184',
        'selector': '[expr184]'
      }, {
        'type': bindingTypes.EACH,
        'getKey': null,
        'condition': null,

        'template': template(
          '<label expr186 class="fradio"><!----><jtooltip expr187></jtooltip><jhelp expr188></jhelp><input expr189 type="radio" class="form-control"/><span class="fradiomark"></span></label>',
          [{
            'redundantAttribute': 'expr186',
            'selector': '[expr186]',

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

            'redundantAttribute': 'expr187',
            'selector': '[expr187]'
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

            'redundantAttribute': 'expr188',
            'selector': '[expr188]'
          }, {
            'redundantAttribute': 'expr189',
            'selector': '[expr189]',

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

        'redundantAttribute': 'expr185',
        'selector': '[expr185]',
        'itemName': 'option',
        'indexName': null,

        'evaluate': function(scope) {
          return scope.props.field.options;
        }
      }]
    );
  },

  'name': 'iradio'
});

riot.register('irange',{
  'css': `irange input[type=range]::-webkit-slider-thumb,[is="irange"] input[type=range]::-webkit-slider-thumb{ background: red; } irange input[type=range]::-moz-range-thumb,[is="irange"] input[type=range]::-moz-range-thumb{ background:red; } irange input[type=range]::-ms-thumb,[is="irange"] input[type=range]::-ms-thumb{ background:red; }`,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr190></jlabel><jtooltip expr191></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><input expr192 type="range"/></div><jhelp expr193></jhelp>',
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

        'redundantAttribute': 'expr190',
        'selector': '[expr190]'
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

        'redundantAttribute': 'expr191',
        'selector': '[expr191]'
      }, {
        'redundantAttribute': 'expr192',
        'selector': '[expr192]',

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

        'redundantAttribute': 'expr193',
        'selector': '[expr193]'
      }]
    );
  },

  'name': 'irange'
});

riot.register('jaddon',{
  'css': null,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<div expr194 class="h-100 input-group-prepend"></div><div expr196 class="h-100 input-group-append"></div>',
      [{
        'type': bindingTypes.IF,

        'evaluate': function(scope) {
          return scope.props.placement=='left' && scope.props.field.icon!='none';
        },

        'redundantAttribute': 'expr194',
        'selector': '[expr194]',

        'template': template(
          '<span class="input-group-text" id="basic-addon1"><jicon expr195></jicon></span>',
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

            'redundantAttribute': 'expr195',
            'selector': '[expr195]'
          }]
        )
      }, {
        'type': bindingTypes.IF,

        'evaluate': function(scope) {
          return scope.props.placement=='right' && scope.props.field.buttons;
        },

        'redundantAttribute': 'expr196',
        'selector': '[expr196]',

        'template': template('<ibutton expr197></ibutton>', [{
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

          'redundantAttribute': 'expr197',
          'selector': '[expr197]',
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
});

riot.register('iselect',{
  'css': null,

  'exports': {
    isSelected(option) {
        //console.log(option)
        return (option.selected || option.value == this.props.field.value || (Array.isArray(this.props.field.value) && this.props.field.value.indexOf(option.value)>-1) )
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr198></jlabel><jtooltip expr199></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group mb-3"><jaddon expr200 placement="left"></jaddon><select expr201><template expr202></template></select><jaddon expr204 placement="right"></jaddon></div><jhelp expr205></jhelp>',
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

        'redundantAttribute': 'expr198',
        'selector': '[expr198]'
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

        'redundantAttribute': 'expr199',
        'selector': '[expr199]'
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

        'redundantAttribute': 'expr200',
        'selector': '[expr200]'
      }, {
        'redundantAttribute': 'expr201',
        'selector': '[expr201]',

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

        'template': template('<option expr203><!----></option>', [{
          'redundantAttribute': 'expr203',
          'selector': '[expr203]',

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

        'redundantAttribute': 'expr202',
        'selector': '[expr202]',
        'itemName': 'option',
        'indexName': null,

        'evaluate': function(scope) {
          return scope.props.field.options;
        }
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

        'redundantAttribute': 'expr204',
        'selector': '[expr204]'
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

        'redundantAttribute': 'expr205',
        'selector': '[expr205]'
      }]
    );
  },

  'name': 'iselect'
});

riot.register('irow',{
  'css': null,

  'exports': {
    checkField(field,i){
    field.id = field.id || 'ffield'+i
    return field
}
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<div class="row"><template expr206></template></div>', [{
      'type': bindingTypes.EACH,
      'getKey': null,
      'condition': null,

      'template': template('<div expr207><div expr208></div></div>', [{
        'redundantAttribute': 'expr207',
        'selector': '[expr207]',

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

        'redundantAttribute': 'expr208',
        'selector': '[expr208]'
      }]),

      'redundantAttribute': 'expr206',
      'selector': '[expr206]',
      'itemName': 'field',
      'indexName': 'i',

      'evaluate': function(scope) {
        return scope.props.field.desc;
      }
    }]);
  },

  'name': 'irow'
});

riot.register('ititle',{
  'css': `ititle .ftitle,[is="ititle"] .ftitle{ font-size:3rem; }`,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<div expr209><jicon expr210></jicon><!----><small><jtooltip expr211></jtooltip></small></div><jhelp expr212></jhelp>',
      [{
        'redundantAttribute': 'expr209',
        'selector': '[expr209]',

        'expressions': [{
          'type': expressionTypes.TEXT,
          'childNodeIndex': 1,

          'evaluate': function(scope) {
            return ['\r\n        ', scope.i18n(scope.props.field.title), '\r\n        '].join('');
          }
        }, {
          'type': expressionTypes.ATTRIBUTE,
          'name': 'class',

          'evaluate': function(scope) {
            return ['ftitle ', scope.props.field.class].join('');
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

        'redundantAttribute': 'expr210',
        'selector': '[expr210]'
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

        'redundantAttribute': 'expr211',
        'selector': '[expr211]'
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

        'redundantAttribute': 'expr212',
        'selector': '[expr212]'
      }]
    );
  },

  'name': 'ititle'
});

riot.register('icolorpicker',{
  'css': `icolorpicker .pickr .pcr-button,[is="icolorpicker"] .pickr .pcr-button{ height: 4em; width: 4em; }`,

  'exports': {
    onMounted() {
        //https://github.com/Simonwep/pickr
        const pickr = Pickr.create({
            el: '[name="colorpicker_'+this.props.field.id+'"]',
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
        })
        
        pickr.on('init', instance => {
            console.log(instance)
                setColor=instance._root.root.closest(".form-group").querySelector("[type='hidden']").value
                pickr.setColor(setColor,true)
        })
        
        pickr.on('save', (color, instance) => {
            rgba = color.toRGBA().toString()
            instance._root.root.closest(".form-group").querySelector("[type='hidden']").value = rgba
        }).on('cancel', () => {pickr.hide()})
        
        document.addEventListener('setColor_'+this.props.field.id, function(ev){
            pickr.setColor(ev.detail.color,true)
        })
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr213></jlabel><jtooltip expr214></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><jhelp expr215></jhelp><div expr216></div><input expr217 type="hidden" class="form-control"/>',
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

        'redundantAttribute': 'expr213',
        'selector': '[expr213]'
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

        'redundantAttribute': 'expr214',
        'selector': '[expr214]'
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

        'redundantAttribute': 'expr215',
        'selector': '[expr215]'
      }, {
        'redundantAttribute': 'expr216',
        'selector': '[expr216]',

        'expressions': [{
          'type': expressionTypes.ATTRIBUTE,
          'name': 'name',

          'evaluate': function(scope) {
            return "colorpicker_" + scope.props.field.id;
          }
        }]
      }, {
        'redundantAttribute': 'expr217',
        'selector': '[expr217]',

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
});

riot.register('itexteditor',{
  'css': null,

  'exports': {
    onBeforeMount() {
        this.state.currentLang = this.props.attr.langs[0]
        this.state.defaultLang = this.props.attr.langs[0]
        if (this.props.field.multilang) {
            this.state.langs = this.props.attr.langs
        } else {
            this.state.langs = ['']
        }
        if (this.props.type == 'datetime') this.state.type = 'datetime-local'
        else this.state.type = this.props.field.type
    },

    onMounted() {
            //https://quilljs.com/

            var container = '.texteditor'
            var editor = new Quill(container, {
                modules: {
                    toolbar: [
                        [{
                            header: [1, 2, false]
                        }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block']
                    ]
                },
                theme: 'snow'
            });
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
        this.state.currentLang = ev.target.attributes.idLang.value
        this.update()
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<jlabel expr115></jlabel><jtooltip expr116></jtooltip><template expr117></template><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div expr119></div><jhelp expr124></jhelp>',
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

        'redundantAttribute': 'expr115',
        'selector': '[expr115]'
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

        'redundantAttribute': 'expr116',
        'selector': '[expr116]'
      }, {
        'type': bindingTypes.EACH,
        'getKey': null,

        'condition': function(scope) {
          return scope.props.field.multilang;
        },

        'template': template(
          '<button expr118 type="button" style="text-transform: capitalize;"><!----><span class="aaainputFeedback"></span></button>',
          [{
            'redundantAttribute': 'expr118',
            'selector': '[expr118]',

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

        'redundantAttribute': 'expr117',
        'selector': '[expr117]',
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
          '<div class="texteditor"></div><input expr120 type="hidden" class="form-control"/><input id="x" value="Editor content goes here" type="hidden" name="content"/><trix-editor expr121 input="x"></trix-editor><div expr122 class="h-100 input-group-append"></div>',
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
            'redundantAttribute': 'expr120',
            'selector': '[expr120]',

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
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'trix-editor';
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'input',

              'evaluate': function() {
                return 'x';
              }
            }],

            'redundantAttribute': 'expr121',
            'selector': '[expr121]'
          }, {
            'type': bindingTypes.IF,

            'evaluate': function(scope) {
              return scope.props.field.multilang && scope.props.attr.proposeTranslate && scope.state.defaultLang !=scope.lang;
            },

            'redundantAttribute': 'expr122',
            'selector': '[expr122]',

            'template': template(
              '<button expr123 type="button" class="btn btn-info"><i class="fas fa-language"></i></button>',
              [{
                'redundantAttribute': 'expr123',
                'selector': '[expr123]',

                'expressions': [{
                  'type': expressionTypes.EVENT,
                  'name': 'onclick',

                  'evaluate': function(scope) {
                    return scope.translate;
                  }
                }]
              }]
            )
          }]
        ),

        'redundantAttribute': 'expr119',
        'selector': '[expr119]',
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

        'redundantAttribute': 'expr124',
        'selector': '[expr124]'
      }]
    );
  },

  'name': 'itexteditor'
});

riot.register('jtooltip',{
  'css': `jtooltip .ftooltip,[is="jtooltip"] .ftooltip{ position: relative; display: inline-block; } jtooltip .ftooltip .ftooltipText,[is="jtooltip"] .ftooltip .ftooltipText{ font-size:1rem!important; visibility: hidden; width: 12rem; background-color: #ffc107; color: white; text-align: center; border: thin solid lightgray; border-radius: 6px; padding: 5px 0; position: absolute; z-index: 10; bottom: 125%; left: 0%; margin-left: -60px; } jtooltip .ftooltip:hover .ftooltipText,[is="jtooltip"] .ftooltip:hover .ftooltipText{ visibility: visible; }`,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<div expr125 class="ftooltip"></div>', [{
      'type': bindingTypes.IF,

      'evaluate': function(scope) {
        return scope.props.tip;
      },

      'redundantAttribute': 'expr125',
      'selector': '[expr125]',

      'template': template(
        '<i class="far fa-question-circle mx-1"></i><div expr126 class="ftooltipText"><!----></div>',
        [{
          'redundantAttribute': 'expr126',
          'selector': '[expr126]',

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
});

riot.register('jhelp',{
  'css': null,
  'exports': null,

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template('<small expr127 class="text-muted mb-1 mr-1"></small>', [{
      'type': bindingTypes.IF,

      'evaluate': function(scope) {
        return scope.props.help;
      },

      'redundantAttribute': 'expr127',
      'selector': '[expr127]',

      'template': template('<!---->', [{
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
});

riot.register('compileme',{
  'css': `compileme .compile-button,[is="compileme"] .compile-button{ position: absolute; bottom: 10px; right: 10px; margin-left: 20px; }`,

  'exports': {
    state:{
        processing:false,
        version: '',
        tagName:'',
        scriptPath:''
    },

    onBeforeMount(props,state){
        this.state.version = (new Date()).getTime();
        if (this.props.version) {
            this.state.version = this.props.version;
        }
        this.state.tagName = 'root.tag';
        this.state.scriptPath = 'tags.js';
        if (this.props.entryTag){
            this.state.tagName = this.props.entryTag;
        }
        if (this.props.distPath){
            this.state.scriptPath = this.props.distPath;
        }
    },

    download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    async downloadJS() {
        this.update({processing:true});
        var codeArr = [];
        var promiseArr = [];
        // Get list of all riot tags
        document.querySelectorAll('script[type=riot]').forEach(elem => {
            if (elem.src.indexOf('compileMe.tag') === -1) {
                promiseArr.push(riot.compileFromUrl(elem.src));
            }
        });

        // process all then concat them
        await Promise.all(promiseArr).then(resArr => {
            resArr.forEach(res => {
                const name = res.meta.tagName;
                // inject "export default" and riot.register statement
                // NOTE: I saw the original code does this string replacement. not sure the best way
                const code2 = res.code.substr(0, res.code.length - 1).replace('export default ', '');
                codeArr.push("riot.register('" + name + "'," + code2 + ");");
            });
            
            var prefix = '// Version: ' + this.state.version + '\n// Auto-generated code. Do not touch.\n';
            var allStr = prefix + codeArr.join('\n\n');
            //console.log(allStr);
            this.download('tags.js',allStr);
            this.update({processing:false});
        });
    },

    async downloadIndex(){
        this.update({processing:true});
        const res = await fetch('index.html');
        const html = await res.text();
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(html, 'text/html');
        // remove all riot tags
        htmlDoc.querySelectorAll('script[type="riot"]').forEach(elem => {
            //console.log(elem.src);
            // Instead of app.tag tag, insert tags.js 
            if (elem.src.indexOf(this.state.tagName) != -1){
                var mainScript = document.createElement("script");
                mainScript.src = this.state.scriptPath;
                elem.parentNode.insertBefore(mainScript,elem);
            }
            elem.remove();
        });
        // Suisidal cleaning
        htmlDoc.querySelectorAll('compileMe').forEach(elem => {
            elem.remove();
        });
        // remove live-server injected tag if any
        htmlDoc.querySelectorAll('script[type="text/javascript"]').forEach(elem => {
            elem.remove();
            if (elem.innerHTML.indexOf('WebSocket') != -1 && elem.innerHTML.indexOf('Live reload enabled')){
                elem.remove();
            }
        });
        // comment and blank line clean up
        const prefix = '<!DOCTYPE html>\n<html>\n<!-- Version: '+this.state.version+'-->\n';
        const postfix = '\n</html>';
        const finalHtml = prefix + htmlDoc.documentElement.innerHTML.replace('<!-- Code injected by live-server -->','').replace(/(^[ \t]*\n)/gm, '') + postfix;
        //console.log(finalHtml);
        this.download('index.html',finalHtml);
        this.update({processing:false});
    }
  },

  'template': function(template, expressionTypes, bindingTypes, getComponent) {
    return template(
      '<div class="btn-group compile-button dropup"><button expr128 type="button" class="btn  btn-secondary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i expr129></i><!----></button><a expr130 class="dropdown-item" href="#"><!----></a><a expr131 class="dropdown-item" href="#">Download index.html - Production index page without riot tag</a></div>',
      [{
        'redundantAttribute': 'expr128',
        'selector': '[expr128]',

        'expressions': [{
          'type': expressionTypes.TEXT,
          'childNodeIndex': 1,

          'evaluate': function(scope) {
            return [
              '\r\n            ',
              scope.props.title ? scope.props.title : 'Compile Me !',
              '\r\n        '
            ].join('');
          }
        }]
      }, {
        'redundantAttribute': 'expr129',
        'selector': '[expr129]',

        'expressions': [{
          'type': expressionTypes.ATTRIBUTE,
          'name': 'class',

          'evaluate': function(scope) {
            return ['fas fa-cog ', scope.state.processing ? 'fa-spin' : ''].join('');
          }
        }]
      }, {
        'redundantAttribute': 'expr130',
        'selector': '[expr130]',

        'expressions': [{
          'type': expressionTypes.TEXT,
          'childNodeIndex': 0,

          'evaluate': function(scope) {
            return ['Download compiled .js file - Deploy this under ', scope.state.scriptPath].join('');
          }
        }, {
          'type': expressionTypes.EVENT,
          'name': 'onclick',

          'evaluate': function(scope) {
            return scope.downloadJS;
          }
        }]
      }, {
        'redundantAttribute': 'expr131',
        'selector': '[expr131]',

        'expressions': [{
          'type': expressionTypes.EVENT,
          'name': 'onclick',

          'evaluate': function(scope) {
            return scope.downloadIndex;
          }
        }]
      }]
    );
  },

  'name': 'compileme'
});