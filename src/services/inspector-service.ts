/*! JointJS+ v4.0.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2024 client IO

 2024-09-14


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import * as joint from '@joint/plus';

export class InspectorService {



    create(cell: joint.dia.Cell): joint.ui.Inspector {

      const inspectorContainer = document.querySelector('.inspector-container');
      if (inspectorContainer) {
          inspectorContainer.classList.remove('hidden'); // Mostrar el inspector
      }

        const { groups, inputs } = this.getInspectorConfig()[cell.get('type')];
        return joint.ui.Inspector.create('.inspector-container', { cell, groups, inputs });
    }


     hideInspector() {
        const inspectorContainer = document.querySelector('.inspector-container');
        if (inspectorContainer) {
            inspectorContainer.classList.add('hidden'); // Ocultar el inspector
        }
    }
    getInspectorConfig() {

        const options = {

            colorPalette: [
                { content: 'transparent', icon: '/assets/transparent-icon.svg' },
                { content: '#f6f6f6' },
                { content: '#dcd7d7' },
                { content: '#8f8f8f' },
                { content: '#c6c7e2' },
                { content: '#feb663' },
                { content: '#fe854f' },
                { content: '#b75d32' },
                { content: '#31d0c6' },
                { content: '#7c68fc' },
                { content: '#61549c' },
                { content: '#6a6c8a' },
                { content: '#4b4a67' },
                { content: '#3c4260' },
                { content: '#33334e' },
                { content: '#222138' }
            ],

            colorPaletteReset: [
                { content: '#f6f6f6' },
                { content: '#dcd7d7' },
                { content: '#8f8f8f' },
                { content: '#c6c7e2' },
                { content: '#feb663' },
                { content: '#fe854f' },
                { content: '#b75d32' },
                { content: '#31d0c6' },
                { content: '#7c68fc' },
                { content: '#61549c' },
                { content: '#6a6c8a' },
                { content: '#4b4a67' },
                { content: '#3c4260' },
                { content: '#33334e' },
                { content: '#222138' }
            ],

            fontWeight: [
                { value: '300', content: '<span style="font-weight: 300">Light</span>' },
                { value: 'Normal', content: '<span style="font-weight: Normal">Normal</span>' },
                { value: 'Bold', content: '<span style="font-weight: Bolder">Bold</span>' }
            ],

            fontFamily: [
                { value: 'Alegreya Sans', content: '<span style="font-family: Alegreya Sans">Alegreya Sans</span>' },
                { value: 'Averia Libre', content: '<span style="font-family: Averia Libre">Averia Libre</span>' },
                { value: 'Roboto Condensed', content: '<span style="font-family: Roboto Condensed">Roboto Condensed</span>' }
            ],

            strokeStyle: [
                { value: '0', content: 'Solid' },
                { value: '2,5', content: 'Dotted' },
                { value: '10,5', content: 'Dashed' }
            ],

            side: [
                { value: 'top', content: 'Top Side' },
                { value: 'right', content: 'Right Side' },
                { value: 'bottom', content: 'Bottom Side' },
                { value: 'left', content: 'Left Side' }
            ],

            portLabelPositionRectangle: [
                { value: { name: 'top', args: { y: -12 }}, content: 'Above' },
                { value: { name: 'right', args: { y: 0 }}, content: 'On Right' },
                { value: { name: 'bottom', args: { y: 12 }}, content: 'Below' },
                { value: { name: 'left', args: { y: 0 }}, content: 'On Left' }
            ],

            portLabelPositionEllipse: [
                { value: 'radial' , content: 'Horizontal' },
                { value: 'radialOriented' , content: 'Angled' }
            ],

            imageIcons: [
                { value: '/assets/image-icon1.svg', content: '<img height="42px" src="assets/image-icon1.svg"/>' },
                { value: '/assets/image-icon2.svg', content: '<img height="80px" src="assets/image-icon2.svg"/>' },
                { value: '/assets/image-icon3.svg', content: '<img height="80px" src="assets/image-icon3.svg"/>' },
                { value: '/assets/image-icon4.svg', content: '<img height="80px" src="assets/image-icon4.svg"/>' }
            ],

            imageGender: [
                { value: '/assets/member-male.png', content: '<img height="50px" src="assets/member-male.png" style="margin: 5px 0 0 2px;"/>' },
                { value: '/assets/member-female.png', content: '<img height="50px" src="assets/member-female.png" style="margin: 5px 0 0 2px;"/>' }
            ],

            arrowheadSize: [
                { value: 'M 0 0 0 0', content: 'Asociacion' },
                { value: 'M 0 -10 -15 0 0 10 z', content: 'Herencia' },
                { value: 'M 0 -5 10 0 0 5 -10 0 z', content: 'Composicion' }, // Agregación: rombo con fondo blanco
                { value: 'M 0 -5 11 0 0 5 -11 0 z', content: 'Agregación' } // Agregación: rombo con fondo blanco

            ],

            strokeWidth: [
                { value: 1, content: '<div style="background:#fff;width:2px;height:30px;margin:0 14px;border-radius: 2px;"/>' },
                { value: 2, content: '<div style="background:#fff;width:4px;height:30px;margin:0 13px;border-radius: 2px;"/>' },
                { value: 4, content: '<div style="background:#fff;width:8px;height:30px;margin:0 11px;border-radius: 2px;"/>' },
                { value: 8, content: '<div style="background:#fff;width:16px;height:30px;margin:0 8px;border-radius: 2px;"/>' }
            ],

            router: [
                { value: 'normal', content: '<p style="background:#fff;width:2px;height:30px;margin:0 14px;border-radius: 2px;"/>' },
                { value: 'orthogonal', content: '<p style="width:20px;height:30px;margin:0 5px;border-bottom: 2px solid #fff;border-left: 2px solid #fff;"/>' },
                { value: 'oneSide', content: '<p style="width:20px;height:30px;margin:0 5px;border: 2px solid #fff;border-top: none;"/>' }
            ],

            connector: [
                { value: 'normal', content: '<p style="width:20px;height:20px;margin:5px;border-top:2px solid #fff;border-left:2px solid #fff;"/>' },
                { value: 'rounded', content: '<p style="width:20px;height:20px;margin:5px;border-top-left-radius:30%;border-top:2px solid #fff;border-left:2px solid #fff;"/>' },
                { value: 'smooth', content: '<p style="width:20px;height:20px;margin:5px;border-top-left-radius:100%;border-top:2px solid #fff;border-left:2px solid #fff;"/>' }
            ],

            labelPosition: [
                { value: 30, content: 'Close to source' },
                { value: 0.5, content: 'In the middle' },
                { value: -30, content: 'Close to target' },
            ],

            portMarkup: [{
                value: [{
                    tagName: 'rect',
                    selector: 'portBody',
                    attributes: {
                        'width': 20,
                        'height': 20,
                        'x': -10,
                        'y': -10
                    }
                }],
                content: 'Rectangle'
            }, {
                value: [{
                    tagName: 'circle',
                    selector: 'portBody',
                    attributes: {
                        'r': 10
                    }
                }],
                content: 'Circle'
            }, {
                value: [{
                    tagName: 'path',
                    selector: 'portBody',
                    attributes: {
                        'd': 'M -10 -10 10 -10 0 10 z'
                    }
                }],
                content: 'Triangle'
            }]
        };

        return <{ [index: string]: any }>{

            'app.Link': {
                inputs: {
                    attrs: {
                        line: {
                            strokeWidth: {
                                type: 'select-button-group',
                                options: options.strokeWidth,
                                group: 'connection',
                                label: 'Link thickness',
                                when: { ne: { 'attrs/line/stroke': 'transparent' }},
                                index: 4
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                group: 'connection',
                                label: 'Link style',
                                when: { ne: { 'attrs/line/stroke': 'transparent' }},
                                index: 5
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                group: 'connection',
                                label: 'Color',
                                index: 6
                            },
                            // sourceMarker: {
                            //     d: {
                            //         type: 'select-box',
                            //         options: options.arrowheadSize,
                            //         group: 'marker-source',
                            //         label: 'Source arrowhead',
                            //         index: 1
                            //     },
                            //     fill: {
                            //         type: 'color-palette',
                            //         options: options.colorPaletteReset,  // Aquí agregamos el color blanco por defecto
                            //         group: 'marker-source',
                            //         label: 'Color',
                            //         when: { ne: { 'attrs/line/sourceMarker/d': 'M 0 0 0 0' }},

                            //         index: 2
                            //     }
                            // },
                            sourceMarker: {
                              d: {
                                  type: 'select-box',
                                  options: options.arrowheadSize,  // Tus opciones de tamaño de flecha
                                  group: 'marker-source',
                                  label: 'Source arrowhead',
                                  index: 1
                              },
                              fill: {
                                  type: 'color-palette',
                                  options: [{ content: '#FFFFFF' }, { content: '#000000' }],  // Fondo blanco y negro
                                  group: 'marker-source',
                                  label: 'Fill color',
                                  // Aplicar solo cuando sea agregación o flecha grande
                                  when: {
                                      or: [
                                          { eq: { 'attrs/line/sourceMarker/d': 'M 0 -5 10 0 0 5 -10 0 z' }}, // Agregación
                                          { eq: { 'attrs/line/sourceMarker/d': 'M 0 -10 -15 0 0 10 z' }},
                                          { eq: { 'attrs/line/sourceMarker/d': 'M 0 -11 -15 0 0 11 z' }}   // Large   // Large
                                      ]
                                  },
                                  index: 2
                              },
                              stroke: {
                                  type: 'color-palette',
                                  options: [{ content: '#000000' }],  // Borde negro
                                  group: 'marker-source',
                                  label: 'Stroke color',
                                  // Aplicar solo cuando sea agregación o flecha grande
                                  when: {
                                      or: [
                                          { eq: { 'attrs/line/sourceMarker/d': 'M 0 -5 10 0 0 5 -10 0 z' }}, // Agregación
                                          { eq: { 'attrs/line/sourceMarker/d': 'M 0 -10 -15 0 0 10 z' }} ,
                                          { eq: { 'attrs/line/sourceMarker/d': 'M 0 -11 -15 0 0 11 z' }}   // Large  // Large
                                      ]
                                  },
                                  index: 3
                              }
                          },
                          targetMarker: {
                              d: {
                                  type: 'select-box',
                                  options: options.arrowheadSize,  // Tus opciones de tamaño de flecha
                                  group: 'marker-target',
                                  label: 'Target arrowhead',
                                  index: 1
                              },
                              fill: {
                                  type: 'color-palette',
                                  options: [{ content: '#FFFFFF' }, { content: '#000000' }],  // Fondo blanco y negro
                                  group: 'marker-target',
                                  label: 'Fill color',
                                  // Aplicar solo cuando sea agregación o flecha grande
                                  when: {
                                      or: [
                                          { eq: { 'attrs/line/targetMarker/d': 'M 0 -5 10 0 0 5 -10 0 z' }}, // Agregación
                                          { eq: { 'attrs/line/targetMarker/d': 'M 0 -10 -15 0 0 10 z' }}  , // Large
                                          { eq: { 'attrs/line/targetMarker/d': 'M 0 -11 -15 0 0 11 z' }}   // Large   // Large

                                      ]
                                  },
                                  index: 2
                              },
                              stroke: {
                                  type: 'color-palette',
                                  options: [{ content: '#000000' }],  // Borde negro
                                  group: 'marker-target',
                                  label: 'Stroke color',
                                  // Aplicar solo cuando sea agregación o flecha grande
                                  when: {
                                      or: [
                                          { eq: { 'attrs/line/targetMarker/d': 'M 0 -5 10 0 0 5 -10 0 z' }}, // Agregación
                                          { eq: { 'attrs/line/targetMarker/d': 'M 0 -10 -15 0 0 10 z' }} ,  // Large
                                          { eq: { 'attrs/line/targetMarker/d': 'M 0 -11 -15 0 0 11 z' }}   // Large   // Large

                                      ]
                                  },
                                  index: 3
                              }
                          }
                        }
                    },
                    router: {
                        name: {
                            type: 'select-button-group',
                            options: options.router,
                            group: 'connection',
                            label: 'Connection type',
                            index: 1
                        },
                        args: {
                            side: {
                                type: 'select-box',
                                options: options.side,
                                placeholder: 'Pick a side',
                                group: 'connection',
                                label: 'Anchors side',
                                when: { eq: { 'router/name': 'oneSide' }, otherwise: { unset: true }},
                                index: 2
                            }
                        }
                    },
                    connector: {
                        name: {
                            type: 'select-button-group',
                            options: options.connector,
                            group: 'connection',
                            label: 'Connection style',
                            index: 3
                        }
                    },
                    labels: {
                        type: 'list',
                        group: 'labels',
                        label: 'Labels',
                        attrs: {
                            label: {
                                'data-tooltip': 'Set (possibly multiple) labels for the link',
                                'data-tooltip-position': 'right',
                                'data-tooltip-position-selector': '.joint-inspector'
                            }
                        },
                        item: {
                            type: 'object',
                            properties: {
                                attrs: {
                                    text: {
                                        text: {
                                            type: 'content-editable',
                                            label: 'text',
                                            defaultValue: 'label',
                                            index: 1,
                                            attrs: {
                                                label: {
                                                    'data-tooltip': 'Set text of the label',
                                                    'data-tooltip-position': 'right',
                                                    'data-tooltip-position-selector': '.joint-inspector'
                                                }
                                            }
                                        },
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Text Color',
                                            index: 5
                                        }
                                    },
                                    rect: {
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Fill',
                                            index: 3
                                        },
                                        stroke: {
                                            type: 'color-palette',
                                            options: options.colorPaletteReset,
                                            label: 'Outline',
                                            index: 4
                                        }
                                    }
                                },
                                position: {
                                    type: 'select-box',
                                    options: options.labelPosition || [],
                                    defaultValue: 0.5,
                                    label: 'Position',
                                    placeholder: 'Custom',
                                    index: 2,
                                    attrs: {
                                        label: {
                                            'data-tooltip': 'Position the label relative to the source of the link',
                                            'data-tooltip-position': 'right',
                                            'data-tooltip-position-selector': '.joint-inspector'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                groups: {
                    connection: {
                        label: 'Connection',
                        index: 1
                    },
                    'marker-source': {
                        label: 'Source marker',
                        index: 2
                    },
                    'marker-target': {
                        label: 'Target marker',
                        index: 3
                    },
                    labels: {
                        label: 'Labels',
                        index: 4
                    }
                }
            },
            'standard.Rectangle': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        }
                    }
                },
                groups: {
                    presentation: {
                        label: 'Presentation',
                        index: 1
                    },
                    text: {
                        label: 'Text',
                        index: 2
                    }
                }
            },
            'standard.Ellipse': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/stroke-width': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        }
                    }
                },
                groups: {
                    presentation: {
                        label: 'Presentation',
                        index: 1
                    },
                    text: {
                        label: 'Text',
                        index: 2
                    }
                }
            },
            'standard.Polygon': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        }
                    }
                },
                groups: {
                    presentation: {
                        label: 'Presentation',
                        index: 1
                    },
                    text: {
                        label: 'Text',
                        index: 2
                    }
                }
            },
            'standard.Cylinder': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        },
                        top: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'top',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'top',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'top',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'top',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        }
                    }
                },
                groups: {
                    presentation: {
                        label: 'Presentation',
                        index: 1
                    },
                    top: {
                        label: 'Top',
                        index: 2
                    },
                    text: {
                        label: 'Text',
                        index: 3
                    }
                }
            },
            'standard.Image': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        image: {
                            xlinkHref: {
                                type: 'select-box',
                                options: options.imageIcons,
                                label: 'Image',
                                group: 'presentation',
                                index: 1
                            }
                        }
                    }
                },
                groups: {
                    presentation: {
                        label: 'Presentation',
                        index: 1
                    },
                    text: {
                        label: 'Text',
                        index: 2
                    }
                }
            },
            'standard.InscribedImage': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        image: {
                            xlinkHref: {
                                type: 'select-box',
                                options: options.imageIcons,
                                label: 'Image',
                                group: 'presentation',
                                index: 1
                            }
                        },
                        background: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 2
                            }
                        },
                        border: {
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 3
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 10,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/border/stroke': 'transparent' }},
                                index: 4
                            }
                        }
                    },
                },
                groups: {
                    presentation: {
                        label: 'Presentation',
                        index: 1
                    },
                    text: {
                        label: 'Text',
                        index: 2
                    }
                }
            },
            'standard.EmbeddedImage': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        },
                        image: {
                            xlinkHref: {
                                type: 'select-box',
                                options: options.imageIcons,
                                label: 'Image',
                                group: 'image',
                                index: 1
                            }
                        }
                    }
                },
                groups: {
                    image: {
                        label: 'image',
                        index: 1
                    },
                    presentation: {
                        label: 'Presentation',
                        index: 2
                    },
                    text: {
                        label: 'Text',
                        index: 3
                    }
                }
            },
            'standard.HeaderedRectangle': {
                inputs: {
                    attrs: {
                        bodyText: {
                            textWrap: {
                                text: {
                                    type: 'content-editable',
                                    label: 'Propiedades',
                                    group: 'text',
                                    index: 1
                                }
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/bodyText/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/bodyText/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/bodyText/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/boduText/text': '' }},
                                index: 5
                            }
                        },
                        headerText: {
                            text: {
                                type: 'content-editable',
                                label: 'Clase',
                                group: 'headerText',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'headerText',
                                when: { ne: { 'attrs/headerText/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'headerText',
                                when: { ne: { 'attrs/headerText/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'headerText',
                                when: { ne: { 'attrs/headerText/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'headerText',
                                when: { ne: { 'attrs/headerText/text': '' }},
                                index: 5
                            }
                        },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        },
                        header: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'header',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'header',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'header',
                                when: { ne: { 'attrs/header/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'header',
                                when: {
                                    and: [
                                        { ne: { 'attrs/header/stroke': 'transparent' }},
                                        { ne: { 'attrs/header/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        }
                    }
                },
                groups: {
                    presentation: {
                        label: 'Presentation',
                        index: 1
                    },
                    text: {
                        label: 'Text',
                        index: 2
                    },
                    header: {
                        label: 'Header',
                        index: 3
                    },
                    headerText: {
                        label: 'Header Text',
                        index: 4
                    }
                }
            },
            'app.RectangularModel': {
                inputs: {
                    attrs: {
                        label1: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        label2: {
                          text: {
                              type: 'content-editable',
                              label: 'Text',
                              group: 'text',
                              index: 1
                          },
                          fontSize: {
                              type: 'range',
                              min: 5,
                              max: 80,
                              unit: 'px',
                              label: 'Font size',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 2
                          },
                          fontFamily: {
                              type: 'select-box',
                              options: options.fontFamily,
                              label: 'Font family',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 3
                          },
                          fontWeight: {
                              type: 'select-box',
                              options: options.fontWeight,
                              label: 'Font thickness',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 4
                          },
                          fill: {
                              type: 'color-palette',
                              options: options.colorPalette,
                              label: 'Fill',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 5
                          }
                      },
                      label3: {
                        text: {
                            type: 'content-editable',
                            label: 'Text',
                            group: 'text',
                            index: 1
                        },
                        fontSize: {
                            type: 'range',
                            min: 5,
                            max: 80,
                            unit: 'px',
                            label: 'Font size',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 2
                        },
                        fontFamily: {
                            type: 'select-box',
                            options: options.fontFamily,
                            label: 'Font family',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 3
                        },
                        fontWeight: {
                            type: 'select-box',
                            options: options.fontWeight,
                            label: 'Font thickness',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 4
                        },
                        fill: {
                            type: 'color-palette',
                            options: options.colorPalette,
                            label: 'Fill',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 5
                        }
                    },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        }
                    },
                    ports: {
                        items: {
                            group: 'ports',
                            type: 'list',
                            label: 'Ports',
                            item: {
                                type: 'object',
                                properties: {
                                    group: {
                                        type: 'select-button-group',
                                        label: 'Group',
                                        defaultValue: 'out',
                                        options: [
                                            { value: 'in', content: 'IN' },
                                            { value: 'out', content: 'OUT' }
                                        ]
                                    },
                                    attrs: {
                                        portLabel: {
                                            text: { type: 'text', label: 'Label' }
                                        },
                                        portBody: {
                                            fill: {
                                                type: 'color-palette',
                                                options: options.colorPaletteReset,
                                                label: 'Override Group Fill',
                                                index: 1
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        groups: {
                            'in': {
                                attrs: {
                                    portBody: {
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPalette,
                                            label: 'Fill',
                                            when: { not: { equal: { inPorts: [] }}},
                                            group: 'inPorts',
                                            index: 1
                                        }
                                    }
                                },
                                position: {
                                    name: {
                                        type: 'select-box',
                                        options: options.side,
                                        label: 'Position',
                                        when: { not: { equal: { inPorts: [] }}},
                                        group: 'inPorts',
                                        index: 3
                                    }
                                },
                                label: {
                                    position: {
                                        type: 'select-box',
                                        options: options.portLabelPositionRectangle,
                                        label: 'Text Position',
                                        when: { not: { equal: { inPorts: [] }}},
                                        group: 'inPorts',
                                        index: 4
                                    }
                                },
                                markup: {
                                    type: 'select-box',
                                    options: options.portMarkup,
                                    label: 'Port Shape',
                                    group: 'inPorts',
                                    index: 5,
                                    overwrite: true
                                }
                            },
                            'out': {
                                attrs: {
                                    portBody: {
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPalette,
                                            label: 'Fill',
                                            when: { not: { equal: { outPorts: [] }}},
                                            group: 'outPorts',
                                            index: 2
                                        }
                                    }
                                },
                                position: {
                                    name: {
                                        type: 'select-box',
                                        options: options.side,
                                        label: 'Position',
                                        when: { not: { equal: { outPorts: [] }}},
                                        group: 'outPorts',
                                        index: 4
                                    }
                                },
                                label: {
                                    position: {
                                        type: 'select-box',
                                        options: options.portLabelPositionRectangle,
                                        label: 'Text Position',
                                        when: { not: { equal: { outPorts: [] }}},
                                        group: 'outPorts',
                                        index: 5
                                    }
                                },
                                markup: {
                                    type: 'select-box',
                                    options: options.portMarkup,
                                    label: 'Port Shape',
                                    group: 'outPorts',
                                    index: 6,
                                    overwrite: true
                                }
                            }
                        }
                    }
                },
                groups: {
                    inPorts: {
                        label: 'Input Ports Defaults',
                        index: 1
                    },
                    outPorts: {
                        label: 'Output Ports Defaults',
                        index: 2
                    },
                    ports: {
                        label: 'Ports',
                        index: 3
                    },
                    presentation: {
                        label: 'Presentation',
                        index: 4
                    },
                    text: {
                        label: 'Text',
                        index: 5
                    }
                }
            },
            'app.CircularModel': {
                inputs: {
                    attrs: {
                        label: {
                            text: {
                                type: 'content-editable',
                                label: 'Text',
                                group: 'text',
                                index: 1
                            },
                            fontSize: {
                                type: 'range',
                                min: 5,
                                max: 80,
                                unit: 'px',
                                label: 'Font size',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 2
                            },
                            fontFamily: {
                                type: 'select-box',
                                options: options.fontFamily,
                                label: 'Font family',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 3
                            },
                            fontWeight: {
                                type: 'select-box',
                                options: options.fontWeight,
                                label: 'Font thickness',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 4
                            },
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'text',
                                when: { ne: { 'attrs/label/text': '' }},
                                index: 5
                            }
                        },
                        body: {
                            fill: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Fill',
                                group: 'presentation',
                                index: 1
                            },
                            stroke: {
                                type: 'color-palette',
                                options: options.colorPalette,
                                label: 'Outline',
                                group: 'presentation',
                                index: 2
                            },
                            strokeWidth: {
                                type: 'range',
                                min: 0,
                                max: 30,
                                step: 1,
                                defaultValue: 1,
                                unit: 'px',
                                label: 'Outline thickness',
                                group: 'presentation',
                                when: { ne: { 'attrs/body/stroke': 'transparent' }},
                                index: 3
                            },
                            strokeDasharray: {
                                type: 'select-box',
                                options: options.strokeStyle,
                                label: 'Outline style',
                                group: 'presentation',
                                when: {
                                    and: [
                                        { ne: { 'attrs/body/stroke': 'transparent' }},
                                        { ne: { 'attrs/body/strokeWidth': 0 }}
                                    ]
                                },
                                index: 4
                            }
                        }
                    },
                    ports: {
                        items: {
                            group: 'ports',
                            type: 'list',
                            label: 'Ports',
                            item: {
                                type: 'object',
                                properties: {
                                    group: {
                                        type: 'select-button-group',
                                        label: 'Group',
                                        defaultValue: 'out',
                                        options: [
                                            { value: 'in', content: 'IN' },
                                            { value: 'out', content: 'OUT' }
                                        ]
                                    },
                                    attrs: {
                                        portLabel: {
                                            text: { type: 'text', label: 'Label' }
                                        },
                                        portBody: {
                                            fill: {
                                                type: 'color-palette',
                                                options: options.colorPaletteReset,
                                                label: 'Override Group Fill',
                                                index: 1
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        groups: {
                            'in': {
                                attrs: {
                                    portBody: {
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPalette,
                                            label: 'Fill',
                                            when: { not: { equal: { 'ports/items': [] }}},
                                            group: 'inPorts',
                                            index: 1
                                        }
                                    }
                                },
                                position: {
                                    args: {
                                        startAngle: {
                                            type: 'range',
                                            min: 0,
                                            max: 360,
                                            step: 1,
                                            defaultValue: 0,
                                            unit: '°',
                                            label: 'Position',
                                            when: { not: { equal: { 'ports/items': [] }}},
                                            group: 'inPorts',
                                            index: 3
                                        }
                                    }
                                },
                                label: {
                                    position: {
                                        name: {
                                            type: 'select-button-group',
                                            options: options.portLabelPositionEllipse,
                                            label: 'Text direction',
                                            when: { not: { equal: { 'ports/items': [] }}},
                                            group: 'inPorts',
                                            index: 4
                                        }
                                    }
                                },
                                markup: {
                                    type: 'select-box',
                                    options: options.portMarkup,
                                    label: 'Port Shape',
                                    group: 'inPorts',
                                    index: 5,
                                    overwrite: true
                                }
                            },
                            'out': {
                                attrs: {
                                    portBody: {
                                        fill: {
                                            type: 'color-palette',
                                            options: options.colorPalette,
                                            label: 'Fill',
                                            when: { not: { equal: { 'ports/items': [] }}},
                                            group: 'outPorts',
                                            index: 2
                                        }
                                    }
                                },
                                position: {
                                    args: {
                                        startAngle: {
                                            type: 'range',
                                            min: 0,
                                            max: 360,
                                            step: 1,
                                            defaultValue: 180,
                                            unit: '°',
                                            label: 'Position',
                                            when: { not: { equal: { 'ports/items': [] }}},
                                            group: 'outPorts',
                                            index: 4
                                        }
                                    }
                                },
                                label: {
                                    position: {
                                        name: {
                                            type: 'select-button-group',
                                            options: options.portLabelPositionEllipse,
                                            label: 'Text Position',
                                            when: { not: { equal: { 'ports/items': [] }}},
                                            group: 'outPorts',
                                            index: 5
                                        }
                                    }
                                },
                                markup: {
                                    type: 'select-box',
                                    options: options.portMarkup,
                                    label: 'Port Shape',
                                    group: 'outPorts',
                                    index: 6,
                                    overwrite: true
                                }
                            }
                        }
                    }
                },
                groups: {
                    inPorts: {
                        label: 'Input Ports Defaults',
                        index: 1
                    },
                    outPorts: {
                        label: 'Output Ports Defaults',
                        index: 2
                    },
                    ports: {
                        label: 'Ports',
                        index: 3
                    },
                    presentation: {
                        label: 'Presentation',
                        index: 4
                    },
                    text: {
                        label: 'Text',
                        index: 5
                    }
                }
            },
            'app.Clase': {
              inputs: {
                  attrs: {
                      nombreclase: {
                          text: {
                              type: 'content-editable',
                              label: 'Nombre de la clase',
                              group: 'text',
                              index: 1
                          },
                          fontSize: {
                              type: 'range',
                              min: 5,
                              max: 80,
                              unit: 'px',
                              label: 'Font size',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 2
                          },
                          fontFamily: {
                              type: 'select-box',
                              options: options.fontFamily,
                              label: 'Font family',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 3
                          },
                          fontWeight: {
                              type: 'select-box',
                              options: options.fontWeight,
                              label: 'Font thickness',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 4
                          },
                          fill: {
                              type: 'color-palette',
                              options: options.colorPalette,
                              label: 'Fill',
                              group: 'text',
                              when: { ne: { 'attrs/label/text': '' }},
                              index: 5
                          }
                      },
                      propiedades: {
                        text: {
                            type: 'content-editable',
                            label: 'Propiedades',
                            group: 'text',
                            index: 1
                        },
                        fontSize: {
                            type: 'range',
                            min: 5,
                            max: 80,
                            unit: 'px',
                            label: 'Font size',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 2
                        },
                        fontFamily: {
                            type: 'select-box',
                            options: options.fontFamily,
                            label: 'Font family',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 3
                        },
                        fontWeight: {
                            type: 'select-box',
                            options: options.fontWeight,
                            label: 'Font thickness',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 4
                        },
                        fill: {
                            type: 'color-palette',
                            options: options.colorPalette,
                            label: 'Fill',
                            group: 'text',
                            when: { ne: { 'attrs/label/text': '' }},
                            index: 5
                        }
                    },
                    metodos: {
                      text: {
                          type: 'content-editable',
                          label: 'Metodos',
                          group: 'text',
                          index: 1
                      },
                      fontSize: {
                          type: 'range',
                          min: 5,
                          max: 80,
                          unit: 'px',
                          label: 'Font size',
                          group: 'text',
                          when: { ne: { 'attrs/label/text': '' }},
                          index: 2
                      },
                      fontFamily: {
                          type: 'select-box',
                          options: options.fontFamily,
                          label: 'Font family',
                          group: 'text',
                          when: { ne: { 'attrs/label/text': '' }},
                          index: 3
                      },
                      fontWeight: {
                          type: 'select-box',
                          options: options.fontWeight,
                          label: 'Font thickness',
                          group: 'text',
                          when: { ne: { 'attrs/label/text': '' }},
                          index: 4
                      },
                      fill: {
                          type: 'color-palette',
                          options: options.colorPalette,
                          label: 'Fill',
                          group: 'text',
                          when: { ne: { 'attrs/label/text': '' }},
                          index: 5
                      }
                  },
                      body: {
                          fill: {
                              type: 'color-palette',
                              options: options.colorPalette,
                              label: 'Fill',
                              group: 'presentation',
                              index: 1
                          },
                          stroke: {
                              type: 'color-palette',
                              options: options.colorPalette,
                              label: 'Outline',
                              group: 'presentation',
                              index: 2
                          },
                          strokeWidth: {
                              type: 'range',
                              min: 0,
                              max: 30,
                              step: 1,
                              defaultValue: 1,
                              unit: 'px',
                              label: 'Outline thickness',
                              group: 'presentation',
                              when: { ne: { 'attrs/body/stroke': 'transparent' }},
                              index: 3
                          },
                          strokeDasharray: {
                              type: 'select-box',
                              options: options.strokeStyle,
                              label: 'Outline style',
                              group: 'presentation',
                              when: {
                                  and: [
                                      { ne: { 'attrs/body/stroke': 'transparent' }},
                                      { ne: { 'attrs/body/strokeWidth': 0 }}
                                  ]
                              },
                              index: 4
                          }
                      }
                  },
                  ports: {
                      items: {
                          group: 'ports',
                          type: 'list',
                          label: 'Ports',
                          item: {
                              type: 'object',
                              properties: {
                                  group: {
                                      type: 'select-button-group',
                                      label: 'Group',
                                      defaultValue: 'out',
                                      options: [
                                          { value: 'in', content: 'IN' },
                                          { value: 'out', content: 'OUT' }
                                      ]
                                  },
                                  attrs: {
                                      portLabel: {
                                          text: { type: 'text', label: 'Label' }
                                      },
                                      portBody: {
                                          fill: {
                                              type: 'color-palette',
                                              options: options.colorPaletteReset,
                                              label: 'Override Group Fill',
                                              index: 1
                                          }
                                      }
                                  }
                              }
                          }
                      },
                      groups: {
                          'in': {
                              attrs: {
                                  portBody: {
                                      fill: {
                                          type: 'color-palette',
                                          options: options.colorPalette,
                                          label: 'Fill',
                                          when: { not: { equal: { inPorts: [] }}},
                                          group: 'inPorts',
                                          index: 1
                                      }
                                  }
                              },
                              position: {
                                  name: {
                                      type: 'select-box',
                                      options: options.side,
                                      label: 'Position',
                                      when: { not: { equal: { inPorts: [] }}},
                                      group: 'inPorts',
                                      index: 3
                                  }
                              },
                              label: {
                                  position: {
                                      type: 'select-box',
                                      options: options.portLabelPositionRectangle,
                                      label: 'Text Position',
                                      when: { not: { equal: { inPorts: [] }}},
                                      group: 'inPorts',
                                      index: 4
                                  }
                              },
                              markup: {
                                  type: 'select-box',
                                  options: options.portMarkup,
                                  label: 'Port Shape',
                                  group: 'inPorts',
                                  index: 5,
                                  overwrite: true
                              }
                          },
                          'out': {
                              attrs: {
                                  portBody: {
                                      fill: {
                                          type: 'color-palette',
                                          options: options.colorPalette,
                                          label: 'Fill',
                                          when: { not: { equal: { outPorts: [] }}},
                                          group: 'outPorts',
                                          index: 2
                                      }
                                  }
                              },
                              position: {
                                  name: {
                                      type: 'select-box',
                                      options: options.side,
                                      label: 'Position',
                                      when: { not: { equal: { outPorts: [] }}},
                                      group: 'outPorts',
                                      index: 4
                                  }
                              },
                              label: {
                                  position: {
                                      type: 'select-box',
                                      options: options.portLabelPositionRectangle,
                                      label: 'Text Position',
                                      when: { not: { equal: { outPorts: [] }}},
                                      group: 'outPorts',
                                      index: 5
                                  }
                              },
                              markup: {
                                  type: 'select-box',
                                  options: options.portMarkup,
                                  label: 'Port Shape',
                                  group: 'outPorts',
                                  index: 6,
                                  overwrite: true
                              }
                          }
                      }
                  }
              },
              groups: {
                  inPorts: {
                      label: 'Input Ports Defaults',
                      index: 1
                  },
                  outPorts: {
                      label: 'Output Ports Defaults',
                      index: 2
                  },
                  ports: {
                      label: 'Ports',
                      index: 3
                  },
                  presentation: {
                      label: 'Presentation',
                      index: 4
                  },
                  text: {
                      label: 'Text',
                      index: 5
                  }
              }
          },
        };
    }
}


