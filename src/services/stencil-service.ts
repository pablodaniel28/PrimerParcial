/*! JointJS+ v4.0.1 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2024 client IO

 2024-09-14


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at https://www.jointjs.com/license
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import { ui, dia } from '@joint/plus';
import * as appShapes from '../shapes/app-shapes';

export class StencilService {

    stencil: ui.Stencil;

    create(paperScroller: ui.PaperScroller, snaplines: ui.Snaplines) {

        this.stencil = new ui.Stencil({
            paper: paperScroller,
            snaplines: snaplines,
            width: 240,
            groups: this.getStencilGroups(),
            dropAnimation: true,
            groupsToggleButtons: true,
            paperOptions: function() {
                return {
                    model: new dia.Graph({}, {
                    cellNamespace: appShapes,

                    }),
                    cellViewNamespace: appShapes
                };
            },
            search: {
                '*': ['type', 'attrs/root/dataTooltip', 'attrs/label/text']
            },
            layout: {
                columns: 1,
                marginX: 10,
                marginY: 1,
                columnGap: 10,
                columnWidth: 200,
                rowHeight: 200,
            },
            // Remove tooltip definition from clone
            dragStartClone: (cell: dia.Cell) => cell.clone().removeAttr('root/dataTooltip')
             // Remove tooltip definition from clone

        });


    }

    setShapes() {
        this.stencil.load(this.getStencilShapes());
    }

    getStencilGroups() {
        return <{ [key: string]: ui.Stencil.Group }>{
            standard: { index: 1, label: 'Figuras' }
        };
    }

    getStencilShapes() {
        return {
            standard: [
                // {
                //     type: 'standard.HeaderedRectangle',
                //     size: { width: 90, height: 54 },
                //     attrs: {
                //         root: {
                //             dataTooltip: 'Rectangle with header',
                //             dataTooltipPosition: 'left',
                //             dataTooltipPositionSelector: '.joint-stencil'
                //         },
                //         body: {
                //             fill: 'transparent',
                //             stroke: '#31d0c6',
                //             strokeWidth: 2,
                //             strokeDasharray: '0'
                //         },
                //         header: {
                //             stroke: '#31d0c6',
                //             fill: '#31d0c6',
                //             strokeWidth: 2,
                //             strokeDasharray: '0',
                //             height: 20
                //         },
                //         bodyText: {
                //             textWrap: {
                //                 text: '',
                //                 width: -10,
                //                 height: -20,
                //                 ellipsis: true
                //             },

                //             fill: '#c6c7e2',
                //             fontFamily: 'Roboto Condensed',
                //             fontWeight: 'Normal',
                //             fontSize: 11,
                //             strokeWidth: 0,
                //             y: 'calc(h/2 + 10)',
                //         },

                //         headerText: {
                //             text: 'header',
                //             fill: '#f6f6f6',
                //             fontFamily: 'Roboto Condensed',
                //             fontWeight: 'Normal',
                //             fontSize: 11,
                //             strokeWidth: 0,
                //             y: 10
                //         }
                //     } ,

                // },


              {
                type: 'app.Clase', // Aquí va la figura personalizada
                size: { width: 130, height: 150 },
                attrs: {
                  root: {
                    dataTooltip: 'Rectangle with header',
                    dataTooltipPosition: 'left',
                    dataTooltipPositionSelector: '.joint-stencil'
                },
                  body: {
                    fill: 'transparent',
                    stroke: '#31d0c6',
                    strokeWidth: 2,
                    strokeDasharray: '0'
                },
                header: {
                  stroke: '#31d0c6',
                  fill: '#31d0c6',
                  strokeWidth: 2,
                  strokeDasharray: '0',
                  height: 20
                },
                    nombreclase: { text: 'Class' ,
                            fill: '#ffff',
                            fontFamily: 'Roboto Condensed',
                            fontWeight: 'Normal',
                            fontSize: 11,
                            strokeWidth: 0,
                            y: 10
                    },
                    porpiedades: { text:''},
                    metodos: { text: '' }
                }
            },
            ]


        };
    }

}

