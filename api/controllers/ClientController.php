<?php 

class ClientController extends AbstractController {

    private ClientManager $cm;

    public function __construct() {
        $this->cm = new ClientManager();
    }

    public function findAll() {
        $clients = $this->cm->findAll();
        if ($clients != null) {
            $clientsArray = [];
            foreach ($clients as $client) {
                $newClient = $client->toArray();
                $clientsArray[] = $newClient;
            }
            $this->render(["clients"=> $clientsArray]);
        }
    }

    public function createClient(array $post) {
        $client = new Client(htmlspecialchars($post["client_name"]));
        $clientCheck = $this->cm->findByName($client);
        if ($clientCheck === null) {
            $client = new Client(htmlspecialchars($post["client_name"]));
            $newClient = $this->cm->createClient($client);
            $this->render(["success"=> true, "newClient" => $newClient->toArray()]);
        }
        else {
            $this->render(["success" => false, "error_message" => "Client déjà dans la BDD" ]);
        }
    }

    public function editClient(array $post) {
        $client = $this->cm->findById($post["client_ID"]);
        if ($client !== null) {
            $client->setClient_name(htmlspecialchars($post["client_name"]));
            $newClient = $this->cm->editClient($client);
            $this->render(["success" => true, "editedClient" => $newClient->toArray()]);
        }
    }

    public function deleteClient(array $post) {
        $client = $this->cm->findById($post["client_ID"]);
        if ($client !== null) {
            $this->cm->deleteClient($client);
        }
    }
}