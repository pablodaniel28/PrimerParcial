// Define PHP templates to replace the Java Spring Boot ones

// Entity template - Base model class
const EntityTemplate: string = `<?php
namespace App\\Models;

/**
 * Class \${ENTITY}
 *
 * @package App\\Models
 */
class \${ENTITY} {
    // Properties
    private $id;
\${PROPERTIES}

    /**
     * Constructor
     */
    public function __construct() {
        // Constructor logic
    }

    // Getters and Setters
    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }
\${GETTERS_SETTERS}
}
`;

// Repository template - Data access layer
const RepositoryTemplate: string = `<?php
namespace App\\Repositories;

use App\\Models\\\${ENTITY};
use PDO;

/**
 * Class \${ENTITY}Repository
 *
 * @package App\\Repositories
 */
class \${ENTITY}Repository {
    private $db;

    /**
     * Constructor
     */
    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Save a new \${entityLower} to the database
     *
     * @param \${ENTITY} \${entityLower}
     * @return \${ENTITY}
     */
    public function save(\${ENTITY} \${entityLower}) {
        $sql = "INSERT INTO \${entityLower}s (\${DB_COLUMNS}) VALUES (\${DB_PLACEHOLDERS})";
        $stmt = $this->db->prepare($sql);
        \${BIND_PARAMS}
        $stmt->execute();

        \${entityLower}->setId($this->db->lastInsertId());
        return \${entityLower};
    }

    /**
     * Get all \${entityLower}s
     *
     * @return array
     */
    public function findAll() {
        $sql = "SELECT * FROM \${entityLower}s";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        $\${entityLower}s = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $\${entityLower}s[] = $this->mapRowTo\${ENTITY}($row);
        }

        return $\${entityLower}s;
    }

    /**
     * Find \${entityLower} by ID
     *
     * @param int $id
     * @return \${ENTITY}|null
     */
    public function findById($id) {
        $sql = "SELECT * FROM \${entityLower}s WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return $this->mapRowTo\${ENTITY}($row);
    }

    /**
     * Update \${entityLower}
     *
     * @param int $id
     * @param \${ENTITY} \${entityLower}
     * @return \${ENTITY}|null
     */
    public function update($id, \${ENTITY} \${entityLower}) {
        $sql = "UPDATE \${entityLower}s SET \${UPDATE_COLUMNS} WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        \${BIND_UPDATE_PARAMS}
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $this->findById($id);
    }

    /**
     * Delete \${entityLower}
     *
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $sql = "DELETE FROM \${entityLower}s WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Map database row to \${ENTITY} object
     *
     * @param array $row
     * @return \${ENTITY}
     */
    private function mapRowTo\${ENTITY}($row) {
        $\${entityLower} = new \${ENTITY}();
        $\${entityLower}->setId($row['id']);
        \${MAP_PROPERTIES}
        return $\${entityLower};
    }
}
`;

// Service template - Business logic layer
const ServiceTemplate: string = `<?php
namespace App\\Services;

use App\\Models\\\${ENTITY};
use App\\Repositories\\\${ENTITY}Repository;

/**
 * Class \${ENTITY}Service
 *
 * @package App\\Services
 */
class \${ENTITY}Service {
    private $\${entityLower}Repository;

    /**
     * Constructor
     */
    public function __construct(\${ENTITY}Repository $\${entityLower}Repository) {
        $this->\${entityLower}Repository = $\${entityLower}Repository;
    }

    /**
     * Create a new \${entityLower}
     *
     * @param \${ENTITY} \${entityLower}
     * @return \${ENTITY}
     */
    public function create\${ENTITY}(\${ENTITY} \${entityLower}) {
        return $this->\${entityLower}Repository->save(\${entityLower});
    }

    /**
     * Get all \${entityLower}s
     *
     * @return array
     */
    public function getAll\${ENTITY}s() {
        return $this->\${entityLower}Repository->findAll();
    }

    /**
     * Get \${entityLower} by ID
     *
     * @param int $id
     * @return \${ENTITY}|null
     */
    public function get\${ENTITY}ById($id) {
        return $this->\${entityLower}Repository->findById($id);
    }

    /**
     * Update \${entityLower}
     *
     * @param int $id
     * @param \${ENTITY} \${entityLower}
     * @return \${ENTITY}|null
     */
    public function update\${ENTITY}($id, \${ENTITY} \${entityLower}) {
        return $this->\${entityLower}Repository->update($id, \${entityLower});
    }

    /**
     * Delete \${entityLower}
     *
     * @param int $id
     * @return bool
     */
    public function delete\${ENTITY}($id) {
        return $this->\${entityLower}Repository->delete($id);
    }
}
`;

// Controller template - HTTP layer
const ControllerTemplate: string = `<?php
namespace App\\Controllers;

use App\\Models\\\${ENTITY};
use App\\Services\\\${ENTITY}Service;

/**
 * Class \${ENTITY}Controller
 *
 * @package App\\Controllers
 */
class \${ENTITY}Controller {
    private $\${entityLower}Service;

    /**
     * Constructor
     */
    public function __construct(\${ENTITY}Service $\${entityLower}Service) {
        $this->\${entityLower}Service = $\${entityLower}Service;
    }

    /**
     * Handle the incoming request
     *
     * @param string $method
     * @param array $params
     * @return mixed
     */
    public function handleRequest($method, $params = []) {
        switch ($method) {
            case 'GET':
                if (isset($params['id'])) {
                    return $this->show($params['id']);
                }
                return $this->index();
            case 'POST':
                return $this->store($_POST);
            case 'PUT':
                if (isset($params['id'])) {
                    parse_str(file_get_contents('php://input'), $putData);
                    return $this->update($params['id'], $putData);
                }
                break;
            case 'DELETE':
                if (isset($params['id'])) {
                    return $this->destroy($params['id']);
                }
                break;
        }

        http_response_code(404);
        return json_encode(['error' => 'Method not found']);
    }

    /**
     * Display a listing of the resource
     *
     * @return string
     */
    public function index() {
        $\${entityLower}s = $this->\${entityLower}Service->getAll\${ENTITY}s();
        return json_encode($\${entityLower}s);
    }

    /**
     * Display the specified resource
     *
     * @param int $id
     * @return string
     */
    public function show($id) {
        $\${entityLower} = $this->\${entityLower}Service->get\${ENTITY}ById($id);

        if (!$\${entityLower}) {
            http_response_code(404);
            return json_encode(['error' => '\${ENTITY} not found']);
        }

        return json_encode($\${entityLower});
    }

    /**
     * Store a newly created resource
     *
     * @param array $data
     * @return string
     */
    public function store($data) {
        $\${entityLower} = $this->createFrom($data);
        $created\${ENTITY} = $this->\${entityLower}Service->create\${ENTITY}($\${entityLower});

        http_response_code(201);
        return json_encode($created\${ENTITY});
    }

    /**
     * Update the specified resource
     *
     * @param int $id
     * @param array $data
     * @return string
     */
    public function update($id, $data) {
        $\${entityLower} = $this->createFrom($data);
        $updated\${ENTITY} = $this->\${entityLower}Service->update\${ENTITY}($id, $\${entityLower});

        if (!$updated\${ENTITY}) {
            http_response_code(404);
            return json_encode(['error' => '\${ENTITY} not found']);
        }

        return json_encode($updated\${ENTITY});
    }

    /**
     * Remove the specified resource
     *
     * @param int $id
     * @return string
     */
    public function destroy($id) {
        $result = $this->\${entityLower}Service->delete\${ENTITY}($id);

        if (!$result) {
            http_response_code(404);
            return json_encode(['error' => '\${ENTITY} not found']);
        }

        http_response_code(204);
        return '';
    }

    /**
     * Create \${ENTITY} from array data
     *
     * @param array $data
     * @return \${ENTITY}
     */
    private function createFrom($data) {
        $\${entityLower} = new \${ENTITY}();
        \${MAP_FROM_REQUEST}
        return $\${entityLower};
    }
}
`;

// Database connection template
const DatabaseTemplate: string = `<?php
namespace App\\Config;

use PDO;
use PDOException;

/**
 * Class Database
 *
 * @package App\\Config
 */
class Database {
    private static $instance = null;
    private $connection;

    /**
     * Private constructor to prevent direct creation
     */
    private function __construct() {
        $host = 'localhost';
        $dbname = 'your_database';
        $username = 'root';
        $password = '';

        try {
            $this->connection = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    /**
     * Get database instance (singleton)
     *
     * @return Database
     */
    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }

        return self::$instance;
    }

    /**
     * Get PDO connection
     *
     * @return PDO
     */
    public function getConnection() {
        return $this->connection;
    }
}
`;

// Router template
const RouterTemplate: string = `<?php
namespace App\\Core;

/**
 * Class Router
 *
 * @package App\\Core
 */
class Router {
    private $routes = [];

    /**
     * Add a route to the router
     *
     * @param string $method
     * @param string $path
     * @param callable $handler
     */
    public function addRoute($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    /**
     * Find a matching route
     *
     * @param string $method
     * @param string $uri
     * @return array|null
     */
    public function match($method, $uri) {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            $pattern = $this->convertRouteToRegex($route['path']);
            if (preg_match($pattern, $uri, $matches)) {
                $params = [];

                // Extract named parameters
                preg_match_all('/{([^}]+)}/', $route['path'], $paramNames);
                foreach ($paramNames[1] as $index => $name) {
                    $params[$name] = $matches[$index + 1] ?? null;
                }

                return [
                    'handler' => $route['handler'],
                    'params' => $params
                ];
            }
        }

        return null;
    }

    /**
     * Convert route pattern to regex
     *
     * @param string $route
     * @return string
     */
    private function convertRouteToRegex($route) {
        $route = preg_replace('/\//', '\\/', $route);
        $route = preg_replace('/{([^}]+)}/', '([^\/]+)', $route);
        return '/^' . $route . '$/';
    }

    /**
     * Handle the incoming request
     */
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        $match = $this->match($method, $uri);

        if ($match) {
            $result = call_user_func($match['handler'], $method, $match['params']);
            echo $result;
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Not Found']);
        }
    }
}
`;

// Index.php template
const IndexTemplate: string = `<?php
require_once __DIR__ . '/vendor/autoload.php';

use App\\Config\\Database;
use App\\Core\\Router;
use App\\Controllers\\\${ENTITY}Controller;
use App\\Repositories\\\${ENTITY}Repository;
use App\\Services\\\${ENTITY}Service;

// Set up error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Get database connection
$db = Database::getInstance()->getConnection();

// Set up router
$router = new Router();

// Initialize repositories, services and controllers
\${ROUTES_SETUP}

// Dispatch request
$router->dispatch();
`;

// Composer.json template
const ComposerTemplate: string = `{
    "name": "php-crud-api",
    "description": "A simple PHP CRUD API",
    "type": "project",
    "autoload": {
        "psr-4": {
            "App\\\\": "app/"
        }
    },
    "require": {
        "php": ">=7.4"
    }
}
`;

// .htaccess template for clean URLs
const HtaccessTemplate: string = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
`;

export {
    EntityTemplate,
    RepositoryTemplate,
    ServiceTemplate,
    ControllerTemplate,
    DatabaseTemplate,
    RouterTemplate,
    IndexTemplate,
    ComposerTemplate,
    HtaccessTemplate
};
