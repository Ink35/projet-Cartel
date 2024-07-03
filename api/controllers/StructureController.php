<?php

class StructureController extends AbstractController {

    private StructureManager $sm;

    public function __construct()
    {
        $this->sm = new StructureManager;
    }

    public function findAll() {
        $structures = $this->sm->findAll();
        if ($structures != null) {
            $structuresArray = [];
            foreach ($structures as $structure) {
                $newStructure = $structure->toArray();
                $structuresArray[] = $newStructure;
            }
            $this->render(["structures" => $structuresArray]);
        }
    }

    public function createStructure(array $post) {
        $structure = $this->sm->findByName(htmlspecialchars($post["structure_name"]));
        if ($structure === null) {
            $structure = new Structure(htmlspecialchars($post["structure_name"]));
            $newStructure = $this->sm->createStructure($structure);
            $this->render(["success"=> true, "newStructure" => $newStructure->toArray()]);
        } else {
            $this->render(["success"=> false, "error_message"=> "structure déja dans la BDD" ]);
        }   
    }

    public function editStructure(array $post) {
        $structure = $this->sm->findById($post["structure_ID"]);
        if ($structure !== null) {
            $structure->setStructure_name(htmlspecialchars($post["structure_name"]));
            $newStructure = $this->sm->editStructure($structure);
            $this->render(["success" => true, "editedStructure"=> $newStructure->toArray()]);
        }
    }

    public function deleteStructure(array $post) {
        $structure = $this->sm->findById($post["structure_ID"]);
        if ($structure !== null) {
            $this->sm->deleteStructure($structure);
       }
    }
}