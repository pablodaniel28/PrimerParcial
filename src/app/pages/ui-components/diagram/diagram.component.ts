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



  ///INICIOO////

  private ZIP_STRUCTURE = {
    controller: 'demo/src/main/java/com/example/demo/controller/',
    entity: 'demo/src/main/java/com/example/demo/entity/',
    repository: 'demo/src/main/java/com/example/demo/repository/',
    service: 'demo/src/main/java/com/example/demo/service/',
  };

  RepositoryTemplate: string = `
  package com.example.demo.repository;

  import com.example.demo.entity.\${ENTITY};
  import org.springframework.data.jpa.repository.JpaRepository;
  import org.springframework.stereotype.Repository;

  @Repository
  public interface \${ENTITY}Repository extends JpaRepository<\${ENTITY}, Long> {
  }
  `;



  ServiceImplTemplate: string = `
package com.example.demo.service;

import com.example.demo.entity.\${ENTITY};
import com.example.demo.repository.\${ENTITY}Repository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class \${ENTITY}Service {

    @Autowired
    private \${ENTITY}Repository \${entityLower}Repository;

    public List<\${ENTITY}> getAll\${ENTITY}s() {
        return \${entityLower}Repository.findAll();
    }

    public Optional<\${ENTITY}> get\${ENTITY}ById(Long id) {
        return \${entityLower}Repository.findById(id);
    }

    public \${ENTITY} create\${ENTITY}(\${ENTITY} \${entityLower}) {
        return \${entityLower}Repository.save(\${entityLower});
    }

    public Optional<\${ENTITY}> update\${ENTITY}(Long id, \${ENTITY} \${entityLower}Details) {
        return \${entityLower}Repository.findById(id).map(\${entityLower} -> {
            BeanUtils.copyProperties(\${entityLower}Details, \${entityLower}, "id"); // No sobreescribe el id
            return \${entityLower}Repository.save(\${entityLower});
        });
    }

    public void delete\${ENTITY}(Long id) {
        \${entityLower}Repository.deleteById(id);
    }
}
`;


  ControllerTemplate: string = `
package com.example.demo.controller;

import com.example.demo.entity.\${ENTITY};
import com.example.demo.service.\${ENTITY}Service;
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
        return \${entityLower}Service.create\${ENTITY}(\${entityLower});
    }

    @GetMapping
    public List<\${ENTITY}> getAll\${ENTITY}s() {
        return \${entityLower}Service.getAll\${ENTITY}s();
    }

    @GetMapping("/{id}")
    public ResponseEntity<\${ENTITY}> get\${ENTITY}ById(@PathVariable Long id) {
        return \${entityLower}Service.get\${ENTITY}ById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<\${ENTITY}> update\${ENTITY}(@PathVariable Long id, @RequestBody \${ENTITY} \${entityLower}Details) {
        return \${entityLower}Service.update\${ENTITY}(id, \${entityLower}Details)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete\${ENTITY}(@PathVariable Long id) {
        \${entityLower}Service.delete\${ENTITY}(id);
        return ResponseEntity.noContent().build();
    }
}
`;



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

package com.example.demo.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "NombreDeLaClase = esta dentro de "nombreclase")
@Data
- **IMPORTANTE**: si es un ID, debes declararlo estrictamente así java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
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



  async generateEntityFiles(content: string) {
    const pomxml: string = `
  <?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
		 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

	<modelVersion>4.0.0</modelVersion>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.2.4</version> <!-- ✅ Spring Boot 3.2.4 -->
		<relativePath/>
	</parent>

	<groupId>com.phegondev</groupId>  <!-- ✅ tu nuevo groupId -->
	<artifactId>usersmanagementsystem</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>usersmanagementsystem</name>
	<description>Demo project for Spring Boot</description>

	<properties>
		<java.version>21</java.version> <!-- ✅ Java 21 -->
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
	</properties>

	<dependencies>
		<!-- Spring Boot Core -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter</artifactId>
		</dependency>

		<!-- Spring Boot Web -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<!-- Spring Boot JPA (Base de datos) -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>

		<!-- PostgreSQL Driver -->
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>

		<!-- Lombok (reducción de código) -->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>

		<!-- Spring Security -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>

		<!-- JWT -->
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-api</artifactId>
			<version>0.12.5</version>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-impl</artifactId>
			<version>0.12.5</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>io.jsonwebtoken</groupId>
			<artifactId>jjwt-jackson</artifactId>
			<version>0.12.5</version>
			<scope>runtime</scope>
		</dependency>

		<!-- Jackson JSON -->
		<dependency>
			<groupId>com.fasterxml.jackson.core</groupId>
			<artifactId>jackson-databind</artifactId>
		</dependency>

		<!-- Testing -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<excludes>
						<exclude>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
						</exclude>
					</excludes>
				</configuration>
			</plugin>
		</plugins>
	</build>

</project>

    `;

    const applicationProperties: string = `
  spring.application.name=demo
  spring.datasource.url=jdbc:postgresql://localhost:5432/demo
  spring.datasource.username=postgres
  spring.datasource.password=
  spring.datasource.driver-class-name=org.postgresql.Driver

  spring.jpa.hibernate.ddl-auto=update
    `;

    const webSecurityConfig: string = `
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desactiva CSRF (para APIs REST)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() // Permite todas las rutas /api/**
                        .anyRequest().permitAll()               // Permite todo
                );
        return http.build();
    }
}
  `;

    // Buscar clases
    const classPattern = /package[\s\S]*?\n}\s*$/gm;
    const classDefinitions = content.match(classPattern);

    if (classDefinitions && classDefinitions.length > 0) {
      const zip = new JSZip();

      const baseFolder = 'demo/src/main/java/com/example/demo/';

      // 💥 pom.xml
      zip.file('demo/pom.xml', pomxml);

      // 💥 application.properties
      zip.file('demo/src/main/resources/application.properties', applicationProperties);

      // 💥 DemoApplication.java
      zip.file(`${baseFolder}DemoApplication.java`, `
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
    `);

      // 💥 WebSecurityConfig.java en config/
      zip.file(`${baseFolder}config/WebSecurityConfig.java`, webSecurityConfig);

      // 💥 Entidades, CRUD
      classDefinitions.forEach((classDef, index) => {
        const classNameMatch = classDef.match(/public class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : `Entity${index}`;

        zip.file(`${baseFolder}entity/${className}.java`, classDef);

        this.generateCRUDFiles(zip, className);
      });

      // 💥 Descargar todo
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        saveAs(blob, 'demo.zip');
      });

    } else {
      console.error('⚠️ No se encontraron clases válidas en el contenido proporcionado.');
    }
  }




  generateCRUDFiles(zip: JSZip, entityName: string): void {
    const baseFolder = 'demo/src/main/java/com/example/demo/';

    // Generar y agregar Repositorio
    const repositoryContent = this.generateContent(this.RepositoryTemplate, entityName);
    zip.file(`${baseFolder}repository/${entityName}Repository.java`, repositoryContent);

    // Generar y agregar Servicio (Interfaz)
    const serviceInterfaceContent = this.generateContent(this.ServiceImplTemplate, entityName);
    zip.file(`${baseFolder}service/${entityName}Service.java`, serviceInterfaceContent);

    // Generar y agregar Controlador
    const controllerContent = this.generateContent(this.ControllerTemplate, entityName);
    zip.file(`${baseFolder}controller/${entityName}Controller.java`, controllerContent);
  }


  // Función para reemplazar los marcadores de posición en las plantillas
  generateContent(template: string, entityName: string): string {
    const entityLower = entityName.charAt(0).toLowerCase() + entityName.slice(1);
    return template
      .replace(/\${ENTITY}/g, entityName)
      .replace(/\${entityLower}/g, entityLower);
  }


  //////FIN/////


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



  exportDiagram() {
    const graphJSON = this.rappid.graph.toJSON();
    const filteredJSON = this.filterJsonClasses(graphJSON);
    const graphText = JSON.stringify(filteredJSON, null, 2);
    const VERSION_MEJORADA_XMI = `<?xml version="1.0" encoding="windows-1252"?>
<xmi:XMI xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.1" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">
	<xmi:Documentation exporter="Enterprise Architect" exporterVersion="6.5"/>
	<uml:Model xmi:type="uml:Model" name="EA_Model" visibility="public">
		<packagedElement xmi:type="uml:Package" xmi:id="EAPK_GENERATED" name="Domain Model" visibility="public">
			<packagedElement xmi:type="uml:Package" xmi:id="EAPK_GENERATED2" name="Domain Objects" visibility="public">
				<ownedComment xmi:type="uml:Comment" xmi:id="EAID_COMMENT" body="Generated classes"/>
				<packagedElement xmi:type="uml:Class" xmi:id="EAID_b1466e13_74a3_462c_9afc_8fab950b9235" name="Producto" visibility="public">
					<ownedAttribute xmi:type="uml:Property" xmi:id="EAID_59D4DBAD_C274_4c0a_9058_1416581E281D" name="id" visibility="private" isStatic="false" isReadOnly="false" isDerived="false" isOrdered="false" isUnique="true" isDerivedUnion="false">
						<lowerValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000001_C274_4c0a_9058_1416581E281D" value="1"/>
						<upperValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000002_C274_4c0a_9058_1416581E281D" value="1"/>
						<type xmi:idref="EAJava_int"/>
					</ownedAttribute>
					<ownedAttribute xmi:type="uml:Property" xmi:id="EAID_4022B19F_8232_457f_B280_1F94E437ED40" name="nombre" visibility="private" isStatic="false" isReadOnly="false" isDerived="false" isOrdered="false" isUnique="true" isDerivedUnion="false">
						<lowerValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000003_8232_457f_B280_1F94E437ED40" value="1"/>
						<upperValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000004_8232_457f_B280_1F94E437ED40" value="1"/>
						<type xmi:idref="EAJava_string"/>
					</ownedAttribute>
					<ownedOperation xmi:id="EAID_26C65086_80DA_41a3_8733_6DE07B775769" name="crear" visibility="public" concurrency="sequential">
						<ownedParameter xmi:id="EAID_RT000000_80DA_41a3_8733_6DE07B775769" name="return" direction="return" type="EAJava_void"/>
					</ownedOperation>
					<ownedOperation xmi:id="EAID_26B22E00_40E1_4b19_B73E_DF6E1CE1AC68" name="guardar" visibility="public" concurrency="sequential">
						<ownedParameter xmi:id="EAID_D0A5BC66_4793_4418_BB7B_D913856DB416" name="dato" direction="in" isStream="false" isException="false" isOrdered="false" isUnique="true" type="EAJava_int"/>
						<ownedParameter xmi:id="EAID_RT000000_40E1_4b19_B73E_DF6E1CE1AC68" name="return" direction="return" type="EAJava_void"/>
					</ownedOperation>
				</packagedElement>
				<packagedElement xmi:type="uml:Association" xmi:id="EAID_304622ac_bed3_454c_a153_c9758d60c2a7" visibility="public">
					<memberEnd xmi:idref="EAID_dst4622ac_bed3_454c_a153_c9758d60c2a7"/>
					<memberEnd xmi:idref="EAID_src4622ac_bed3_454c_a153_c9758d60c2a7"/>
					<ownedEnd xmi:type="uml:Property" xmi:id="EAID_src4622ac_bed3_454c_a153_c9758d60c2a7" visibility="public" association="EAID_304622ac_bed3_454c_a153_c9758d60c2a7" isStatic="false" isReadOnly="false" isDerived="false" isOrdered="false" isUnique="true" isDerivedUnion="false" aggregation="none">
						<type xmi:idref="EAID_aa385d04_aad2_44f0_b6f6_ac51179337d3"/>
						<lowerValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000005__bed3_454c_a153_c9758d60c2a7" value="1"/>
						<upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="EAID_LI000006__bed3_454c_a153_c9758d60c2a7" value="-1"/>
					</ownedEnd>
					<ownedEnd xmi:type="uml:Property" xmi:id="EAID_dst4622ac_bed3_454c_a153_c9758d60c2a7" visibility="public" association="EAID_304622ac_bed3_454c_a153_c9758d60c2a7" isStatic="false" isReadOnly="false" isDerived="false" isOrdered="false" isUnique="true" isDerivedUnion="false" aggregation="none">
						<type xmi:idref="EAID_b1466e13_74a3_462c_9afc_8fab950b9235"/>
						<lowerValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000011__bed3_454c_a153_c9758d60c2a7" value="1"/>
						<upperValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000012__bed3_454c_a153_c9758d60c2a7" value="1"/>
					</ownedEnd>
				</packagedElement>
				<packagedElement xmi:type="uml:Class" xmi:id="EAID_aa385d04_aad2_44f0_b6f6_ac51179337d3" name="categoria" visibility="public">
					<ownedAttribute xmi:type="uml:Property" xmi:id="EAID_2C858178_0417_4a04_8EB2_2DEB0A43BE16" name="id" visibility="private" isStatic="false" isReadOnly="false" isDerived="false" isOrdered="false" isUnique="true" isDerivedUnion="false">
						<lowerValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000007_0417_4a04_8EB2_2DEB0A43BE16" value="1"/>
						<upperValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000008_0417_4a04_8EB2_2DEB0A43BE16" value="1"/>
						<type xmi:idref="EAJava_int"/>
					</ownedAttribute>
					<ownedAttribute xmi:type="uml:Property" xmi:id="EAID_98BC715B_87D3_4875_8755_AD05C410ED10" name="descripcion" visibility="private" isStatic="false" isReadOnly="false" isDerived="false" isOrdered="false" isUnique="true" isDerivedUnion="false">
						<lowerValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000009_87D3_4875_8755_AD05C410ED10" value="1"/>
						<upperValue xmi:type="uml:LiteralInteger" xmi:id="EAID_LI000010_87D3_4875_8755_AD05C410ED10" value="1"/>
						<type xmi:idref="EAJava_string"/>
					</ownedAttribute>
					<ownedOperation xmi:id="EAID_554BF1FE_E0E6_4df6_AA9F_CD8B2DE19CC3" name="eliminar" visibility="public" concurrency="sequential">
						<ownedParameter xmi:id="EAID_DE5BAB9C_7BAF_4ab1_918C_4A563A685F3F" name="id" direction="in" isStream="false" isException="false" isOrdered="false" isUnique="true" type="EAJava_int"/>
						<ownedParameter xmi:id="EAID_RT000000_E0E6_4df6_AA9F_CD8B2DE19CC3" name="return" direction="return" type="EAJava_void"/>
					</ownedOperation>
				</packagedElement>
			</packagedElement>
		</packagedElement>
	</uml:Model>
	<xmi:Extension extender="Enterprise Architect" extenderID="6.5">
		<elements>
			<element xmi:idref="EAPK_GENERATED" xmi:type="uml:Package" name="Domain Model" scope="public">
				<model package2="EAID_GENERATED" package="EAPK_7C95558C_287A_4f89_8E52_9C9F673EC813" tpos="0" ea_localid="115" ea_eleType="package"/>
				<properties isSpecification="false" sType="Package" nType="0" scope="public"/>
				<project author="danie" version="1.0" phase="1.0" created="2025-04-28 11:26:36" modified="2025-04-28 11:26:36" complexity="1" status="Proposed"/>
				<code gentype="Java"/>
				<style appearance="BackColor=-1;BorderColor=-1;BorderWidth=-1;FontColor=-1;VSwimLanes=1;HSwimLanes=1;BorderStyle=0;"/>
				<tags/>
				<xrefs/>
				<extendedProperties tagged="0" package_name="Modulo Persona"/>
				<packageproperties version="1.0"/>
				<paths/>
				<times created="2025-04-28 00:00:00" modified="2025-04-28 13:07:15" lastloaddate="2025-04-28 13:07:15" lastsavedate="2025-04-28 13:07:15"/>
				<flags iscontrolled="FALSE" isprotected="FALSE" batchsave="0" batchload="0" usedtd="FALSE" logxml="FALSE"/>
			</element>
			<element xmi:idref="EAPK_GENERATED2" xmi:type="uml:Package" name="Domain Objects" scope="public">
				<model package2="EAID_GENERATED2" package="EAPK_GENERATED" tpos="0" ea_localid="116" ea_eleType="package"/>
				<properties isSpecification="false" sType="Package" nType="0" scope="public"/>
				<project author="danie" version="1.0" phase="1.0" created="2025-04-28 11:26:36" modified="2025-04-28 11:26:36" complexity="1" status="Proposed"/>
				<code gentype="Java"/>
				<style appearance="BackColor=-1;BorderColor=-1;BorderWidth=-1;FontColor=-1;VSwimLanes=1;HSwimLanes=1;BorderStyle=0;"/>
				<tags/>
				<xrefs/>
				<extendedProperties tagged="0" package_name="Domain Model"/>
				<packageproperties version="1.0"/>
				<paths/>
				<times created="2025-04-28 00:00:00" modified="2025-04-28 13:07:15" lastloaddate="2025-04-28 13:07:15" lastsavedate="2025-04-28 13:07:15"/>
				<flags iscontrolled="FALSE" isprotected="FALSE" batchsave="0" batchload="0" usedtd="FALSE" logxml="FALSE"/>
			</element>
			<element xmi:idref="EAID_b1466e13_74a3_462c_9afc_8fab950b9235" xmi:type="uml:Class" name="Producto" scope="public">
				<model package="EAPK_GENERATED2" tpos="0" ea_localid="433" ea_eleType="element"/>
				<properties isSpecification="false" sType="Class" nType="0" scope="public" isRoot="false" isLeaf="false" isAbstract="false" isActive="false"/>
				<project author="danie" version="1.0" phase="1.0" created="2025-04-28 11:30:48" modified="2025-04-28 13:07:15" complexity="1" status="Proposed"/>
				<code gentype="Java"/>
				<style appearance="BackColor=-1;BorderColor=-1;BorderWidth=-1;FontColor=-1;VSwimLanes=1;HSwimLanes=1;BorderStyle=0;"/>
				<tags/>
				<xrefs/>
				<extendedProperties tagged="0" package_name="Domain Objects"/>
				<attributes>
					<attribute xmi:idref="EAID_59D4DBAD_C274_4c0a_9058_1416581E281D" name="id" scope="Private">
						<initial/>
						<documentation/>
						<model ea_localid="230" ea_guid="{59D4DBAD-C274-4c0a-9058-1416581E281D}"/>
						<properties type="int" derived="0" collection="false" duplicates="0" changeability="changeable"/>
						<coords ordered="0" scale="0"/>
						<containment containment="Not Specified" position="0"/>
						<stereotype/>
						<bounds lower="1" upper="1"/>
						<options/>
						<style/>
						<styleex value="volatile=0;"/>
						<tags/>
						<xrefs/>
					</attribute>
					<attribute xmi:idref="EAID_4022B19F_8232_457f_B280_1F94E437ED40" name="nombre" scope="Private">
						<initial/>
						<documentation/>
						<model ea_localid="231" ea_guid="{4022B19F-8232-457f-B280-1F94E437ED40}"/>
						<properties type="string" derived="0" collection="false" duplicates="0" changeability="changeable"/>
						<coords ordered="0" scale="0"/>
						<containment containment="Not Specified" position="1"/>
						<stereotype/>
						<bounds lower="1" upper="1"/>
						<options/>
						<style/>
						<styleex value="volatile=0;"/>
						<tags/>
						<xrefs/>
					</attribute>
				</attributes>
				<operations>
					<operation xmi:idref="EAID_26C65086_80DA_41a3_8733_6DE07B775769" name="crear" scope="Public">
						<properties position="0"/>
						<stereotype/>
						<model ea_guid="{26C65086-80DA-41a3-8733-6DE07B775769}" ea_localid="179"/>
						<type type="void" const="false" static="false" isAbstract="false" synchronised="0" concurrency="Sequential" pure="0" isQuery="false"/>
						<behaviour/>
						<code/>
						<style/>
						<styleex/>
						<documentation/>
						<tags/>
						<parameters>
							<parameter xmi:idref="EAID_RETURNID_80DA_41a3_8733_6DE07B775769" visibility="public">
								<properties pos="0" type="void" const="false" ea_guid="{RETURNID-80DA-41a3-8733-6DE07B775769}"/>
								<style/>
								<styleex/>
								<documentation/>
								<tags/>
								<xrefs/>
							</parameter>
						</parameters>
						<xrefs/>
					</operation>
					<operation xmi:idref="EAID_26B22E00_40E1_4b19_B73E_DF6E1CE1AC68" name="guardar" scope="Public">
						<properties position="1"/>
						<stereotype/>
						<model ea_guid="{26B22E00-40E1-4b19-B73E-DF6E1CE1AC68}" ea_localid="180"/>
						<type type="void" const="false" static="false" isAbstract="false" synchronised="0" concurrency="Sequential" pure="0" isQuery="false"/>
						<behaviour/>
						<code/>
						<style/>
						<styleex/>
						<documentation/>
						<tags/>
						<parameters>
							<parameter xmi:idref="EAID_RETURNID_40E1_4b19_B73E_DF6E1CE1AC68" visibility="public">
								<properties pos="0" type="void" const="false" ea_guid="{RETURNID-40E1-4b19-B73E-DF6E1CE1AC68}"/>
								<style/>
								<styleex/>
								<documentation/>
								<tags/>
								<xrefs/>
							</parameter>
							<parameter xmi:idref="EAID_D0A5BC66_4793_4418_BB7B_D913856DB416" visibility="public">
								<properties pos="0" type="int" const="false" ea_guid="{D0A5BC66-4793-4418-BB7B-D913856DB416}"/>
								<style/>
								<styleex/>
								<documentation/>
								<tags/>
								<xrefs/>
							</parameter>
						</parameters>
						<xrefs/>
					</operation>
				</operations>
				<links>
					<Association xmi:id="EAID_304622ac_bed3_454c_a153_c9758d60c2a7" start="EAID_aa385d04_aad2_44f0_b6f6_ac51179337d3" end="EAID_b1466e13_74a3_462c_9afc_8fab950b9235"/>
				</links>
			</element>
			<element xmi:idref="EAID_aa385d04_aad2_44f0_b6f6_ac51179337d3" xmi:type="uml:Class" name="categoria" scope="public">
				<model package="EAPK_GENERATED2" tpos="0" ea_localid="434" ea_eleType="element"/>
				<properties isSpecification="false" sType="Class" nType="0" scope="public" isRoot="false" isLeaf="false" isAbstract="false" isActive="false"/>
				<project author="danie" version="1.0" phase="1.0" created="2025-04-28 11:33:28" modified="2025-04-28 13:07:15" complexity="1" status="Proposed"/>
				<code product_name="Java" gentype="Java"/>
				<style appearance="BackColor=-1;BorderColor=-1;BorderWidth=-1;FontColor=-1;VSwimLanes=1;HSwimLanes=1;BorderStyle=0;"/>
				<tags/>
				<xrefs/>
				<extendedProperties tagged="0" package_name="Domain Objects"/>
				<attributes>
					<attribute xmi:idref="EAID_2C858178_0417_4a04_8EB2_2DEB0A43BE16" name="id" scope="Private">
						<initial/>
						<documentation/>
						<model ea_localid="232" ea_guid="{2C858178-0417-4a04-8EB2-2DEB0A43BE16}"/>
						<properties type="int" derived="0" collection="false" duplicates="0" changeability="changeable"/>
						<coords ordered="0" scale="0"/>
						<containment containment="Not Specified" position="0"/>
						<stereotype/>
						<bounds lower="1" upper="1"/>
						<options/>
						<style/>
						<styleex value="volatile=0;"/>
						<tags/>
						<xrefs/>
					</attribute>
					<attribute xmi:idref="EAID_98BC715B_87D3_4875_8755_AD05C410ED10" name="descripcion" scope="Private">
						<initial/>
						<documentation/>
						<model ea_localid="233" ea_guid="{98BC715B-87D3-4875-8755-AD05C410ED10}"/>
						<properties type="string" derived="0" collection="false" duplicates="0" changeability="changeable"/>
						<coords ordered="0" scale="0"/>
						<containment containment="Not Specified" position="1"/>
						<stereotype/>
						<bounds lower="1" upper="1"/>
						<options/>
						<style/>
						<styleex value="volatile=0;"/>
						<tags/>
						<xrefs/>
					</attribute>
				</attributes>
				<operations>
					<operation xmi:idref="EAID_554BF1FE_E0E6_4df6_AA9F_CD8B2DE19CC3" name="eliminar" scope="Public">
						<properties position="0"/>
						<stereotype/>
						<model ea_guid="{554BF1FE-E0E6-4df6-AA9F-CD8B2DE19CC3}" ea_localid="181"/>
						<type type="void" const="false" static="false" isAbstract="false" synchronised="0" concurrency="Sequential" pure="0" isQuery="false"/>
						<behaviour/>
						<code/>
						<style/>
						<styleex/>
						<documentation/>
						<tags/>
						<parameters>
							<parameter xmi:idref="EAID_RETURNID_E0E6_4df6_AA9F_CD8B2DE19CC3" visibility="public">
								<properties pos="0" type="void" const="false" ea_guid="{RETURNID-E0E6-4df6-AA9F-CD8B2DE19CC3}"/>
								<style/>
								<styleex/>
								<documentation/>
								<tags/>
								<xrefs/>
							</parameter>
							<parameter xmi:idref="EAID_DE5BAB9C_7BAF_4ab1_918C_4A563A685F3F" visibility="public">
								<properties pos="0" type="int" const="false" ea_guid="{DE5BAB9C-7BAF-4ab1-918C-4A563A685F3F}"/>
								<style/>
								<styleex/>
								<documentation/>
								<tags/>
								<xrefs/>
							</parameter>
						</parameters>
						<xrefs/>
					</operation>
				</operations>
				<links>
					<Association xmi:id="EAID_304622ac_bed3_454c_a153_c9758d60c2a7" start="EAID_aa385d04_aad2_44f0_b6f6_ac51179337d3" end="EAID_b1466e13_74a3_462c_9afc_8fab950b9235"/>
				</links>
			</element>
			<element xmi:idref="EAID_COMMENT" xmi:type="uml:Note" scope="public">
				<model package="EAPK_GENERATED2" tpos="0" ea_localid="432" ea_eleType="element"/>
				<properties documentation="Generated classes" isSpecification="false" sType="Note" nType="1" scope="public"/>
				<project author="danie" version="1.0" phase="1.0" created="2025-04-28 11:26:36" modified="2025-04-28 13:07:15" complexity="1" status="Proposed"/>
				<code gentype="&lt;none&gt;"/>
				<style appearance="BackColor=-1;BorderColor=-1;BorderWidth=-1;FontColor=-1;VSwimLanes=1;HSwimLanes=1;BorderStyle=0;"/>
				<tags/>
				<xrefs/>
				<extendedProperties tagged="0" package_name="Domain Objects"/>
			</element>
		</elements>
		<connectors>
			<connector xmi:idref="EAID_304622ac_bed3_454c_a153_c9758d60c2a7">
				<source xmi:idref="EAID_aa385d04_aad2_44f0_b6f6_ac51179337d3">
					<model ea_localid="434" type="Class" name="categoria"/>
					<role visibility="Public" targetScope="instance"/>
					<type multiplicity="1..*" aggregation="none" containment="Unspecified"/>
					<constraints/>
					<modifiers isOrdered="false" changeable="none" isNavigable="false"/>
					<style value="Union=0;Derived=0;AllowDuplicates=0;Owned=0;Navigable=Unspecified;"/>
					<documentation/>
					<xrefs/>
					<tags/>
				</source>
				<target xmi:idref="EAID_b1466e13_74a3_462c_9afc_8fab950b9235">
					<model ea_localid="433" type="Class" name="Producto"/>
					<role visibility="Public" targetScope="instance"/>
					<type multiplicity="1" aggregation="none" containment="Unspecified"/>
					<constraints/>
					<modifiers isOrdered="false" changeable="none" isNavigable="false"/>
					<style value="Union=0;Derived=0;AllowDuplicates=0;Owned=0;Navigable=Unspecified;"/>
					<documentation/>
					<xrefs/>
					<tags/>
				</target>
				<model ea_localid="175"/>
				<properties ea_type="Association" direction="Unspecified"/>
				<modifiers isRoot="false" isLeaf="false"/>
				<parameterSubstitutions/>
				<documentation/>
				<appearance linemode="3" linecolor="-1" linewidth="0" seqno="0" headStyle="0" lineStyle="0"/>
				<labels lb="1..*" rb="1"/>
				<extendedProperties virtualInheritance="0"/>
				<style/>
				<xrefs/>
				<tags/>
			</connector>
		</connectors>
		<primitivetypes>
			<packagedElement xmi:type="uml:Package" xmi:id="EAPrimitiveTypesPackage" name="EA_PrimitiveTypes_Package" visibility="public">
				<packagedElement xmi:type="uml:Package" xmi:id="EAJavaTypesPackage" name="EA_Java_Types_Package" visibility="public">
					<packagedElement xmi:type="uml:PrimitiveType" xmi:id="EAJava_int" name="int" visibility="public">
						<generalization xmi:type="uml:Generalization" xmi:id="EAJava_int_General">
							<general href="http://schema.omg.org/spec/UML/2.1/uml.xml#Integer"/>
						</generalization>
					</packagedElement>
					<packagedElement xmi:type="uml:PrimitiveType" xmi:id="EAJava_string" name="string" visibility="public"/>
					<packagedElement xmi:type="uml:PrimitiveType" xmi:id="EAJava_void" name="void" visibility="public"/>
				</packagedElement>
			</packagedElement>
		</primitivetypes>
		<profiles/>
		<diagrams>
			<diagram xmi:id="EAID_DIAGRAM">
				<model package="EAPK_GENERATED2" localID="123" owner="EAPK_GENERATED2"/>
				<properties name="Domain Objects" type="Logical"/>
				<project author="auto-generated" version="1.0" created="2025-04-28 10:43:18" modified="2025-04-28 13:09:59"/>
				<style1 value="ShowPrivate=1;ShowProtected=1;ShowPublic=1;HideRelationships=0;Locked=0;Border=0;HighlightForeign=0;PackageContents=0;SequenceNotes=0;ScalePrintImage=0;PPgs.cx=0;PPgs.cy=0;DocSize.cx=803;DocSize.cy=1146;ShowDetails=0;Orientation=;Zoom=100;ShowTags=0;OpParams=0;VisibleAttributeDetail=0;ShowOpRetType=1;ShowIcons=1;CollabNums=1;HideProps=1;ShowReqs=0;ShowCons=0;PaperSize=9;HideParents=0;UseAlias=0;HideAtts=0;HideOps=0;HideStereo=0;HideElemStereo=0;ShowTests=0;ShowMaint=0;ConnectorNotation=UML 2.1;ExplicitNavigability=0;ShowShape=1;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;m_bElementClassifier=1;ShowNotes=0;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;"/>
				<style2 value="ExcludeRTF=0;DocAll=0;HideQuals=0;AttPkg=1;ShowTests=0;ShowMaint=0;SuppressFOC=1;MatrixActive=0;SwimlanesActive=0;KanbanActive=0;MatrixLineWidth=0;MatrixLineClr=0;MatrixLocked=0;TConnectorNotation=UML 2.1;TExplicitNavigability=0;AdvancedElementProps=1;AdvancedFeatureProps=1;AdvancedConnectorProps=1;m_bElementClassifier=1;ProfileData=;MDGDgm=;STBLDgm=;ShowNotes=0;VisibleAttributeDetail=0;ShowOpRetType=1;SuppressBrackets=0;SuppConnectorLabels=0;PrintPageHeadFoot=0;ShowAsList=0;SuppressedCompartments=;Theme=:119;SaveTag=D225A11B;"/>
				<swimlanes value="locked=false;orientation=0;width=0;inbar=false;names=false;color=-1;bold=false;fcol=0;tcol=-1;ofCol=-1;ufCol=-1;hl=0;ufh=0;cls=0;"/>
				<matrixitems value="locked=false;matrixactive=false;swimlanesactive=false;kanbanactive=false;width=0;clrLine=0;"/>
				<extendedProperties/>
				<elements>
					<element geometry="Left=300;Top=100;Right=390;Bottom=170;" subject="EAID_b1466e13_74a3_462c_9afc_8fab950b9235" seqno="1" style="DUID=68BFF966;"/>
					<element geometry="Left=100;Top=200;Right=190;Bottom=270;" subject="EAID_aa385d04_aad2_44f0_b6f6_ac51179337d3" seqno="2" style="DUID=7CE44F03;"/>
					<element geometry="SX=0;SY=0;EX=0;EY=0;EDGE=2;$LLB=CX=6:CY=14:OX=0:OY=0:HDN=0:BLD=0:ITA=0:UND=0:CLR=-1:ALN=1:DIR=0:ROT=0;LLT=;LMT=;LMB=;LRT=;LRB=CX=18:CY=14:OX=0:OY=0:HDN=0:BLD=0:ITA=0:UND=0:CLR=-1:ALN=1:DIR=0:ROT=0;IRHS=;ILHS=;Path=;" subject="EAID_304622ac_bed3_454c_a153_c9758d60c2a7" style="Mode=3;EOID=68BFF966;SOID=68BFF966;Color=-1;LWidth=0;Hidden=0;"/>
				</elements>
			</diagram>
		</diagrams>
	</xmi:Extension>
</xmi:XMI>
`;

    const context = `
Eres un experto en UML y XMI. A partir del siguiente JSON que contiene clases (type: "app.Clase") y relaciones (type: "app.Link"), quiero que generes un archivo XMI que copie el estilo y estructura EXACTA del archivo de referencia proporcionado.

JSON de entrada:
${graphText}

Archivo XMI de referencia (estructura y estilo que debes imitar):
${VERSION_MEJORADA_XMI}

⚠️ Reglas obligatorias:
- Utiliza solo las clases y relaciones del JSON.
- Copia exactamente la estructura del XMI de referencia.
- Cada "app.Clase" debe convertirse en un <packagedElement> de tipo uml:Class, y cada propiedad (de attrs.propiedades.text) debe generarse como un <ownedAttribute>.
- Además, **cada método** (de attrs.metodos.text) debe convertirse en un <ownedOperation> dentro de la clase, similar al formato de atributos pero para operaciones.
- Para los atributos y métodos:
  - Los atributos usan <ownedAttribute> como en el XMI de referencia.
  - Los métodos deben usar <ownedOperation> siguiendo el estilo estándar UML.
  - Atributos y métodos deben reflejar la visibilidad "private" por defecto.
- Genera correctamente las asociaciones (<packagedElement> tipo uml:Association) para las relaciones, respetando las multiplicidades usando los valores de labels[0].attrs.text.text y labels[1].attrs.text.text.
- En la sección <diagrams>:
  - Agrega las posiciones inventadas pero coherentes (Left, Top, Right, Bottom).
- NO inventes nuevas clases, atributos, métodos ni relaciones que no estén en el JSON.
- Mantén la estructura de style1, style2, swimlanes, matrixitems y extendedProperties exactamente como el archivo XMI de referencia.
- Usa IDs para las clases en el formato EAID_0000, EAID_0001, etc.
- Usa IDs para las relaciones en el formato EACON_0000, EACON_0001, etc.
- El archivo final debe comenzar exactamente con "<?xml version="1.0" encoding="windows-1252"?>" y terminar exactamente con "</xmi:XMI>".
- El resultado debe ser 100% válido y abrirse correctamente en Enterprise Architect.
Es muy importante que respetes fielmente el estilo y estructura del archivo XMI proporcionado.
Genera ahora el archivo completo respetando todas estas reglas.
`;

    const messageToSend = context;

    this.openAIService.sendMessageToGemini(messageToSend).subscribe(
      (response: any) => {
        if (response?.candidates?.length > 0 && response.candidates[0]?.content?.parts?.length > 0) {
          let xmiGenerated = response.candidates[0].content.parts[0].text.trim();

          // ✂️ Eliminar marcas ```xml y ``` si existen
          if (xmiGenerated.startsWith('```xml')) {
            xmiGenerated = xmiGenerated.replace(/^```xml/, '').trim();
          }
          if (xmiGenerated.endsWith('```')) {
            xmiGenerated = xmiGenerated.replace(/```$/, '').trim();
          }

          // Validar que empieza correctamente
          if (!xmiGenerated.startsWith('<?xml')) {
            console.error('🚨 El XMI generado no empieza correctamente con <?xml ... ?>');
            return;
          }

          const blob = new Blob([xmiGenerated], { type: 'text/xml' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'diagram_exported_from_gemini.xmi';
          link.click();
        } else {
          console.warn('⚠️ No se recibió respuesta válida de Gemini.');
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener la respuesta de Gemini:', error);
      }
    );
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
