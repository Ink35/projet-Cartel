<?php 
class TypeController extends AbstractController {
    
    private TypeManager $tm;
    private SubtypeManager $stm;

    public function __construct()
    {
        $this->tm = new TypeManager();
        $this->stm = new SubtypeManager();
    }

    public function findAll() {
        $types = $this->tm->findAll();
        if ($types != null) {
            $typesArray = [];
            foreach ($types as $type) {
                $newType = $type->toArray();
                $typesArray[] = $newType;
            }
            $this->render(["types"=> $typesArray]);
        }
    }

    public function createType(array $post) {
        $type = $this->tm->findByName(htmlspecialchars($post["type"]));
        if ($type === null) {
            $type = new Type(htmlspecialchars($post["type"]));
            $newType = $this->tm->createType($type);
            $this->render(["success"=> true, "newType" => $newType->toArray()]);
        } else {
            $this->render(["success"=> false, "error_message"=> "type déja dans la BDD" ]);
        }

        
    }

    public function editType(array $post) {
        $type = $this->tm->findById($post["type_ID"]);
        if ($type !== null) {
            $type->setType(htmlspecialchars($post["type"]));
            $newType = $this->tm->editType($type);
            $this->render(["success" => true, "editedType"=> $newType->toArray()]);
        }

    }

    public function deleteType(array $post) {
        $type = $this->tm->findById($post["type_ID"]);
        if ($type !== null) {
            $subtypes = $this->stm->findAllSubtypeByType($type);
            foreach ($subtypes as $subtype) {
                $this->stm->deleteSubtype($subtype);
            }
            $this->tm->deleteType($type);
        }
    }
}