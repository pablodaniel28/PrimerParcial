// PHP File Generator Functions

import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  EntityTemplate,
  RepositoryTemplate,
  ServiceTemplate,
  ControllerTemplate,
  DatabaseTemplate,
  RouterTemplate,
  IndexTemplate,
  ComposerTemplate,
  HtaccessTemplate
} from './php-templates';

// Define the PHP project structure
const PHP_STRUCTURE = {
  models: 'app/Models/',
  repositories: 'app/Repositories/',
  services: 'app/Services/',
  controllers: 'app/Controllers/',
  config: 'app/Config/',
  core: 'app/Core/'
};

/**
 * Generate content for a PHP file from template
 * @param template Template string with placeholders
 * @param entityName Entity class name
 * @param properties Optional properties object for additional replacements
 */
function generateContent(template: string, entityName: string, properties: any = {}): string {
  const entityLower = entityName.charAt(0).toLowerCase() + entityName.slice(1);

  let content = template
    .replace(/\${ENTITY}/g, entityName)
    .replace(/\${entityLower}/g, entityLower);

  // Replace any additional properties
  Object.keys(properties).forEach(key => {
    content = content.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), properties[key]);
  });

  return content;
}

/**
 * Extrae propiedades desde la definición de clase
 * @param classDefinition Definición de clase PHP/Java como string
 * @returns Objeto con reemplazos relacionados con propiedades
 */
function extractProperties(classDefinition: string): any {
  // Iniciamos las colecciones para almacenar diferentes partes del código
  const properties: string[] = [];
  const gettersSetters: string[] = [];
  const dbColumns: string[] = [];
  const dbPlaceholders: string[] = [];
  const bindParams: string[] = [];
  const updateColumns: string[] = [];
  const bindUpdateParams: string[] = [];
  const mapProperties: string[] = [];
  const mapFromRequest: string[] = [];

  // En el diagrama, las propiedades se almacenan en el atributo "porpiedades"
  // Extraemos primero el texto de porpiedades
  const propTextMatch = classDefinition.match(/porpiedades:\s*{\s*text:\s*['"]([^'"]*)['"]/);
  if (propTextMatch && propTextMatch[1]) {
    // Dividimos por saltos de línea para obtener cada propiedad
    const propText = propTextMatch[1].trim();
    if (propText) {
      const propLines = propText.split('\\n');

      propLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          // Intentamos extraer el tipo y nombre
          // Patrones comunes: "- nombre: String" o "- edad: int" o simplemente "- direccion"
          const propMatch = trimmedLine.match(/[-+]\s*(\w+)(?::\s*(\w+))?/);

          if (propMatch) {
            const propName = propMatch[1];
            // Si no hay tipo definido, asumimos string
            const propType = propMatch[2] || 'string';

            // Mapeo de tipos Java a PHP
            let phpType = 'string';
            if (['int', 'Integer', 'Long', 'Short'].includes(propType)) {
              phpType = 'int';
            } else if (['float', 'double', 'Float', 'Double'].includes(propType)) {
              phpType = 'float';
            } else if (['boolean', 'Boolean'].includes(propType)) {
              phpType = 'bool';
            } else if (['array', 'List', 'Set', 'Collection'].includes(propType)) {
              phpType = 'array';
            }

            // Añadir propiedad a la clase PHP
            properties.push(`    private $${propName}; // ${phpType}`);

            // Añadir getter y setter
            gettersSetters.push(`
    /**
     * @return ${phpType}
     */
    public function get${propName.charAt(0).toUpperCase() + propName.slice(1)}() {
        return $this->${propName};
    }

    /**
     * @param ${phpType} $${propName}
     * @return $this
     */
    public function set${propName.charAt(0).toUpperCase() + propName.slice(1)}($${propName}) {
        $this->${propName} = $${propName};
        return $this;
    }`);

            // Añadir a columnas DB y placeholders
            dbColumns.push(propName);
            dbPlaceholders.push(`:${propName}`);

            // Añadir bind params para inserts
            bindParams.push(`        $stmt->bindParam(':${propName}', $${propName.toLowerCase()}->get${propName.charAt(0).toUpperCase() + propName.slice(1)}());`);

            // Añadir columnas de actualización
            updateColumns.push(`${propName} = :${propName}`);

            // Añadir bind params para updates
            bindUpdateParams.push(`        $stmt->bindParam(':${propName}', $${propName.toLowerCase()}->get${propName.charAt(0).toUpperCase() + propName.slice(1)}());`);

            // Añadir mapeo de propiedades desde DB
            mapProperties.push(`        $${propName.toLowerCase()}->set${propName.charAt(0).toUpperCase() + propName.slice(1)}($row['${propName}']);`);

            // Añadir mapeo de propiedades desde request
            mapFromRequest.push(`        if (isset($data['${propName}'])) {
            $${propName.toLowerCase()}->set${propName.charAt(0).toUpperCase() + propName.slice(1)}($data['${propName}']);
        }`);
          }
        }
      });
    }
  }

  // Si no encontramos propiedades, buscamos también en nombreclase para el nombre de la clase
  const classNameMatch = classDefinition.match(/nombreclase:\s*{\s*text:\s*['"]([^'"]*)['"]/);
  const className = classNameMatch ? classNameMatch[1].trim() : 'Entity';

  // Si no hay propiedades, agregamos al menos el ID
  if (properties.length === 0) {
    properties.push(`    private $id; // int`);

    gettersSetters.push(`
    /**
     * @return int
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param int $id
     * @return $this
     */
    public function setId($id) {
        $this->id = $id;
        return $this;
    }`);

    dbColumns.push('id');
    dbPlaceholders.push(':id');
    bindParams.push(`        $stmt->bindParam(':id', $${className.toLowerCase()}->getId());`);
    updateColumns.push(`id = :id`);
    bindUpdateParams.push(`        $stmt->bindParam(':id', $${className.toLowerCase()}->getId());`);
    mapProperties.push(`        $${className.toLowerCase()}->setId($row['id']);`);
    mapFromRequest.push(`        if (isset($data['id'])) {
            $${className.toLowerCase()}->setId($data['id']);
        }`);
  }

  return {
    PROPERTIES: properties.join('\n'),
    GETTERS_SETTERS: gettersSetters.join('\n'),
    DB_COLUMNS: dbColumns.join(', '),
    DB_PLACEHOLDERS: dbPlaceholders.join(', '),
    BIND_PARAMS: bindParams.join('\n'),
    UPDATE_COLUMNS: updateColumns.join(', '),
    BIND_UPDATE_PARAMS: bindUpdateParams.join('\n'),
    MAP_PROPERTIES: mapProperties.join('\n'),
    MAP_FROM_REQUEST: mapFromRequest.join('\n')
  };
}

/**
 * Generate PHP files for entity and add to ZIP
 * @param zip JSZip instance
 * @param entityName Entity class name
 * @param classDefinition PHP/Java class definition as string
 */
function generatePHPFiles(zip: JSZip, entityName: string, classDefinition: string): void {
  const properties = extractProperties(classDefinition);

  // Generate the entity model
  const modelContent = generateContent(EntityTemplate, entityName, properties);
  zip.file(`${PHP_STRUCTURE.models}${entityName}.php`, modelContent);

  // Generate the repository
  const repositoryContent = generateContent(RepositoryTemplate, entityName, properties);
  zip.file(`${PHP_STRUCTURE.repositories}${entityName}Repository.php`, repositoryContent);

  // Generate the service
  const serviceContent = generateContent(ServiceTemplate, entityName, properties);
  zip.file(`${PHP_STRUCTURE.services}${entityName}Service.php`, serviceContent);

  // Generate the controller
  const controllerContent = generateContent(ControllerTemplate, entityName, properties);
  zip.file(`${PHP_STRUCTURE.controllers}${entityName}Controller.php`, controllerContent);
}

/**
 * Generate shared code files
 * @param zip JSZip instance
 * @param entityNames Array of entity names for routes setup
 */
function generateSharedFiles(zip: JSZip, entityNames: string[]): void {
  // Generate database config
  zip.file(`${PHP_STRUCTURE.config}Database.php`, DatabaseTemplate);

  // Generate router
  zip.file(`${PHP_STRUCTURE.core}Router.php`, RouterTemplate);

  // Generate routes setup
  const routesSetup: string[] = [];

  entityNames.forEach(entityName => {
    const entityLower = entityName.charAt(0).toLowerCase() + entityName.slice(1);

    routesSetup.push(`// Setup for ${entityName}
$${entityLower}Repository = new ${entityName}Repository($db);
$${entityLower}Service = new ${entityName}Service($${entityLower}Repository);
$${entityLower}Controller = new ${entityName}Controller($${entityLower}Service);

// Routes for ${entityName}
$router->addRoute('GET', '/${entityLower}s', function($method, $params) use ($${entityLower}Controller) {
    return $${entityLower}Controller->handleRequest($method, $params);
});
$router->addRoute('GET', '/${entityLower}s/{id}', function($method, $params) use ($${entityLower}Controller) {
    return $${entityLower}Controller->handleRequest($method, $params);
});
$router->addRoute('POST', '/${entityLower}s', function($method, $params) use ($${entityLower}Controller) {
    return $${entityLower}Controller->handleRequest($method, $params);
});
$router->addRoute('PUT', '/${entityLower}s/{id}', function($method, $params) use ($${entityLower}Controller) {
    return $${entityLower}Controller->handleRequest($method, $params);
});
$router->addRoute('DELETE', '/${entityLower}s/{id}', function($method, $params) use ($${entityLower}Controller) {
    return $${entityLower}Controller->handleRequest($method, $params);
});`);
  });

  // Generate index.php with routes
  const indexContent = generateContent(IndexTemplate, entityNames[0], {
    ROUTES_SETUP: routesSetup.join('\n\n')
  });
  zip.file('index.php', indexContent);

  // Generate composer.json
  zip.file('composer.json', ComposerTemplate);

  // Generate .htaccess
  zip.file('.htaccess', HtaccessTemplate);
}

/**
 * Parse PHP classes from Gemini API response
 * @param content API response containing PHP class definitions
 * @returns Array of parsed class definitions with names
 */
function parsePhpClasses(content: string): { name: string, definition: string }[] {
  const classes: { name: string, definition: string }[] = [];

  // Regular expression to find PHP classes
  const classPattern = /\<\?php[\s\S]*?class\s+(\w+)[\s\S]*?}\s*$/gm;
  let match;

  while ((match = classPattern.exec(content)) !== null) {
    const classDefinition = match[0];
    const className = match[1];

    classes.push({
      name: className,
      definition: classDefinition
    });
  }

  return classes;
}

/**
 * Generate and download a PHP CRUD application
 * @param content API response containing PHP class definitions
 */
function generatePHPApplication(content: string): void {
  const parsedClasses = parsePhpClasses(content);

  if (parsedClasses && parsedClasses.length > 0) {
    // Create a new ZIP file
    const zip = new JSZip();

    // Create folder structure
    Object.values(PHP_STRUCTURE).forEach(path => {
      zip.folder(path);
    });

    // Extract entity names for shared files
    const entityNames = parsedClasses.map(cls => cls.name);

    // Generate entity files
    parsedClasses.forEach(cls => {
      generatePHPFiles(zip, cls.name, cls.definition);
    });

    // Generate shared files
    generateSharedFiles(zip, entityNames);

    // Generate and download the ZIP
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'PHP_CRUD_Application.zip');
    });
  } else {
    console.error('No PHP classes found in the content.');
  }
}

export {
  generatePHPApplication,
  parsePhpClasses
};
