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
  spring.datasource.password=daniel2804
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
