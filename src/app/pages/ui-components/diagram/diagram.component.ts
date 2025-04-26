import { Component, ElementRef, OnInit } from '@angular/core';
import { StencilService } from 'src/services/stencil-service';
import { ToolbarService } from 'src/services/toolbar-service';
import { InspectorService } from 'src/services/inspector-service';
import { HaloService } from 'src/services/halo-service';
import { KeyboardService } from 'src/services/keyboard-service';
import RappidService from 'src/services/kitchensink-service';
import { ThemePicker } from 'src/components/theme-picker';
import { io } from 'socket.io-client';
import { ActivatedRoute, Router } from '@angular/router';
import * as joint from '@joint/plus/joint-plus';
import { app } from 'src/shapes/app-shapes';  // Import your app-shapes
import { OpenAIService } from 'src/app/services/chatgpt.service';  // Importa tu servicio
import { HttpErrorResponse } from '@angular/common/http';  // Importar para el manejo de errores HTTP
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './diagram.component.html'
})
export class DiagramComponent implements OnInit {


  public apiResponse: string = ''; // To store the ChatGPT response

  private rappid: RappidService;
  private socket: any;
  public sessionLink: string | null = null;
  private sessionId: string | null = null;
  private graphInitialized = false;
  private inspectorService: InspectorService;
  private selection: joint.ui.Selection;
  private selectedElements: joint.dia.Element[] = [];  // Store selected elements
  userMessage: string = '';  // Para almacenar el mensaje del usuario
  chatGPTResponse: string = '';  // Para almacenar la respuesta de ChatGPT


  private ZIP_STRUCTURE = {
    controller: 'Back_End_Spring/src/main/java/com/phegondev/usersmanagementsystem/controller/',
    entity: 'Back_End_Spring/src/main/java/com/phegondev/usersmanagementsystem/entity/',
    repository: 'Back_End_Spring/src/main/java/com/phegondev/usersmanagementsystem/repository/',
    service: 'Back_End_Spring/src/main/java/com/phegondev/usersmanagementsystem/service/',
  };

  RepositoryTemplate: string = `
  package com.phegondev.usersmanagementsystem.repository;

  import com.phegondev.usersmanagementsystem.entity.\${ENTITY};
  import org.springframework.data.jpa.repository.JpaRepository;
  import org.springframework.stereotype.Repository;

  @Repository
  public interface \${ENTITY}Repository extends JpaRepository<\${ENTITY}, Long> {
  }
  `;


  ServiceInterfaceTemplate: string = `
  package com.phegondev.usersmanagementsystem.service;

  import com.phegondev.usersmanagementsystem.entity.\${ENTITY};
  import java.util.List;
  import java.util.Optional;

  public interface \${ENTITY}Service {
      \${ENTITY} save\${ENTITY}(\${ENTITY} \${entityLower});
      List<\${ENTITY}> getAll\${ENTITY}s();
      Optional<\${ENTITY}> get\${ENTITY}ById(Long id);
      \${ENTITY} update\${ENTITY}(Long id, \${ENTITY} \${entityLower}Details);
      void delete\${ENTITY}(Long id);
  }
  `;
  ServiceImplTemplate: string = `
  package com.phegondev.usersmanagementsystem.service.impl;

  import com.phegondev.usersmanagementsystem.entity.\${ENTITY};
  import com.phegondev.usersmanagementsystem.repository.\${ENTITY}Repository;
  import com.phegondev.usersmanagementsystem.service.\${ENTITY}Service;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.stereotype.Service;

  import java.util.List;
  import java.util.Optional;

  @Service
  public class \${ENTITY}ServiceImpl implements \${ENTITY}Service {

      @Autowired
      private \${ENTITY}Repository \${entityLower}Repository;

      @Override
      public \${ENTITY} save\${ENTITY}(\${ENTITY} \${entityLower}) {
          return \${entityLower}Repository.save(\${entityLower});
      }

      @Override
      public List<\${ENTITY}> getAll\${ENTITY}s() {
          return \${entityLower}Repository.findAll();
      }

      @Override
      public Optional<\${ENTITY}> get\${ENTITY}ById(Long id) {
          return \${entityLower}Repository.findById(id);
      }

      @Override
      public \${ENTITY} update\${ENTITY}(Long id, \${ENTITY} \${entityLower}Details) {
          \${ENTITY} \${entityLower} = \${entityLower}Repository.findById(id)
                  .orElseThrow(() -> new RuntimeException("\${ENTITY} not found for id :: " + id));
          // Actualiza los campos necesarios
          return \${entityLower}Repository.save(\${entityLower});
      }

      @Override
      public void delete\${ENTITY}(Long id) {
          \${ENTITY} \${entityLower} = \${entityLower}Repository.findById(id)
                  .orElseThrow(() -> new RuntimeException("\${ENTITY} not found for id :: " + id));
          \${entityLower}Repository.delete(\${entityLower});
      }
  }
  `;
  ControllerTemplate: string = `
  package com.phegondev.usersmanagementsystem.controller;

  import com.phegondev.usersmanagementsystem.entity.\${ENTITY};
  import com.phegondev.usersmanagementsystem.service.\${ENTITY}Service;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.http.ResponseEntity;
  import org.springframework.web.bind.annotation.*;
  import java.util.List;

  @RestController
  @RequestMapping("/api/\${entityLower}s")
  public class \${ENTITY}Controller {

      @Autowired
      private \${ENTITY}Service \${entityLower}Service;

      @PostMapping
      public \${ENTITY} create\${ENTITY}(@RequestBody \${ENTITY} \${entityLower}) {
          return \${entityLower}Service.save\${ENTITY}(\${entityLower});
      }

      @GetMapping
      public List<\${ENTITY}> getAll\${ENTITY}s() {
          return \${entityLower}Service.getAll\${ENTITY}s();
      }

      @GetMapping("/{id}")
      public ResponseEntity<\${ENTITY}> get\${ENTITY}ById(@PathVariable Long id) {
          \${ENTITY} \${entityLower} = \${entityLower}Service.get\${ENTITY}ById(id)
                  .orElseThrow(() -> new RuntimeException("\${ENTITY} not found for id :: " + id));
          return ResponseEntity.ok().body(\${entityLower});
      }

      @PutMapping("/{id}")
      public \${ENTITY} update\${ENTITY}(@PathVariable Long id, @RequestBody \${ENTITY} \${entityLower}Details) {
          return \${entityLower}Service.update\${ENTITY}(id, \${entityLower}Details);
      }

      @DeleteMapping("/{id}")
      public ResponseEntity<Void> delete\${ENTITY}(@PathVariable Long id) {
          \${entityLower}Service.delete\${ENTITY}(id);
          return ResponseEntity.noContent().build();
      }
  }
  `;
  // Función para reemplazar los marcadores de posición en las plantillas
  generateContent(template: string, entityName: string): string {
    const entityLower = entityName.charAt(0).toLowerCase() + entityName.slice(1);
    return template
      .replace(/\${ENTITY}/g, entityName)
      .replace(/\${entityLower}/g, entityLower);
  }


  //-----------------------------
  //-----------------------------
  //-----------------------------
  //-----------------------------
  //-----------------------------
  //-----------------------------
  //-----------------------------
  // Función para generar y descargar los archivos CRUD
  // Función para generar y agregar los archivos CRUD al ZIP
  // Función para generar y agregar los archivos CRUD al ZIP dentro de Back_End_Spring
  generateCRUDFiles(zip: JSZip, entityName: string): void {
    const baseFolder = 'Back_End_Spring/src/main/java/com/phegondev/usersmanagementsystem/';

    // Generar y agregar Repositorio
    const repositoryContent = this.generateContent(this.RepositoryTemplate, entityName);
    zip.file(`${baseFolder}repository/${entityName}Repository.java`, repositoryContent);

    // Generar y agregar Servicio (Interfaz)
    const serviceInterfaceContent = this.generateContent(this.ServiceInterfaceTemplate, entityName);
    zip.file(`${baseFolder}service/${entityName}Service.java`, serviceInterfaceContent);

    // Generar y agregar Controlador
    const controllerContent = this.generateContent(this.ControllerTemplate, entityName);
    zip.file(`${baseFolder}controller/${entityName}Controller.java`, controllerContent);
  }




  // Función para generar y descargar CRUD para todas las entidades
  generateAllCRUDs(classDefinitions: string[]): void {
    // Crear una nueva instancia de JSZip
    const zip = new JSZip();

    classDefinitions.forEach((classDef, index) => {
      const classNameMatch = classDef.match(/public class\s+(\w+)/);
      const className = classNameMatch ? classNameMatch[1] : `Entity${index}`;

      // Pasa la instancia del zip y el nombre de la clase a generateCRUDFiles
      this.generateCRUDFiles(zip, className);
    });

    // Generar el archivo ZIP y descargarlo al final
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'Back_End_Spring_CRUDs.zip');
    });
  }

  // Función para generar y descargar las entidades y capas CRUD
  // Función para generar y descargar las entidades y capas CRUD
  // Función para generar y agregar las entidades y los archivos CRUD al ZIP
  // Función para generar y agregar las entidades y los archivos CRUD al ZIP sin eliminar archivos existentes
  async generateEntityFiles(content: string) {
    // Expresión regular para encontrar todo el bloque desde "package" hasta el cierre de la clase "}"
    const classPattern = /package[\s\S]*?\n}\s*$/gm;
    const classDefinitions = content.match(classPattern);

    if (classDefinitions && classDefinitions.length > 0) {
      // Crear una instancia de JSZip
      const zip = new JSZip();

      // Aquí mantendremos la estructura de la carpeta Back_End_Spring
      const baseFolder = 'Back_End_Spring/src/main/java/com/phegondev/usersmanagementsystem/';

      classDefinitions.forEach((classDef, index) => {
        // Extraer el nombre de la clase para usarlo como nombre de archivo
        const classNameMatch = classDef.match(/public class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : `Entity${index}`;

        // Agregar el archivo de la entidad al ZIP dentro de la carpeta de entidad
        const entityContent = classDef;
        zip.file(`${baseFolder}entity/${className}.java`, entityContent);

        // Generar y agregar los archivos CRUD (Repositorio, Servicio y Controlador) al ZIP dentro de las carpetas respectivas
        this.generateCRUDFiles(zip, className);
      });

      // Generar el archivo ZIP y descargarlo
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'Back_End_Spring_CRUDs.zip');
      });
    } else {
      console.error('No se encontraron clases en el contenido proporcionado.');
    }
  }





  constructor(private openAIService: OpenAIService, private element: ElementRef, private route: ActivatedRoute, private router: Router  // Inject the ChatGPT service
  ) { }

  ngOnInit() {
    this.socket = io('http://localhost:3000');    // Reemplaza con tu URL de WebSocket    this.inspectorService = new InspectorService();
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['sessionId'];
      if (this.sessionId) {
        this.joinSession(this.sessionId);
      }
    });

    this.rappid = new RappidService(
      this.element.nativeElement,
      new StencilService(),
      new ToolbarService(),
      new InspectorService(),
      new HaloService(),
      new KeyboardService()
    );
    this.rappid.startRappid();

    const themePicker = new ThemePicker({ mainView: this.rappid });
    document.body.appendChild(themePicker.render().el);

    this.rappid.paper.on('element:pointerdown', (elementView) => {
      this.selectElement(elementView.model);
    });

    // Escuchar cuando se añaden nuevas figuras al gráfico
    this.rappid.graph.on('add', () => {
      if (this.graphInitialized) {
        const graphJSON = this.rappid.graph.toJSON();
        this.socket.emit('updateGraph', { sessionId: this.sessionId, cells: graphJSON });
      }
    });

    this.socket.on('updateGraph', (data: any) => {
      if (data.sessionId === this.sessionId) {
        this.graphInitialized = true;
        this.rappid.graph.fromJSON(data.cells);
      }
    });

    this.rappid.graph.on('remove', () => {
      if (this.graphInitialized) {
        const graphJSON = this.rappid.graph.toJSON();
        this.socket.emit('updateGraph', { sessionId: this.sessionId, cells: graphJSON });
      }
    });

    // Escuchar cuando se realizan cambios en el gráfico
    this.rappid.graph.on('change', () => {
      if (this.graphInitialized) {
        const graphJSON = this.rappid.graph.toJSON();
        this.socket.emit('updateGraph', { sessionId: this.sessionId, cells: graphJSON });
      }
    });
    // Escuchar la inicialización del gráfico desde el servidor
    this.socket.on('initialize', (data: any) => {
      this.graphInitialized = true;
      this.rappid.graph.fromJSON(data.cells); // Cargar el gráfico de la sesión
    });

    // Selección activa para manejar figuras seleccionadas
    this.selection = new joint.ui.Selection({
      paper: this.rappid.paper,
      useModelGeometry: true,
    });

    // this.rappid.paper.on('element:pointerdown', (elementView) => {
    //   // Mostrar inspector cuando se selecciona una figura
    //   this.inspectorService.create(elementView.model);
    // });

    // this.rappid.paper.on('blank:pointerdown', () => {
    //   // Ocultar inspector cuando se hace clic en el área vacía
    //   this.inspectorService.hideInspector();
    // });

    // Monitorear cuando no hay figuras seleccionadas
    // this.selection.collection.on('reset', () => {
    //   if (this.selection.collection.isEmpty()) {
    //     this.inspectorService.hideInspector();  // Ocultar inspector si no hay figuras seleccionadas
    //   }
    // });

    // Añadir selección manual
    this.rappid.paper.on('element:pointerdown', (elementView, evt) => {
      if (evt.shiftKey) {
        this.selection.collection.add(elementView.model);
      } else {
        this.selection.collection.reset([elementView.model]);
      }
    });

    this.rappid.paper.on('blank:pointerdown', () => {
      this.selection.collection.reset([]);
    });

    //   this.rappid.paper.on('element:pointerdown', (elementView, evt) => {
    //     if (!evt.data || !evt.data.moved) {  // Solo seleccionar si no se está arrastrando
    //         this.selection.collection.reset([elementView.model]);  // Seleccionar solo con clic
    //     }
    // });

  }

  sendMessage(retries: number = 2) {
    if (this.userMessage.trim() === '') return;

    console.log('Enviando solicitud a Gemini: ', this.userMessage);

    this.openAIService.sendMessageToGemini(this.userMessage).subscribe(
      (response: any) => {
        console.log('Respuesta cruda de Gemini:', response);

        if (response?.candidates?.length > 0 && response.candidates[0]?.content?.parts?.length > 0) {
          this.chatGPTResponse = response.candidates[0].content.parts[0].text;
          console.log('Respuesta final:', this.chatGPTResponse);
        } else {
          console.warn('No se recibió respuesta válida o partes de contenido.');
          this.chatGPTResponse = 'Respuesta vacía o inválida de Gemini.';
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener la respuesta de Gemini:', error);

        if (error.status === 429 && retries > 0) {
          console.warn('Demasiadas solicitudes. Reintentando en 30 segundos...');
          setTimeout(() => {
            this.sendMessage(retries - 1);
          }, 30000);
        } else {
          alert('Error al obtener respuesta de Gemini. Intenta más tarde.');
        }
      }
    );
  }






  // Function to select the classes
  selectElement(element: joint.dia.Element) {
    if (this.selectedElements.length < 2) {
      this.selectedElements.push(element);
    } else {
      this.selectedElements.shift();  // Remove the first element and add the new one
      this.selectedElements.push(element);
    }
  }

  // Create the link and intermediate class
  createLinkWithIntermediateClass() {
    if (this.selectedElements.length === 2) {
      const [sourceElement, targetElement] = this.selectedElements;

      // Create the intermediate class (using `app.Clase`)
      const intermediateClass = new app.Clase({
        position: {
          x: (sourceElement.position().x + targetElement.position().x) / 2,
          y: (sourceElement.position().y + targetElement.position().y) / 2
        },
        size: { width: 130, height: 90 },
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
          nombreclase: {
            text: 'ClassIntermedia',
            fill: '#ffff',
            fontFamily: 'Roboto Condensed',
            fontWeight: 'Normal',
            fontSize: 11,
            strokeWidth: 0,
            y: 10
          },
          porpiedades: { text: '' },
          metodos: { text: '' }

        }
      });

      // Add the intermediate class to the graph
      this.rappid.graph.addCell(intermediateClass);

      // Create links using `app.Link`
      const link1 = new app.Link({
        source: { id: sourceElement.id },
        target: { id: intermediateClass.id },
        attrs: {
          line: {
            stroke: '#000000',
            strokeWidth: 3
          }
        }
      });

      const link2 = new app.Link({
        source: { id: intermediateClass.id },
        target: { id: targetElement.id },
        attrs: {
          line: {
            stroke: '#000000',
            strokeWidth: 3
          }
        }
      });

      // Add the links to the graph
      this.rappid.graph.addCells([link1, link2]);

      // Clear the selections
      this.selectedElements = [];
    } else {
      alert('Por favor, selecciona dos elementos.');
    }
  }

  createSession() {
    this.socket.emit('create-session', (sessionId: string) => {
      this.sessionId = sessionId;
      this.sessionLink = `${window.location.origin}/ui-components/aulas?sessionId=${sessionId}`;
      this.updateUrlWithSessionId(sessionId);
      this.graphInitialized = true;
    });
  }

  joinSession(sessionId: string) {
    this.socket.emit('join-session', sessionId);
  }

  updateUrlWithSessionId(sessionId: string) {
    this.router.navigate([], {
      queryParams: { sessionId },
      queryParamsHandling: 'merge'
    });
  }


  sendDiagramWithContext() {
    const graphJSON = this.rappid.graph.toJSON();

    // Filtrar las clases eliminando las partes innecesarias
    const filteredJSON = this.filterJsonClasses(graphJSON);

    // Convertir el JSON filtrado a texto
    const graphText = JSON.stringify(filteredJSON, null, 2);

    // Añadir contexto a la solicitud de Gemini
    const context = `
  Eres un experto en UML y en la creación de entidades Java utilizando Spring Boot con JPA. A partir del siguiente JSON, quiero que generes entidades en Java asegurándote de capturar correctamente las relaciones entre las clases. Utiliza las siguientes anotaciones de JPA donde sea necesario: @Entity, @Table, @Id, @GeneratedValue, @OneToMany, @ManyToOne, @OneToOne, @JoinColumn, y @ManyToMany.
Para la FK basate en el id de la app.class y es
Detalles importantes: : no me generes comentarios dentro de tu respuesta, ademas para identificar a un clase con su cardinalidad solo necesicomparar el "id" que esta dentro del app.link un componente y compararlo con el "id" de app.clase
Usa @ManyToOne y @OneToMany solo cuando haya una relación 1..* o *..1, y usa Joincolum para agregar la llave foranea
No añadas claves foráneas (FK) en las clases A o B si hay una clase intermedia que maneja la relación.
Usa @OneToOne solo cuando la relación sea 1..1.
Usa @ManyToMany solo si hay una relación de muchos a muchos, y en este caso, usa una clase intermedia con dos claves foráneas para las dos clases conectadas por la relación.

 Si el valor es en un figura de la linea M 0 -10 -15 0 0 10  : Representa una Herencia . Asegúrate de que la subclase dependa de la clase padre (agregale a la clase hija el extends a la padre osea a la que esta conectada no a ella misma o al revez ), aplicando las anotaciones de JPA necesarias.

Clase Intermedia:
Si encuentras una clase cuyo nombre contiene "ClassIntermedia", representa una relación muchos a muchos. La clase intermedia debe tener dos claves foráneas (FK) que correspondan a las dos clases conectadas por las líneas,
 pero las clases conectadas extrictamente no deben tener FK hacia la clase intermedia.
  las clases conectadas extrictamente no deben tener FK hacia la clase intermedia solo ManyToOne
Asegúrate de que la clase intermedia tenga dos JoinColumn y relaciones ManyToOne con las clases conectadas,ademas las otras clases no deben tener FK relacionadas con la clase intermedia.
Composición, Agregación y Herencia:
Si la flecha tiene una propiedad sourceMarker con valor M 0 -5 10 0 0 5 -10 0 z: Representa una Composició . La clase que la conecta debe tener una FK, pero no a sí misma.
 Si el valor es M 0 -10 -15 0 0 10  : Representa una Herencia . Asegúrate de que la subclase dependa de la clase padre (agregale a la clase hija el extends a la padre ), aplicando las anotaciones de JPA necesarias.
 Si el valor es M 0 -5 11 0 0 5 -11 0  : Representa una Agregació . Asegúrate de que la clase que la conecta tenga una FK, pero no a sí misma.

la respuesta que me des debe tener en cada clase que me generes debe comenzar estrictamente con ejemplo , package...nombreclase..,package..nombreclase...:

package com.phegondev.usersmanagementsystem.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "NombreDeLaClase = esta dentro de "nombreclase")
@Data
    `;

    const messageToSend = `${context}\n\n${graphText}`;

    this.openAIService.sendMessageToGemini(messageToSend).subscribe(
      (response: any) => {
        console.log("Respuesta cruda de Gemini:", response);

        if (response?.candidates?.length > 0 && response.candidates[0]?.content?.parts?.length > 0) {
          const chatGPTResponse = response.candidates[0].content.parts[0].text;
          console.log("Respuesta procesada de Gemini:", chatGPTResponse);

          // Llama a la función para generar los archivos
          this.generateEntityFiles(chatGPTResponse);
        } else {
          console.warn('⚠️ No se recibió respuesta válida de Gemini.');
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 429) {
          console.error('Demasiadas solicitudes. Reintentando en 10 segundos...');
          setTimeout(() => this.sendDiagramWithContext(), 10000);
        } else {
          console.error('Error al obtener la respuesta de Gemini:', error);
        }
      }
    );
  }

  // Función para descargar el archivo .java
  // Función para descargar el archivo .java y generar CRUD
  downloadAsJavaFile(content: string, className: string, isEntity: boolean = true): void {
    // Descargar el archivo de la entidad o CRUD
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${className}.java`;  // Nombre del archivo basado en el nombre de la clase
    link.click();

    // Si es una entidad, generar y descargar los archivos CRUD
    if (isEntity) {
      const repositoryContent = this.generateContent(this.RepositoryTemplate, className);
      const serviceInterfaceContent = this.generateContent(this.ServiceInterfaceTemplate, className);
      const serviceImplContent = this.generateContent(this.ServiceImplTemplate, className);
      const controllerContent = this.generateContent(this.ControllerTemplate, className);

      // Descargar los archivos CRUD sin generar más CRUD
      this.downloadAsJavaFile(repositoryContent, `${className}Repository`, false);
      this.downloadAsJavaFile(serviceInterfaceContent, `${className}Service`, false);
      this.downloadAsJavaFile(serviceImplContent, `${className}ServiceImpl`, false);
      this.downloadAsJavaFile(controllerContent, `${className}Controller`, false);
    }
  }


  generateEntityFiles1(content: string) {
    // Expresión regular actualizada para encontrar todo el bloque desde "package" hasta el cierre de la clase "}"
    const classPattern = /package[\s\S]*?\n}\s*$/gm;

    // Encuentra todas las clases que coincidan con este patrón
    const classDefinitions = content.match(classPattern);

    if (classDefinitions) {
      classDefinitions.forEach((classDef, index) => {
        // Extraer el nombre de la clase para usarlo como nombre de archivo
        const classNameMatch = classDef.match(/public class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : `Entity${index}`;

        // Crear y descargar el archivo .java
        this.downloadAsJavaFile(classDef, className);
      });
    } else {
      console.error('No se encontraron clases en el contenido proporcionado.');
    }
  }



  // Función para descargar el archivo .java
  downloadAsJavaFile1(content: string, className: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${className}.java`;  // Nombre del archivo basado en el nombre de la clase
    link.click();
  }


  // Función para eliminar las secciones innecesarias del JSON
  filterJsonClasses(json: any) {
    return json.cells.map((cell: any) => {
      if (cell.type === 'app.Clase') {
        const filteredCell = { ...cell };

        // Elimina las propiedades innecesarias
        delete filteredCell.markup;
        delete filteredCell.position;
        delete filteredCell.size;

        // Elimina el objeto "groups" de "ports"
        if (filteredCell.ports && filteredCell.ports.groups) {
          delete filteredCell.ports.groups;
        }

        // Elimina los objetos "body" y "header" de "attrs"
        if (filteredCell.attrs) {
          delete filteredCell.attrs.body;
          delete filteredCell.attrs.header;
        }

        return filteredCell;
      }
      return cell;
    });
  }

  // Modificar la función exportDiagram para aplicar el filtro antes de la descarga
  exportDiagram() {
    const graphJSON = this.rappid.graph.toJSON();

    // Filtrar las clases eliminando las partes innecesarias
    const filteredJSON = this.filterJsonClasses(graphJSON);

    // Convertir el JSON filtrado a texto
    const graphText = JSON.stringify(filteredJSON, null, 2);

    // Crear el archivo y descargarlo
    const blob = new Blob([graphText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'filtered_diagram.txt';
    link.click();
  }


  copyLink() {
    if (this.sessionLink) {
      const input = document.createElement('input');
      input.value = this.sessionLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Enlace copiado al portapapeles');
    }
  }


}
