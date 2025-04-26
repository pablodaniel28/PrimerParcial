/*! JointJS+ v4.0.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2024 client IO

 2024-09-14


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import * as joint from '@joint/plus';

const cache = new Map();
export namespace app {

    export class CircularModel extends joint.shapes.standard.Ellipse {

        portLabelMarkup = [{
            tagName: 'text',
            selector: 'portLabel'
        }];

        override defaults() {

            return joint.util.defaultsDeep({
                type: 'app.CircularModel',
                attrs: {
                    root: {
                        magnet: false
                    }
                },
                ports: {
                    groups: {
                        'in': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 0,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        },
                        'out': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 180,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        }
                    }
                }
            }, joint.shapes.standard.Ellipse.prototype.defaults);
        }
    }

    export class RectangularModel extends joint.shapes.standard.Rectangle {

      portLabelMarkup = [{
          tagName: 'text',
          selector: 'portLabel'
      }];

      override defaults() {
          return joint.util.defaultsDeep({
              type: 'app.RectangularModel',
              attrs: {
                root: {
                  dataTooltipPosition: 'left',
                  dataTooltipPositionSelector: '.joint-stencil'
              },
              body: {
                fill: 'transparent',
                stroke: '#31d0c6',
                strokeWidth: 2,
                strokeDasharray: '0'
            },  header: {
                            stroke: '#31d0c6',
                            fill: '#31d0c6',
                            strokeWidth: 2,
                            strokeDasharray: '0',
                            height: 20
                        },
                  label1: {
                      text: 'First Row',
                      refY: '20%',
                      refX: '50%',
                      textAnchor: 'middle',
                      fontSize: 12,
                      fill: '#000000'
                  },
                  label2: {
                      text: 'Second Row',
                      refY: '50%',
                      refX: '50%',
                      textAnchor: 'middle',
                      fontSize: 12,
                      fill: '#000000'
                  },
                  label3: {
                      text: 'Third Row',
                      refY: '80%',
                      refX: '50%',
                      textAnchor: 'middle',
                      fontSize: 12,
                      fill: '#000000'
                  },
                  line1: {
                      stroke: '#000000',
                      strokeWidth: 1,
                      refX: 0,
                      refY: '33%',
                      x2: '10%',
                  },
                  line2: {
                      stroke: '#000000',
                      strokeWidth: 1,
                      refX: 0,
                      refY: '66%',
                      x2: '10%',
                  }
              },
              markup: [{
                  tagName: 'rect',
                  selector: 'body'
              }, {
                  tagName: 'text',
                  selector: 'label1'
              }, {
                  tagName: 'text',
                  selector: 'label2'
              }, {
                  tagName: 'text',
                  selector: 'label3'
              }, {
                  tagName: 'line',
                  selector: 'line1'
              }, {
                  tagName: 'line',
                  selector: 'line2'
              }]
          }, joint.shapes.standard.Rectangle.prototype.defaults);
      }
  }
  export class RecDemo1 extends joint.shapes.standard.Rectangle {

    portLabelMarkup = [{
        tagName: 'text',
        selector: 'portLabel'
    }];

    override defaults() {
        return joint.util.defaultsDeep({
          type: 'app.RecDemo',
    attrs: {
        root: {
            cursor: 'move'
        },
        body: {
            width: 'calc(w)',
            height: 'calc(h)',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF'
        },
        header: {
            width: 'calc(w)',
            height: 30,
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF'
        },
        headerText: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            x: 'calc(w/2)',
            y: 15,
            fontSize: 16,
            fill: '#333333'
        },
        bodyText: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            x: 'calc(w/2)',
            y: 'calc(h/2+15)',
            fontSize: 14,
            fill: '#333333'
        }
        ,
                line2: {
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    refX: 0,
                    refY: '66%',
                    x2: 'calc(w)',  // Línea contenida en el ancho de la figura
                    refWidth: '100%', // Ajuste para que la línea siga el ancho del cuerpo
                    y2: 0 // Mantiene la línea horizontal
                }
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body'
    }, {
        tagName: 'rect',
        selector: 'header'
    }, {
        tagName: 'text',
        selector: 'headerText'
    }, {
        tagName: 'text',
        selector: 'bodyText'
    }
  ]
});}}

  export class Clase extends joint.shapes.standard.Rectangle {

    portLabelMarkup = [{
        tagName: 'text',
        selector: 'portLabel'
    }];

    override defaults() {
        return joint.util.defaultsDeep({
            type: 'app.Clase',
            attrs: {
              root: {
                cursor: 'move'
            },
                body: {
                  width: 'calc(w)',
                  height: 'calc(h)',
                  strokeWidth: 2,
                  stroke: '#000000',
                  fill: '#FFFFFF'
              },
              header: {
                  width: 'calc(w)',
                  height: 30,
                  strokeWidth: 2,
                  stroke: '#000000',
                  fill: '#FFFFFF'
              },
              nombreclase: {
                  textVerticalAnchor: 'middle',
                  textAnchor: 'middle',
                  x: 'calc(w/2)',
                  y: 15,
                  fontSize: 16,
                  fill: '#333333'
              },

                propiedades: {
                  refY: 35,
                 refX: '50%',
                    textAnchor: 'middle',
                    fontSize: 12,
                    fill: '#000000'
                },
                metodos: {
                    refY: '77%',
                    refX: '50%',
                    textAnchor: 'middle',
                    fontSize: 12,
                    fill: '#000000'
                },

                line2: {
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    refX: 0,
                    //refY: '57%',
                    refY: '75%',
                    x2: 'calc(w)',  // Línea contenida en el ancho de la figura
                    refWidth: '100%', // Ajuste para que la línea siga el ancho del cuerpo
                    y2: 0 // Mantiene la línea horizontal
                }
            },
            markup: [{
                tagName: 'rect',
                selector: 'body'
            },
            {
              tagName: 'rect',
              selector: 'header'
          },{
                tagName: 'text',
                selector: 'nombreclase'
            }, {
                tagName: 'text',
                selector: 'propiedades'
            }, {
                tagName: 'text',
                selector: 'metodos'
            }, {
                tagName: 'line',
                selector: 'line1'
            }, {
                tagName: 'line',
                selector: 'line2'
            }]
        }, joint.shapes.standard.Rectangle.prototype.defaults);
    }
}

//   export class Demo extends joint.shapes.standard.Rectangle {

//     portLabelMarkup = [{
//         tagName: 'text',
//         selector: 'portLabel'
//     }];

//     override defaults() {
//         return joint.util.defaultsDeep({
//             type: 'app.Demo',
//             attrs: {
//               root: {
//                  cursor: 'move',
//                 dataTooltipPosition: 'left',
//                 dataTooltipPositionSelector: '.joint-stencil'
//             },
//             body: {
//               width: 'calc(w)',
//             height: 'calc(h)',
//             strokeWidth: 2,
//             stroke: '#000000',
//             fill: '#FFFFFF'
//           },  header: {
//             width: 'calc(w)',
//             height: 30,
//             strokeWidth: 2,
//             stroke: '#000000',
//             fill: '#FFFFFF'
//                       },
//                 label1: {
//                   text: 'First Row',
//                   refY: '20%',
//                   refX: '50%',
//                   textAnchor: 'middle',
//                   fontSize: 12,
//                   fill: '#000000'
//                 },
//                 label2: {
//                     text: 'Second Row',
//                     refY: '50%',
//                     refX: '50%',
//                     textAnchor: 'middle',
//                     fontSize: 12,
//                     fill: '#000000'
//                 },
//                 label3: {
//                     text: 'Third Row',
//                     refY: '80%',
//                     refX: '50%',
//                     textAnchor: 'middle',
//                     fontSize: 12,
//                     fill: '#000000'
//                 },

//                 line2: {

//                   fontSize: 14,
//                   fill: '#333333',
//                     stroke: '#000000',
//                     strokeWidth: 1,
//                     refX: 0,
//                     refY: '66%',
//                     x2: '10%',
//                 }
//             },
//             markup: [{
//                 tagName: 'rect',
//                 selector: 'body'
//             },{
//               tagName: 'rect',
//               selector: 'header'
//           },  {
//                 tagName: 'text',
//                 selector: 'label1'
//             }, {
//                 tagName: 'text',
//                 selector: 'label2'
//             }, {
//                 tagName: 'text',
//                 selector: 'label3'
//             }, {
//                 tagName: 'line',
//                 selector: 'line1'
//             }, {
//                 tagName: 'line',
//                 selector: 'line2'
//             }]
//         }, joint.shapes.standard.Rectangle.prototype.defaults);
//     }
// }


    export class Link extends joint.shapes.standard.Link {

        override defaultLabel = {
            attrs: {
                rect: {
                    fill: '#ffffff',
                    stroke: '#8f8f8f',
                    strokeWidth: 1,
                    width: 'calc(w + 10)',
                    height: 'calc(h + 10)',
                    x: 'calc(x - 5)',
                    y: 'calc(y - 5)'
                }
            }
        };

        private getDataWidthCached = function(d: string){
            if (cache.has(d)) {
                return cache.get(d);
            } else {
                const bbox = (new joint.g.Path(d)).bbox();
                cache.set(d, bbox ? bbox.width : 0);
                return cache.get(d);
            }
        };

        static connectionPoint(line: any, view: any, magnet: any, _opt: any, type: any, linkView: any): joint.g.Point {
            const link = linkView.model;
            const markerWidth = (link.get('type') === 'app.Link') ? link.getMarkerWidth(type) : 0;
            const opt: any = { offset: markerWidth, stroke: true };
            // connection point for UML shapes lies on the root group containing all the shapes components
            const modelType = view.model.get('type');
            // taking the border stroke-width into account
            if (modelType === 'standard.InscribedImage') { opt.selector = 'border'; }
            return joint.connectionPoints.boundary.call(this, line, view, magnet, opt, type, linkView);
        }

        override defaults() {
            return joint.util.defaultsDeep({
                type: 'app.Link',
                router: {
                    name: 'normal'
                },
                connector: {
                    name: 'rounded'
                },
                labels: [],
                attrs: {
                    line: {
                        stroke: '#8f8f8f',
                        strokeDasharray: '0',
                        strokeWidth: 2,
                        fill: 'none',
                        sourceMarker: {
                          type: 'path',
                          d: 'M 0 0 0 0',  // Puedes cambiar el valor 'd' si necesitas una forma específica
                          fill: '#FFFFFF',  // Fondo blanco
                          stroke: '#000000', // Borde negro
                          strokeWidth: 2     // Grosor del borde
                      },
                      targetMarker: {
                          type: 'path',
                          d: 'M 0 0 0 0',  // Puedes cambiar el valor 'd' si necesitas una forma específica
                          fill: '#FFFFFF',  // Fondo blanco
                          stroke: '#000000', // Borde negro
                          strokeWidth: 2     // Grosor del borde
                      }

                    }
                }
            }, joint.shapes.standard.Link.prototype.defaults);
        }

        getMarkerWidth(type: any) {
            const d = (type === 'source') ? this.attr('line/sourceMarker/d') : this.attr('line/targetMarker/d');
            return this.getDataWidth(d);
        }

        getDataWidth(d: any) {
            return this.getDataWidthCached(d);
        }
    }
}

export const NavigatorElementView = joint.dia.ElementView.extend({

    body: null,

    markup: [{
        tagName: 'rect',
        selector: 'body',
        attributes: {
            'fill': '#31d0c6'
        }
    }],

    initFlag: ['RENDER', 'UPDATE', 'TRANSFORM'],

    presentationAttributes: {
        size: ['UPDATE'],
        position: ['TRANSFORM'],
        angle: ['TRANSFORM']
    },

    confirmUpdate: function(flags: number) {

        if (this.hasFlag(flags, 'RENDER')) { this.render(); }
        if (this.hasFlag(flags, 'UPDATE')) { this.update(); }
        if (this.hasFlag(flags, 'TRANSFORM')) { this.updateTransformation(); }
    },

    render: function() {
        const { fragment, selectors: { body }} = joint.util.parseDOMJSON(this.markup);
        this.body = body;
        this.el.appendChild(fragment);
    },

    update: function() {
        const { model, body } = this;
        const { width, height } = model.size();
        body.setAttribute('width', width);
        body.setAttribute('height', height);
    }
});


export const NavigatorLinkView = joint.dia.LinkView.extend({

    defaultTheme: null,

    initialize: function(options: any) {
        joint.mvc.View.prototype.initialize.call(this, options);
    },

    onMount: joint.util.noop,

    render: joint.util.noop,

    update: joint.util.noop
});

// re-export build-in shapes from rappid
export const standard = joint.shapes.standard;

